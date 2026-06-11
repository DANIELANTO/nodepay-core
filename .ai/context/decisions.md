# Registro de Decisiones Técnicas (Decisions Log)

Este archivo actúa como un registro de Decisiones Arquitectónicas y Técnicas (ADR simplificado) del proyecto.

> **REGLA DE ACTUALIZACIÓN:** Este archivo debe actualizarse cada vez que:
> - Se cambie la arquitectura.
> - Se agregue una dependencia importante.
> - Se cambie una convención principal.
> - Se tome una decisión crítica que otros agentes deban conocer.
> - Se modifique la forma en que se organizan archivos o módulos.
> - Se cambie el flujo principal de ejecución del sistema.

---

## DEC-0001: Arquitectura de Microservicios

**Fecha:** 2024-01-01 (Aproximada, inferida)  
**Estado:** Aceptada  
**Contexto:**  
Se necesitaba un sistema que combinara procesamiento transaccional rápido con herramientas avanzadas de Inteligencia Artificial, que poseen requisitos de entorno y lenguaje diferentes (Node vs Python).

**Decisión:**  
Separar el sistema en 3 componentes principales dockerizados: Frontend SPA, Backend Transaccional (Node), y AI Service (Python).

**Razón:**  
Permite utilizar las mejores herramientas de cada ecosistema (Express/Prisma para transacciones rápidas y tipadas; FastAPI/LangChain para procesamiento avanzado de LLMs).

**Impacto:**  
Facilita la escalabilidad y despliegue independiente. Requiere Docker Compose para desarrollo local y orquestación de red interna (CORS, URLs inter-servicios).

---

## DEC-0002: Patrón Repositorio en Backend Node.js

**Fecha:** 2024-01-01 (Aproximada, inferida)  
**Estado:** Aceptada  
**Contexto:**  
Acoplar directamente el ORM (Prisma) a la lógica de negocio dificulta realizar pruebas unitarias y cambiar de proveedor de base de datos en el futuro.

**Decisión:**  
Implementar el Repository Pattern creando interfaces estrictas (ej. `IUserRepository`) y clases concretas de implementación (`PrismaUserRepository`).

**Razón:**  
Aislar la lógica de dominio (Domain-Driven Design) de las preocupaciones de persistencia de datos.

**Impacto:**  
El desarrollo de nuevas entidades requiere crear más archivos (Interface, Implementación, Service, Controller). Aumenta la robustez y capacidad de mockear servicios en tests.

---

## DEC-0003: Autenticación Externa con Keycloak

**Fecha:** 2024-01-01 (Aproximada, inferida)  
**Estado:** Aceptada  
**Contexto:**  
Implementar un sistema de autenticación seguro, escalable, y con soporte para SSO requiere un gran esfuerzo de desarrollo y mantenimiento si se hace in-house.

**Decisión:**  
Delegar toda la autenticación y autorización a Keycloak, alojando su data en un esquema PostgreSQL (`auth`) aislado de la app (`public`).

**Razón:**  
Mayor seguridad, soporte para OIDC, manejo automático de refresh tokens y roles listos para usar.

**Impacto:**  
El frontend depende estrictamente de `keycloak-js`. El backend confía ciegamente en el JWT validado de Keycloak.

---

## DEC-0004: Inmutabilidad de Transacciones Financieras

**Fecha:** 2024-01-01 (Aproximada, inferida)  
**Estado:** Aceptada  
**Contexto:**  
Los historiales de pagos y billeteras deben ser trazables y auditables. Modificar transacciones abre puertas a inconsistencias.

**Decisión:**  
Las transacciones creadas en la base de datos son inmutables (COMPLETED o REJECTED). Nunca se actualizan o modifican.

**Razón:**  
Garantizar la integridad financiera del sistema y prever posibles conflictos de auditoría.

**Impacto:**  
Cualquier corrección financiera requerirá crear una nueva transacción de tipo opuesto, no modificar una existente.

---

## DEC-0005: AI Semantic Caching y Restricciones de Agente SQL

**Fecha:** 2024-01-01 (Aproximada, inferida)  
**Estado:** Aceptada  
**Contexto:**  
Llamar al LLM repetidas veces por la misma pregunta cuesta tokens y eleva latencia. El Agente SQL expone riesgos de manipulación de la DB de producción.

**Decisión:**  
1. Usar un Semantic Cache (FAISS) para preguntas de RAG que ya han sido resueltas.  
2. Limitar al SQL Agent a consultas exclusivas de `SELECT`, ocultando campos sensibles.

**Razón:**  
Ahorro de costos, rendimiento y prevención de incidentes de ciberseguridad o corrupción de base de datos.

**Impacto:**  
Obliga a mantener memoria en el servicio Python. El AI Service no puede efectuar cambios en el sistema, solo observar.

---

## DEC-0006: Rediseño Visual — Tema SaaS Azul-Violeta y Convención de Hover

**Fecha:** 2026-06-11  
**Estado:** Aceptada  
**Spec de referencia:** `.ai/specs/2026-06-11-ui-visual-redesign.md`  
**Contexto:**  
El dashboard usaba un tema ámbar (`#F59E0B`) con glassmorphism pesado (`backdrop-blur`) y `scale-[1.02]` en hover global. Esto generaba una sensación de rebote incómoda en contenedores y los botones carecían de `cursor: pointer`.

**Decisión:**  
1. **Acento del sistema:** Migrar de ámbar (`#F59E0B`) a azul-violeta (`#4F46E5` / `indigo-600`). En modo oscuro: `#6366F1` (indigo-500).  
2. **Fondo general:** `#F3F4F8` (modo claro) — gris muy claro tipo SaaS moderno.  
3. **Tipografía:** Solo **Inter** para headings y body (se elimina Space Grotesk).  
4. **`.glass-card`:** Rediseñada sin `backdrop-blur` y sin `scale` en hover. Usa fondo sólido blanco con sombra suave.  
5. **Convención `scale` en hover:** Reservado **exclusivamente** para micro-interacciones de botones de acción puntual (FAB, submit). **Nunca** aplicar a contenedores, cards, tablas ni barras de navegación.  
6. **Botones:** Deben incluir `cursor-pointer` explícitamente en sus clases utilitarias.  
7. **`ConfirmModal`:** Variante `success` usa indigo (no verde) para consistencia semántica. `danger` usa rojo sólido.

**Razón:**  
Experiencia de usuario más profesional y coherente con estándares de SaaS modernos. El `scale` en contenedores resulta distracting y poco natural en elementos que no son de acción puntual.

**Impacto:**  
- Todos los componentes y vistas deben usar tokens semánticos (`bg-accent`, `text-accent`, `bg-surface`, `border-subtle`, etc.).
- Se ha unificado el estilo visual eliminando colores hardcodeados (`amber-*`, `slate-*`) incluso de secciones como `TermsPage` y chat Copilot, para garantizar que respondan al tema global (claro/oscuro y acentos).
- Cualquier nuevo modal de confirmación debe seguir el patrón de colores sólidos de `ConfirmModal`.

