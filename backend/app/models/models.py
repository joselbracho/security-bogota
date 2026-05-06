from sqlalchemy import Column, String, Float, Boolean, Date, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship, DeclarativeBase
import enum
from datetime import datetime

class Base(DeclarativeBase):
    pass

class CameraStatus(str, enum.Enum):
    ACTIVA = "Activa"
    INACTIVA = "Inactiva"
    EN_MANTENIMIENTO = "En Mantenimiento"

class TicketStatus(str, enum.Enum):
    NUEVO = "Nuevo"
    EN_CURSO = "En curso"
    RESUELTO = "Resuelto"

class TicketType(str, enum.Enum):
    CORRECTIVO = "Correctivo"
    PREVENTIVO = "Preventivo"

class TicketPriority(str, enum.Enum):
    CRITICA = "Crítica"
    ALTA = "Alta"
    MEDIA = "Media"
    BAJA = "Baja"

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String, primary_key=True, index=True)
    modelo = Column(String, nullable=False)
    ubicacion = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    estado = Column(SQLEnum(CameraStatus), default=CameraStatus.ACTIVA)
    ult_mantto = Column(Date, nullable=True)
    loc = Column(String, nullable=False)
    url_rtsp = Column(String, nullable=True)
    is_deleted = Column(Boolean, default=False)

    tickets = relationship("Ticket", back_populates="camera")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String, primary_key=True, index=True)
    camera_id = Column(String, ForeignKey("cameras.id"), nullable=False)
    tipo = Column(SQLEnum(TicketType), nullable=False)
    descripcion = Column(String, nullable=False)
    estado = Column(SQLEnum(TicketStatus), default=TicketStatus.NUEVO)
    prioridad = Column(SQLEnum(TicketPriority), nullable=False)
    apertura = Column(DateTime, default=datetime.utcnow)
    cierre = Column(DateTime, nullable=True)

    camera = relationship("Camera", back_populates="tickets")
