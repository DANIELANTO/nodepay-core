# Project Context: NodePay

## Descripción General
**NodePay** es una plataforma de gestión de pagos full-stack construida como un sistema de microservicios. Permite a los administradores gestionar usuarios y sus billeteras (wallets), simular transacciones financieras en tiempo real y obtener respuestas impulsadas por IA sobre los términos de la plataforma y datos financieros en vivo.

## Propósito Principal
Sistema de gestión de pagos que integra una solución de microservicios para manejar identidades, operaciones financieras en tiempo real y asistencia inteligente a través de un RAG y un Agente SQL.

## Tecnologías Utilizadas
- **Lenguajes:** TypeScript (Node.js, React), Python (IA).
- **Base de Datos:** PostgreSQL 15 (esquemas aislados `public` y `auth`).
- **Identity Provider:** Keycloak 24.0.4.
- **Contenedores:** Docker y Docker Compose.

## Frameworks Principales
- **Backend (User Management):** Node.js, Express.js v5, Prisma ORM, Socket.IO v4.
- **Backend (AI Service):** Python 3.x, FastAPI, LangChain, OpenAI GPT-4o-mini.
- **Frontend:** React 19, Vite 7, Tailwind CSS v4, Zustand (Auth), Redux Toolkit / RTK Query (API), React Router DOM v7.

## Tipo de Aplicación
Plataforma basada en arquitectura de **Microservicios**.

## Cómo se Ejecuta / Prepara el Entorno
El entorno completo se levanta mediante **Docker Compose**.

1. Copiar los archivos de entorno:
   - `cp .env.example .env` (Raíz)
   - `cp ai-service/.env.example ai-service/.env`
   - `cp frontend/.env.example frontend/.env`
2. Configurar los secretos (OpenAI key, Keycloak URL, etc.).
3. Ejecutar: `docker compose up --build`

## Comandos Importantes Detectados
- **Backend (Raíz):** `npm run dev` (nodemon + ts-node), `npm run build` (tsc), `npm start`.
- **Frontend:** `npm run dev` (vite), `npm run build` (tsc -b && vite build).
- **Docker:** `docker compose up --build`.

## Variables de Entorno Relevantes
- **User Management (`.env`):** `DATABASE_URL`, `FRONTEND_URL`, `PORT`
- **AI Service (`ai-service/.env`):** `OPENAI_API_KEY`, `DATABASE_URL`, `FRONTEND_URL`
- **Frontend (`frontend/.env`):** `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID`, `VITE_API_URL`, `VITE_AI_URL`

## Resumen de la Estructura General
- `/src`: Backend principal en Node.js (User Management & Wallets).
- `/ai-service`: Microservicio de IA en Python.
- `/frontend`: SPA en React.
- `/prisma`: Configuración y esquemas de base de datos Prisma.
- `docker-compose.yml`: Orquestación de servicios y base de datos/Keycloak.

## Estado Actual del Proyecto
Proyecto en fase funcional con integración completa entre React (Frontend), Node (User Management), FastAPI (AI Service) y Keycloak. Recientemente se han realizado refactorizaciones visuales al estilo "Tech-Minimalist" y mejoras en RAG/Búsquedas.

## Información Pendiente de Confirmar
- Flujo exacto del despliegue en producción (si existe un pipeline CI/CD).
- Estrategia de pruebas actual (se detectó `jest` en package.json pero no detalles profundos de cobertura).
