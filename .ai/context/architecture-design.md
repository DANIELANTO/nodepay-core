# Arquitectura del Sistema: NodePay

## Descripción de la Arquitectura Actual
NodePay utiliza una **Arquitectura de Microservicios** donde cada servicio es independiente, tiene su propio código, dependencias y ciclo de vida de despliegue. Los servicios se comunican a través de contratos bien definidos (REST y WebSockets).

## Capas Principales del Sistema
1. **Client Layer (Frontend):** React SPA que maneja la interfaz de usuario, interactúa con Keycloak para autenticación y consume las APIs REST/WebSockets.
2. **User Management Service (Node.js):** Servicio principal para gestión de identidades, operaciones de billeteras y simulación de transacciones.
3. **AI Service (Python):** Servicio inteligente que proporciona QA sobre Términos y Condiciones mediante RAG y respuestas sobre datos de negocio mediante un SQL Agent de solo lectura.
4. **Data Layer (PostgreSQL):** Base de datos relacional persistente compartida pero lógicamente aislada mediante esquemas (`public` para Prisma, `auth` para Keycloak).
5. **Identity Provider (Keycloak):** Servicio dedicado de Single Sign-On (SSO) y gestión de tokens JWT.

## Responsabilidad de cada Capa
- **Frontend:** Presentación, manejo de estado global (Zustand para auth, RTK para data), UI en tiempo real.
- **Node.js Backend:** Lógica de negocio de pagos (Domain-Driven Design), emisión de eventos en tiempo real (Socket.IO).
- **Python AI Service:** Procesamiento de lenguaje natural, Vector Store (FAISS), interacciones seguras con la base de datos a nivel lectura.

## Flujo General de Datos
1. **Autenticación:** Frontend -> Keycloak -> JWT devuelto al Frontend.
2. **Operación de Negocio:** Frontend (con JWT) -> REST API (Node) -> Prisma -> PostgreSQL.
3. **Real-Time:** Node Backend procesa simulación -> Emite evento a Socket.IO (room específico) -> Frontend actualiza estado sin recargar.
4. **IA Query (RAG):** Frontend -> REST API (Python) -> Semantic Cache -> Si hay Miss -> FAISS -> GPT-4o-mini -> Frontend.

## Patrones de Diseño Identificados
- **Repository Pattern:** En el backend de Node (`Controller -> Service -> IUserRepository -> PrismaUserRepository`).
- **Domain-Driven Design (Inspiración):** Lógica agrupada por dominios (`User`, `Wallet`, `Transaction`). Lógica de negocio encapsulada en servicios (ej. `SimulationService`).
- **Pub/Sub (Real-Time):** Uso de Rooms en Socket.IO para notificaciones orientadas por `walletId`.
- **Semantic Caching:** En el servicio de IA para evitar llamadas innecesarias al LLM.

## Decisiones Arquitectónicas Visibles
- Separación de Keycloak de la lógica de aplicación para la gestión completa de identidad.
- Restricción del AI SQL Agent a operaciones `SELECT` exclusivamente, para evitar manipulación accidental o maliciosa de datos (Data Integrity).
- Las transacciones son inmutables (solo se crean como `COMPLETED` o `REJECTED`, no se actualizan).
- Dependencia fuerte en Docker Compose para el entorno de desarrollo y enlace de redes internas.

## Riesgos o Puntos de Cuidado
- La base de datos es única y compartida entre los esquemas de la aplicación y Keycloak. Si PostgreSQL cae, todo el sistema cae.
- Las consultas en el Agente SQL dependen de mantener los nombres de tablas/columnas entre comillas dobles debido a Prisma.
- Mantenimiento del esquema de DB: Prisma es la única fuente de la verdad para el esquema `public`.

## Lugares donde la Arquitectura aún no está Clara
- *Pendiente de confirmar:* Escalabilidad horizontal de Socket.IO (si se requieren múltiples instancias del backend Node, faltaría un adaptador de Redis).
