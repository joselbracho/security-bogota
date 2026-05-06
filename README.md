# Sistema de Videovigilancia Bogotá - Grupo Verytel

Este proyecto es una prueba técnica para la gestión de cámaras de seguridad y tickets de mantenimiento en la ciudad de Bogotá.

## Características
- **Dashboard Interactivo:** KPIs, gráficas de distribución de estado y tickets por localidad.
- **Mapa en Tiempo Real:** Visualización geolocalizada de cámaras con estados diferenciados por colores.
- **Gestión de Cámaras:** CRUD completo con validaciones geográficas y soft delete.
- **Gestión de Tickets:** Seguimiento de mantenimiento con flujo de estados controlado.

## Requisitos
- Docker y Docker Compose

## Ejecución Rápida
1. Clonar el repositorio.
2. Ejecutar:
   ```bash
   docker-compose up --build
   ```
3. El sistema estará disponible en:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8000/api/v1
   - **Documentación API (Swagger):** http://localhost:8000/docs

## Carga de Datos Iniciales
El sistema incluye un script de semilla. Si usas Docker, puedes ejecutarlo con:
```bash
docker-compose exec backend python seed.py
```

## Ejecución Manual (Sin Docker)
### Backend
1. Ir a `backend/`.
2. Crear un entorno virtual e instalar dependencias: `pip install -r requirements.txt`.
3. Configurar `.env` con `DATABASE_URL`.
4. Ejecutar: `uvicorn app.main:app --reload`.

### Frontend
1. Ir a `frontend/`.
2. Instalar dependencias: `npm install`.
3. Ejecutar: `npm run dev`.

## Pruebas
Para ejecutar las pruebas del backend:
```bash
cd backend
pytest
```
