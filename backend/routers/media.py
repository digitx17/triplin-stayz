import hmac
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile
from pydantic import BaseModel

from lib.admin_auth import create_admin_token, require_admin
from lib.db import db
from lib.storage import APP_NAME, get_object, put_object

router = APIRouter()

ALLOWED_CATEGORIES = {"Photoshoot", "Website & CRM", "Graphic Design / Content", "Events", "Influencer Collab", "Listings"}
MAX_BYTES = 60 * 1024 * 1024


class AdminLogin(BaseModel):
    password: str


class MediaItem(BaseModel):
    id: str
    category: str
    brand: str
    caption: str = ""
    kind: str
    content_type: str
    size: int
    url: str
    created_at: str


def to_item(doc: dict) -> MediaItem:
    return MediaItem(
        id=doc["id"],
        category=doc.get("category") or "Graphic Design / Content",
        brand=doc.get("brand") or "General",
        caption=doc.get("caption", ""),
        kind=doc["kind"],
        content_type=doc["content_type"],
        size=doc["size"],
        url=f"/api/media/file/{doc['id']}",
        created_at=doc["created_at"],
    )


@router.post("/admin/login")
async def admin_login(body: AdminLogin):
    expected = os.environ.get("ADMIN_PASSWORD", "")
    if not expected or not hmac.compare_digest(body.password, expected):
        raise HTTPException(status_code=401, detail="Wrong password")
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
    if category not in ALLOWED_CATEGORIES:
        raise HTTPException(status_code=422, detail="Unknown category")
    ctype = file.content_type or "application/octet-stream"
    if not (ctype.startswith("image/") or ctype.startswith("video/")):
        raise HTTPException(status_code=422, detail="Only image or video files allowed")
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (60MB max)")
    ext = (file.filename or "bin").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin"
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
        "content_type": ctype,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.media.insert_one(doc)
    return to_item(doc)


@router.get("/media/file/{media_id}")
async def serve_media(media_id: str):
    doc = await db.media.find_one({"id": media_id, "is_deleted": False})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    data, ctype = get_object(doc["storage_path"])
    return Response(content=data, media_type=doc.get("content_type", ctype))


@router.delete("/media/{media_id}", dependencies=[Depends(require_admin)])
async def delete_media(media_id: str):
    res = await db.media.update_one({"id": media_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
