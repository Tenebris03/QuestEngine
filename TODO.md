# Quest Generator - Implementierungsplan

## Ziel
QuestGenerator-Page mit echter lokaler KI (Transformers.js), tabellarischer Wochenübersicht und Design-Konsistenz zu Home.

## Schritte

- [ ] 1. `package.json` erweitern (`@xenova/transformers`)
- [ ] 2. `QuestGenerator.types.ts` erweitern (AI-Status, Modell-Info)
- [ ] 3. `LocalAIService.ts` erstellen (Transformers.js Integration, Prompt-Builder, Parser)
- [ ] 4. `useQuestAI.ts` Hook erstellen (React-Integration für KI)
- [ ] 5. `AILoadingPanel` Komponente erstellen (Modell-Download & Generierung-Fortschritt)
- [ ] 6. `WeeklyTable` Komponente erstellen (HTML table, responsive, barrierefrei)
- [ ] 7. `QuestGeneratorService.ts` anpassen (KI + Template-Fallback)
- [ ] 8. `WeeklyOverview.tsx` anpassen (WeeklyTable integrieren)
- [ ] 9. `QuestGenerator.tsx` anpassen (KI-Loading-States, Hardware-Check)
- [ ] 10. `QuestGenerator.css` anpassen (Hero-Gradient wie Home)
- [ ] 11. CSS für neue Komponenten erstellen
- [ ] 12. `npm install` ausführen
- [ ] 13. `npm run lint` prüfen
- [ ] 14. `npm run build` prüfen
