# Tailwind CSS Protocol
## Installation & Config
1. `npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography`
2. `npx tailwindcss init -p`
3. `tailwind.config.ts` MUST extend, never override core theme.
4. Map legacy CSS variables → Tailwind config:
```ts
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#8b5cf6', hover: '#a78bfa', muted: '#5b21b6', soft: 'rgba(139,92,246,0.12)' },
      bg: { primary: '#0a0a0f', secondary: '#12121a', tertiary: '#1a1a25' },
      text: { primary: '#f3f4f6', secondary: '#a1a1aa', muted: '#71717a' },
      status: { success: '#10b981', warning: '#f59e0b', error: '#ef4444' }
    },
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px', '2xl': '64px' },
    borderRadius: { sm: '8px', md: '12px', lg: '16px', xl: '24px' },
    fontFamily: { heading: ['Inter', 'system-ui', 'sans-serif'], body: ['Inter', 'system-ui', 'sans-serif'] }
  }
}

Styling Rules
✅ MUST use utility classes exclusively.
✅ MUST use clsx + tailwind-merge for dynamic classes.
✅ NEVER use arbitrary values [width:350px] unless proven unavoidable.
✅ NEVER leave dead classes. Run tailwindcss -i ./src/index.css -o ./dist/output.css --purge to verify.
✅ ALWAYS extract repeated patterns into <Component /> or @apply (only if >3 usages).
✅ ALWAYS use semantic HTML + Tailwind (e.g., <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover">)
Migration Protocol
Install deps + configure Tailwind.
Replace @import './theme/variables.css' with Tailwind base styles in index.css.
For each .tsx file:
Open corresponding .css
Convert each rule → Tailwind utilities
Delete .css file
Run npm run lint + npm run build
STOP if any visual regression occurs. Fix before proceeding.

