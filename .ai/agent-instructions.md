# Instrucciones Permanentes para Agentes LLM

Eres un Asistente / Agente LLM trabajando en **NodePay**. Debes operar bajo las siguientes reglas y flujos de trabajo estrictamente.

## 1. Reglas de Lectura de Contexto (MANDATORIO)
Antes de modificar código en este proyecto, **DEBES LEER** estos archivos si están disponibles en tu contexto:
* `.ai/context/project-context.md`
* `.ai/context/architecture-design.md`
* `.ai/context/file-map.md`
* `.ai/context/development-guidelines.md`
* `.ai/context/decisions.md`

## 2. Flujo de Especificaciones (Spec Driven Design)
Antes de implementar una nueva feature, refactor, o cambio importante, debes revisar si existe una spec relacionada en la carpeta `.ai/specs/`.
* **Si no existe una spec:** Debes crear una nueva usando `.ai/specs/spec-template.md`
basándote en la solicitud del usuario, seguir los lineamientos de `.ai/specs/README.md`, y esperar validación si hay dudas.
* **Toda implementación:** DEBE seguir la spec correspondiente paso a paso.
* **Incompletitud:** Si durante la implementación descubres que la spec está incompleta (ej. falta un caso de borde), actualiza la spec antes de continuar escribiendo código.

## 3. Modificaciones Críticas
Si un cambio requiere alterar la arquitectura, estructura de carpetas, responsabilidades de módulos, dependencias o implica nuevas decisiones técnicas críticas, **DEBES ACTUALIZAR TAMBIÉN:**
* `.ai/context/architecture-design.md`
* `.ai/context/file-map.md`
* `.ai/context/decisions.md`
* `.ai/context/project-context.md`, si aplica.
* `.ai/context/development-guidelines.md`, si aplica.

## 4. Prompts Directos
Si un prompt directo del usuario solicita un cambio o explica un detalle que afecta el contexto general del proyecto, el agente debe **actualizar los archivos de contexto pertinentes** proactivamente, aunque no se esté elaborando una spec formal.

## 5. Transparencia de Cambios
Cada cambio importante debe dejar claro en el código, en la spec o en la respuesta:
* Qué se cambió.
* Por qué se cambió.
* Qué archivos fueron afectados.
* Qué impacto tiene en futuras modificaciones.

## 6. Asunciones y Dudas
**No asumas información crítica.** Si la intención de una arquitectura, un archivo o un requerimiento no está clara, no adivines ni inventes respuestas. Pregunta al usuario o marca la información en la documentación explícitamente como `Pendiente de confirmar`.

## 7. Actualización Automática del Contexto
El contexto de `.ai/context/` DEBE actualizarse proactivamente en los siguientes casos:
* Se agrega o se elimina una feature.
* Se cambia una dependencia clave en `package.json` o `requirements.txt`.
* Se cambia la arquitectura o el flujo de datos.
* Se altera la estructura de carpetas (mover componentes, crear nuevos módulos).
* Se renombra un módulo/archivo estructural importante.
* Se introducen nuevos patrones, estilos o convenciones de código.
* Se toma una decisión técnica relevante durante una conversación con el usuario.
* Una spec implementada modifica el comportamiento o reglas de negocio previamente documentadas en el sistema.
* Un prompt directo del usuario introduce información relevante (contexto de despliegue, infraestructura, lógica no escrita, etc.).

Tu tarea es ser el guardián de la memoria del proyecto (Harness) para que los futuros agentes que abran este repositorio tengan una visión correcta, actualizada y 100% alineada a la realidad del código.
