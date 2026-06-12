# Spec: UI Visual Redesign — Hover Effects, Button Styles & Theme Overhaul

## Status

**Completed** ✅ (Iterations closed on 2026-06-11)

---

## Context

The user identified three categories of visual issues on the dashboard:

1. **Excessive scale on hover:** The `scale-[1.02]` effect was applied globally to `.glass-card:hover`, creating an uncomfortable "bounce" effect on elements that should not scale: user cards (mobile), the desktop table, the pagination bar, and the panel header (`Administration Panel` + theme/logout buttons).

2. **Unnatural button hovers:** Buttons lacked `cursor: pointer`, preventing the mouse cursor from changing to a hand pointer when hovering over them, breaking a basic UX convention. Additionally, the confirmation button in `ConfirmModal` (for enabling/disabling users) used semi-transparent dark background styles (`bg-green-900/40`, `bg-red-900/40`) that looked inconsistent in light mode and failed to clearly communicate the action.

3. **Outdated general theme:** The previous palette used a dark background (`#0A0A0F` dark, `#F8FAFC` light) with an amber accent (`#F59E0B`). The user requested migrating to a modern minimalist SaaS theme with a light gray background `#F3F4F8`, a blue-violet accent `#4F46E5`, Inter/SF Pro typography, a clean table, and drawer-style modals.

---

## Goal

1. Remove `scale` on hover from container elements (cards, table, pagination, header). Reserve `scale` exclusively for micro-interactions on targeted action buttons (e.g., AI FAB).
2. Add `cursor-pointer` to all buttons and interactive elements.
3. Redesign the confirmation button in `ConfirmModal` with solid, semantic colors that work correctly in both light and dark modes.
4. Migrate the color token system and typography to the new minimalist SaaS theme described by the user.
5. Ensure the table, header, and modals adopt the new visual language consistently.
6. Apply the same visual language (colors, backgrounds, typography, borders, modals) to the "NodePay Copilot" chat panel and the "Terms and Conditions" section.
7. Identify and extract shared styles, components, or tokens to avoid duplicating visual code across different views.

---

## Scope

- `frontend/src/index.css`: color tokens, typography, utilities `.glass-card`, `.btn-primary`, `.btn-secondary`, `.input-glass`.
- `frontend/src/layouts/DashboardLayout.tsx`: header, theme and logout buttons.
- `frontend/src/components/ui/ConfirmModal.tsx`: confirmation button (danger/success/warning variants).
- `frontend/src/components/users/UsersDesktopTable.tsx`: desktop table (row hover).
- `frontend/src/components/users/UserCard.tsx`: mobile card hover.
- `frontend/src/components/users/UsersTable.tsx`: pagination hover.
- `frontend/src/components/ai/*` (or other components of the Copilot chat section).
- `frontend/src/components/terms/*` (or other terms and conditions files).
- Creation of shared UI components (e.g., a base modal, base panel) if warranted.

---

## Out of Scope

- Core business logic, RTK Query, Zustand stores.
- Main routing and navigation.
- Backend (Node.js, Python).
- Theme toggle functionality (only its appearance is updated).
- Creation of a sidebar (the current topbar layout remains).

---

## Functional Requirements

- [ ] **FR-01:** Container elements (`.glass-card` in header, table, pagination, mobile cards) **MUST NOT** apply `scale` on `:hover`. The effect should be limited to border, shadow, or background changes.
- [ ] **FR-02:** All interactive `<button>` and `<a>` elements must show `cursor: pointer` on hover.
- [ ] **FR-03:** The confirmation button in `ConfirmModal` for the `success` variant must use a solid blue-violet color (`#4F46E5`) legible in both light and dark modes.
- [ ] **FR-04:** The confirmation button for the `danger` variant must use solid red, rather than the current semi-transparent dark background.
- [ ] **FR-05:** The general background of the application must change to `#F3F4F8` (light gray) in light mode.
- [ ] **FR-06:** The primary accent must change from amber `#F59E0B` to blue-violet `#4F46E5`.
- [ ] **FR-07:** The primary typography must be **Inter** (already imported) with a `system-ui` fallback. `Space Grotesk` is removed as a heading font.
- [ ] **FR-08:** Table headers must look small, in uppercase, with a secondary gray color and no heavy borders.
- [ ] **FR-09:** Table rows must have a height between 48–56px with a smooth background `hover`, without scale.
- [ ] **FR-10:** Modals must use a semi-transparent dark overlay with blur, and the content panel must have `border-radius: 14px` and a soft shadow (no dark glassmorphism).
- [ ] **FR-11:** The "NodePay Copilot" chat panel must follow the same minimalist aesthetic (consistent background, clean `input-glass` style inputs, chat bubbles using colors from the main palette/surfaces).
- [ ] **FR-12:** The "Terms and Conditions" section must look integrated and use `Inter` typography, applying the text tokens, container backgrounds, and modals of the new UI.

---

## Technical Requirements

- [ ] **TR-01:** Token changes must be made in `@layer base` inside `index.css`, maintaining the `@theme` structure of Tailwind v4.
- [ ] **TR-02:** The new accent `#4F46E5` must consistently generate its `--accent-hover-color` (`#4338CA`) variants, glow shadows, and ring colors.
- [ ] **TR-03:** The `.glass-card` class must be redefined WITHOUT heavy `backdrop-blur` and WITHOUT `scale` on hover. New style: solid white background, `#E5E7EB` border, `16px` radius, `0 1px 4px rgba(0,0,0,0.06)` shadow, hover with slightly more pronounced shadow and `#D1D5DB` border.
- [ ] **TR-04:** The `.btn-primary` and `.btn-secondary` classes must explicitly include `cursor-pointer`.
- [ ] **TR-05:** `ConfirmModal` must replace `confirmBtnClasses` with solid semantic colors compatible with both themes.
- [ ] **TR-06:** Compatibility with dark mode (`.dark`) must be maintained. Dark tokens are updated collectively to reflect the new theme (more neutral dark surface, blue-violet accent).

---

## Affected Files or Modules

```
frontend/src/index.css                              ← Global tokens + utilities
frontend/src/layouts/DashboardLayout.tsx            ← Header + control buttons
frontend/src/components/ui/ConfirmModal.tsx         ← Confirmation button
frontend/src/components/users/UsersDesktopTable.tsx ← Table row hover
frontend/src/components/users/UserCard.tsx          ← Mobile card hover
frontend/src/components/users/UsersTable.tsx        ← Pagination hover
frontend/src/components/ai/*                        ← Copilot components
frontend/src/components/terms/*                     ← Terms components
```

---

## Proposed Design

### 1. New Color Tokens (`:root` — light mode)

```css
:root {
  color-scheme: light;
  --bg-color: #F3F4F8;               /* Very light gray general background */
  --surface-color: #FFFFFF;           /* Main white container */
  --surface-elevated-color: #F9FAFB; /* Secondary surfaces */
  --fg-color: #111827;               /* Primary text */
  --muted-fg-color: #6B7280;         /* Secondary text */
  --accent-color: #4F46E5;           /* Blue-violet */
  --accent-hover-color: #4338CA;     /* Blue-violet hover */
  --border-subtle-color: #E5E7EB;    /* Standard border */
  --border-hover-color: #D1D5DB;     /* Hover border */
  --card-bg-color: #FFFFFF;          /* Solid card background */
  --card-bg-hover-color: #F9FAFB;    /* Hover card background */
  --glow-sm-shadow: 0 0 12px rgba(79, 70, 229, 0.15);
  --glow-md-shadow: 0 0 28px rgba(79, 70, 229, 0.2);
  --glow-border-shadow: 0 0 0 1px rgba(79, 70, 229, 0.2), 0 0 12px rgba(79, 70, 229, 0.1);
}
```

### 2. Dark Tokens (`.dark`)

```css
.dark {
  color-scheme: dark;
  --bg-color: #0F172A;               /* Slate 900 */
  --surface-color: #1E293B;          /* Slate 800 */
  --surface-elevated-color: #263348; /* Between slate 800 and 700 */
  --fg-color: #F1F5F9;
  --muted-fg-color: #94A3B8;
  --accent-color: #6366F1;           /* Indigo 500 — brighter in dark */
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

### 3. Typography (`@theme`)

```css
/* Use Inter for display and body — remove Space Grotesk */
--font-display: "Inter", system-ui, sans-serif;
--font-body: "Inter", system-ui, sans-serif;
```

### 4. `.glass-card` Class (no `backdrop-blur`, no `scale`)

```css
.glass-card {
  @apply bg-card-bg border border-border-subtle rounded-2xl transition-all duration-200;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.glass-card:hover {
  @apply border-border-hover bg-card-bg-hover;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  /* ❌ NO scale */
}
```

### 5. Buttons with `cursor-pointer`

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

### 6. `ConfirmModal` — button variants (solid colors)

```tsx
const confirmBtnClasses: Record<ConfirmVariant, string> = {
  danger:  'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 cursor-pointer',
  success: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 cursor-pointer',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-300 cursor-pointer',
};
```

> **Note:** `success` uses `indigo-600` (blue-violet accent) because "enabling" a user is an affirmative primary action that should visually align as the main action of the system.

### 7. Hover on Table Rows (`UsersDesktopTable`)

```tsx
// Before: hover:bg-white/5
// After: hover:bg-surface-elevated
<tr key={user.id} className="group transition-colors hover:bg-surface-elevated">
```

### 8. Dashboard Header — remove `hover:scale-105`

```tsx
// Remove "transition-transform duration-300 hover:scale-105" from the theme button
className="btn-secondary p-3 flex items-center justify-center rounded-lg"
```

### 9. `body` — no amber radial gradient

```css
body {
  @apply bg-background text-foreground font-body antialiased transition-colors duration-300;
  /* Clean background — no background-image */
}
```

### 10. Chat (NodePay Copilot) and Terms & Conditions
- **Chat:** User bubbles can use `bg-accent text-white`, while assistant bubbles can use `bg-surface-elevated text-foreground`. The input area must use a consistent style (`border-subtle` borders, `bg-card-bg` background).
- **Terms:** If displayed in a modal or page, they must use `.glass-card` or a container with `bg-card-bg`, legible typography, and `text-muted-fg` for paragraphs and `text-foreground` for titles.
- **Shared Components:** Leverage utility classes `.glass-card`, `.btn-primary`, `.btn-secondary`, `.input-glass` for buttons, inputs, and containers. If a repeated pattern is detected (e.g., Modal Container), consider extracting a generic `<Modal>`.

---

## Impact on Architecture

Purely visual change. **Does not affect** data architecture, routing, stores, or APIs.

Context files to update post-implementation:
- `.ai/context/development-guidelines.md` → add convention on hover `scale` usage.
- `.ai/context/decisions.md` → record migration from amber to blue-violet accent.

---

## Implementation Plan

1. **`index.css`** — Update `:root` and `.dark` tokens, `@theme`, `.glass-card`, `.btn-primary`, `.btn-secondary`, `.input-glass`, and `body`.
2. **`ConfirmModal.tsx`** — Replace `confirmBtnClasses` with solid colors.
3. **`DashboardLayout.tsx`** — Remove `hover:scale-105` and `transition-transform duration-300` from the theme toggle button.
4. **`UsersDesktopTable.tsx`** — Change row hovers from `hover:bg-white/5` to `hover:bg-surface-elevated`.
5. **`UserCard.tsx`** — Hover is covered by the `.glass-card` change. Verify no manual overrides exist.
6. **`UsersTable.tsx`** — Add `cursor-pointer` to pagination buttons if not already present.
7. **Chat and Terms Components** — Identify and update `AIAssistantPanel` and any Terms & Conditions modal or view to use the newly defined classes and tokens.
8. **Component Extraction** — If applicable, extract repeated visual logic.
9. Update `.ai/context/development-guidelines.md` and `.ai/context/decisions.md`.

---

## Acceptance Criteria

- [ ] **AC-01:** When hovering over cards, tables, pagination, and header, none scale visually.
- [ ] **AC-02:** The cursor changes to `pointer` over any interactive `<button>` or link.
- [ ] **AC-03:** The "Enable" button of the modal is shown in solid blue-violet (`indigo-600`), legible in both modes.
- [ ] **AC-04:** The "Disable" button of the modal is shown in solid red (`red-600`), legible in both modes.
- [ ] **AC-05:** The background in light mode is gray `#F3F4F8`, not pure white.
- [ ] **AC-06:** The app accent (primary buttons, focus rings, spinner) is blue-violet, not amber.
- [ ] **AC-07:** Heading typography uses **Inter** (no Space Grotesk).
- [ ] **AC-08:** Dark mode continues to work with the new color system.
- [ ] **AC-09:** No functional regressions: search, pagination, user toggle, and logout operate correctly.
- [ ] **AC-10:** Copilot chat uses the correct color palette and shared components.
- [ ] **AC-11:** The Terms & Conditions component looks consistent and applies the new tokens.

---

## Suggested Testing

1. Open the app in light mode → light gray background, blue-violet accent, no scale on hover.
2. Hover over: header, mobile cards, desktop table, pagination → absence of scaling.
3. Click user actions menu (...) → "Disable/Enable" → modal with correct solid color button.
4. Activate dark mode → check visual coherence of the new theme.
5. Hover over `btn-primary` and `btn-secondary` → `cursor: pointer` visible.
6. Open "NodePay Copilot" and send a message → verify bubble styles, input, and background.
7. Review the "Terms & Conditions" section/modal → check typography, spacing, and readability.

---

## Risks

| Risk | Probability | Mitigation |
|--------|-------------|------------|
| Hardcoded references to `amber-500`/`amber-400` in uncovered components | Medium | Run a global grep for `amber-` before finalizing and replace with `indigo-`/`accent`. |
| `StatusBadge.tsx` may use incompatible hardcoded Tailwind classes | Low | Review the component and update if necessary. |
| `btn-secondary:hover` may look identical to the background in light mode | Low | Verify contrast in browser. Adjust to `#EDEDF2` if needed. |

---

## Notes for Future Agents

- **Hover `scale` convention:** Reserved **exclusively** for micro-interactions on targeted action buttons (FAB, submit). **Never** apply to containers, cards, tables, or navigation bars.
- **System Accent:** Migrated from amber (`#F59E0B`) to blue-violet (`#4F46E5` / `indigo-600`). Always use `bg-accent`, `text-accent`, or `indigo-*` classes.
- **Glassmorphism:** Reduced. `.glass-card` no longer uses `backdrop-blur-md`. Solid background with soft shadow.
- **`ConfirmModal` `success`:** Intencionalmente uses blue-violet (not green) for semantic consistency with the design system.
- **`App.css`:** Contains Vite scaffolding styles (`hero`, `counter`, etc.) that are not used in production. Do not touch.

---

## Subsequent Changes / Expansions

### Expansion: Bug Fixes in User Search Bar
- **Date:** 2026-06-11
- **Reason for Change:**
  - The search icon overlapped with the placeholder and text due to a lack of proper padding (`!pl-12` on the `input-glass` class).
  - The search bar disappeared entirely when there were no results, making it impossible to clear the search or return to the table.
- **New Scope:**
  - Adjusted search `input` styles to force `!pl-12`.
  - Restructured rendering in `UsersTable.tsx` to keep the Header and search bar visible even when `users.length === 0`.
- **Affected Files or Modules:**
  - `frontend/src/components/users/UsersTable.tsx`
- **New Acceptance Criteria:**
  - [ ] **AC-12:** Text in the search bar does not overlap with the magnifying glass icon.
  - [ ] **AC-13:** When performing a search that returns no results, the search bar remains visible and allows clearing the filter.
- **Impact on Context or Architecture:** None (UI/UX change at the component level).

### Expansion: UI Density and Viewport Optimization
- **Date:** 2026-06-11
- **Reason for Change:**
  - Lists and tables displayed very few records (~5), forcing unnecessary scrolling on common resolutions like 1920x1080 (viewport ~1432x793).
  - Excessive padding (`py-5`, `p-8`) and margins (`mb-10`, `mt-8`) in `DashboardLayout`, `UsersTable`, and `TermsPage` broke the visual density expected in a modern SaaS (e.g., Linear, GitHub).
- **New Scope:**
  - Reduce general padding in `DashboardLayout.tsx` (`p-8` -> `p-6`, `mb-10` -> `mb-6`).
  - Adjust table density in `UsersDesktopTable.tsx` (header `py-5` -> `py-3`, cells `py-4` -> `py-2.5` or `py-3`).
  - Adjust margins in `UsersTable.tsx` and compress search bar / pagination.
  - Reduce Header Banner height in `TermsPage.tsx` (`py-12` -> `py-8`, `space-y-8` -> `space-y-6`).
- **Affected Files:**
  - `frontend/src/layouts/DashboardLayout.tsx`
  - `frontend/src/components/users/UsersTable.tsx`
  - `frontend/src/components/users/UsersDesktopTable.tsx`
  - `frontend/src/pages/TermsPage.tsx`
- **Acceptance Criteria:**
  - [ ] **AC-14:** Desktop tables display more visible records without requiring scroll (more compact rows ~36-40px high).
  - [ ] **AC-15:** The overall layout feels more integrated, with consistent and reduced margins.
  - [ ] **AC-16:** The Terms & Conditions header consumes significantly less vertical space without losing legibility or hierarchy.

### Expansion: Ultra-Compact Density (Viewport Efficiency)
- **Date:** 2026-06-11
- **Reason for Change:**
  - The user requested a higher level of compactness focused on administration tools (SaaS) to avoid a landing page appearance, ensuring that 5 users, search, and pagination fit easily in 1432x793.
- **New Scope:**
  - Further reduce header in `DashboardLayout.tsx` (spacing and height).
  - In `UsersTable`, integrate pagination into the same `.glass-card` as the desktop table (merge containers).
  - In `UsersDesktopTable`, reduce Avatar size (`md` to `sm`) and lower row padding to `py-2` and header padding to `py-2.5`.
  - In `TermsPage`, further compact the Hero Banner, table of contents spacing, and introduction.
- **Impact on Context or Architecture:** None (continuation of visual optimization).

### Expansion: Layout Stability and Dynamic Height
- **Date:** 2026-06-11
- **Reason for Change:**
  - The user requested the main dashboard view to behave like a native desktop app, filling the available vertical space and using internal scroll on the table body rather than a global page scroll.
  - Additionally, buttons felt too large ("excessive visual weight") compared to the expected proportions of a dense admin interface.
- **New Scope:**
  - `DashboardLayout.tsx`: Implement `min-h-screen flex flex-col` and propagate height growth with `flex-1 min-h-0` to internal views.
  - `UsersTable.tsx` / `UsersDesktopTable.tsx`: Configure containers to occupy `flex-1 min-h-0`, enabling `overflow-auto` on the table and a sticky header (`sticky top-0`). The pagination footer is anchored at the bottom (`flex-shrink-0`).
  - `index.css`: Reduce base buttons `.btn-primary` and `.btn-secondary` (`px-6 py-3` → `px-4 py-2.5`, applying `text-sm`).
  - `CreateUser.tsx`: Remove full widths (`w-full`) on form buttons, shifting them to the right (`justify-end`) to reduce visual weight.
- **Acceptance Criteria:**
  - [x] **AC-17:** The user table fills the remaining viewport height, keeping pagination anchored at the bottom.
  - [x] **AC-18:** If users exceed the table space, scrolling occurs within the table body (`tbody`), not the entire page.
  - [x] **AC-19:** Global buttons have an average height of ~40-44px and forms look well-proportioned.
