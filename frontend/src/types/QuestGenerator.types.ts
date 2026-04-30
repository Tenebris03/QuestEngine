/**
 * Type-Definitionen für den Quest Generator.
 * Enthält alle Interfaces und Enums für Preferences, Quests und Übungen.
 */

export type FitnessGoal = 'strength' | 'endurance' | 'weightloss' | 'muscle';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type IntensityLevel = 'light' | 'medium' | 'hard';

/**
 * Status der lokalen KI-Engine.
 */
export type AIStatus = 'idle' | 'loading_model' | 'generating' | 'ready' | 'error';

/**
 * Repräsentiert eine einzelne Übung innerhalb einer Quest.
 */
export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  muscleGroup: string;
}

/**
 * Repräsentiert eine tägliche Quest (Trainingseinheit).
 */
export interface Quest {
  day: string;
  dayIndex: number;
  title: string;
  description: string;
  exercises: Exercise[];
  duration: number;
  intensity: IntensityLevel;
  equipment: string[];
  completed: boolean;
}

/**
 * Benutzer-Preferences für die Quest-Generierung.
 */
export interface UserPreferences {
  fitnessGoal: FitnessGoal;
  availableTime: 30 | 45 | 60 | 90 | 120;
  equipment: string[];
  intensity: number;
  experienceLevel: ExperienceLevel;
  includeWeekend: boolean;
}

/**
 * Ein vordefiniertes Quest-Template für die Generierung.
 */
export interface QuestTemplate {
  title: string;
  description: string;
  exercises: Omit<Exercise, 'sets' | 'reps'>[];
  minDuration: number;
  maxDuration: number;
  targetMuscles: string[];
  requiredEquipment: string[];
}

/**
 * Der generierte Wochenplan.
 */
export interface WeeklyPlan {
  weekNumber: number;
  quests: Quest[];
  totalDuration: number;
  createdAt: Date;
}

/**
 * Fortschritt beim Laden des KI-Modells oder Generieren.
 */
export interface AIProgress {
  status: AIStatus;
  message: string;
  percent: number;
}

/**
 * Ergebnis einer KI-Generierung.
 */
export interface AIGenerationResult {
  plan: WeeklyPlan;
  generatedBy: 'ai' | 'template';
  modelName?: string;
}
