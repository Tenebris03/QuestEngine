# Agent

Im Kontext von QuestEngine repräsentiert ein "Agent" den Spieler oder Nutzer, der aktiv am gamifizierten Self-Improvement-System teilnimmt. Der Agent ist die zentrale Entität, um die sich Quests, Fortschritt und Belohnungen drehen.

---

## Frontend (Next.js / React)

Das Frontend ist für die Darstellung und Interaktion mit dem Agenten zuständig. Hier werden die Daten des Agenten visualisiert und Aktionen des Nutzers initiiert.

### Komponenten

*   **`AgentProfile`**: Zeigt grundlegende Informationen des Agenten an (Name, Level, XP, etc.).
    *   Beispiel: `agentName`, `agentLevel`, `currentXp`, `nextLevelXp`.
*   **`AgentStats`**: Visualisiert die Disziplin- und Stärke-Werte sowie andere relevante Statistiken.
    *   Beispiel: `disciplineValue`, `strengthValue`, `totalQuestsCompleted`.
*   **`QuestLog`**: Listet die aktuellen und abgeschlossenen Quests des Agenten auf.
    *   Beispiel: `activeQuests`, `completedQuests`.

### Datenfluss

*   **Abruf**: Agenten-Daten werden über API-Aufrufe vom Backend bezogen.
    *   Beispiel: `fetchAgentProfile()`, `getAgentQuests()`.
*   **Aktualisierung**: Nutzerinteraktionen (z.B. Quest abschließen) senden Updates an das Backend.
    *   Beispiel: `completeQuest(questId)`, `updateAgentProfile(profileData)`.

### Code-Praktiken

*   **camelCase**: Für Variablen, Funktionen, Props und Dateinamen (z.B. `agentProfile.tsx`, `useAgentData.ts`, `handleQuestCompletion`).

---

## Backend (NestJS)

Das Backend verwaltet die Logik, Persistenz und Geschäftsregeln rund um den Agenten. Es ist die Quelle der Wahrheit für alle Agenten-bezogenen Daten.

### Module und Services

*   **`AgentModule`**: Kapselt alle Agenten-bezogenen Logiken.
*   **`AgentController`**: Definiert die API-Endpunkte für den Zugriff auf Agenten-Daten.
    *   Beispiel: `GET /agents/:id`, `PATCH /agents/:id/profile`, `POST /agents/:id/quests/:questId/complete`.
*   **`AgentService`**: Enthält die Geschäftslogik für Agenten (z.B. Level-Berechnung, XP-Vergabe, Statistik-Updates).
    *   Beispiel: `findAgentById(agentId)`, `updateAgentStats(agentId, stats)`, `awardXp(agentId, amount)`.
*   **`AgentRepository`**: Interagiert direkt mit der Datenbank, um Agenten-Daten zu speichern und abzurufen.

### Datenmodell

*   **Entitäten**: Definition der Agenten-Struktur in der Datenbank.
    *   Beispiel: `AgentEntity` mit Feldern wie `id`, `username`, `level`, `experiencePoints`, `disciplineStat`, `strengthStat`.
*   **DTOs (Data Transfer Objects)**: Für die Validierung und Strukturierung von Daten, die über die API gesendet und empfangen werden.
    *   Beispiel: `CreateAgentDto`, `UpdateAgentProfileDto`, `AgentProfileResponseDto`.

### Code-Praktiken

*   **camelCase**: Für Methoden, Variablen, DTO-Felder und Datenbankspalten (z.B. `agentId`, `updateAgentProfile`, `disciplineStat`).
*   **Modularer Aufbau**: Klare Trennung von Controller, Service und Repository.
*   **TypeScript**: Strikte Typisierung für alle Agenten-bezogenen Datenstrukturen und Funktionen.

---

## Interaktion zwischen Frontend und Backend

Die Kommunikation erfolgt über definierte API-Endpunkte, die vom `AgentController` im Backend bereitgestellt werden.

*   **RESTful API**: Typische Endpunkte für CRUD-Operationen auf Agenten-Ressourcen.
    *   `GET /api/agents/{agentId}`: Ruft das Profil eines spezifischen Agenten ab.
    *   `PATCH /api/agents/{agentId}/profile`: Aktualisiert das Profil eines Agenten.
    *   `POST /api/agents/{agentId}/quests/{questId}/complete`: Markiert eine Quest als abgeschlossen für den Agenten.
*   **GraphQL (optional)**: Wenn GraphQL verwendet wird, würden spezifische Queries und Mutationen für Agenten-Daten definiert.
    *   Beispiel: `query { agent(id: "...") { id username level } }`, `mutation { completeQuest(agentId: "...", questId: "...") { success } }`.

Die Datenstrukturen, die zwischen Frontend und Backend ausgetauscht werden, folgen ebenfalls der `camelCase`-Konvention, um Konsistenz zu gewährleisten (z.B. `agentProfileData`, `questCompletionRequest`).
