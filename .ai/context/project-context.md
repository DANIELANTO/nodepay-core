# Project Context: NodePay

## General Description
**NodePay** is a full-stack payment management platform built as a microservices system. It allows administrators to manage users and their wallets, simulate financial transactions in real-time, and get AI-driven responses about platform terms and live financial data.

## Core Purpose
A payment management system that integrates a microservices solution to handle identities, real-time financial operations, and intelligent assistance via RAG and a SQL Agent.

## Technologies Used
- **Languages:** TypeScript (Node.js, React), Python (AI).
- **Database:** PostgreSQL 15 (isolated schemas: `public` and `auth`).
- **Identity Provider:** Keycloak 24.0.4.
- **Containers:** Docker and Docker Compose.

## Key Frameworks
- **Backend (User Management):** Node.js, Express.js v5, Prisma ORM, Socket.IO v4.
- **Backend (AI Service):** Python 3.x, FastAPI, LangChain, OpenAI GPT-4o-mini.
- **Frontend:** React 19, Vite 7, Tailwind CSS v4, Zustand (Auth), Redux Toolkit / RTK Query (API), React Router DOM v7.

## Application Type
Microservices-based platform.

## How to Run / Set Up the Environment
The complete environment is run via **Docker Compose**.

1. Copy the environment files:
   - `cp .env.example .env` (Root)
   - `cp ai-service/.env.example ai-service/.env`
   - `cp frontend/.env.example frontend/.env`
2. Configure secrets (OpenAI key, Keycloak URL, etc.).
3. Run: `docker compose up --build`

## Key Commands Detected
- **Backend (Root):** `npm run dev` (nodemon + ts-node), `npm run build` (tsc), `npm start`.
- **Frontend:** `npm run dev` (vite), `npm run build` (tsc -b && vite build).
- **Docker:** `docker compose up --build`.

## Relevant Environment Variables
- **User Management (`.env`):** `DATABASE_URL`, `FRONTEND_URL`, `PORT`
- **AI Service (`ai-service/.env`):** `OPENAI_API_KEY`, `DATABASE_URL`, `FRONTEND_URL`
- **Frontend (`frontend/.env`):** `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID`, `VITE_API_URL`, `VITE_AI_URL`

## General Structure Summary
- `/src`: Main backend in Node.js (User Management & Wallets).
- `/ai-service`: Python AI microservice.
- `/frontend`: React SPA.
- `/prisma`: Prisma database schema and configuration.
- `docker-compose.yml`: Database, Keycloak, and service orchestration.

## Current Project Status
Fully functional project with complete integration between React (Frontend), Node (User Management), FastAPI (AI Service), and Keycloak. Recently, visual refactorings to a "Tech-Minimalist" style and RAG/search improvements were implemented.

## Information Pending Confirmation
- Exact production deployment workflow (whether a CI/CD pipeline exists).
- Current testing strategy (`jest` was detected in package.json, but coverage details are missing).
