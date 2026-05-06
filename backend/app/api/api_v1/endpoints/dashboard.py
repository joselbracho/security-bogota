from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import Camera, Ticket, CameraStatus, TicketStatus, TicketType, TicketPriority
from app.schemas.schemas import DashboardStats, StatusDistribution, LocalityStats

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Camera status distribution
    total_cameras = db.query(Camera).filter(Camera.is_deleted == False).count()
    status_counts = db.query(Camera.estado, func.count(Camera.id)).filter(Camera.is_deleted == False).group_by(Camera.estado).all()
    
    status_dist = []
    active_cameras = 0
    for status, count in status_counts:
        status_dist.append(StatusDistribution(
            status=status,
            count=count,
            percentage=(count / total_cameras * 100) if total_cameras > 0 else 0
        ))
        if status == CameraStatus.ACTIVA:
            active_cameras = count

    # Open tickets (Nuevo + En curso)
    open_tickets = db.query(Ticket).filter(Ticket.estado.in_([TicketStatus.NUEVO, TicketStatus.EN_CURSO])).count()
    
    # Critical/High open tickets percentage
    crit_high_open = db.query(Ticket).filter(
        Ticket.estado.in_([TicketStatus.NUEVO, TicketStatus.EN_CURSO]),
        Ticket.prioridad.in_([TicketPriority.CRITICA, TicketPriority.ALTA])
    ).count()
    crit_high_pct = (crit_high_open / open_tickets * 100) if open_tickets > 0 else 0

    # Avg resolution time (days)
    resolved_tickets = db.query(Ticket).filter(Ticket.estado == TicketStatus.RESUELTO, Ticket.cierre != None).all()
    avg_res_time = None
    if resolved_tickets:
        total_time = sum([(t.cierre - t.apertura).total_seconds() for t in resolved_tickets])
        avg_res_time = (total_time / len(resolved_tickets)) / 86400 # Convert to days

    # Locality stats (Tickets by locality grouped by type)
    from sqlalchemy import case
    locality_data = db.query(
        Camera.loc,
        func.count(case((Ticket.tipo == TicketType.CORRECTIVO, Ticket.id))).label("corrective"),
        func.count(case((Ticket.tipo == TicketType.PREVENTIVO, Ticket.id))).label("preventive")
    ).join(Ticket).group_by(Camera.loc).all()
    
    loc_stats = [
        LocalityStats(locality=loc, corrective=corr, preventive=prev)
        for loc, corr, prev in locality_data
    ]

    return DashboardStats(
        active_cameras=active_cameras,
        open_tickets=open_tickets,
        avg_resolution_time=avg_res_time,
        critical_high_open_tickets_percentage=crit_high_pct,
        status_distribution=status_dist,
        locality_stats=loc_stats
    )
