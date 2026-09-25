import asyncio
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
from lib.db import client, db, ensure_indexes
from routers.media import router as media_router
from routers.content import router as content_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    try:
        from lib.storage import init_storage
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    yield
    client.close()


app = FastAPI(lifespan=lifespan)

api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactInquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)
    website: str = ""  # honeypot — real users never fill this hidden field

CONTACT_WINDOW_SEC = 600
CONTACT_MAX_PER_WINDOW = 5
_contact_hits: dict[str, list[float]] = defaultdict(list)


def contact_rate_limited(ip: str) -> bool:
    now = time.monotonic()
    hits = [t for t in _contact_hits[ip] if now - t < CONTACT_WINDOW_SEC]
    _contact_hits[ip] = hits
    if len(hits) >= CONTACT_MAX_PER_WINDOW:
        return True
    hits.append(now)
    return False

class ContactInquiry(ContactInquiryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/contact", response_model=ContactInquiry)
async def create_contact_inquiry(input: ContactInquiryCreate, request: Request):
    inquiry = ContactInquiry(**input.model_dump())
    if input.website.strip():
        logger.info("Contact honeypot triggered from %s — dropped silently", request.client.host if request.client else "?")
        return inquiry  # fake success so bots learn nothing
    ip = request.client.host if request.client else "unknown"
    if contact_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many messages — please try again later.")
    doc = inquiry.model_dump()
    doc.pop("website", None)
    await db.contact_inquiries.insert_one(doc)
    return inquiry


api_router.include_router(media_router)
api_router.include_router(content_router)
app.include_router(api_router)

_cors_origins = [o.strip() for o in os.environ.get('CORS_ORIGINS', '').split(',') if o.strip()]
_wildcard = '*' in _cors_origins
app.add_middleware(
    CORSMiddleware,
    # wildcard origin cannot be combined with credentials; fall back to non-credentialed
    allow_credentials=not _wildcard,
    allow_origins=_cors_origins or ['*'],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
