/**
 * Quest Generator Service - Storage Layer
 * Verantwortlich für das Speichern und Laden von Preferences und Plänen.
 * Die Generierungslogik wurde in LocalAIService.ts verschoben (WebLLM).
 */

import type { UserPreferences, WeeklyPlan } from '../QuestGenerator.types';

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
