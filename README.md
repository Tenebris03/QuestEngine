# QuestEngine

> **Level Up Your Life.** A gamified fitness quest platform that turns your workout routine into an RPG adventure.

QuestEngine combines the motivational power of gamification with AI-driven fitness planning. Users generate personalized weekly training quests based on their goals, experience level, and available equipment — all powered by a local LLM running directly in the browser via WebGPU.

---

## Features

- **AI-Powered Quest Generation** — Generate personalized weekly fitness plans using a local Llama-3.2-1B model via [WebLLM](https://webllm.mlc.ai/). No data leaves your device.
- **Algorithmic Fallback** — If WebGPU is unavailable or the AI model fails, a sophisticated algorithmic generator creates balanced training splits based on fitness goals.
- **Gamified Experience** — RPG-themed UI with stats (STR, AGI, INT, VIT), levels, XP, and daily quests to keep users motivated.
- **Bilingual Support** — Full internationalization with English and German translations via `i18next`.
- **Accessibility First** — Built following WCAG 2.1 guidelines with semantic HTML, ARIA attributes, keyboard navigation, and screen reader support.
- **Responsive Design** — Modern, responsive UI with custom CSS theming and Inter variable font.
- **User Authentication** — Login/Register flow with protected dashboard and settings pages.
- **Local Persistence** — User preferences and generated plans are stored in `localStorage` for offline access.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI framework with React Compiler enabled |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) | Internationalization |
| [@mlc-ai/web-llm](https://www.npmjs.com/package/@mlc-ai/web-llm) | Local LLM inference in the browser |
| [Babel React Compiler](https://react.dev/learn/react-compiler) | Automatic memoization |

### Backend
| Technology | Purpose |
|------------|---------|
| [NestJS](https://nestjs.com/) | Progressive Node.js framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Jest](https://jestjs.io/) | Unit and E2E testing |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | Code quality and formatting |

---

## Architecture

QuestEngine follows a **monorepo structure** with clear separation between frontend and backend:

```
QuestEngine/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/     # Reusable UI components (Header, Footer, Card)
│   │   ├── pages/          # Route-level pages (Home, Dashboard, QuestGenerator, Auth, Settings)
│   │   ├── services/       # Business logic (LocalAIService, QuestGeneratorService)
│   │   ├── context/        # React context (UserContext)
│   │   ├── hooks/          # Custom React hooks (useQuestGenerator)
│   │   ├── locales/        # i18n translation files (en, de)
│   │   ├── theme/          # CSS variables and typography
│   │   └── types/          # Shared TypeScript definitions
│   └── public/             # Static assets
├── backend/           # NestJS API
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   └── test/               # E2E tests
├── agents/            # AI agent instructions (coding standards, planner, implementer, reviewer)
└── instructions/      # Development guidelines (a11y, React best practices)
```

### AI Quest Generation Flow

1. **User sets preferences** — Fitness goal, available time, experience level, intensity, equipment, weekend inclusion.
2. **WebLLM initialization** — The app attempts to load `Llama-3.2-1B-Instruct-q4f16_1-MLC` via WebGPU.
3. **Prompt engineering** — A structured prompt is sent to the local LLM requesting a JSON-formatted weekly training plan.
4. **Parsing & validation** — The AI output is parsed, validated, and mapped to the `WeeklyPlan` type.
5. **Algorithmic fallback** — If WebGPU is unavailable or the AI fails, a rule-based generator creates balanced push/pull/legs/cardio splits.
6. **Storage** — The plan is saved to `localStorage` and displayed in the weekly overview.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- npm or yarn
- A modern browser with **WebGPU support** (Chrome/Edge 113+) for AI generation

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend API will be available at `http://localhost:3000`.

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm run start:prod
```

---

## Development

### Code Quality

Both frontend and backend enforce strict code quality standards:

```bash
# Frontend linting
cd frontend
npm run lint

# Backend linting & formatting
cd backend
npm run lint
npm run format
```

### Testing

```bash
# Backend unit tests
cd backend
npm run test

# Backend E2E tests
cd backend
npm run test:e2e

# Backend test coverage
cd backend
npm run test:cov
```

### Project Guidelines

- **React**: See [`instructions/react.md`](instructions/react.md) for component conventions, hooks rules, and performance guidelines.
- **Accessibility**: See [`instructions/a11y.md`](instructions/a11y.md) for WCAG compliance, semantic HTML, and ARIA best practices.
- **Agent Instructions**: See [`agents/`](agents/) for AI coding standards, planning, implementation, and review workflows.

---

## Accessibility (a11y)

QuestEngine is built with accessibility as a core requirement:

- **Semantic HTML** — Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, and `<a>` elements.
- **ARIA Attributes** — `aria-label`, `aria-describedby`, `aria-hidden`, and `role` used where native semantics are insufficient.
- **Keyboard Navigation** — All interactive elements are reachable and operable via keyboard.
- **Focus Management** — Visible focus indicators (`:focus-visible`) and logical tab order.
- **Form Accessibility** — Every input has an associated `<label>`, error messages use `aria-describedby`, and invalid states set `aria-invalid="true"`.
- **Alt Text** — All meaningful images have descriptive `alt` attributes; decorative images use `alt=""`.
- **Color Contrast** — UI elements meet WCAG contrast ratios (4.5:1 for text, 3:1 for UI components).
- **Screen Reader Support** — Dynamic content updates use `aria-live` regions; loading states announce progress.

---

## Browser Support

| Feature | Chrome/Edge | Firefox | Safari |
|---------|-------------|---------|--------|
| Basic App | ✅ 90+ | ✅ 90+ | ✅ 15+ |
| AI Generation (WebGPU) | ✅ 113+ | ⚠️ Nightly | ❌ Not yet |

If WebGPU is unavailable, the app gracefully falls back to the algorithmic quest generator.

---

## License

UNLICENSED — This is a private project.

---

<p align="center">
  Built with React, Vite, NestJS & WebLLM
</p>

