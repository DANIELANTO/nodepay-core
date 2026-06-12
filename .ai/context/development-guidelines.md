# Development Guidelines

## Detected Code Conventions

### Frontend (React/TypeScript)
- Strict use of functional components with Hooks.
- Styling via **Tailwind CSS v4** oriented toward a **Minimalist Modern SaaS** design system (Inter font, very light gray background `#F3F4F8`, blue-violet accent `#4F46E5`). Supports both light and dark modes.
- **Hover Convention:** `scale` on `:hover` is reserved **exclusively** for targeted action buttons (FAB, submit). Never apply to containers, cards, tables, or navigation bars.
- **System Accent and Tokens:** `#4F46E5` (indigo-600) in light mode, `#6366F1` (indigo-500) in dark mode. Use shared tokens like `bg-accent`, `text-accent`, `bg-surface`, `border-subtle`. Do not use hardcoded colors like `amber-*` or `slate-*` in any visual component of the system.
- Global State: **Zustand** for synchronous UI and Auth aspects; **Redux Toolkit Query (RTK Query)** for caching, fetching, and server mutations.
- Strict TypeScript. Exported interfaces/types are preferred.

### Backend (Node.js/TypeScript)
- Simplified **Domain-Driven Design (DDD)** implementation.
- Use of the **Repository Pattern**: never interact with Prisma directly from a Controller or general business Service, always go through the contract (`IUserRepository`, etc.).
- Modularity using ESM imports (proper extension use or correct module resolution).
- Coherent API response returns (standardized JSON format).

### AI Service (Python/FastAPI)
- Use of native Python type hints (`typing`).
- Asynchronous code (`async def`) for FastAPI endpoints.
- Careful management of database sessions and FAISS memory.

## How to Add New Features

1. **Mandatory Requirement:** Before implementing a feature or major change, a spec must first exist in `.ai/specs/`. If the spec does not exist, the agent or developer must create it or request the necessary information to complete it.
2. Identify which microservice the new feature belongs to.
3. If it impacts the DB, update `schema.prisma`, create a migration, and implement the interface in the Repository layer.
4. Create the business logic in the `services/` layer.
5. Expose the functionality through `controllers/` and `routes/`.
6. On Frontend, define the endpoint in the RTK Query API slice, or create a custom hook. Integrate visually, respecting the "Tech-Minimalist" guidelines.

## How to Modify Existing Code

- **Respect Transaction Immutability:** Never add logic to `UPDATE` a financial transaction. Transactions must be created and remain static.
- **Avoid Breaking the Architecture:** Do not call the DB directly from controllers. Do not mix UI logic with business logic.
- **Maintain Typing:** Ensure that TypeScript interfaces and Python types match.

## Workflow and Automation

> **STRICT SPECIFICATION RULE:**
> Every modification, refactor, or feature must follow **Spec Driven Design / Spec Driven Development**. Review the `.ai/specs/` folder before touching a single line of code.

## Error Handling
- In Node: Use global error handling middleware or respond with correct HTTP status codes (400 for broken business rules, 401/403 for Auth, 404 Not Found, 500 server error).
- In Python: Raise FastAPI `HTTPException`.
- In React: Show visual feedback to the user using `react-hot-toast` or similar components to notify failures.

## Rules for Keeping the Harness (.ai/) Updated

The AI Development Harness is not static. It must be updated in case of:
- A new technology, framework, or pattern added to the stack.
- Modifications in service flows.
- Structural alterations (new files or folders).
- Any change that warrants explaining to future agents or developers *why* and *how* a part of the system works.
