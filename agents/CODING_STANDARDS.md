# Coding Standards

## 1. Naming Conventions
- **Components**: `PascalCase.tsx`.
- **Styles**: `PascalCase.module.css` (must match the component name).
- **Class Names**: Use `camelCase` for classes within CSS modules (e.g., `.containerMain`).

## 2. CSS Modules Architecture
- **Local Scoping**: All styles must be locally scoped. Global styles are reserved for `index.css` (reset/base only).
- **Importing**: Use the `styles` object: `import styles from './MyComponent.module.css';`.
- **Composition**: Use the CSS `composes` keyword or CSS Variables for shared design tokens (colors, spacing).

## 3. TypeScript & React 19
- **Strict Props**: Use `interface` for all component props.
- **Cleanup**: Styles must be removed when a component is deleted; CSS Modules facilitate this by co-location.

## 4. Internationalization (i18n)
- All user-facing strings must use the `t()` function.
- Locales reside in a `locales/` folder adjacent to the component.