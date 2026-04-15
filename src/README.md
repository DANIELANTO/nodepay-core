# User Management Service

> **REST API & Real-Time Engine** for NodePay — built with Node.js, TypeScript, Express 5, Prisma ORM, and Socket.IO.

Part of the [NodePay](../README.md) microservices platform.

---

## Table of Contents

- [Responsibility](#responsibility)
- [Tech Stack](#tech-stack)
- [Architecture & Patterns](#architecture--patterns)
  - [Layered Architecture](#layered-architecture)
  - [Repository Pattern](#repository-pattern)
  - [Real-Time Simulation Engine](#real-time-simulation-engine)
- [API Reference](#api-reference)
  - [Users Endpoints](#users-endpoints)
  - [Wallets Endpoints](#wallets-endpoints)
  - [Health Check](#health-check)
- [Database Schema](#database-schema)
- [WebSocket Events](#websocket-events)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

---

## Responsibility

This service is the **core backend** of NodePay. It handles:

- **User management** — create, read, update users, toggle active status
- **Wallet management** — each user automatically gets a linked wallet on registration
- **Transaction simulation** — generates random DEPOSIT/WITHDRAWAL events on a wallet at regular intervals, enforcing business rules (no negative balances)
- **Real-time events** — pushes wallet balance updates to connected frontend clients via WebSocket rooms

---

## Tech Stack

| Technology | Role |
|---|---|
| **Node.js** | JavaScript runtime |
| **TypeScript** (ESM) | Type-safe development, compiled to ES Modules |
| **Express.js v5** | HTTP server framework |
| **Prisma 7** | ORM — schema management, migrations, type-safe queries |
| **`@prisma/adapter-pg`** | Native PostgreSQL adapter for Prisma |
| **Socket.IO v4** | WebSocket server for real-time events |
| **`pg`** | Low-level PostgreSQL client |
| **`cors`** | Cross-Origin Resource Sharing middleware |
| **`dotenv`** | Environment variable loading |
| **`nodemon`** | Development hot-reloading |
| **`ts-node`** | TypeScript execution for development |

---

## Architecture & Patterns

### Layered Architecture

The service is organized into strict, well-defined layers. Each layer only communicates with the layer directly below it:

```
HTTP Request
     ↓
┌───────────────────────────────────┐
│         Routes Layer              │  (routes/*.routes.ts)
│  Maps HTTP methods + paths to     │
│  controller functions             │
└─────────────────┬─────────────────┘
                  ↓
┌───────────────────────────────────┐
│       Controllers Layer           │  (controllers/*.controller.ts)
│  Validates request input          │
│  Calls Service methods            │
│  Sends HTTP responses             │
└─────────────────┬─────────────────┘
                  ↓
┌───────────────────────────────────┐
│        Services Layer             │  (services/*.service.ts)
│  Encapsulates business logic      │
│  Orchestrates repository calls    │
│  Enforces domain rules            │
└─────────────────┬─────────────────┘
                  ↓
┌───────────────────────────────────┐
│      Repository Layer             │  (services/repositories/)
│  Abstracts all data access        │
│  Only layer that knows Prisma     │
└─────────────────┬─────────────────┘
                  ↓
            PostgreSQL DB
```

---

### Repository Pattern

Business logic is completely decoupled from data access through the **Repository Pattern**:

**Interface** — `models/repositories/IUserRepository.ts`
```typescript
interface IUserRepository {
  createUser(email: string, name: string): Promise<User>
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  toggleUserStatus(id: string): Promise<User>
  editUser(id: string, name: string): Promise<User>
}
```

**Implementation** — `services/repositories/PrismaUserRepository.ts`
```typescript
class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}
  // ... all methods use Prisma Client
}
```

**Wiring** — done in the controller, not via a DI container:
```typescript
const userRepository = new PrismaUserRepository(prisma);
const userService    = new UserService(userRepository);
```

**Benefits:**
- `UserService` has zero knowledge of Prisma — it works with any `IUserRepository` implementation
- The data layer is **fully testable** in isolation by injecting a mock repository
- Swapping the database (e.g., to MongoDB) only requires writing a new repository class

---

### Real-Time Simulation Engine

The `SimulationService` (`services/simulation.service.ts`) manages **per-wallet transaction simulations**:

```
simulationService.start(walletId)
        ↓
setInterval(executeTick, 5000ms)
        ↓
   ┌──────────────────────────────────────────────────────┐
   │                  executeTick()                        │
   │  1. Generate random amount ($1–$500) and type        │
   │     (DEPOSIT or WITHDRAWAL)                          │
   │                                                      │
   │  2. Prisma Atomic Transaction:                        │
   │     - Fetch wallet                                   │
   │     - BUSINESS RULE: if WITHDRAWAL > balance         │
   │       → record as REJECTED, skip balance update      │
   │     - Otherwise: update balance + record COMPLETED   │
   │                                                      │
   │  3. Emit `wallet_update` via Socket.IO               │
   │     → only to room `wallet_{walletId}`               │
   └──────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **Atomic Prisma transactions** (`prisma.$transaction`) ensure balance update and transaction record are always consistent — no partial writes
- **Rejected transactions are still recorded** — providing a full audit trail
- **Socket.IO rooms** ensure updates are only sent to clients watching the specific wallet, not broadcast to everyone

---

## API Reference

Base URL: `http://localhost:3000`

### Health Check

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Returns service status and timestamp |

**Response:**
```json
{ "status": "up", "timestamp": "2026-04-15T20:00:00.000Z" }
```

---

### Users Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/users` | Get all users (with their wallets) |
| `GET` | `/users/:id` | Get a user by ID (with wallet) |
| `POST` | `/users` | Create a new user (and their wallet) |
| `PATCH` | `/users/:id/status` | Toggle user active/inactive status |
| `PATCH` | `/users/:id` | Edit user name |

**`POST /users` — Request Body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe"
}
```

**`POST /users` — Response (201):**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "...",
  "wallet": {
    "id": "uuid",
    "balance": 0,
    "currency": "USD",
    "userId": "uuid",
    "updatedAt": "..."
  }
}
```

**`PATCH /users/:id` — Request Body:**
```json
{ "name": "New Name" }
```

---

### Wallets Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/wallets/:id/simulate/start` | Start transaction simulation for a wallet |
| `POST` | `/wallets/:id/simulate/stop` | Stop transaction simulation for a wallet |

**Note:** `:id` is the **wallet ID**, not the user ID.

---

## Database Schema

Defined in [`../prisma/schema.prisma`](../prisma/schema.prisma).

### Models

**`User`**
```
id        String   (UUID, PK)
email     String   (unique)
name      String
isActive  Boolean  (default: true)
createdAt DateTime
updatedAt DateTime
wallet    Wallet?  (one-to-one, optional)
```

**`Wallet`**
```
id           String        (UUID, PK)
balance      Float         (default: 0.0)
currency     String        (default: "USD")
userId       String        (unique FK → User)
updatedAt    DateTime
transactions Transaction[]
```

**`Transaction`**
```
id        String            (UUID, PK)
amount    Float
type      TransactionType   (DEPOSIT | WITHDRAWAL)
status    TransactionStatus (COMPLETED | REJECTED)
createdAt DateTime
walletId  String            (FK → Wallet)
```

### Migrations

Run migrations manually:
```bash
npx prisma migrate deploy    # Apply pending migrations
npx prisma migrate dev       # Generate + apply new migration (dev only)
npx prisma generate          # Regenerate Prisma Client after schema changes
```

---

## WebSocket Events

The Socket.IO server is mounted on the same HTTP server as Express.

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `join_wallet_room` | `walletId: string` | Join a wallet-specific room to receive updates |

**Example (client side):**
```javascript
socket.emit('join_wallet_room', 'wallet-uuid-here');
```

### Server → Client

| Event | Room | Payload | Description |
|---|---|---|---|
| `wallet_update` | `wallet_{walletId}` | `{ walletId, newBalance, lastTransaction, error }` | Emitted after each simulation tick |

**Payload shape:**
```json
{
  "walletId": "uuid",
  "newBalance": 1250.50,
  "lastTransaction": { "type": "DEPOSIT", "amount": 123.45 },
  "error": null
}
```

If the transaction was rejected (insufficient funds):
```json
{
  "walletId": "uuid",
  "newBalance": 50.00,
  "lastTransaction": null,
  "error": "Insufficient balance"
}
```

---

## Project Structure

```
src/
├── index.ts                    # Entry point: Express app, Socket.IO setup, server listen
├── config/
│   ├── db.ts                   # Prisma Client singleton
│   └── shutdown.ts             # GracefulShutdown handler (SIGTERM/SIGINT)
├── routes/
│   ├── user.routes.ts          # /users route definitions
│   └── wallet.routes.ts        # /wallets route definitions
├── controllers/
│   └── user.controller.ts      # HTTP handlers for user endpoints
├── services/
│   ├── user.service.ts         # User business logic
│   ├── simulation.service.ts   # Wallet simulation engine
│   └── repositories/
│       └── PrismaUserRepository.ts  # Prisma implementation of IUserRepository
└── models/
    └── repositories/
        └── IUserRepository.ts  # Repository interface (contract)
```

---

## Local Development

```bash
# From the project root (NodePay/)

# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env

# 3. Make sure PostgreSQL is running (e.g., via Docker)
docker compose up db -d

# 4. Apply DB migrations and generate Prisma Client
npx prisma migrate deploy
npx prisma generate

# 5. Start the development server with hot-reload
npm run dev
```

The service will start at `http://localhost:3000`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL URL. Format: `postgresql://user:pass@host:5432/db?schema=public` |
| `FRONTEND_URL` | ✅ | Allowed CORS origin for the browser client |
| `PORT` | ❌ | HTTP server port (default: `3000`) |
| `NODE_ENV` | ❌ | `development` or `production` |

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start development server with nodemon + ts-node |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm start` | Run compiled production build |
| `test` | `npm test` | Run Jest test suite |
