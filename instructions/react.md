React Development
General Instructions
Make only high‑confidence suggestions when reviewing code changes.

Write code with strong maintainability practices, including comments explaining why certain design decisions were made.

Handle edge cases explicitly and implement clear error handling.

When using external libraries, include comments describing their purpose and why they were chosen.

Produce idiomatic, modern React code that follows established best practices.

React Instructions
Dependency Management
Use ES Modules (import … from …).

Import only what is required.

Organize imports in the following order:

React and framework imports

Third‑party libraries

Internal modules

Stylesheets

Component Structure & Conventions
Component Basics
Use functional components exclusively.

Component names must follow PascalCase.

Props, variables, and functions must use camelCase.

Place each component in its own file.

Component Layout (Required)
Each component must follow this structure:

Imports

Prop types or TypeScript interfaces

Constants and helper functions

Component definition

Exports

Hooks
General Rules
Hooks must be called only at the top level.

Hooks must never be called inside loops, conditions, or nested functions.

Custom hooks must always start with the prefix use.

useState
Use functional updates when the new value depends on the previous value.

Keep state minimal, flat, and focused.

useEffect
Use useEffect only for real side effects.

Do not place pure computations inside useEffect.

Always provide a complete dependency array.

Use cleanup functions when necessary.

Custom Hooks
Store custom hooks in src/hooks/.

Custom hooks must be stateless except for React state.

Custom hooks must not contain UI logic.

Configuration & Environment
Environment Profiles
Use separate environment files for different environments:

.env.development

.env.test

.env.production

Secrets Management
Do not store secrets in code.

Secrets must be provided through:

Environment variables

Secret management systems

CI/CD pipelines

Configuration Access
Use import.meta.env (Vite) or process.env (CRA/Node) for environment variables.

Code Organization
Separation of Concerns
Components: UI and rendering logic

Hooks: state management and data fetching

Services: business logic and API access

Utils: pure functions without side effects

Utility Modules
Utility modules must:

Be final (no classes, only functions)

Prevent instantiation or empty exports

Data Fetching & API Layer
Rules
Use fetch, Axios, or another library — include comments explaining why the library is used.

API access must be placed in:

Custom hooks (e.g., useUser)

Service modules (e.g., api/userService.js)

Error Handling
Errors must be caught, logged, and surfaced clearly to the UI.

Do not swallow errors silently.

Logging
Do not use console.log() in production code.

Use:

console.error() for errors

console.warn() for warnings

Logging must be minimal, contextual, and purposeful.

Security & Input Handling
Input Validation
Validate inputs on the client when appropriate.

Always validate inputs again on the backend.

Preventing Injection
Avoid dangerouslySetInnerHTML.

If its use is unavoidable:

Sanitize all content

Add comments explaining why it is necessary

API Security
Never store tokens in source code.

LocalStorage is acceptable only when the security risk is understood.

Prefer HttpOnly cookies for authentication.

Build & Verification
Build Commands
Task	NPM/Yarn Command	Description
Run App	npm run dev / yarn dev	Start the development server
Build	npm run build / yarn build	Build the production bundle
Test	npm test / yarn test	Run tests
Lint	npm run lint / yarn lint	Run linting


Requirements
After modifying or adding code:

The project must build successfully.

The linter must report no errors.

All tests must pass.

Testing
Rules
Use React Testing Library.

Write tests for:

Rendering

User interactions

Critical logic

Avoid snapshot tests for large components.

Performance
Guidelines
Use useMemo and useCallback only when necessary.

Use React.memo for pure presentational components.

Prevent unnecessary re-renders by:

Maintaining stable references

Optimizing props

Using correct keys in lists