# Guías de Desarrollo (Development Guidelines)

## Convenciones de Código Detectadas

### Frontend (React/TypeScript)
- Uso estricto de componentes funcionales con Hooks.
- Estilos mediante **Tailwind CSS v4** (orientación a "Tech-Minimalist Design", Dark Mode, alto contraste, componentes tipo wireframe/glassmorphism).
- Estado global: **Zustand** para aspectos sincrónicos de UI y Auth; **Redux Toolkit Query (RTK)** para caching, fetching y mutaciones del servidor.
- TypeScript estricto. Interfaces/Types exportados preferiblemente.

### Backend (Node.js/TypeScript)
- Implementación de **Domain-Driven Design (DDD)** simplificado.
- Uso del **Repository Pattern**: nunca interactuar con Prisma directamente desde un Controller o Service de negocio general, siempre a través del contrato (`IUserRepository`, etc.).
- Modularidad con importaciones ESM (uso de extensiones o resolución correcta de módulos).
- Devolución coherente de respuestas API (probablemente formato JSON estandarizado).

### AI Service (Python/FastAPI)
- Uso de anotaciones de tipos nativas de Python (`typing`).
- Código asíncrono (`async def`) para endpoints de FastAPI.
- Manejo cuidadoso de las sesiones de base de datos y memoria de FAISS.

## Cómo Agregar Nuevas Features

1. **Requisito Obligatorio:** Antes de implementar una feature o cambio importante, primero debe existir una spec en `.ai/specs/`. Si la spec no existe, el agente o desarrollador debe crearla o solicitar la información necesaria para completarla.
2. Identificar qué microservicio abarca la nueva feature.
3. Si impacta BD, actualizar `schema.prisma`, crear migración e implementar la interfaz en la capa de Repository.
4. Crear la lógica de negocio en la capa de `services/`.
5. Exponer a través de `controllers/` y `routes/`.
6. En Frontend, definir el endpoint en RTK Query API slice, o crear un custom hook. Integrar visualmente respetando los lineamientos "Tech-Minimalist".

## Cómo Modificar Código Existente

- **Respeta la inmutabilidad de transacciones:** Nunca agregues lógica para hacer `UPDATE` a una transacción financiera. Las transacciones deben crearse y quedar estáticas.
- **Evita romper la arquitectura:** No llames directamente a BD en los controladores. No mezcles lógica de UI con lógica de negocio.
- **Mantener el tipado:** Asegúrate de que las interfaces TypeScript / Tipos de Python coincidan.

## Flujo de Trabajo y Automatización

> **REGLA ESTRICTA DE ESPECIFICACIONES:**
> Toda modificación, refactor, o feature debe seguir el **Spec Driven Design / Spec Driven Development**. Revisa la carpeta `.ai/specs/` antes de tocar una línea de código.

## Manejo de Errores
- En Node: Usar middlewares de manejo de errores globales o responder con códigos de estado HTTP correctos (400 para reglas de negocio rotas, 401/403 para Auth, 404 No encontrado, 500 error del servidor).
- En Python: Elevar `HTTPException` de FastAPI.
- En React: Mostrar feedback visual al usuario a través de `react-hot-toast` o componentes similares para notificar fallos.

## Reglas para Mantener Actualizado el Harness (.ai/)

El AI Development Harness no es estático. Debe actualizarse en caso de:
- Nueva tecnología, framework o patrón añadido al stack.
- Modificaciones en el flujo de los servicios.
- Alteraciones estructurales (archivos o carpetas nuevas).
- Cualquier cambio que amerite explicar a futuros agentes o desarrolladores *por qué* y *cómo* funciona una pieza del sistema.
