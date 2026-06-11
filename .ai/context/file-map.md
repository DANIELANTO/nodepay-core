# Mapa de Archivos y Carpetas

## Estructura General

```txt
NodePay/
├── .ai/                    # Development Harness: Contexto, specs, guías para agentes IA
├── ai-service/             # Servicio backend Python/FastAPI (IA RAG y Agente SQL)
├── frontend/               # Cliente web React SPA
├── prisma/                 # Configuración de ORM, migraciones de BD y schema
├── src/                    # Servicio backend Node.js (User Management)
├── docker-compose.yml      # Orquestador principal de servicios para desarrollo local
├── Dockerfile              # Dockerfile para el backend Node.js
├── package.json            # Dependencias del servicio Node.js (raíz)
└── README.md               # Documentación general y arquitectura del proyecto
```

## Propósito de Carpetas y Archivos Importantes

### `/src` (Backend Node.js)
Ubicación de lógica de negocio, controladores y base de datos para la gestión de usuarios y pagos.
- `/src/index.ts`: Punto de entrada, configuración de Express, middlewares y Socket.IO.
- `/src/config/`: Archivos de configuración general.
- `/src/controllers/`: Controladores de los endpoints HTTP. Reciben peticiones y delegan en servicios.
- `/src/services/`: **Ubicación de la lógica de negocio.**
  - `/src/services/repositories/`: Capa de acceso a datos (Patrón Repositorio). Implementaciones concretas de interfaces de Prisma.
- `/src/models/`: Interfaces TypeScript y contratos de repositorios.
- `/src/routes/`: Definición de rutas Express.

### `/frontend` (Cliente React)
Interfaz de usuario de la plataforma.
- `/frontend/src/main.tsx`: Punto de entrada React.
- `/frontend/src/App.tsx`: Enrutador principal y layouts.
- `/frontend/src/components/`: Componentes visuales reutilizables.
- `/frontend/src/pages/`: Vistas completas de la aplicación (Login, Dashboard, UsersTable, etc.).
- `/frontend/src/store/`: Manejo de estado global (Zustand para Auth, RTK Query para API requests).
- `/frontend/src/api/`: Instancias de Axios y clientes de Socket.IO.
- `/frontend/src/config/`: Configuraciones de Keycloak (`keycloak-js`).

### `/ai-service` (Servicio Python IA)
- `/ai-service/src/main.py`: Punto de entrada FastAPI, endpoints RAG y Agente SQL.
- `/ai-service/docs/`: Documentos de texto plano (como Términos y Condiciones) para alimentar el RAG.
- `/ai-service/requirements.txt`: Dependencias de Python.

### `/prisma`
- `/prisma/schema.prisma`: Fuente única de verdad de los modelos de base de datos de la aplicación (excepto Keycloak).
- `/prisma/migrations/`: Historial de migraciones.

## Archivos que NO deben modificarse sin cuidado
- `prisma/schema.prisma`: Cualquier cambio requiere generar una nueva migración y puede romper el backend y el Agente SQL.
- Archivos de configuración de Keycloak: Su alteración puede romper todo el flujo de autenticación de la plataforma.
- Configuración de RAG y System Prompts en `/ai-service/src/main.py`: Cambios imprevistos pueden causar alucinaciones en el modelo de lenguaje.
