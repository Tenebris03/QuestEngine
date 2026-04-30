# Project Context: QuestEngine

## Architecture
QuestEngine is a monorepo featuring a NestJS backend and a React 19 frontend. It prioritizes clean code, local scoping, and modern web standards.

- **backend/**: NestJS API.
- **frontend/**: React 19 application using Vite and CSS Modules.
- **agents/**: System instructions and AI workflows.

## Tech Stack
| Layer | Technology | Notes |
|-------|------------|-------|
| **Backend** | NestJS | TypeScript-first logic. |
| **Frontend** | React 19 | Vite, TypeScript (Strict), CSS Modules. |
| **I18n** | i18next | Co-located locale files per component. |
| **Styling** | CSS Modules | Local scoping via `*.module.css` files. |
| **AI** | Local / WebLLM | Integration for quest generation. |

## Development Guiding Principles
1. **Encapsulation**: Every component is a self-contained unit with its own logic, styles, and translations.
2. **Zero Runtime Styling**: Styles are processed at build time via CSS Modules to ensure maximum performance.
3. **Modern CSS**: Leverage native CSS features (nesting, variables, container queries) instead of utility frameworks.

