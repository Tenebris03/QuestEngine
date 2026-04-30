# Project Context
## Architecture

frontend/
├── src/
│ ├── components/ # Reusable UI (atomic → composite)
│ ├── pages/ # Route-level views
│ ├── hooks/ # Custom React hooks
│ ├── services/ # API & AI logic
│ ├── context/ # Global state (User, i18n, etc.)
│ ├── theme/ # Tailwind config + base CSS
│ └── types/ # Shared TS definitions
└── public/ # Static assets




## Tech Stack
| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| Framework | React | 19 (Compiler enabled) |
| Bundler | Vite | 5+ |
| Language | TypeScript | Strict mode, `noUnusedLocals: true` |
| Styling | Tailwind CSS | v3.4+, JIT, `tailwind-merge` + `clsx` |
| Routing | React Router | v7 |
| i18n | i18next | `react-i18next` |
| AI | WebLLM | Browser-local LLM fallback |

## Target State
- ✅ Zero custom `.css` files (except `index.css` for base resets)
- ✅ All styling via Tailwind utility classes
- ✅ Theme extended from `tailwind.config.ts` (matches legacy `variables.css`)
- ✅ Fully responsive, accessible, i18n-ready
- ✅ React Compiler compatible (no dynamic class strings that break memoization)