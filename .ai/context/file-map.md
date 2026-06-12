# Directory and File Map

## General Structure

```txt
NodePay/
├── .ai/                    # Development Harness: Context, specs, guidelines for AI agents
├── ai-service/             # Python/FastAPI backend service (AI RAG and SQL Agent)
├── frontend/               # React SPA web client
├── prisma/                 # ORM configuration, DB migrations, and schema
├── src/                    # Node.js backend service (User Management)
├── docker-compose.yml      # Main service orchestrator for local development
├── Dockerfile              # Dockerfile for the Node.js backend
├── package.json            # Node.js service dependencies (root)
└── README.md               # General documentation and project architecture
```

## Purpose of Important Folders and Files

### `/src` (Node.js Backend)
Location of business logic, controllers, and database access for managing users and payments.
- `/src/index.ts`: Entry point, Express configuration, middlewares, and Socket.IO.
- `/src/config/`: General configuration files.
- `/src/controllers/`: HTTP endpoint controllers. They receive requests and delegate to services.
- `/src/services/`: **Location of business logic.**
  - `/src/services/repositories/`: Data access layer (Repository Pattern). Concrete Prisma implementations of interfaces.
- `/src/models/`: TypeScript interfaces and repository contracts.
- `/src/routes/`: Express route definitions.

### `/frontend` (React Client)
User interface of the platform.
- `/frontend/src/main.tsx`: React entry point.
- `/frontend/src/App.tsx`: Main router and layouts.
- `/frontend/src/components/`: Reusable UI components.
- `/frontend/src/pages/`: Complete application views (Login, Dashboard, UsersTable, etc.).
- `/frontend/src/store/`: Global state management (Zustand for Auth, RTK Query for API requests).
- `/frontend/src/api/`: Axios instances and Socket.IO clients.
- `/frontend/src/config/`: Keycloak configurations (`keycloak-js`).

### `/ai-service` (Python AI Service)
- `/ai-service/src/main.py`: FastAPI entry point, RAG endpoints, and SQL Agent.
- `/ai-service/docs/`: Plain text documents (such as Terms and Conditions) to feed the RAG.
- `/ai-service/requirements.txt`: Python dependencies.

### `/prisma`
- `/prisma/schema.prisma`: Single source of truth for the application database models (excluding Keycloak).
- `/prisma/migrations/`: Migration history.

## Files That Should NOT Be Modified Carelessly
- `prisma/schema.prisma`: Any changes require generating a new migration and can break the backend and the SQL Agent.
- Keycloak configuration files: Altering these can break the authentication flow of the entire platform.
- RAG configuration and System Prompts in `/ai-service/src/main.py`: Unexpected changes can cause hallucinations in the language model.
