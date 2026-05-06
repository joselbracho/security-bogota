from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import List, Optional
from app.models.models import CameraStatus, TicketStatus, TicketType, TicketPriority

# Camera Schemas
class CameraBase(BaseModel):
    modelo: str
    ubicacion: str
    lat: float = Field(..., ge=4.4, le=4.9)
    lng: float = Field(..., ge=-74.3, le=-73.9)
    estado: CameraStatus = CameraStatus.ACTIVA
    ult_mantto: Optional[date] = None
    loc: str
    url_rtsp: Optional[str] = None

class CameraCreate(CameraBase):
    id: str

class CameraUpdate(BaseModel):
    modelo: Optional[str] = None
    ubicacion: Optional[str] = None
    lat: Optional[float] = Field(None, ge=4.4, le=4.9)
    lng: Optional[float] = Field(None, ge=-74.3, le=-73.9)
    estado: Optional[CameraStatus] = None
    ult_mantto: Optional[date] = None
    loc: Optional[str] = None
    url_rtsp: Optional[str] = None

class CameraRead(CameraBase):
    id: str
    is_deleted: bool
    model_config = ConfigDict(from_attributes=True)

# Ticket Schemas
class TicketBase(BaseModel):
    camera_id: str
    tipo: TicketType
    descripcion: str
    prioridad: TicketPriority

class TicketCreate(TicketBase):
    id: str

class TicketUpdate(BaseModel):
    estado: Optional[TicketStatus] = None
    prioridad: Optional[TicketPriority] = None
    descripcion: Optional[str] = None

class TicketRead(TicketBase):
    id: str
    estado: TicketStatus
    apertura: datetime
    cierre: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# Detail Schema
class CameraDetail(CameraRead):
    tickets: List[TicketRead] = []

# Dashboard Schemas
class StatusDistribution(BaseModel):
    status: CameraStatus
    count: int
    percentage: float

class LocalityStats(BaseModel):
    locality: str
    corrective: int
    preventive: int

class DashboardStats(BaseModel):
    active_cameras: int
    open_tickets: int
    avg_resolution_time: Optional[float] = None
    critical_high_open_tickets_percentage: float
    status_distribution: List[StatusDistribution]
    locality_stats: List[LocalityStats]
