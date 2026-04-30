
---

## 📄 `CODING_STANDARDS.md`
```markdown
# Coding Standards
## File & Naming
- Components: `PascalCase.tsx`
- Hooks/Utils: `camelCase.ts`
- Types/Interfaces: `PascalCase.ts`
- CSS/Styles: DELETED (replaced by Tailwind)

## TypeScript
- ✅ Interfaces for props: `interface ComponentProps { ... }`
- ✅ Explicit return types for public functions
- ✅ `readonly` for immutable data
- ❌ No `any`, no implicit `any`, no `as` casting without comment
- ✅ `strictNullChecks: true` enforced

## React 19 + Compiler
- ✅ Functional components only
- ✅ Hooks at top-level only
- ✅ `useMemo`/`useCallback` only for expensive operations or stable refs
- ✅ **NEVER** mutate state directly
- ✅ **NEVER** use inline functions in JSX if avoidable (Compiler handles most, but keep clean)

## i18n
- ✅ All user-facing text wrapped in `t('key')`
- ✅ Translation keys: `page.section.element.state` (e.g., `dashboard.stats.xp`)
- ✅ Fallback language: `en`

## Imports Order
```ts
import React from 'react';
// Third-party
import { useTranslation } from 'react-i18next';
// Internal
import { useUser } from '@/context/UserContext';
// Styles (if base CSS needed)
import '@/index.css';