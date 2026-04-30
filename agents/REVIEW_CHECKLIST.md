
---

## 📄 `REVIEW_CHECKLIST.md`
```markdown
# Pre-Merge Review Checklist
## Automated
- [ ] `npm run lint` passes (zero warnings)
- [ ] `npm run typecheck` passes (zero errors)
- [ ] `npm run build` succeeds
- [ ] Tailwind purge removes unused classes
- [ ] Bundle size ≤ previous baseline

## Manual
- [ ] Zero custom `.css` files remain (except `index.css`)
- [ ] Dynamic classes use `cn()` / `tailwind-merge`
- [ ] No arbitrary `[...]` values without justification
- [ ] All interactive elements have `:focus-visible` styles
- [ ] Responsive breakpoints tested (`sm`, `md`, `lg`)
- [ ] i18n keys cover all user-facing strings
- [ ] React Compiler compatible (no memoization-breaking patterns)
- [ ] Accessibility: contrast ≥ 4.5:1, semantic HTML, keyboard nav works

## Tailwind-Specific
- [ ] `@apply` used only for 3+ identical class combinations
- [ ] `group`/`peer` modifiers used correctly for hover/focus states
- [ ] Dark mode (if applicable) uses `dark:` prefix consistently

## Approval Rule
❌ Any unchecked item = BLOCKER. Do not merge until resolved.