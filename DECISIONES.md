# Decisiones Técnicas - Sistema de Videovigilancia Bogotá

## Stack Tecnológico
- **Backend:** **Django (Python)** con **Django Rest Framework (DRF)**. Elegido por su robustez en el manejo de ORM, sistema de migraciones integrado y facilidad para construir APIs empresariales seguras y escalables.
- **Frontend:** **React (TypeScript) + Vite**. Utilizado para garantizar un rendimiento óptimo y un desarrollo basado en componentes con tipado estricto.
- **Base de Datos:** **PostgreSQL**. Garantiza la integridad referencial y el soporte para datos geoespaciales en el futuro.
- **Protocolo de Comunicación:** REST API con soporte para actualizaciones parciales mediante **PATCH**.
- **UI & Estilos:** **Tailwind CSS + Shadcn/UI**. Proporciona una interfaz moderna, responsiva y profesional.
- **Mapas:** **React-Leaflet**. Implementado para la visualización de cámaras con iconos personalizados basados en su estado actual.
- **Contenerización:** **Docker Compose**. Utilizado para orquestar los servicios de base de datos, backend y frontend en un entorno reproducible.

## Arquitectura y Diseño
1.  **Modelo de Datos en Inglés:** Se definió el esquema de base de datos íntegramente en inglés (ej. `model`, `status`, `latitude`, `longitude`) siguiendo los estándares internacionales de ingeniería de software.
2.  **Gestión de Estados de Tickets:** Se implementó una lógica de validación estricta en el backend para asegurar que el flujo de mantenimiento sea unidireccional y coherente (`New → In Progress → Resolved`).
3.  **Bonus Track (Visualización de Stream):** Ante la imposibilidad de reproducir RTSP de forma nativa en navegadores sin transcodificación, se diseñó un **simulador de monitoreo profesional HUD (Heads-Up Display)** que visualiza los metadatos técnicos y simula la conexión en vivo.
4.  **Eliminación Lógica (Soft Delete):** Las cámaras eliminadas se marcan con un flag `is_deleted` para preservar el histórico de tickets y auditoría de mantenimiento.

## Desarrollo de la Solución
La aplicación sigue una arquitectura desacoplada de tres capas:
```
[ Frontend: React/TS ] --(JSON/API)--> [ Backend: Django/DRF ] --(SQL)--> [ DB: PostgreSQL ]
```

## Uso de Herramientas de IA
Se utilizó Gemini CLI de manera estratégica para:
1.  **Generación de Estructura:** Definición de modelos, serializadores y vistas de Django siguiendo las mejores prácticas de DRF.
2.  **Configuración de TypeScript:** Resolución de dependencias y optimización del archivo `tsconfig.json`.
3.  **Dockerización:** Ajuste de los scripts de entrada (`entrypoint.sh`) y configuración de redes para asegurar la conectividad entre servicios.
4.  **Maquetación HUD:** Diseño del componente de simulación de streaming mediante Tailwind CSS.

## Decisiones de Diseño y Compromisos (Trade-offs)
- **Convención de Slashes:** Se configuró el frontend para cumplir estrictamente con el manejo de trailing slashes de Django, evitando redirecciones innecesarias en peticiones POST/PATCH.
- **Robustez en el Arranque:** Se implementó un script de verificación de base de datos en el contenedor de backend para asegurar que las migraciones y la semilla de datos solo se ejecuten cuando PostgreSQL esté disponible.

## Tiempo Invertido
- Planeación y Diseño de Arquitectura: 1 hora
- Implementación de Backend (Django/DRF): 3.5 horas
- Desarrollo de Frontend y Mapas: 2 horas
- Bonus Track y Pulido de UI/UX: 1 hora
- Testing y Documentación: 0.5 horas
- **Total:** ~8 horas
