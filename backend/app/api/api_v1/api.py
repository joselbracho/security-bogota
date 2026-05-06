from fastapi import APIRouter
from app.api.api_v1.endpoints import cameras, tickets, dashboard

api_router = APIRouter()
api_router.include_router(cameras.router, prefix="/cameras", tags=["cameras"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
