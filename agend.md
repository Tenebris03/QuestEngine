# Agent

Dieses Dokument beschreibt die **geplante Architektur** des `Agent`-Features in **QuestEngine**.

Der Agent repräsentiert den Spieler bzw. Nutzer des gamifizierten Self-Improvement-Systems. Er ist die zentrale Domänenentität für Profil, Fortschritt, Quests, Erfahrungspunkte und Belohnungen.

---

## Zweck des Agent-Features

Der Agent bündelt alle Informationen, die den Fortschritt eines Nutzers innerhalb von QuestEngine beschreiben.

### Kernverantwortung

- Verwaltung des Profils eines Nutzers
- Speicherung von Level und Erfahrungspunkten
- Abbildung von Werten wie Disziplin, Stärke oder ähnlichen Attributen
- Verknüpfung mit aktiven und abgeschlossenen Quests
- Grundlage für Belohnungen, Fortschrittsanzeigen und Spielmechaniken

### Beispielhafte Felder

- `id`
- `username`
- `level`
- `experiencePoints`
- `disciplineStat`
- `strengthStat`
- `totalQuestsCompleted`
- `createdAt`
- `updatedAt`

---

## Aktueller Projektkontext

QuestEngine besteht aktuell aus:

- **Frontend:** `Vite + React + TypeScript`
- **Backend:** `NestJS + TypeScript`

Dieses Dokument beschreibt die **fachliche Zielstruktur** des Agent-Features. Es bedeutet nicht automatisch, dass alle unten genannten Komponenten oder Module bereits implementiert sind.

---

## Frontend (Vite + React)

Das Frontend ist für Darstellung und Interaktion zuständig. Es visualisiert den Zustand des Agenten und stößt Aktionen des Nutzers an.

### Ziel im Frontend

Das Frontend soll unter anderem folgende Aufgaben erfüllen:

- Agenten-Profil anzeigen
- Statistiken und Fortschritt visualisieren
- aktive und abgeschlossene Quests darstellen
- Nutzeraktionen an das Backend senden
- Lade-, Fehler- und Erfolgszustände sauber behandeln

### Mögliche Komponenten

#### `AgentProfile`
Zeigt die grundlegenden Informationen des Agenten an.

**Beispielhafte Props oder Datenfelder:**
- `username`
- `level`
- `experiencePoints`
- `nextLevelXp`

#### `AgentStats`
Visualisiert Spiel- und Fortschrittswerte.

**Beispielhafte Datenfelder:**
- `disciplineStat`
- `strengthStat`
- `totalQuestsCompleted`

#### `QuestLog`
Listet aktive und abgeschlossene Quests.

**Beispielhafte Datenfelder:**
- `activeQuests`
- `completedQuests`

### Datenfluss im Frontend

#### Abruf
Agenten-Daten werden über API-Aufrufe aus dem Backend geladen.

**Beispiele:**
- `fetchAgentById(agentId)`
- `fetchAgentQuests(agentId)`

#### Aktualisierung
Nutzeraktionen senden Änderungen an das Backend.

**Beispiele:**
- `completeQuest(agentId, questId)`
- `updateAgentProfile(agentId, profileData)`

### Frontend-Konventionen

- **TypeScript** für strikt typisierte Komponenten, Props und API-Daten
- **camelCase** für Variablen, Funktionen und Datenfelder
- klare Trennung zwischen:
  - UI-Komponenten
  - API-Zugriff
  - Typdefinitionen
  - Zustandslogik

### Beispiel für sinnvolle Frontend-Struktur

Diese Struktur ist ein Vorschlag für die spätere Umsetzung:

- `src/components/agent/AgentProfile.tsx`
- `src/components/agent/AgentStats.tsx`
- `src/components/quest/QuestLog.tsx`
- `src/types/agent.ts`
- `src/api/agent.ts`

---

## Backend (NestJS)

Das Backend ist die Quelle der Wahrheit für alle Agent-bezogenen Daten. Es kapselt Geschäftslogik, Validierung und spätere Persistenz.

### Ziel im Backend

Das Backend soll unter anderem folgende Aufgaben übernehmen:

- Agenten abrufen
- Agentenprofil aktualisieren
- XP vergeben
- Level berechnen
- Quest-Abschlüsse verarbeiten
- Statistiken aktualisieren

### Mögliche NestJS-Bausteine

#### `AgentModule`
Kapselt alle Agent-bezogenen Bestandteile.

#### `AgentController`
Definiert die HTTP-Endpunkte für das Agent-Feature.

**Beispielhafte Endpunkte:**
- `GET /agents/:id`
- `PATCH /agents/:id/profile`
- `POST /agents/:id/quests/:questId/complete`

#### `AgentService`
Enthält die Geschäftslogik.

**Beispielhafte Methoden:**
- `findById(agentId: string)`
- `updateProfile(agentId: string, data: UpdateAgentProfileDto)`
- `awardXp(agentId: string, amount: number)`
- `completeQuest(agentId: string, questId: string)`

#### Persistenzschicht
Sobald eine Datenbank integriert ist, kann zusätzlich eine Persistenzschicht ergänzt werden, zum Beispiel über Repositorys oder ein ORM.

**Beispielhafte Aufgabe:**
- Agenten speichern und laden
- Fortschrittsdaten persistieren
- Quest-Zuordnungen verwalten

### Datenmodell

Der Agent sollte im Backend als klar typisierte Domänenstruktur beschrieben werden.

#### Beispielhafte Entity oder Model-Struktur

- `id: string`
- `username: string`
- `level: number`
- `experiencePoints: number`
- `disciplineStat: number`
- `strengthStat: number`
- `totalQuestsCompleted: number`
- `createdAt: Date`
- `updatedAt: Date`

### DTOs

DTOs strukturieren und validieren eingehende und ausgehende Daten.

**Beispiele:**
- `CreateAgentDto`
- `UpdateAgentProfileDto`
- `AgentResponseDto`
- `CompleteQuestDto`

### Backend-Konventionen

- **TypeScript** für alle Controller, Services und DTOs
- **camelCase** für Methoden, Variablen und Datenfelder
- saubere Trennung von:
  - Controller
  - Service
  - DTOs
  - späterer Persistenzschicht
- Geschäftslogik gehört in den **Service**, nicht in den Controller

### Beispiel für sinnvolle Backend-Struktur

Diese Struktur ist ein Vorschlag für die spätere Umsetzung:

- `src/agent/agent.module.ts`
- `src/agent/agent.controller.ts`
- `src/agent/agent.service.ts`
- `src/agent/dto/update-agent-profile.dto.ts`
- `src/agent/dto/agent-response.dto.ts`

---

## Interaktion zwischen Frontend und Backend

Die Kommunikation erfolgt über HTTP-Endpunkte des NestJS-Backends.

### Beispielhafte REST-Endpunkte

- `GET /api/agents/:agentId`  
  Liefert das Profil eines Agenten.

- `PATCH /api/agents/:agentId/profile`  
  Aktualisiert Profilinformationen eines Agenten.

- `POST /api/agents/:agentId/quests/:questId/complete`  
  Markiert eine Quest als abgeschlossen und aktualisiert XP, Fortschritt und Statistiken.

### Beispielhafte JSON-Struktur

#### Antwort für Agent-Profil

```json
{
  "id": "agent-123",
  "username": "Leon",
  "level": 4,
  "experiencePoints": 320,
  "disciplineStat": 18,
  "strengthStat": 11,
  "totalQuestsCompleted": 7
}
```

#### Request für Profil-Update

```json
{
  "username": "LeonR",
  "disciplineStat": 19
}
```

### API-Konventionen

- JSON als Austauschformat
- konsistente Feldnamen in `camelCase`
- klare Trennung zwischen Request-DTOs und Response-DTOs
- Fehlerantworten sollten nachvollziehbar und stabil sein

---

## Implementierungsnotizen

Bei der Umsetzung des Agent-Features sollten folgende Punkte beachtet werden:

- Das Dokument beschreibt eine **Zielarchitektur**, keinen vollständig vorhandenen Ist-Zustand.
- Das Frontend nutzt **Vite + React**, nicht Next.js.
- Das Backend basiert auf **NestJS**.
- Zusätzliche technische Entscheidungen wie Authentifizierung, Datenbank oder ORMs sollten separat dokumentiert werden, sobald sie konkret festgelegt sind.

---

## Zusammenfassung

Der Agent ist die zentrale Spielfigur des Systems aus technischer und fachlicher Sicht. Das Feature verbindet:

- Nutzerprofil
- Fortschritt
- Werte und Statistiken
- Quests
- Belohnungslogik

Damit bildet der Agent die Grundlage für die Kernmechanik von QuestEngine.
