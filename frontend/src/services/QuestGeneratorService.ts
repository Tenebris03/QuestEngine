/**
 * Quest Generator Service - Storage Layer
 * Verantwortlich für das Speichern und Laden von Preferences und Plänen.
 * Die Generierungslogik wurde in LocalAIService.ts verschoben (WebLLM).
 */

import type { UserPreferences, WeeklyPlan, Quest } from '../pages/QuestGenerator/QuestGenerator.types';

/**
 * Speichert User-Preferences im localStorage.
 */
export function savePreferences(preferences: UserPreferences): void {
  localStorage.setItem('questGenerator_preferences', JSON.stringify(preferences));
}

/**
 * Lädt User-Preferences aus dem localStorage.
 */
export function loadPreferences(): UserPreferences | null {
  const stored = localStorage.getItem('questGenerator_preferences');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Überprüft, ob der Benutzer bereits Preferences gesetzt hat.
 */
export function hasPreferences(): boolean {
  return loadPreferences() !== null;
}

/**
 * Speichert einen Wochenplan im localStorage.
 */
export function saveWeeklyPlan(plan: WeeklyPlan): void {
  localStorage.setItem('questGenerator_weeklyPlan', JSON.stringify(plan));
}

/**
 * Lädt den letzten Wochenplan aus dem localStorage.
 */
export function loadWeeklyPlan(): WeeklyPlan | null {
  const stored = localStorage.getItem('questGenerator_weeklyPlan');
  if (!stored) return null;
  const parsed = JSON.parse(stored);
  return { ...parsed, createdAt: new Date(parsed.createdAt) };
}

/**
 * Gibt die Quest für den aktuellen Wochentag zurück.
 * Returns null wenn kein Plan existiert oder der Tag keine Quest hat.
 */
export function getTodaysQuest(): Quest | null {
  const plan = loadWeeklyPlan();
  if (!plan || !plan.quests) return null;

  const todayIndex = new Date().getDay(); // 0 = Sonntag, 1 = Montag, ...
  // Unser Plan nutzt dayIndex 0-6. Wir nehmen an die Reihenfolge ist Mo-So oder So-Sa?
  // Basierend auf der Generierung sind die Tage in der Regel Mo-So, also index 0 = Montag.
  // Da getDay() 0=Sonntag gibt, brauchen wir eine Mapping-Logik.
  // Wir nehmen den pragmatischen Ansatz: Suche nach dem passenden Tagesnamen.
  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const todayName = weekdays[todayIndex];

  const todaysQuest = plan.quests.find((q) => q.day === todayName);
  return todaysQuest || null;
}
