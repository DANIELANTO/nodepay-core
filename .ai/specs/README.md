# Spec Driven Development: Specifications

This folder is used for the creation and management of Specifications (Specs) following the **Spec Driven Design / Spec Driven Development** approach.

## What is a Spec?
A Spec (Specification) is a document that describes in detail a new feature, an architectural change, a major refactor, or a critical bug fix, **before or during** its implementation. 
It serves as a contract between the requirements (business/user) and the technical implementation (LLM agent / human developer).

## When to Create a Spec?
Create a spec whenever you perform:
- A new significant feature or functionality.
- A major change in the existing business logic.
- A code refactor.
- An alteration of the database model or the architecture.

## How to Name a Spec?
Specs should follow a chronological and descriptive naming convention. Recommended format:

```txt
YYYY-MM-DD-feature-or-change-name.md
```

**Examples:**
- `2026-06-10-user-authentication.md`
- `2026-06-11-refactor-payment-service.md`
- `2026-06-12-add-dashboard-filters.md`

## How to Use a Spec to Implement Changes?
1. **Creation/Review:** An Agent or the User drafts the spec using the template defined in `spec-template.md`.
2. **Approval:** If there are ambiguous points, they are discussed. (The agent should mark them as "Pending confirmation" or ask the user).
3. **Implementation:** The developer or LLM agent writes the code strictly guided by what is described in the spec.
4. **Validation:** Acceptance Criteria are verified.
5. **Closure:** The Spec status is marked as `Implemented`.

## How to Update the Project Context Afterwards?
Once a Spec is implemented, the agent MUST evaluate whether the change impacts the overall understanding of the project.

If so, the following files should be updated as appropriate:
- `.ai/context/architecture-design.md` (if the architecture changed).
- `.ai/context/file-map.md` (if structural files were added/moved).
- `.ai/context/decisions.md` (if the spec introduced a permanent technical decision).
- `.ai/context/project-context.md` (if commands, environment variables, or base descriptions changed).

## Handling Bugs and Fixes

Not all bugs require a new spec.

### Update an existing spec when:

- The bug was introduced by that same spec.
- The bug is a direct consequence of a recent feature.
- The fix is part of the same functional goal.
- The change does not represent a new initiative.

### Create a new spec when:

- The bug is independent of current specs.
- The bug requires architectural changes.
- The bug affects multiple modules with no direct relation to the original spec.
- The fix requires its own technical strategy.
- The bug represents an independent work initiative.

### General Rule

If the fix answers the question:

"Is this still part of the same goal?"

Then update the existing spec.

If it answers:

"Does this deserve its own planning, analysis, and acceptance criteria?"

Then create a new spec.