# System Architecture: NodePay

## Description of the Current Architecture
NodePay uses a **Microservices Architecture** where each service is independent, with its own codebase, dependencies, and deployment lifecycle. Services communicate through well-defined contracts (REST and WebSockets).

## Main System Layers
1. **Client Layer (Frontend):** A React SPA that handles the user interface, interacts with Keycloak for authentication, and consumes REST/WebSockets APIs.
2. **User Management Service (Node.js):** The main service for identity management, wallet operations, and transaction simulation.
3. **AI Service (Python):** An intelligent service providing QA over Terms and Conditions via RAG, and business data queries using a read-only SQL Agent.
4. **Data Layer (PostgreSQL):** A persistent, shared relational database that is logically isolated using schemas (`public` for Prisma, `auth` for Keycloak).
5. **Identity Provider (Keycloak):** A dedicated Single Sign-On (SSO) and JWT token management service.

## Responsibility of Each Layer
- **Frontend:** Presentation, global state management (Zustand for auth, RTK for data), real-time UI.
- **Node.js Backend:** Payment business logic (Domain-Driven Design), real-time event broadcasting (Socket.IO).
- **Python AI Service:** Natural language processing, Vector Store (FAISS), secure read-only database interactions.

## General Data Flow
1. **Authentication:** Frontend -> Keycloak -> JWT returned to Frontend.
2. **Business Operation:** Frontend (with JWT) -> REST API (Node) -> Prisma -> PostgreSQL.
3. **Real-Time:** Node Backend processes simulation -> Emits event to Socket.IO (specific room) -> Frontend updates state without reloading.
4. **AI Query (RAG):** Frontend -> REST API (Python) -> Semantic Cache -> On Miss -> FAISS -> GPT-4o-mini -> Frontend.

## Identified Design Patterns
- **Repository Pattern:** In the Node backend (`Controller -> Service -> IUserRepository -> PrismaUserRepository`).
- **Domain-Driven Design (Inspiration):** Logic grouped by domains (`User`, `Wallet`, `Transaction`). Business logic encapsulated in services (e.g., `SimulationService`).
- **Pub/Sub (Real-Time):** Use of Rooms in Socket.IO for notifications targeted by `walletId`.
- **Semantic Caching:** In the AI service to avoid unnecessary LLM calls.

## Visible Architectural Decisions
- Separation of Keycloak from the application logic for complete identity management.
- Restricting the AI SQL Agent to `SELECT` operations exclusively to prevent accidental or malicious data manipulation (Data Integrity).
- Transactions are immutable (created only as `COMPLETED` or `REJECTED`, never updated).
- Strong dependency on Docker Compose for the development environment and internal network bridging.

## Risks or Areas of Concern
- The database is shared across application and Keycloak schemas. If PostgreSQL goes down, the entire system goes down.
- Queries in the SQL Agent depend on keeping table/column names in double quotes due to Prisma.
- DB Schema Maintenance: Prisma is the single source of truth for the `public` schema.

## Areas Where the Architecture is Not Yet Clear
- *Pending confirmation:* Horizontal scalability of Socket.IO (if multiple instances of the Node backend are required, a Redis adapter would be missing).
