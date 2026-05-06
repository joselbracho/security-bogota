from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.models import Camera, CameraStatus
from app.schemas.schemas import CameraCreate, CameraUpdate, CameraRead, CameraDetail

router = APIRouter()

@router.get("/", response_model=List[CameraRead])
def list_cameras(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[CameraStatus] = None,
    locality: Optional[str] = None
):
    query = db.query(Camera).filter(Camera.is_deleted == False)
    
    if search:
        query = query.filter(
            or_(
                Camera.id.ilike(f"%{search}%"),
                Camera.modelo.ilike(f"%{search}%"),
                Camera.ubicacion.ilike(f"%{search}%")
            )
        )
    
    if status:
        query = query.filter(Camera.estado == status)
    
    if locality:
        query = query.filter(Camera.loc.ilike(f"%{locality}%"))
    
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=CameraRead)
def create_camera(camera_in: CameraCreate, db: Session = Depends(get_db)):
    db_camera = db.query(Camera).filter(Camera.id == camera_in.id).first()
    if db_camera:
        raise HTTPException(status_code=400, detail="Camera ID already exists")
    
    db_camera = Camera(**camera_in.model_dump())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

@router.get("/{camera_id}", response_model=CameraDetail)
def get_camera(camera_id: str, db: Session = Depends(get_db)):
    db_camera = db.query(Camera).filter(Camera.id == camera_id, Camera.is_deleted == False).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return db_camera

@router.put("/{camera_id}", response_model=CameraRead)
def update_camera(camera_id: str, camera_in: CameraUpdate, db: Session = Depends(get_db)):
    db_camera = db.query(Camera).filter(Camera.id == camera_id, Camera.is_deleted == False).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    update_data = camera_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_camera, field, value)
    
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

@router.delete("/{camera_id}", response_model=CameraRead)
def delete_camera(camera_id: str, db: Session = Depends(get_db)):
    db_camera = db.query(Camera).filter(Camera.id == camera_id, Camera.is_deleted == False).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    db_camera.is_deleted = True
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera
