# Agent Execution Workflow

## Phase 1: Information Gathering
- **Context Retrieval**: Scan the codebase to identify all affected components, services, and data contracts.
- **Dependency Mapping**: List all internal and external dependencies that will be touched or added.
- **Constraint Audit**: Cross-reference the request against `CODE_QUALITY_LIMITS.md` and `PROJECT_CONTEXT.md`.

## Phase 2: Brainstorming & Architecture
- **Solution Design**: Evaluate at least two ways to implement the feature. Choose the one that maximizes modularity[cite: 6].
- **Logic Mapping**: Draft the data flow from the NestJS backend through to the React 19 UI[cite: 6].
- **Decomposition**: Plan how to break the task into atomic, testable units to stay under the 100-line file limit[cite: 6].

## Phase 3: Project Management
- **TODO Update**: Append the planned steps to the root `TODO.md` file[cite: 6].
- **Status Check**: Ensure the current task aligns with the overall project roadmap[cite: 6].

## Phase 4: Implementation (The Coding Cycle)
- **Atomic Commits**: Code the solution in small, logical steps (e.g., Backend -> Hooks -> UI -> Locales)[cite: 6].
- **Standard Adherence**: Apply CSS Modules for styling and ensure strict TypeScript typing[cite: 6].
- **I18n Integration**: Populate EN/DE translation files as the UI is built[cite: 6].

## Phase 5: Critical Review
- **Self-Correction**: Review the generated code against the "3-level nesting" and "20-line function" rules[cite: 6].
- **Verification**: Run `npm run typecheck` and verify i18n key parity[cite: 6].
- **Cleanup**: Remove any "scratchpad" code or temporary logs used during development[cite: 6].