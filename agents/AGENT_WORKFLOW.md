
---

## 📄 `AGENT_WORKFLOW.md`
```markdown
# Agent Execution Workflow
## Phase 1: Analyze
1. Read target file + related imports/context
2. Identify CSS dependencies, state logic, i18n usage
3. Map migration steps (atomic, reversible)

## Phase 2: Plan
1. Output step-by-step tasks (max 5 steps)
2. Specify validation checkpoints per step
3. Request confirmation before code generation

## Phase 3: Implement
1. Generate diffs only
2. Preserve existing logic
3. Apply `TAILWIND_PROTOCOL.md` & `CODING_STANDARDS.md`
4. Add JSDoc for public APIs

## Phase 4: Validate
```bash
npm run lint
npm run typecheck  # tsc --noEmit
npm run build

✅ All pass → Mark complete
❌ Fail → Rollback, diagnose, retry

Phase 5: Document
Update TODO.md if applicable
Note Tailwind config changes if new theme values added
Output summary: [FILES] | [CHANGES] | [STATUS]