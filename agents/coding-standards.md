# QuestEngine Coding Standards

> **Diese Datei gilt für ALLE Agenten (Planner, Implementer, Reviewer).**
> Jeder generierte Code MUSS diesen Standards folgen. Bei Verstößen wird der Code im Review abgelehnt.

---

## 1. Allgemeine Regeln (Backend & Frontend)

### 1.1 Sprache & Kommunikation
- **Kommentare und Dokumentation** werden auf **Deutsch** verfasst.
- **Code** (Variablen, Funktionen, Klassen) verwendet **Englisch**.
- JSDoc-Kommentare sind für öffentliche APIs, Komponenten und komplexe Funktionen **verpflichtend**.

### 1.2 Code-Formatierung
- **Single Quotes** (`'`) für Strings.
- **Trailing Commas** in Objekten, Arrays und Funktionsparametern.
- **Semikolons** am Ende von Statements.
- **2 Leerzeichen** Einrückung.
- Maximale Zeilenlänge: **100 Zeichen** (Prettier-Standard).

### 1.3 Namenskonventionen
| Element | Konvention | Beispiel |
|---------|-----------|----------|
| Klassen / Komponenten | `PascalCase` | `UserService`, `Card` |
| Interfaces / Types | `PascalCase` | `UserProps`, `ApiResponse` |
| Funktionen / Variablen | `camelCase` | `fetchData`, `isLoading` |
| Konstanten (top-level) | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Dateien (Komponenten) | `PascalCase.tsx` | `Card.tsx` |
| Dateien (Utils/Hooks) | `camelCase.ts` | `useAuth.ts` |
| Private Member | `_prefix` | `_internalCache` |
| CSS-Klassen | `kebab-case` | `card-container` |

### 1.4 Import-Ordnung
Importe MÜSSEN in dieser Reihenfolge gruppiert werden:
1. Framework-Imports (React, NestJS)
2. Third-Party Libraries
3. Interne Module (absolute Pfade)
4. Relative Imports (`./`, `../`)
5. Stylesheets (`.css`)

Jede Gruppe durch eine Leerzeile getrennt.

### 1.5 Fehlerbehandlung
- Niemals Errors "swallowen" (leerer catch-Block).
- Im Backend: Exceptions werfen oder `try/catch` mit Logging.
- Im Frontend: Fehler an die UI durchreichen, nicht nur `console.log`.
- `console.log` ist im Produktivcode **verboten**. Verwende `console.error()` oder `console.warn()`.

### 1.6 Sicherheit
- Keine Secrets im Code hinterlegen.
- Keine Tokens in LocalStorage (außer ausdrücklich dokumentiert).
- `dangerouslySetInnerHTML` vermeiden; wenn unvermeidbar, Inhalt sanitizen.
- Immer Input-Validierung auf Backend-Seite durchführen.

---

## 2. Backend (NestJS)

### 2.1 Architektur
- **Modul-basiert**: Jede Domain hat ein eigenes Module, Controller, Service, DTO.
- **Dependency Injection** verwenden – nie manuell Services instanziieren.
- **Separation of Concerns**:
  - `Controller`: HTTP-Handling, Routing, Response-Formatierung
  - `Service`: Business-Logik, Datenverarbeitung
  - `Repository` / `Entity`: Datenbankzugriff (wenn ORM hinzugefügt wird)
  - `DTO` / `Pipe`: Validierung und Transformation

### 2.2 TypeScript-Konfiguration
```json
{
  "module": "nodenext",
  "moduleResolution": "nodenext",
  "target": "ES2023",
  "strictNullChecks": true,
  "forceConsistentCasingInFileNames": true,
  "noImplicitAny": false,
  "strictBindCallApply": false
}
```

- `strictNullChecks` ist aktiviert – handle `null` / `undefined` explizit.
- `noImplicitAny` ist **aus** – aber trotzdem explizite Typen bevorzugen.
- Decorator-Metadaten: `@Module`, `@Controller`, `@Injectable`, etc.

### 2.3 Dateistruktur
```
src/
├── main.ts                 # Bootstrap
├── app.module.ts           # Root-Module
├── [feature]/
│   ├── [feature].module.ts
│   ├── [feature].controller.ts
│   ├── [feature].service.ts
│   ├── dto/
│   │   ├── create-[feature].dto.ts
│   │   └── update-[feature].dto.ts
│   └── entities/
│       └── [feature].entity.ts
```

### 2.4 Controller
- Route-Pfade mit `kebab-case`: `@Controller('user-profiles')`
- HTTP-Methoden explizit deklarieren: `@Get()`, `@Post()`, etc.
- Async-Funktionen mit `Promise<T>` oder `async/await`.
- Status-Codes mit `@HttpCode()` oder NestJS-Standardverhalten.

### 2.5 Services
- `@Injectable()` Decorator verpflichtend.
- Business-Logik hier implementieren, nicht im Controller.
- Externe APIs oder Datenbankzugriff über Repository-Pattern.
- Rückgabetypen explizit angeben.

### 2.6 DTOs
- `class` mit Validation-Decorators (wenn `class-validator` hinzugefügt wird).
- Readonly-Properties bevorzugen: `readonly name: string`.
- Keine Business-Logik in DTOs.

---

## 3. Frontend (React + Vite)

### 3.1 React-Version & Features
- **React 19** mit React Compiler (Babel Plugin).
- **Funktionale Komponenten** ausschließlich – keine Class Components.
- **TypeScript** für alle `.tsx` und `.ts` Dateien.

### 3.2 Komponenten-Struktur
Jede Komponente liegt in einem eigenen Ordner:

```
src/components/Card/
├── Card.tsx
├── Card.css
└── index.ts        # Optional: re-export
```

**Komponenten-Template:**
```tsx
import React from 'react';
import './Component.css';

/**
 * Kurzbeschreibung der Komponente.
 * @param props - Die Props der Komponente
 */
interface ComponentProps {
  title: string;
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ title, children }) => {
  return (
    <article className="component">
      <h3>{title}</h3>
      {children}
    </article>
  );
};

export default Component;
```

### 3.3 Props & State
- **Interfaces** für Props verwenden, nicht `type` (Projekt-Konvention).
- `React.FC<Props>` für Komponenten-Typisierung.
- Optionale Props mit `?` markieren: `children?: React.ReactNode`.
- State minimal halten – derive state from props wenn möglich.
- `useState` mit funktionalen Updates, wenn vom vorherigen Wert abhängig.

### 3.4 Hooks
- Hooks NUR auf Top-Level aufrufen – nie in Schleifen, Bedingungen oder verschachtelten Funktionen.
- Custom Hooks mit `use`-Prefix: `useAuth`, `useApi`.
- Custom Hooks in `src/hooks/` speichern.
- `useEffect` nur für echte Side Effects – keine reinen Berechnungen darin.
- Dependency Arrays in `useEffect` immer vollständig angeben.
- Cleanup-Funktionen bei Bedarf (Event Listener, Subscriptions).

### 3.5 Performance
- `useMemo` und `useCallback` nur bei tatsächlichem Bedarf verwenden.
- `React.memo` für pure presentational Components.
- Stabile Referenzen in Dependency Arrays wahren.
- Korrekte `key`-Props in Listen (`key` muss stabil und eindeutig sein).

### 3.6 Styling
- **CSS Custom Properties** (CSS Variables) aus `src/theme/variables.css` verwenden.
- **Keine Inline-Styles** – immer CSS-Klassen.
- CSS-Datei pro Komponente mit gleichem Namen.
- BEM-ähnliche Namenskonvention für CSS-Klassen:
  - Block: `.card`
  - Element: `.card-title`, `.card-description`
  - Modifier: `.card--highlighted`

### 3.7 Design System (Theme)
Folgende CSS-Variablen MÜSSEN verwendet werden – niemals hartkodierte Werte:

```css
/* Farben */
var(--bg-primary)        /* #0d0d10 */
var(--bg-secondary)      /* #16161a */
var(--bg-tertiary)       /* #1f1f23 */
var(--text-primary)      /* #f3f4f6 */
var(--text-secondary)    /* #9ca3af */
var(--text-muted)        /* #6b7280 */
var(--accent)            /* #7c3aed */
var(--accent-hover)      /* #8b5cf6 */
var(--accent-muted)      /* #4c1d95 */
var(--accent-soft)       /* rgba(124, 58, 237, 0.15) */

/* Struktur */
var(--border)            /* #2e303a */
var(--border-light)      /* #3f3f46 */
var(--shadow)            /* Box-Shadow Standard */
var(--shadow-accent)     /* Box-Shadow mit Lila-Glow */

/* Spacing */
var(--space-xs)          /* 4px */
var(--space-sm)          /* 8px */
var(--space-md)          /* 16px */
var(--space-lg)          /* 24px */
var(--space-xl)          /* 48px */

/* Border Radius */
var(--radius-sm)         /* 4px */
var(--radius-md)         /* 8px */
var(--radius-lg)         /* 12px */
```

### 3.8 Schriftarten
- **Inter** als primäre Schriftart verwenden.
- Font-Face ist in `src/theme/typography.css` definiert.
- Fallback: `system-ui, -apple-system, sans-serif`.

---

## 4. Linting & Formatting

### 4.1 Backend
**ESLint Config:** `backend/eslint.config.mjs`
- `@eslint/js` recommended
- `typescript-eslint` recommendedTypeChecked
- `eslint-plugin-prettier/recommended`
- `globals.node`, `globals.jest`

**Wichtige Regeln:**
| Regel | Setting |
|-------|---------|
| `@typescript-eslint/no-explicit-any` | `off` |
| `@typescript-eslint/no-floating-promises` | `warn` |
| `@typescript-eslint/no-unsafe-argument` | `warn` |
| `prettier/prettier` | `error` |

**Scripts:**
```bash
npm run lint        # ESLint mit Auto-Fix
npm run format      # Prettier Formatierung
```

### 4.2 Frontend
**ESLint Config:** `frontend/eslint.config.js`
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react-hooks` recommended
- `eslint-plugin-react-refresh` vite

**Scripts:**
```bash
npm run lint        # ESLint Check
```

### 4.3 Prettier (Backend)
```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

### 4.4 Pflicht-Check vor Commit
- `npm run lint` muss ohne Fehler durchlaufen.
- `npm run build` muss erfolgreich sein.
- Keine TypeScript-Fehler (`tsc --noEmit`).

---

## 5. TypeScript

### 5.1 Allgemeine Regeln
- **Explizite Typen** bevorzugen – keine impliziten `any`.
- **Interfaces** für Objekt-Formen, **Types** für Unions/Aliases.
- **Enums** für feste Wertemengen.
- **Generics** verwenden, wenn Typen wiederverwendbar sind.
- `readonly` für unveränderliche Properties.

### 5.2 Strict Mode
Backend: `strictNullChecks: true`, `forceConsistentCasingInFileNames: true`
Frontend: `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`

### 5.3 Verboten
- `any` vermeiden (Backend: erlaubt aber nicht empfohlen).
- `// @ts-ignore` nur mit ausführlicher Begründung.
- `as` Type Assertions nur wenn nötig.

---

## 6. Testing

### 6.1 Backend (Jest)
- Test-Dateien: `*.spec.ts` neben der zu testenden Datei.
- E2E-Tests: `test/*.e2e-spec.ts`
- Coverage-Report generierbar mit `npm run test:cov`

**Test-Struktur:**
```ts
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### 6.2 Frontend (React Testing Library)
- Komponenten auf Rendering testen.
- User Interactions testen.
- Kritische Business-Logik testen.
- **Keine Snapshot-Tests** für große Komponenten.

---

## 7. Dateiorganisation

### 7.1 Projekt-Struktur
```
QuestEngine/
├── backend/                # NestJS API
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── [feature]/
│   └── test/               # E2E Tests
├── frontend/               # React + Vite App
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/     # Wiederverwendbare UI-Komponenten
│   │   ├── pages/          # Seiten-Komponenten
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── services/       # API-Logik
│   │   ├── utils/          # Pure Helper-Funktionen
│   │   ├── theme/          # CSS-Variablen, Typography
│   │   └── assets/         # Bilder, Fonts
│   └── public/             # Statische Assets
├── instructions/           # Zusätzliche Guidelines
│   ├── a11y.md
│   └── react.md
└── agents/                 # Agent-Instructions
    ├── planner.md
    ├── implementer.md
    ├── reviewer.md
    └── coding-standards.md # Diese Datei
```

### 7.2 Namenskonventionen für Dateien
| Typ | Muster | Beispiel |
|-----|--------|----------|
| React Komponente | `PascalCase.tsx` | `UserCard.tsx` |
| React CSS | `PascalCase.css` | `UserCard.css` |
| Utility / Hook | `camelCase.ts` | `useAuth.ts` |
| NestJS Controller | `[name].controller.ts` | `user.controller.ts` |
| NestJS Service | `[name].service.ts` | `user.service.ts` |
| NestJS Module | `[name].module.ts` | `user.module.ts` |
| NestJS DTO | `[action]-[name].dto.ts` | `create-user.dto.ts` |
| Test-Datei | `[name].spec.ts` | `user.service.spec.ts` |

---

## 8. Kommentare & Dokumentation

### 8.1 JSDoc
Für öffentliche APIs, Komponenten und komplexe Funktionen:

```tsx
/**
 * Beschreibung der Funktion/Komponente.
 * @param user - Der zu aktualisierende Benutzer
 * @returns Das aktualisierte Benutzer-Objekt
 * @throws BadRequestException wenn E-Mail ungültig
 */
```

### 8.2 Inline-Kommentare
- Warum, nicht was (Code sagt WAS, Kommentar sagt WARUM).
- Kurz und prägnant.
- Bei komplexen Algorithmen oder Workarounds.

```tsx
// Wir verwenden debounce hier, um zu viele API-Calls zu vermeiden
const debouncedSearch = useDebounce(searchTerm, 300);
```

### 8.3 Sprache
- **Kommentare: Deutsch**
- **Code: Englisch**

---

## 9. Accessibility (a11y)

> **Vollständige Guidelines:** Siehe `QuestEngine/instructions/a11y.md`

**Kritische Pflicht-Regeln:**
- **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **Buttons für Aktionen**, **Links für Navigation** – niemals vertauschen.
- **Alt-Texte** für alle `<img>` (dekorativ: `alt=""`).
- **Labels** für alle Formular-Inputs (`<label for="id">`).
- **ARIA-Attribute** nur wenn natives HTML nicht ausreicht.
- **Tastaturbedienbarkeit**: Alle interaktiven Elemente per Tab erreichbar.
- **Fokus-Management**: `:focus-visible` mit `outline: 2px solid var(--accent)`.
- **Kontrast**: Mindestens 4.5:1 für normalen Text.

---

## 10. API & Datenkommunikation

### 10.1 Backend API
- RESTful Endpoints mit klaren Ressourcen-Pfaden.
- JSON als Austauschformat.
- HTTP-Status-Codes korrekt verwenden:
  - `200` OK
  - `201` Created
  - `400` Bad Request
  - `401` Unauthorized
  - `404` Not Found
  - `500` Internal Server Error

### 10.2 Frontend API-Layer
- API-Calls in `src/services/` oder Custom Hooks (`src/hooks/`).
- Fehlerbehandlung zentralisieren.
- Retry-Logik bei Netzwerkfehlern.
- Loading- und Error-States in der UI behandeln.

---

## 11. Agent-spezifische Anweisungen

### 11.1 Für Planner
- Implementierungspläne MÜSSEN diese Standards referenzieren.
- Bei UI-Tasks: Accessibility-Checkliste aus `a11y.md` einplanen.
- Linting und Testing als explizite Schritte im Plan aufführen.

### 11.2 Für Implementer
- Vor Code-Generierung: Diese Datei und relevante Instructions lesen.
- Nach Implementierung: `npm run lint` und `npm run build` ausführen.
- Keine Code-Änderungen ohne Tests (wenn Tests existieren).
- Bei Komponenten: Accessibility-Attribute (aria-label, role) prüfen.

### 11.3 Für Reviewer
- Code Muss gegen diese Standards geprüft werden.
- Linting-Fehler = Blocker.
- TypeScript-Fehler = Blocker.
- Accessibility-Verstöße = Blocker.
- Jede Review-Anmerkung erhält eine numerische ID für Nachverfolgung.

---

## 12. Checklisten

### 12.1 Vor jedem Commit (Frontend)
- [ ] `npm run lint` läuft fehlerfrei
- [ ] `npm run build` erfolgreich
- [ ] Keine ungenutzten Variablen/Imports
- [ ] CSS-Variablen verwendet (keine hartkodierten Farben/Spacing)
- [ ] Accessibility geprüft (Alt-Texte, Labels, Fokus)
- [ ] Komponenten haben JSDoc-Kommentare

### 12.2 Vor jedem Commit (Backend)
- [ ] `npm run lint` läuft fehlerfrei
- [ ] `npm run build` erfolgreich
- [ ] `npm run test` besteht
- [ ] Services haben JSDoc-Kommentare
- [ ] DTOs sind validiert
- [ ] Fehlerbehandlung implementiert

---

## 13. Referenzen

- **Accessibility:** `QuestEngine/instructions/a11y.md`
- **React:** `QuestEngine/instructions/react.md`
- **Backend ESLint:** `QuestEngine/backend/eslint.config.mjs`
- **Backend Prettier:** `QuestEngine/backend/.prettierrc`
- **Frontend ESLint:** `QuestEngine/frontend/eslint.config.js`
- **Backend TS Config:** `QuestEngine/backend/tsconfig.json`
- **Frontend TS Config:** `QuestEngine/frontend/tsconfig.app.json`

---

> **Letzte Aktualisierung:** Wird bei Änderungen an ESLint/Prettier/TS-Config aktualisiert.
