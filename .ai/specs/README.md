# Spec Driven Development: Especificaciones

Esta carpeta se utiliza para la creación y gestión de Especificaciones (Specs) siguiendo el enfoque de **Spec Driven Design / Spec Driven Development**.

## ¿Qué es una Spec?
Una Spec (Especificación) es un documento que describe detalladamente una nueva funcionalidad, un cambio arquitectónico, un refactor importante o la corrección de un bug crítico, **antes o durante** su implementación. 
Sirve como contrato entre el requerimiento (negocio/usuario) y la implementación técnica (agente LLM / desarrollador humano).

## ¿Cuándo crear una Spec?
Cada vez que se vaya a realizar:
- Una nueva feature o funcionalidad significativa.
- Un cambio importante en la lógica de negocio existente.
- Un refactor de código.
- Una alteración del modelo de base de datos o de la arquitectura.

## ¿Cómo nombrar una Spec?
Las specs deben seguir un orden cronológico y descriptivo. Convención recomendada:

```txt
YYYY-MM-DD-feature-or-change-name.md
```

**Ejemplos:**
- `2026-06-10-user-authentication.md`
- `2026-06-11-refactor-payment-service.md`
- `2026-06-12-add-dashboard-filters.md`

## ¿Cómo usar una Spec para implementar cambios?
1. **Creación/Revisión:** Un Agente o el Usuario redacta la spec usando el formato definido en `spec-template.md`.
2. **Aprobación:** Si hay puntos ambiguos, se discuten. (El agente debe marcar como "Pendiente de confirmar" o preguntar al usuario).
3. **Implementación:** El desarrollador o agente LLM escribe el código estrictamente guiado por lo descrito en la spec.
4. **Validación:** Se comprueban los Criterios de Aceptación.
5. **Cierre:** Se marca el estado de la Spec como `Implementada`.

## ¿Cómo actualizar el contexto del proyecto después?
Una vez implementada una Spec, el agente DEBE evaluar si el cambio impacta el entendimiento global del proyecto.

En caso afirmativo, se deben actualizar los siguientes archivos según corresponda:
- `.ai/context/architecture-design.md` (si la arquitectura cambió).
- `.ai/context/file-map.md` (si se añadieron/movieron archivos estructurales).
- `.ai/context/decisions.md` (si la spec introdujo una decisión técnica permanente).
- `.ai/context/project-context.md` (si cambiaron comandos, variables de entorno, o descripciones base).

## Manejo de Bugs y Fixes

No todos los bugs requieren una nueva spec.

### Actualizar una spec existente cuando:

- El bug fue introducido por esa misma spec.
- El bug es consecuencia directa de una feature reciente.
- El fix forma parte del mismo objetivo funcional.
- El cambio no representa una nueva iniciativa.

### Crear una nueva spec cuando:

- El bug es independiente de las specs actuales.
- El bug requiere cambios arquitectónicos.
- El bug afecta múltiples módulos sin relación directa con la spec original.
- El fix requiere una estrategia técnica propia.
- El bug representa una iniciativa de trabajo independiente.

### Regla general

Si el fix responde a la pregunta:

"¿Esto sigue siendo parte del mismo objetivo?"

Entonces actualizar la spec existente.

Si responde a:

"¿Esto merece su propia planificación, análisis y criterios de aceptación?"

Entonces crear una nueva spec.