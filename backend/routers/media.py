import hmac
import mimetypes
import os
import time
import uuid
from collections import defaultdict
from datetime import datetime, timezone
from typing import List, Optional
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, Response, UploadFile
from pydantic import BaseModel, Field

from lib.admin_auth import create_admin_token, require_admin
from lib.db import db
from lib.storage import APP_NAME, get_object, put_object
from routers.content import get_allowed_categories

router = APIRouter()

MAX_BYTES = 60 * 1024 * 1024


class AdminLogin(BaseModel):
    password: str


class MediaItem(BaseModel):
    id: str
    category: str
    brand: str
    caption: str = ""
    kind: str  # image | video | embed
    provider: str = ""
    content_type: str
    size: int
    url: str
    created_at: str


class MediaLink(BaseModel):
    url: str = Field(min_length=8, max_length=500)
    category: str = "Graphic Design / Content"
    brand: str = "General"
    caption: str = ""


def to_item(doc: dict) -> MediaItem:
    kind = doc["kind"]
    return MediaItem(
        id=doc["id"],
        category=doc.get("category") or "Graphic Design / Content",
        brand=doc.get("brand") or "General",
        caption=doc.get("caption", ""),
        kind=kind,
        provider=doc.get("provider", ""),
        content_type=doc["content_type"],
        size=doc["size"],
        url=doc.get("embed_url") if kind == "embed" else f"/api/media/file/{doc['id']}",
        created_at=doc["created_at"],
    )


def detect_provider(url: str) -> str:
    host = urlparse(url).netloc.lower()
    if host.endswith("youtu.be") or host.endswith("youtube.com"):
        return "youtube"
    if host.endswith("instagram.com"):
        return "instagram"
    raise HTTPException(status_code=422, detail="Only YouTube or Instagram links are supported")


LOGIN_WINDOW_SEC = 900
LOGIN_MAX_FAILURES = 5
_login_failures: dict[str, list[float]] = defaultdict(list)


@router.post("/admin/login")
async def admin_login(body: AdminLogin, request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    fails = [t for t in _login_failures[ip] if now - t < LOGIN_WINDOW_SEC]
    _login_failures[ip] = fails
    if len(fails) >= LOGIN_MAX_FAILURES:
        raise HTTPException(status_code=429, detail="Too many failed attempts — try again in 15 minutes.")
    expected = os.environ.get("ADMIN_PASSWORD", "")
    if not expected or not hmac.compare_digest(body.password, expected):
        fails.append(now)
        raise HTTPException(status_code=401, detail="Wrong password")
    _login_failures.pop(ip, None)
    return {"token": create_admin_token()}


@router.get("/admin/check", dependencies=[Depends(require_admin)])
async def admin_check():
    return {"ok": True}


@router.get("/media", response_model=List[MediaItem])
async def list_media(category: Optional[str] = None, brand: Optional[str] = None):
    query: dict = {"is_deleted": False}
    docs = await db.media.find(query).sort("created_at", -1).to_list(500)
    items = [to_item(d) for d in docs]
    if category:
        items = [i for i in items if i.category == category]
    if brand:
        items = [i for i in items if i.brand == brand]
    return items


@router.post("/media/upload", response_model=MediaItem, dependencies=[Depends(require_admin)])
async def upload_media(
    file: UploadFile = File(...),
    category: str = Form("Graphic Design / Content"),
    brand: str = Form("General"),
    caption: str = Form(""),
):
    if category not in await get_allowed_categories():
        raise HTTPException(status_code=422, detail="Unknown category")
    ext = (file.filename or "bin").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin"
    ctype = file.content_type or ""
    if not (ctype.startswith("image/") or ctype.startswith("video/")):
        # browsers often send phone photos (HEIC etc.) as octet-stream — fall back to extension
        EXTRA_TYPES = {"heic": "image/heic", "heif": "image/heif", "avif": "image/avif"}
        guessed = EXTRA_TYPES.get(ext) or mimetypes.guess_type(f"file.{ext}")[0]
        if guessed and (guessed.startswith("image/") or guessed.startswith("video/")):
            ctype = guessed
        else:
            raise HTTPException(status_code=422, detail="Only image or video files allowed")
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (60MB max)")
    path = f"{APP_NAME}/media/{uuid.uuid4()}.{ext}"
    result = put_object(path, data, ctype)
    doc = {
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "category": category,
        "brand": brand.strip()[:60] or "General",
        "caption": caption.strip()[:140],
        "kind": "video" if ctype.startswith("video/") else "image",
        "provider": "",
        "content_type": ctype,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.media.insert_one(doc)
    return to_item(doc)


@router.post("/media/link", response_model=MediaItem, dependencies=[Depends(require_admin)])
async def add_media_link(body: MediaLink):
    if body.category not in await get_allowed_categories():
        raise HTTPException(status_code=422, detail="Unknown category")
    provider = detect_provider(body.url)
    doc = {
        "id": str(uuid.uuid4()),
        "storage_path": "",
        "original_filename": "",
        "category": body.category,
        "brand": body.brand.strip()[:60] or "General",
        "caption": body.caption.strip()[:140],
        "kind": "embed",
        "provider": provider,
        "embed_url": body.url.strip(),
        "content_type": f"embed/{provider}",
        "size": 0,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.media.insert_one(doc)
    return to_item(doc)


@router.get("/media/file/{media_id}")
async def serve_media(media_id: str):
    doc = await db.media.find_one({"id": media_id, "is_deleted": False})
    if not doc or doc.get("kind") == "embed":
        raise HTTPException(status_code=404, detail="Not found")
    data, ctype = get_object(doc["storage_path"])
    return Response(content=data, media_type=doc.get("content_type", ctype))


@router.delete("/media/{media_id}", dependencies=[Depends(require_admin)])
async def delete_media(media_id: str):
    res = await db.media.update_one({"id": media_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
