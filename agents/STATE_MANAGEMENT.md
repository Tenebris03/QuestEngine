# State Management & Data Flow

## 1. React 19 Patterns
- **Actions**: Use the new React 19 `useActionState` and `useFormStatus` for form handling instead of manual loading states.
- **Data Fetching**: Prefer the `use` hook for resolving promises within components to simplify async logic.
- **Local State**: Use `useState` only for UI-specific toggles; keep business logic in custom hooks.

## 2. Global State
- **Context API**: Use React Context for global settings (Theme, Auth, Language).
- **Prop Drilling**: Maximum depth of 3 levels before implementing a Context provider.
- **Immutability**: Never mutate state directly; use functional updates `setState(prev => ...)` to ensure React 19 compiler compatibility[cite: 6].

## 3. Data Integrity
- **Validation**: All data entering the frontend must be validated against TypeScript interfaces[cite: 6].
- **Consistency**: Ensure the frontend state matches the NestJS backend DTOs (Data Transfer Objects)[cite: 6].