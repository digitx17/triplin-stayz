from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from lib.admin_auth import require_admin
from lib.db import db

router = APIRouter()


class SkillCluster(BaseModel):
    title: str
    items: List[str]


class SiteContent(BaseModel):
    skills: List[SkillCluster] = []
    toolkit: List[str] = []
    experience: dict = {}


@router.get("/content")
async def get_content():
    doc = await db.site_content.find_one({"key": "main"}, {"_id": 0})
    return doc["value"] if doc else {}


@router.put("/content", dependencies=[Depends(require_admin)])
async def put_content(body: SiteContent):
    await db.site_content.update_one({"key": "main"}, {"$set": {"value": body.model_dump()}}, upsert=True)
    return {"ok": True}
