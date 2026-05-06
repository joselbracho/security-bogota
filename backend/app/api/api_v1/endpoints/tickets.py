from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from app.core.database import get_db
from app.models.models import Ticket, Camera, TicketStatus, CameraStatus, TicketType, TicketPriority
from app.schemas.schemas import TicketCreate, TicketUpdate, TicketRead

router = APIRouter()

@router.get("/", response_model=List[TicketRead])
def list_tickets(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[TicketStatus] = None,
    tipo: Optional[TicketType] = None,
    prioridad: Optional[TicketPriority] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    query = db.query(Ticket)
    
    if status:
        query = query.filter(Ticket.estado == status)
    if tipo:
        query = query.filter(Ticket.tipo == tipo)
    if prioridad:
        query = query.filter(Ticket.prioridad == prioridad)
    if start_date:
        query = query.filter(Ticket.apertura >= start_date)
    if end_date:
        query = query.filter(Ticket.apertura <= end_date)
        
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=TicketRead)
def create_ticket(ticket_in: TicketCreate, db: Session = Depends(get_db)):
    camera = db.query(Camera).filter(Camera.id == ticket_in.camera_id, Camera.is_deleted == False).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    db_ticket = Ticket(**ticket_in.model_dump())
    db_ticket.estado = TicketStatus.NUEVO
    db_ticket.apertura = datetime.utcnow()
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.put("/{ticket_id}", response_model=TicketRead)
def update_ticket(ticket_id: str, ticket_in: TicketUpdate, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if ticket_in.estado:
        # Status flow validation: Nuevo -> En curso -> Resuelto
        current_status = db_ticket.estado
        new_status = ticket_in.estado
        
        if current_status == TicketStatus.RESUELTO:
            raise HTTPException(status_code=400, detail="Cannot change status of a resolved ticket")
        
        if current_status == TicketStatus.NUEVO and new_status not in [TicketStatus.EN_CURSO, TicketStatus.RESUELTO]:
             raise HTTPException(status_code=400, detail="Invalid status transition from Nuevo")
             
        if current_status == TicketStatus.EN_CURSO and new_status != TicketStatus.RESUELTO:
            raise HTTPException(status_code=400, detail="Invalid status transition from En curso")

        db_ticket.estado = new_status
        if new_status == TicketStatus.RESUELTO:
            db_ticket.cierre = datetime.utcnow()
            
            # Bonus check: If all tickets for this camera are resolved and camera is "En Mantenimiento"
            camera = db_ticket.camera
            if camera.estado == CameraStatus.EN_MANTENIMIENTO:
                open_tickets = db.query(Ticket).filter(
                    Ticket.camera_id == camera.id,
                    Ticket.estado != TicketStatus.RESUELTO,
                    Ticket.id != ticket_id
                ).count()
                if open_tickets == 0:
                    # Suggestion: In a real app we might return a flag. 
                    # Here we'll just keep it in logic, maybe the frontend checks it.
                    pass

    if ticket_in.prioridad:
        db_ticket.prioridad = ticket_in.prioridad
    if ticket_in.descripcion:
        db_ticket.descripcion = ticket_in.descripcion
        
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket
