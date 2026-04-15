# NodePay

> **A microservices-based payment management system** built with Node.js, Python, and React — featuring real-time updates, AI-powered assistance, and identity management via Keycloak.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [High-Level Diagram](#high-level-diagram)
  - [Services at a Glance](#services-at-a-glance)
- [Tech Stack](#tech-stack)
- [Design Paradigms & Principles](#design-paradigms--principles)
  - [Microservices Architecture](#microservices-architecture)
  - [Repository Pattern](#repository-pattern)
  - [Domain-Driven Design (DDD) Inspiration](#domain-driven-design-ddd-inspiration)
  - [Real-Time Communication](#real-time-communication)
  - [AI with RAG & Semantic Cache](#ai-with-rag--semantic-cache)
  - [Security — Authentication & Authorization](#security--authentication--authorization)
- [Database Design](#database-design)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker Compose](#running-with-docker-compose)
  - [Running Services Individually](#running-services-individually)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Author](#author)

---

## Overview

**NodePay** is a full-stack payment platform built as a microservices system. It allows administrators to manage users and their wallets, simulate financial transactions in real time, and get AI-powered answers about the platform's terms and live financial data.

The system is divided into three independent, containerized services that communicate through HTTP REST APIs and WebSockets, orchestrated by Docker Compose.

---

## Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                      │
│                   React + Vite Frontend                  │
│          (Port 5173 — Tailwind CSS, Zustand, RTK)        │
└────────────┬─────────────────────────┬──────────────────┘
             │ REST (Axios)            │ WebSocket (Socket.IO)
             ▼                         ▼
┌────────────────────────┐   ┌─────────────────────────────┐
│  User Management API   │   │        AI Service           │
│  Node.js + Express 5   │   │   Python + FastAPI          │
│  (Port 3000)           │   │   (Port 8000)               │
│  Prisma ORM            │   │   LangChain + OpenAI        │
│  Socket.IO Server      │   │   RAG + SQL Agent           │
└────────────┬───────────┘   └────────────────┬────────────┘
             │                                │
             └──────────────┬─────────────────┘
                            ▼
              ┌─────────────────────────────┐
              │     PostgreSQL 15           │
              │  Schema: public (app data)  │
              │  Schema: auth   (Keycloak)  │
              └─────────────────────────────┘
                            ▲
              ┌─────────────┴───────────────┐
              │   Keycloak 24  (Port 8080)  │
              │   Identity & Access Mgmt    │
              └─────────────────────────────┘
```

### Services at a Glance

| Service | Technology | Port | Responsibility |
|---|---|---|---|
| **user-management-service** | Node.js, Express 5, TypeScript | `3000` | User CRUD, Wallet management, Transaction simulation, WebSocket events |
| **ai-service** | Python, FastAPI, LangChain | `8000` | RAG-based Q&A on Terms & Conditions, SQL Agent for live data insights |
| **frontend** | React 19, Vite, TypeScript | `5173` | Admin dashboard UI, authentication flow, real-time wallet display |
| **keycloak** | Keycloak 24.0.4 | `8080` | Identity provider — SSO, JWT issuance, token refresh |
| **db** | PostgreSQL 15 | `5432` | Shared persistent store with isolated schemas |

---

## Tech Stack

### Backend — User Management Service
- **Runtime:** Node.js with TypeScript (ESM modules)
- **Framework:** Express.js v5
- **ORM:** Prisma 7 with PostgreSQL adapter (`@prisma/adapter-pg`)
- **Real-Time:** Socket.IO v4
- **Build:** `tsc` → compiled to `dist/`
- **Dev Server:** `nodemon` with `ts-node/esm` loader

### AI Service
- **Runtime:** Python 3.x
- **Framework:** FastAPI + Uvicorn
- **AI/LLM Orchestration:** LangChain (`langchain`, `langchain-openai`, `langchain-community`)
- **Vector Store:** FAISS (in-memory)
- **LLM:** OpenAI GPT-4o-mini
- **Database Access:** SQLAlchemy + psycopg2

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (auth) + Redux Toolkit / RTK Query (API calls)
- **HTTP Client:** Axios
- **Real-Time:** Socket.IO client
- **Authentication:** `keycloak-js`
- **Routing:** React Router DOM v7

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Database:** PostgreSQL 15 (Alpine)
- **Auth Provider:** Keycloak 24.0.4

---

## Design Paradigms & Principles

### Microservices Architecture

NodePay is built as a set of **independent, loosely coupled services**. Each service:

- Has its own codebase, dependencies, and Dockerfile
- Owns a specific domain responsibility (users, AI, presentation)
- Communicates via well-defined contracts (REST + WebSocket)
- Can be scaled, deployed, or replaced independently

This separation ensures that, for example, the AI service can use Python/LangChain without affecting the Node.js backend, and both can be updated without redeploying the frontend.

---

### Repository Pattern

The user-management backend strictly applies the **Repository Pattern** to decouple business logic from data access:

```
Controller → Service → IUserRepository (interface)
                              ↑
                  PrismaUserRepository (implementation)
```

- `IUserRepository` defines the contract (interface) for user data access
- `PrismaUserRepository` is the concrete implementation using Prisma
- The `UserService` only depends on the interface, never on Prisma directly
- This makes the data layer **swappable** (e.g., could be replaced with a MongoDB repository) and easily **testable** with mocks

---

### Domain-Driven Design (DDD) Inspiration

The backend is organized around **business domains**, not technical layers:

- **User** domain: handles identity, registration, and status management
- **Wallet** domain: manages financial balances, tightly coupled to users (one-to-one)
- **Transaction** domain: immutable event records of financial activity (COMPLETED / REJECTED)

Business rules are enforced **inside the service layer**, not in controllers or the database:
- A withdrawal that would result in a negative balance is automatically rejected and recorded as a `REJECTED` transaction — the business rule lives in `SimulationService`, not at the DB constraint level.

---

### Real-Time Communication

The backend uses **Socket.IO rooms** for targeted real-time push events:

1. The frontend joins a **wallet room** (`wallet_{walletId}`) upon viewing a wallet
2. On each simulation tick, the backend emits `wallet_update` **only to that room**
3. The frontend receives live balance updates and the latest transaction **without polling**

This avoids broadcasting irrelevant updates to all connected clients, making the real-time layer both **efficient and scalable**.

---

### AI with RAG & Semantic Cache

The AI service implements two distinct AI workflows:

#### 1. RAG (Retrieval-Augmented Generation) — `/ask`
The assistant answers questions **exclusively** from the Terms & Conditions document, preventing hallucinations:

```
User Question
     ↓
Semantic Cache Check (FAISS similarity < 0.15 threshold)
     ↓ MISS
LangChain Retrieval Chain (FAISS vector store → top-2 chunks)
     ↓
GPT-4o-mini generates answer from retrieved context
     ↓
Answer stored in Semantic Cache for future hits
```

The **semantic cache** avoids re-calling the LLM for semantically identical questions (e.g., "What are the fees?" and "Tell me about your fees"), reducing latency and token costs.

#### 2. SQL Agent — `/data-insights`
A LangChain SQL Agent with direct read-only access to PostgreSQL. It:
- Is restricted to `SELECT` operations only (no DML)
- Never exposes sensitive fields (passwords, UUIDs, API keys)
- Refuses off-topic questions with a strict system prompt
- Wraps all table/column names in double quotes (Prisma case-sensitivity requirement)

---

### Security — Authentication & Authorization

Authentication is fully delegated to **Keycloak**, an enterprise-grade Identity Provider:

- The frontend uses `keycloak-js` to initiate SSO via OpenID Connect
- On login, Keycloak issues a **JWT Bearer token**
- The token is automatically refreshed by the auth store (Zustand) before expiry
- The backend's `CORS` middleware restricts cross-origin requests to the known frontend origin
- Keycloak data is stored in a **separate PostgreSQL schema** (`auth`) to isolate it from the application schema (`public`)

---

## Database Design

The PostgreSQL database uses **two isolated schemas** within the same instance:

| Schema | Owner | Tables |
|---|---|---|
| `public` | Application (Prisma) | `User`, `Wallet`, `Transaction` |
| `auth` | Keycloak | Keycloak internal tables |

### Entity Relationships

```
User (1) ──── (1) Wallet (1) ──── (*) Transaction
  id (UUID)         id (UUID)          id (UUID)
  email (unique)    balance (Float)    amount (Float)
  name              currency           type (DEPOSIT|WITHDRAWAL)
  isActive          userId (FK)        status (COMPLETED|REJECTED)
  createdAt         updatedAt          createdAt
  updatedAt                            walletId (FK)
```

**Key Constraints:**
- `User ↔ Wallet` is a **one-to-one** relationship (enforced by `@unique` on `userId`)
- Deleting a User **cascades** to delete the Wallet and all its Transactions
- Transaction records are **immutable** — they are only created, never updated

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) v18+ (for local development without Docker)
- [Python](https://www.python.org/) 3.10+ (for local AI service development)
- An [OpenAI API Key](https://platform.openai.com/api-keys)
- A configured Keycloak realm (see `ai-service/README.md` and `frontend/README.md`)

### Running with Docker Compose

```bash
# 1. Clone the repository
git clone https://github.com/DANIELANTO/NodePay.git
cd NodePay

# 2. Set up environment variables
cp .env.example .env          # Root (user-management-service)
cp ai-service/.env.example ai-service/.env
cp frontend/.env.example frontend/.env

# 3. Fill in your secrets (OpenAI key, Keycloak URL, etc.)
# See "Environment Variables" section below

# 4. Launch all services
docker compose up --build

# Services will be available at:
# Frontend:              http://localhost:5173
# User Management API:   http://localhost:3000
# AI Service:            http://localhost:8000
# Keycloak Admin:        http://localhost:8080
```

### Running Services Individually

Refer to each service's own README for standalone development instructions:

- [`src/` — User Management Service](./src/README.md) *(backend root)*
- [`ai-service/README.md`](./ai-service/README.md)
- [`frontend/README.md`](./frontend/README.md)

---

## Environment Variables

### Root (User Management Service) — `.env`

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/nodepay_db?schema=public` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `PORT` | Server port | `3000` |

### AI Service — `ai-service/.env`

| Variable | Description | Example |
|---|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@db:5432/nodepay_db?schema=public` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### Frontend — `frontend/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_KEYCLOAK_URL` | Keycloak server URL | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name | `nodepay` |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak client ID | `nodepay-frontend` |
| `VITE_API_URL` | User Management API URL | `http://localhost:3000` |
| `VITE_AI_URL` | AI Service URL | `http://localhost:8000` |

---

## Project Structure

```
NodePay/
├── docker-compose.yml          # Orchestrates all services
├── Dockerfile                  # User management service image
├── package.json                # Node.js dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── prisma/
│   ├── schema.prisma           # Database models & relations
│   ├── init-db.sql             # DB initialization (schema creation)
│   └── migrations/             # Prisma migration history
├── src/                        # User Management Service source
│   ├── index.ts                # Entry point — Express + Socket.IO setup
│   ├── config/                 # DB connection, graceful shutdown
│   ├── routes/                 # Route definitions
│   ├── controllers/            # HTTP request handlers
│   ├── services/               # Business logic
│   │   └── repositories/       # Data access layer (Repository Pattern)
│   └── models/                 # TypeScript interfaces & repository contracts
├── ai-service/                 # AI Service (Python/FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── src/main.py             # FastAPI app — RAG & SQL Agent
│   └── docs/                   # Knowledge base documents
└── frontend/                   # React SPA
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    └── src/
        ├── main.tsx            # React entry point
        ├── App.tsx             # Root component & routing
        ├── api/                # Axios instance & Socket.IO client
        ├── config/             # Keycloak configuration
        ├── store/              # Zustand stores & RTK Query API slices
        ├── router/             # ProtectedRoute guard
        ├── layouts/            # DashboardLayout
        ├── pages/              # Page components (Login, Users, etc.)
        └── components/         # Reusable UI components
```

---

## Author

**Daniel Romero** — [@DANIELANTO](https://github.com/DANIELANTO)

- Repository: [github.com/DANIELANTO/NodePay](https://github.com/DANIELANTO/NodePay)
- Issues: [github.com/DANIELANTO/NodePay/issues](https://github.com/DANIELANTO/NodePay/issues)
- License: ISC
