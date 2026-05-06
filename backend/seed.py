import os
import django
from datetime import datetime, date

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from cameras_api.models import Camera, Ticket

def seed_db():
    # Seed Cameras
    cameras_data = [
        ["CAM-001", "Cámara PTZ Hikvision DS-2DE4425IW", "Parque Simón Bolívar", 4.658, -74.093, 'Active', date(2025, 11, 15), "Teusaquillo", "rtsp://191.93.211.227:554/11"],
        ["CAM-002", "Cámara Fija Dahua IPC-HFW5442H", "Portal Américas TransMilenio", 4.626, -74.153, 'Active', date(2025, 8, 22), "Kennedy", "rtsp://181.142.116.28:554/11"],
        ["CAM-003", "Cámara PTZ Axis Q6135-LE", "Plaza de Bolívar", 4.598, -74.076, 'Maintenance', date(2026, 1, 10), "Santa Fe", "rtsp://191.93.211.227:554/11"],
        ["CAM-004", "Cámara Fija Hikvision DS-2CD2T47G2", "Estación Calle 72 TM", 4.666, -74.058, 'Active', date(2024, 12, 5), "Chapinero", "rtsp://181.142.116.28:554/11"],
        ["CAM-005", "Cámara PTZ Dahua SD6AL245XA", "CAI Kennedy Central", 4.630, -74.159, 'Inactive', date(2026, 3, 1), "Kennedy", "rtsp://191.93.211.227:554/11"],
        ["CAM-006", "Cámara Fija Axis P1448-LE", "Centro Comercial Gran Estación", 4.649, -74.108, 'Active', date(2025, 6, 18), "Teusaquillo", "rtsp://181.142.116.28:554/11"],
        ["CAM-007", "Cámara PTZ Hikvision DS-2DE7A432IW", "Alcaldía Local Usaquén", 4.695, -74.032, 'Active', date(2025, 9, 30), "Usaquén", "rtsp://191.93.211.227:554/11"],
        ["CAM-008", "Cámara Fija Dahua IPC-HFW3849T1", "Terminal de Transporte Salitre", 4.653, -74.117, 'Maintenance', date(2026, 2, 14), "Fontibón", "rtsp://181.142.116.28:554/11"],
        ["CAM-009", "Cámara PTZ Axis Q6318-LE", "Estación Héroes TransMilenio", 4.649, -74.068, 'Active', date(2025, 7, 25), "Chapinero", "rtsp://191.93.211.227:554/11"],
        ["CAM-010", "Cámara Fija Hikvision DS-2CD2T86G2", "Parque El Virrey", 4.673, -74.049, 'Active', date(2025, 4, 12), "Chapinero", "rtsp://181.142.116.28:554/11"],
        ["CAM-011", "Cámara PTZ Dahua SD8A840XA-HNF", "CAI Chapinero Central", 4.644, -74.063, 'Inactive', date(2026, 1, 28), "Chapinero", "rtsp://191.93.211.227:554/11"],
        ["CAM-012", "Cámara Fija Axis M3116-LVE", "Biblioteca Virgilio Barco", 4.659, -74.099, 'Active', date(2025, 10, 5), "Teusaquillo", "rtsp://181.142.116.28:554/11"],
        ["CAM-013", "Cámara PTZ Hikvision DS-2DE5425IW", "Portal Norte TransMilenio", 4.763, -74.044, 'Active', date(2025, 5, 20), "Usaquén", "rtsp://191.93.211.227:554/11"],
        ["CAM-014", "Cámara Fija Dahua IPC-HFW5541E", "Hospital Simón Bolívar", 4.746, -74.039, 'Maintenance', date(2026, 3, 15), "Usaquén", "rtsp://181.142.116.28:554/11"],
        ["CAM-015", "Cámara PTZ Axis Q6315-LE", "Centro Histórico La Candelaria", 4.596, -74.072, 'Active', date(2025, 12, 1), "La Candelaria", "rtsp://191.93.211.227:554/11"],
        ["CAM-016", "Cámara Fija Hikvision DS-2CD2H86G2", "Estación Av. Jiménez TM", 4.601, -74.074, 'Active', date(2025, 3, 14), "Santa Fe", "rtsp://181.142.116.28:554/11"],
        ["CAM-017", "Cámara PTZ Dahua SD6AL830XA", "Parque Nacional Enrique Olaya", 4.622, -74.063, 'Active', date(2025, 11, 8), "Santa Fe", "rtsp://191.93.211.227:554/11"],
        ["CAM-018", "Cámara Fija Axis P3267-LVE", "Terminal Sur de Transporte", 4.596, -74.129, 'Inactive', date(2026, 2, 20), "Fontibón", "rtsp://181.142.116.28:554/11"],
        ["CAM-019", "Cámara PTZ Hikvision DS-2DE7A825IW", "Portal Tunal TransMilenio", 4.576, -74.131, 'Active', date(2025, 8, 15), "Tunjuelito", "rtsp://191.93.211.227:554/11"],
        ["CAM-020", "Cámara Fija Dahua IPC-HFW5842E", "CAI Santa Fe Centro", 4.609, -74.078, 'Maintenance', date(2026, 4, 1), "Santa Fe", "rtsp://181.142.116.28:554/11"]
    ]

    for data in cameras_data:
        Camera.objects.get_or_create(
            id=data[0],
            defaults={
                'model': data[1], 'location': data[2], 'latitude': data[3], 'longitude': data[4],
                'status': data[5], 'last_maintenance': data[6], 'locality': data[7], 'rtsp_url': data[8]
            }
        )

    # Seed Tickets
    tickets_data = [
        ["TKT-2026-001", "CAM-003", 'Corrective', "Falla en motor de rotación PTZ", 'In Progress', 'High', datetime(2026, 1, 12), None],
        ["TKT-2026-002", "CAM-005", 'Corrective', "Sin señal de video - fuente dañada", 'New', 'Critical', datetime(2026, 3, 2), None],
        ["TKT-2026-003", "CAM-008", 'Preventive', "Limpieza de domo y revisión de cableado", 'In Progress', 'Medium', datetime(2026, 2, 15), None],
        ["TKT-2026-004", "CAM-014", 'Corrective', "Imagen borrosa - lente desenfocado", 'In Progress', 'High', datetime(2026, 3, 16), None],
        ["TKT-2026-005", "CAM-011", 'Corrective', "Corte de fibra óptica en poste", 'New', 'Critical', datetime(2026, 1, 30), None],
        ["TKT-2026-006", "CAM-020", 'Preventive', "Actualización de firmware v4.2.1", 'In Progress', 'Medium', datetime(2026, 4, 2), None],
        ["TKT-2026-007", "CAM-018", 'Corrective', "Vandalismo - carcasa rota", 'New', 'High', datetime(2026, 2, 22), None],
        ["TKT-2026-008", "CAM-001", 'Preventive', "Inspección trimestral programada", 'Resolved', 'Low', datetime(2025, 12, 10), datetime(2025, 12, 12)],
        ["TKT-2026-009", "CAM-006", 'Corrective', "Sobrecalentamiento por exposición solar", 'Resolved', 'Medium', datetime(2025, 7, 20), datetime(2025, 7, 23)],
        ["TKT-2026-010", "CAM-010", 'Preventive', "Reemplazo preventivo de fuente PoE", 'Resolved', 'Low', datetime(2025, 5, 1), datetime(2025, 5, 3)],
        ["TKT-2026-011", "CAM-002", 'Corrective', "Pérdida intermitente de conexión", 'Resolved', 'High', datetime(2025, 9, 15), datetime(2025, 9, 18)],
        ["TKT-2026-012", "CAM-013", 'Preventive', "Calibración de preset de patrullaje", 'Resolved', 'Medium', datetime(2025, 6, 10), datetime(2025, 6, 11)],
        ["TKT-2026-013", "CAM-007", 'Corrective', "Falla en IR - visión nocturna", 'Resolved', 'High', datetime(2025, 10, 20), datetime(2025, 10, 24)],
        ["TKT-2026-014", "CAM-009", 'Preventive', "Limpieza semestral and ajuste de ángulo", 'Resolved', 'Low', datetime(2025, 8, 5), datetime(2025, 8, 6)],
        ["TKT-2026-015", "CAM-015", 'Corrective', "Interferencia eléctrica en imagen", 'Resolved', 'Medium', datetime(2026, 1, 5), datetime(2026, 1, 9)]
    ]

    for data in tickets_data:
        Ticket.objects.get_or_create(
            id=data[0],
            defaults={
                'camera_id': data[1], 'ticket_type': data[2], 'description': data[3],
                'status': data[4], 'priority': data[5], 'created_at': data[6], 'closed_at': data[7]
            }
        )
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
