/**
 * Quest Generator Service - Storage Layer
 * Verantwortlich für das Speichern und Laden von Preferences und Plänen.
 * Die Generierungslogik wurde in LocalAIService.ts verschoben (WebLLM).
 */

import type { UserPreferences, WeeklyPlan, Quest, IntensityLevel } from '../pages/QuestGenerator/QuestGenerator.types';

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
 * NEU: Löscht auch den täglichen Fortschritt, damit das Dashboard resettet wird.
 */
export function saveWeeklyPlan(plan: WeeklyPlan): void {
  localStorage.setItem('questGenerator_weeklyPlan', JSON.stringify(plan));
  
  // Wenn ein völlig neuer Plan gespeichert wird, löschen wir die 
  // heutigen Checklisten-Daten, damit das Dashboard frisch startet.
  const todayKey = getTodayStorageKey();
  localStorage.removeItem(todayKey);
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
 * Syncs completion status.
 */
export function getTodaysQuest(): Quest | null {
  const plan = loadWeeklyPlan();
  if (!plan || !plan.quests) return null;

  const todayIndex = getTodayIndex();
  const questIndex = plan.quests.findIndex((q) => q.dayIndex === todayIndex);
  if (questIndex !== -1) {
    // Ensure status synced
    getQuestCompletionStatus(questIndex);
    return plan.quests[questIndex];
  }
  return null;
}

/**
 * Gets mapped today index (0=Mo...6=So)
 */
export function getTodayIndex(): number {
  const today = new Date().getDay(); // 0=Su,1=Mo,...,6=Sa
  return today === 0 ? 6 : today - 1;
}

/**
 * Markiert eine Quest als completed und speichert Rating (1-10).
 * Syncs with daily checklist storage.
 * @param questIndex - Index der Quest im WeeklyPlan (0-6)
 * @param rating - Difficulty rating 1-10
 */
export function completeQuest(questIndex: number, rating: number): void {
  const plan = loadWeeklyPlan();
  if (!plan || !plan.quests[questIndex]) return;

  plan.quests[questIndex].completed = true;
  plan.quests[questIndex].difficultyRating = Math.max(1, Math.min(10, Math.round(rating)));

  saveWeeklyPlan(plan);
  syncDailyCompletion(questIndex, rating);
}

/**
 * Sets daily checklist as fully completed for today&#39;s quest.
 * @private
 */
function setDailyCompleted(exerciseCount: number): void {
  const todayKey = getTodayStorageKey();
  localStorage.setItem(todayKey, JSON.stringify(Array(exerciseCount).fill(true)));
}

/**
 * Gets today&#39;s localStorage key for daily completions (matches Dashboard).
 */
export function getTodayStorageKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `questEngine_dailyCompletion_${today}`;
}

/**
 * Syncs quest completion to daily checklist storage and vice versa.
 * Called by completeQuest and Dashboard.
 * @param questIndex 
 * @param rating Optional rating from quest
 * @param exercisesDone Optional exercise count from dashboard
 */
export function syncDailyCompletion(questIndex: number, rating?: number, exercisesDone?: number[]): void {
  const plan = loadWeeklyPlan();
  if (!plan || !plan.quests[questIndex]) return;

  const todayKey = getTodayStorageKey();
  let dailyCompleted = false;
  let dailyExercisesCount = plan.quests[questIndex].exercises.length;

  if (exercisesDone) {
    // From Dashboard: check if all done
    dailyCompleted = exercisesDone.every(done => done);
    localStorage.setItem(todayKey, JSON.stringify(exercisesDone));
  } else {
    // From Quest: mark all done
    const storedDaily = localStorage.getItem(todayKey);
    if (!storedDaily || JSON.parse(storedDaily).every((d: boolean) => !d)) {
      setDailyCompleted(dailyExercisesCount);
    }
    dailyCompleted = true;
  }

  // Update quest if not already
  if (!plan.quests[questIndex].completed || (rating !== undefined && plan.quests[questIndex].difficultyRating !== rating)) {
    plan.quests[questIndex].completed = dailyCompleted;
    if (rating !== undefined) {
      plan.quests[questIndex].difficultyRating = Math.max(1, Math.min(10, Math.round(rating)));
    }
    saveWeeklyPlan(plan);
  }
}

/**
 * Gets completion status for a specific quest/day.
 * Checks both weeklyPlan and daily storage.
 */
export function getQuestCompletionStatus(questIndex: number): { completed: boolean; rating?: number; exercisesDone: boolean[] } {
  const plan = loadWeeklyPlan();
  if (!plan?.quests[questIndex]) {
    return { completed: false, exercisesDone: [] };
  }

  const quest = plan.quests[questIndex];
  const todayKey = getTodayStorageKey();
  const dailyStored = localStorage.getItem(todayKey);

  if (dailyStored) {
    try {
      const exercisesDone: boolean[] = JSON.parse(dailyStored);
      const allDone = exercisesDone.every(Boolean);
      if (allDone && !quest.completed) {
        // Sync: mark quest completed if daily all done
        quest.completed = true;
        if (!quest.difficultyRating) quest.difficultyRating = 5; // default
        saveWeeklyPlan(plan);
      }
      return { completed: allDone, rating: quest.difficultyRating, exercisesDone };
    } catch {
      // fallback
    }
  }

  return { 
    completed: quest.completed, 
    rating: quest.difficultyRating, 
    exercisesDone: Array(quest.exercises.length).fill(quest.completed) 
  };
}

/**
 * Checks if today&#39;s quest is completed (from either storage).
 */
export function isDailyQuestCompleted(): boolean {
  const todayIndex = getTodayIndex();
  return getQuestCompletionStatus(todayIndex).completed;
}

/**
 * Lädt alle Ratings für statistische Auswertung.
 */
export function getAllRatings(): number[] {
  const plan = loadWeeklyPlan();
  return plan?.quests
    .filter(q => q.completed && q.difficultyRating !== undefined)
    .map(q => q.difficultyRating!) || [];
}

/**
 * Berechnet average difficulty rating.
 */
export function getAverageRating(): number {
  const ratings = getAllRatings();
  return ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) as unknown as number : 0;
}
