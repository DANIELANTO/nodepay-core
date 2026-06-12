# Technical Decisions Log (ADR Log)

This file acts as a record of Architectural and Technical Decisions (simplified ADR) for the project.

> **UPDATE RULE:** This file must be updated every time:
> - The architecture changes.
> - A major dependency is added.
> - A major convention changes.
> - A critical decision is made that other agents need to know.
> - The folder or module organization is modified.
> - The main execution flow of the system changes.

---

## DEC-0001: Microservices Architecture

**Date:** 2024-01-01 (Approximate, inferred)  
**Status:** Accepted  
**Context:**  
A system was needed that combined fast transactional processing with advanced Artificial Intelligence tools, which have different environment and language requirements (Node vs Python).

**Decision:**  
Separate the system into 3 main dockerized components: Frontend SPA, Transactional Backend (Node), and AI Service (Python).

**Rationale:**  
Allows using the best tools of each ecosystem (Express/Prisma for fast and typed transactions; FastAPI/LangChain for advanced LLM processing).

**Impact:**  
Facilitates scalability and independent deployment. Requires Docker Compose for local development and internal network orchestration (CORS, inter-service URLs).

---

## DEC-0002: Repository Pattern in Node.js Backend

**Date:** 2024-01-01 (Approximate, inferred)  
**Status:** Accepted  
**Context:**  
Directly coupling the ORM (Prisma) to the business logic makes unit testing difficult and complicates switching database providers in the future.

**Decision:**  
Implement the Repository Pattern by creating strict interfaces (e.g., `IUserRepository`) and concrete implementation classes (`PrismaUserRepository`).

**Rationale:**  
Isolate domain logic (Domain-Driven Design) from data persistence concerns.

**Impact:**  
Developing new entities requires creating more files (Interface, Implementation, Service, Controller). Increases robustness and the ability to mock services in tests.

---

## DEC-0003: External Authentication with Keycloak

**Date:** 2024-01-01 (Approximate, inferred)  
**Status:** Accepted  
**Context:**  
Implementing a secure, scalable authentication system with support for SSO requires significant development and maintenance effort if done in-house.

**Decision:**  
Delegate all authentication and authorization to Keycloak, hosting its data in a isolated PostgreSQL schema (`auth`) separate from the application (`public`).

**Rationale:**  
Greater security, support for OIDC, automatic handling of refresh tokens, and ready-to-use roles.

**Impact:**  
The frontend strictly depends on `keycloak-js`. The backend blindly trusts the validated JWT from Keycloak.

---

## DEC-0004: Immutability of Financial Transactions

**Date:** 2024-01-01 (Approximate, inferred)  
**Status:** Accepted  
**Context:**  
Payment and wallet histories must be traceable and auditable. Modifying transactions opens the door to inconsistencies.

**Decision:**  
Transactions created in the database are immutable (`COMPLETED` or `REJECTED`). They are never updated or modified.

**Rationale:**  
Ensure the financial integrity of the system and prevent potential audit conflicts.

**Impact:**  
Any financial correction will require creating a new transaction of the opposite type, rather than modifying an existing one.

---

## DEC-0005: AI Semantic Caching and SQL Agent Restrictions

**Date:** 2024-01-01 (Approximate, inferred)  
**Status:** Accepted  
**Context:**  
Repeatedly calling the LLM for the same question consumes tokens and increases latency. The SQL Agent exposes risks of production database manipulation.

**Decision:**  
1. Use a Semantic Cache (FAISS) for RAG queries that have already been resolved.  
2. Limit the SQL Agent to read-only `SELECT` queries, hiding sensitive fields.

**Rationale:**  
Cost savings, performance improvement, and prevention of cybersecurity incidents or database corruption.

**Impact:**  
Requires maintaining state/memory in the Python service. The AI Service cannot perform write changes to the system, only observe.

---

## DEC-0006: Visual Redesign — Blue-Violet SaaS Theme and Hover Convention

**Date:** 2026-06-11  
**Status:** Accepted  
**Reference Spec:** `.ai/specs/2026-06-11-ui-visual-redesign.md`  
**Context:**  
The dashboard used an amber theme (`#F59E0B`) with heavy glassmorphism (`backdrop-blur`) and a global `scale-[1.02]` on hover. This generated an uncomfortable bounce feeling on containers, and buttons lacked `cursor: pointer`.

**Decision:**  
1. **System Accent:** Migrate from amber (`#F59E0B`) to blue-violet (`#4F46E5` / `indigo-600`). In dark mode: `#6366F1` (indigo-500).  
2. **General Background:** `#F3F4F8` (light mode) — very light gray, typical of modern SaaS.  
3. **Typography:** Only **Inter** for headings and body (eliminating Space Grotesk).  
4. **`.glass-card`:** Redesigned without `backdrop-blur` and without `scale` on hover. Uses a solid white background with a soft shadow.  
5. **Hover `scale` Convention:** Reserved **exclusively** for micro-interactions of targeted action buttons (FAB, submit). **Never** apply to containers, cards, tables, or navigation bars.  
6. **Buttons:** Must explicitly include `cursor-pointer` in their utility classes.  
7. **`ConfirmModal`:** `success` variant uses indigo (not green) for semantic consistency. `danger` uses solid red.

**Rationale:**  
Provides a more professional user experience consistent with modern SaaS standards. The `scale` effect on containers is distracting and unnatural for elements that are not targeted action items.

**Impact:**  
- All components and views must use semantic tokens (`bg-accent`, `text-accent`, `bg-surface`, `border-subtle`, etc.).
- The visual style has been unified, removing hardcoded colors (`amber-*`, `slate-*`) even from sections like `TermsPage` and the Copilot chat, ensuring they respond to the global theme (light/dark and accents).
- Any new confirmation modal must follow the solid color pattern of `ConfirmModal`.
