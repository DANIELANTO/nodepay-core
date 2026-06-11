# Spec: UI Visual Redesign — Hover Effects, Button Styles & Theme Overhaul

## Estado

**Activa** 🚧 (Reabierta y expandida el 2026-06-11)

---

## Contexto

El usuario ha identificado tres categorías de problemas visuales en el dashboard:

1. **Escala excesiva en hover:** El efecto `scale-[1.02]` está aplicado de forma global en `.glass-card:hover`, lo que genera una sensación de "rebote" incómodo en elementos que no deberían escalar: las tarjetas de usuario (mobile), la tabla de escritorio, la barra de paginación y el encabezado del panel (`Administration Panel` + botones de tema/logout).

2. **Botones con hover poco natural:** Los botones carecen de `cursor: pointer`, lo que hace que el cursor del mouse no cambie al pasar sobre ellos, rompiendo una convención básica de UX. Además, el botón de confirmación dentro de `ConfirmModal` (para enable/disable usuario) usa estilos de fondo oscuro semi-transparente (`bg-green-900/40`, `bg-red-900/40`) que lucen inconsistentes en modo claro y no comunican claramente la acción.

3. **Tema general desactualizado:** La paleta actual usa fondo oscuro (`#0A0A0F` dark, `#F8FAFC` light) con acento ámbar (`#F59E0B`). El usuario solicita migrar a un tema SaaS moderno minimalista con fondo gris claro `#F3F4F8`, acento azul-violeta `#4F46E5`, tipografía Inter/SF Pro, tabla limpia, y modales tipo drawer.

---

## Objetivo

1. Eliminar `scale` en hover de elementos contenedores (cards, tabla, paginación, header). Reservar `scale` solo para micro-interacciones de botones de acción puntual (ej: FAB de AI).
2. Añadir `cursor-pointer` a todos los botones y elementos interactivos.
3. Rediseñar el botón de confirmación del `ConfirmModal` con colores sólidos y semánticos que funcionen correctamente en modo claro y oscuro.
4. Migrar el sistema de tokens de color y tipografía al nuevo tema SaaS minimalista descrito por el usuario.
5. Asegurar que la tabla, el header y los modales adopten el nuevo lenguaje visual de forma coherente.
6. Aplicar el mismo lenguaje visual (colores, fondos, tipografía, bordes, modales) a la sección de chat "NodePay Copilot" y la sección de "Terms and Conditions".
7. Identificar y extraer estilos, componentes o tokens compartidos para evitar la duplicación de código visual entre distintas vistas.

---

## Alcance

- `frontend/src/index.css`: tokens de color, tipografía, utilidades `.glass-card`, `.btn-primary`, `.btn-secondary`, `.input-glass`.
- `frontend/src/layouts/DashboardLayout.tsx`: header, botones de tema y logout.
- `frontend/src/components/ui/ConfirmModal.tsx`: botón de confirmación (variantes danger/success/warning).
- `frontend/src/components/users/UsersDesktopTable.tsx`: tabla de escritorio (hover de filas).
- `frontend/src/components/users/UserCard.tsx`: tarjeta mobile (hover de card).
- `frontend/src/components/users/UsersTable.tsx`: paginación (hover de botones de página).
- `frontend/src/components/ai/AIAssistantPanel.tsx` (u otros componentes de la sección chat Copilot).
- `frontend/src/components/terms/TermsAndConditions.tsx` (u otros archivos de términos y condiciones).
- Creación de componentes UI compartidos (ej. un modal base, un panel base) si amerita.

---

## Fuera de alcance

- Lógica de negocio profunda, RTK Query, Zustand stores.
- Routing y navegación principales.
- Backend (Node.js, Python).
- Backend (Node.js, Python).
- Funcionalidad del toggle de tema (solo se actualiza su apariencia).
- Creación de un sidebar lateral (el layout actual de topbar se mantiene).

---

## Requisitos funcionales

- [ ] **RF-01:** Los elementos contenedores (`.glass-card` en header, tabla, paginación, cards mobile) **NO** deben aplicar `scale` en `:hover`. El efecto debe limitarse a cambio de borde, sombra o fondo.
- [ ] **RF-02:** Todos los `<button>` y `<a>` interactivos deben mostrar `cursor: pointer` al hacer hover.
- [ ] **RF-03:** El botón de confirmación en `ConfirmModal` para variante `success` debe usar un color azul-violeta sólido (`#4F46E5`) legible tanto en modo claro como oscuro.
- [ ] **RF-04:** El botón de confirmación para variante `danger` debe usar rojo sólido legible, no el fondo semi-transparente oscuro actual.
- [ ] **RF-05:** El fondo general de la aplicación debe cambiar a `#F3F4F8` (gris claro) en modo claro.
- [ ] **RF-06:** El acento principal debe cambiar de ámbar `#F59E0B` a azul-violeta `#4F46E5`.
- [ ] **RF-07:** La tipografía principal debe ser **Inter** (ya importada) con fallback `system-ui`. Se elimina `Space Grotesk` como fuente de headings.
- [ ] **RF-08:** Los headers de la tabla deben verse pequeños, en mayúsculas, con color gris secundario y sin líneas pesadas.
- [ ] **RF-09:** Las filas de la tabla deben tener una altura entre 48–56px con `hover` suave de fondo, sin escala.
- [ ] **RF-10:** Los modales deben usar overlay oscuro semitransparente con blur, y el panel de contenido con `border-radius: 14px` y sombra suave (no glassmorphism oscuro).
- [ ] **RF-11:** El panel de chat "NodePay Copilot" debe seguir la misma estética minimalista (fondo coherente, inputs limpios estilo `input-glass`, burbujas de chat con colores de la paleta principal/superficies).
- [ ] **RF-12:** La sección de "Terms and Conditions" debe lucir integrada y usar la tipografía `Inter`, aplicando los tokens de texto, fondos de contenedores y modales de la nueva UI.

---

## Requisitos técnicos

- [ ] **RT-01:** Los cambios de tokens deben realizarse en `@layer base` dentro de `index.css`, manteniendo la estructura `@theme` de Tailwind v4.
- [ ] **RT-02:** El nuevo acento `#4F46E5` debe generar sus variantes de `--accent-hover-color` (`#4338CA`), glow shadows y ring colors de forma consistente.
- [ ] **RT-03:** La clase `.glass-card` debe redefinirse SIN `backdrop-blur` pesado y SIN `scale` en hover. Nuevo estilo: fondo blanco sólido, borde `#E5E7EB`, radio `16px`, sombra `0 1px 4px rgba(0,0,0,0.06)`, hover con sombra levemente más pronunciada y borde `#D1D5DB`.
- [ ] **RT-04:** Las clases `.btn-primary` y `.btn-secondary` deben incluir `cursor-pointer` explícitamente.
- [ ] **RT-05:** `ConfirmModal` debe reemplazar `confirmBtnClasses` con colores semánticos sólidos compatibles con ambos temas.
- [ ] **RT-06:** Se debe mantener compatibilidad con el modo oscuro (`.dark`). Los tokens oscuros se actualizan en conjunto para reflejar el nuevo tema (superficie oscura más neutra, acento azul-violeta).

---

## Archivos o módulos afectados

```
frontend/src/index.css                              ← Tokens + utilidades globales
frontend/src/layouts/DashboardLayout.tsx            ← Header + botones de controles
frontend/src/components/ui/ConfirmModal.tsx         ← Botón de confirmación
frontend/src/components/users/UsersDesktopTable.tsx ← Hover de filas tabla
frontend/src/components/users/UserCard.tsx          ← Hover de card mobile
frontend/src/components/users/UsersTable.tsx        ← Hover de paginación
frontend/src/components/ai/*                        ← Componentes de Copilot
frontend/src/components/terms/*                     ← Componentes de Terms
```

---

## Diseño propuesto

### 1. Nuevos tokens de color (`:root` — modo claro)

```css
:root {
  color-scheme: light;
  --bg-color: #F3F4F8;               /* Fondo general gris muy claro */
  --surface-color: #FFFFFF;           /* Contenedor principal blanco */
  --surface-elevated-color: #F9FAFB; /* Superficies secundarias */
  --fg-color: #111827;               /* Texto principal */
  --muted-fg-color: #6B7280;         /* Texto secundario */
  --accent-color: #4F46E5;           /* Azul-violeta */
  --accent-hover-color: #4338CA;     /* Azul-violeta hover */
  --border-subtle-color: #E5E7EB;    /* Borde estándar */
  --border-hover-color: #D1D5DB;     /* Borde hover */
  --card-bg-color: #FFFFFF;          /* Card fondo sólido */
  --card-bg-hover-color: #F9FAFB;    /* Card hover fondo */
  --glow-sm-shadow: 0 0 12px rgba(79, 70, 229, 0.15);
  --glow-md-shadow: 0 0 28px rgba(79, 70, 229, 0.2);
  --glow-border-shadow: 0 0 0 1px rgba(79, 70, 229, 0.2), 0 0 12px rgba(79, 70, 229, 0.1);
}
```

### 2. Tokens oscuros (`.dark`)

```css
.dark {
  color-scheme: dark;
  --bg-color: #0F172A;               /* Slate 900 */
  --surface-color: #1E293B;          /* Slate 800 */
  --surface-elevated-color: #263348; /* Entre slate 800 y 700 */
  --fg-color: #F1F5F9;
  --muted-fg-color: #94A3B8;
  --accent-color: #6366F1;           /* Indigo 500 — más brillante en oscuro */
  --accent-hover-color: #4F46E5;
  --border-subtle-color: rgba(148, 163, 184, 0.15);
  --border-hover-color: rgba(148, 163, 184, 0.25);
  --card-bg-color: #1E293B;
  --card-bg-hover-color: #263348;
  --glow-sm-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
  --glow-md-shadow: 0 0 35px rgba(99, 102, 241, 0.25);
  --glow-border-shadow: 0 0 0 1px rgba(99, 102, 241, 0.3), 0 0 15px rgba(99, 102, 241, 0.15);
}
```

### 3. Tipografía (`@theme`)

```css
/* Usar Inter para display y body — eliminar Space Grotesk */
--font-display: "Inter", system-ui, sans-serif;
--font-body: "Inter", system-ui, sans-serif;
```

### 4. Clase `.glass-card` (sin `backdrop-blur`, sin `scale`)

```css
.glass-card {
  @apply bg-card-bg border border-border-subtle rounded-2xl transition-all duration-200;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.glass-card:hover {
  @apply border-border-hover bg-card-bg-hover;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  /* ❌ SIN scale */
}
```

### 5. Botones con `cursor-pointer`

```css
.btn-primary {
  @apply bg-accent text-white font-medium rounded-lg px-6 py-3
         transition-all duration-200 border-none outline-none cursor-pointer;
}

.btn-primary:hover {
  @apply bg-accent-hover shadow-glow-sm;
}

.btn-secondary {
  @apply bg-transparent text-foreground border border-border-hover
         rounded-lg px-6 py-3 transition-all duration-200 cursor-pointer;
}

.btn-secondary:hover {
  @apply bg-surface-elevated;
}
```

### 6. `ConfirmModal` — variantes de botón (colores sólidos)

```tsx
const confirmBtnClasses: Record<ConfirmVariant, string> = {
  danger:  'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 cursor-pointer',
  success: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 cursor-pointer',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-300 cursor-pointer',
};
```

> **Nota:** `success` usa `indigo-600` (acento azul-violeta) porque "habilitar" un usuario es una acción primaria afirmativa que debe verse como la acción principal del sistema.

### 7. Hover en filas de tabla (`UsersDesktopTable`)

```tsx
// Antes: hover:bg-white/5
// Después: hover:bg-surface-elevated
<tr key={user.id} className="group transition-colors hover:bg-surface-elevated">
```

### 8. Header del Dashboard — eliminar `hover:scale-105`

```tsx
// Quitar "transition-transform duration-300 hover:scale-105" del botón de tema
className="btn-secondary p-3 flex items-center justify-center rounded-lg"
```

### 9. `body` — sin radial gradient de ámbar

```css
body {
  @apply bg-background text-foreground font-body antialiased transition-colors duration-300;
  /* Fondo limpio — sin background-image */
}
```

### 10. Chat (NodePay Copilot) y Terms & Conditions
- **Chat:** Las burbujas de usuario pueden usar `bg-accent text-white`, mientras que las del asistente pueden usar `bg-surface-elevated text-foreground`. El área de input debe usar un estilo consistente (bordes `border-subtle`, fondo `bg-card-bg`).
- **Terms:** Si se despliegan en modal o página, deben usar `.glass-card` o un contenedor con `bg-card-bg`, tipografía legible y colores de texto `text-muted-fg` para párrafos y `text-foreground` para títulos.
- **Componentes Compartidos:** Se deben aprovechar las clases de utilidades `.glass-card`, `.btn-primary`, `.btn-secondary`, `.input-glass` para botones, inputs y contenedores. Si se detecta un patrón repetido (ej. Modal Container), considerar extraer un `<Modal>` genérico.

---

## Impacto en arquitectura

Cambio puramente visual. **No afecta** la arquitectura de datos, routing, stores, ni APIs.

Archivos de contexto a actualizar post-implementación:
- `.ai/context/development-guidelines.md` → agregar convención sobre uso de `scale` en hover.
- `.ai/context/decisions.md` → registrar migración de acento ámbar → azul-violeta.

---

## Plan de implementación

1. **`index.css`** — Actualizar tokens `:root` y `.dark`, `@theme`, `.glass-card`, `.btn-primary`, `.btn-secondary`, `.input-glass` y `body`.
2. **`ConfirmModal.tsx`** — Reemplazar `confirmBtnClasses` por colores sólidos.
3. **`DashboardLayout.tsx`** — Quitar `hover:scale-105` y `transition-transform duration-300` del botón de toggle de tema.
4. **`UsersDesktopTable.tsx`** — Cambiar hover de filas de `hover:bg-white/5` a `hover:bg-surface-elevated`.
5. **`UserCard.tsx`** — El hover se cubre por el cambio en `.glass-card`. Verificar no haya overrides manuales.
6. **`UsersTable.tsx`** — Añadir `cursor-pointer` a botones de paginación si no lo tienen ya.
7. **Componentes de Chat y Terms** — Identificar y actualizar `AIAssistantPanel` y cualquier modal o vista de Terms & Conditions para usar las clases y tokens recién definidos.
8. **Extracción de componentes** — Si aplica, extraer lógica visual repetida.
9. Actualizar `.ai/context/development-guidelines.md` y `.ai/context/decisions.md`.

---

## Criterios de aceptación

- [ ] **CA-01:** Al hacer hover sobre cards, tabla, paginación y header — ninguno escala visualmente.
- [ ] **CA-02:** El cursor cambia a `pointer` sobre cualquier `<button>` o enlace interactivo.
- [ ] **CA-03:** El botón "Enable" del modal se muestra en azul-violeta sólido (`indigo-600`), legible en ambos modos.
- [ ] **CA-04:** El botón "Disable" del modal se muestra en rojo sólido (`red-600`), legible en ambos modos.
- [ ] **CA-05:** El fondo en modo claro es gris `#F3F4F8`, no blanco puro.
- [ ] **CA-06:** El acento de la app (botones primarios, focus rings, spinner) es azul-violeta, no ámbar.
- [ ] **CA-07:** La tipografía de headings usa **Inter** (sin Space Grotesk).
- [ ] **CA-08:** El modo oscuro sigue funcionando con el nuevo sistema de colores.
- [ ] **CA-09:** Sin regresiones funcionales: búsqueda, paginación, toggle de usuario y logout operan correctamente.
- [ ] **CA-10:** El chat Copilot usa la paleta de colores y componentes compartidos correctos.
- [ ] **CA-11:** El componente de Terms & Conditions luce coherente y aplica los nuevos tokens.

---

## Pruebas sugeridas

1. Abrir la app en modo claro → fondo gris claro, acento azul-violeta, sin scale en hover.
2. Hover sobre: header, cards mobile, tabla desktop, paginación → ausencia de escala.
3. Clic en 3 puntos de usuario → "Disable/Enable" → modal con botón de color sólido correcto.
4. Activar modo oscuro → coherencia visual del nuevo tema.
5. Hover sobre `btn-primary` y `btn-secondary` → `cursor: pointer` visible.
6. Abrir "NodePay Copilot" y enviar un mensaje → verificar los estilos de burbujas, input y fondo.
7. Revisar la sección/modal de "Terms & Conditions" → comprobar tipografía, espaciado y legibilidad.

---

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Referencias hardcoded a `amber-500`/`amber-400` en componentes no cubiertos | Media | Grep global de `amber-` antes de finalizar y reemplazar por `indigo-`/`accent`. |
| `StatusBadge.tsx` puede usar clases Tailwind hardcoded incompatibles | Baja | Revisar el componente y actualizar si es necesario. |
| `btn-secondary:hover` puede verse igual al fondo en modo claro | Baja | Verificar contraste en navegador. Ajustar a `#EDEDF2` si hace falta. |

---

## Notas para futuros agentes

- **Convención `scale` en hover:** Está reservado **exclusivamente** para micro-interacciones de botones de acción puntual (FAB, submit). **Nunca** aplicar a contenedores, cards, tablas o barras de navegación.
- **Acento del sistema:** Migrado de ámbar (`#F59E0B`) a azul-violeta (`#4F46E5` / `indigo-600`). Usar siempre `bg-accent`, `text-accent`, o clases `indigo-*`.
- **Glassmorphism:** Reducido. `.glass-card` ya no usa `backdrop-blur-md`. Fondo sólido con sombra suave.
- **`ConfirmModal` `success`:** Intencionalmente usa azul-violeta (no verde) para consistencia semántica con el design system.
- **`App.css`:** Contiene estilos de scaffolding de Vite (`hero`, `counter`, etc.) que no se usan en producción. No tocar.
