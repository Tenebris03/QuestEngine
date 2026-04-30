# I18N Protocol (Co-Located Locales)
> **Scope:** `frontend/src/` only. Translation files MUST live next to the component that consumes them.
> **Goal:** 1:1 lifecycle mapping. Delete a component → translations vanish automatically. Zero dead keys.

## 1. Architecture & Directory Structure
Every UI component/page MUST own a `locales/` directory containing language-specific JSON files.


frontend/src/
├── components/
│ └── Header/
│ ├── Header.tsx
│ ├── Header.css
│ └── locales/
│ ├── en.json # English fallback
│ └── de.json # German translation
├── pages/
│ └── Dashboard/
│ ├── Dashboard.tsx
│ └── locales/
│ ├── en.json
│ └── de.json
└── lib/
└── i18nLoader.ts # Auto-registers namespaces via Vite glob


## 2. Auto-Discovery Configuration
i18next does NOT natively scan folders. You MUST configure Vite to auto-register namespaces at startup.

### `src/lib/i18nLoader.ts`
```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Vite auto-imports all locale files
const locales = import.meta.glob(['../**/locales/*.json'], { eager: true, import: 'default' });

const resources: Record<string, Record<string, Record<string, string>>> = {};

Object.entries(locales).forEach(([path, translation]) => {
  const match = path.match(/\/(?<ns>[A-Za-z0-9-]+)\/locales\/(?<lang>[a-z]{2})\.json$/);
  if (match?.groups) {
    const { ns, lang } = match.groups;
    if (!resources[lang]) resources[lang] = {};
    resources[lang][ns] = translation as Record<string, string>;
  }
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  });

export default i18n;

3. JSON Conventions
✅ Namespace = Folder Name (case-sensitive, matches component name)
✅ Keys: Flat or dot-notation. No deep nesting.
✅ Always provide identical keys in en.json and de.json
❌ NEVER leave unused keys
❌ NEVER hardcode user-facing text in JSX

Example: components/Header/locales/en.json

{
  "logoAlt": "QuestEngine Logo",
  "nav": {
    "home": "Home",
    "dashboard": "Dashboard"
  },
  "user": {
    "logout": "Logout",
    "login": "Login"
  }
}

4. Component Usage Rules

// ✅ CORRECT
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('Header'); // Namespace matches folder

// ✅ Dynamic key
<span>{t(`nav.${activeTab}`)}</span>

// ❌ WRONG
<span>{isGerman ? 'Startseite' : 'Home'}</span>
<span>{t('header.nav.home')}</span> // Global namespace deprecated

Mandatory Checklist Per Component
locales/en.json & locales/de.json exist
useTranslation('ComponentName') used
Zero hardcoded strings in JSX
Keys are identical across en/de
aria-label/alt text wrapped in t()

5. Migration Protocol
Create locales/ folder next to target component.
Extract existing hardcoded strings → en.json & de.json.
Replace hardcoded strings with t('key').
Import useTranslation with correct namespace.
Run npm run build → verify no missing key warnings.
Delete old src/locales/ references once fully migrated.