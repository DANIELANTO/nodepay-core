# Permanent Instructions for LLM Agents

You are an LLM Assistant / Agent working on **NodePay**. You must strictly operate under the following rules and workflows.

## 1. Context Reading Rules (MANDATORY)
Before modifying any code in this project, **YOU MUST READ** these files if they are available in your context:
* `.ai/context/project-context.md`
* `.ai/context/architecture-design.md`
* `.ai/context/file-map.md`
* `.ai/context/development-guidelines.md`
* `.ai/context/decisions.md`

## 2. Specification Workflow (Spec Driven Design)
Before implementing a new feature, refactor, or major change, you must check if a related spec exists in the `.ai/specs/` folder.
* **If a spec does not exist:** You must create a new one using `.ai/specs/spec-template.md` based on the user's request, follow the guidelines in `.ai/specs/README.md`, and wait for validation if there are any doubts.
* **All implementations:** MUST follow the corresponding spec step-by-step and validate guidelines with `.ai/specs/README.md`.
* **Incompleteness:** If during implementation you discover that the spec is incomplete (e.g., a missing edge case), update the spec before continuing to write code and validate guidelines with `.ai/specs/README.md`.

## 3. Critical Modifications
If a change requires altering the architecture, folder structure, module responsibilities, dependencies, or implies new critical technical decisions, **YOU MUST ALSO UPDATE:**
* `.ai/context/architecture-design.md`
* `.ai/context/file-map.md`
* `.ai/context/decisions.md`
* `.ai/context/project-context.md`, if applicable.
* `.ai/context/development-guidelines.md`, if applicable.

## 4. Direct Prompts
If a direct user prompt requests a change or explains a detail that affects the overall context of the project, the agent must proactively **update the relevant context files**, even if a formal spec is not being created.

## 5. Transparency of Changes
Each major change must make clear in the code, spec, or response:
* What was changed.
* Why it was changed.
* Which files were affected.
* What impact it has on future modifications.

## 6. Assumptions and Doubts
**Do not assume critical information.** If the intention of an architecture, a file, or a requirement is not clear, do not guess or invent answers. Ask the user or explicitly mark the information in the documentation as `Pending confirmation`.

## 7. Automatic Context Update
The context in `.ai/context/` MUST be proactively updated in the following cases:
* A feature is added or removed.
* A key dependency changes in `package.json` or `requirements.txt`.
* The architecture or data flow changes.
* The folder structure is altered (moving components, creating new modules).
* An important structural module/file is renamed.
* New code patterns, styles, or conventions are introduced.
* A relevant technical decision is made during a conversation with the user.
* An implemented spec modifies behavior or business rules previously documented in the system.
* A direct user prompt introduces relevant information (deployment context, infrastructure, unwritten logic, etc.).

Your task is to be the guardian of the project's memory (Harness) so that future agents opening this repository have a correct, updated view that is 100% aligned with the reality of the code.

## Handling Additional Changes to an Existing Spec

If additional changes appear after implementing or starting a spec, the agent must decide if the change is an extension of the original goal or represents a new goal.

### Update the existing spec when:

- The change maintains the same primary goal.
- It only expands the scope.
- It affects screens or components related to the same feature.
- It seeks visual, functional, or technical consistency with what has already been implemented.
- It corrects an omission in the original spec.
- It adjusts acceptance criteria without changing the main intent.

### Create a new spec when:

- The change introduces a different feature.
- The change requires a new architecture.
- The change has independent acceptance criteria.
- The change affects another area of the system with no direct relation.
- The change introduces a separate major technical decision.
- The change is large enough to be implemented, tested, and reviewed independently.

### General Rule

Do not create new specs unnecessarily. If the change is part of the same product or design intent, update the existing spec and record the scope expansion.

When a spec has already been implemented but needs to be expanded, change its status to:

`Implemented - requires expansion`

or create a section called:

`## Subsequent Changes / Expansions`

Each expansion must document:

- Date.
- Reason for the change.
- New scope.
- Additional affected files or modules.
- New acceptance criteria.
- Impact on context or architecture.