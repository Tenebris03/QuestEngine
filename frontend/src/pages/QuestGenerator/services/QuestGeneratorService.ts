/**
 * Local AI Service für die Quest-Generierung.
 * Generiert realistische Trainingspläne basierend auf User-Preferences.
 * Läuft komplett client-side im Browser.
 */

import type {
  Exercise,
  FitnessGoal,
  ExperienceLevel,
  IntensityLevel,
  Quest,
  QuestTemplate,
  UserPreferences,
  WeeklyPlan,
} from '../QuestGenerator.types';


const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

/**
 * Vordefinierte Übungs-Templates nach Muskelgruppe.
 */
const EXERCISE_POOL: Record<string, Array<Omit<Exercise, 'sets' | 'reps'>>> = {
  push: [
    { name: 'Liegestütze', restSeconds: 60, muscleGroup: 'Brust' },
    { name: 'Diamant-Liegestütze', restSeconds: 60, muscleGroup: 'Trizeps' },
    { name: 'Pike Push-ups', restSeconds: 90, muscleGroup: 'Schulter' },
    { name: 'Dips', restSeconds: 90, muscleGroup: 'Brust' },
  ],
  pull: [
    { name: 'Klimmzüge', restSeconds: 120, muscleGroup: 'Rücken' },
    { name: 'Australian Pull-ups', restSeconds: 90, muscleGroup: 'Rücken' },
    { name: 'Chin-ups', restSeconds: 120, muscleGroup: 'Bizeps' },
    { name: 'Superman Holds', restSeconds: 60, muscleGroup: 'Rücken' },
  ],
  legs: [
    { name: 'Kniebeugen', restSeconds: 120, muscleGroup: 'Beine' },
    { name: 'Ausfallschritte', restSeconds: 90, muscleGroup: 'Beine' },
    { name: 'Bulgarian Split Squats', restSeconds: 120, muscleGroup: 'Beine' },
    { name: 'Wadenheben', restSeconds: 60, muscleGroup: 'Waden' },
  ],
  core: [
    { name: 'Plank', restSeconds: 60, muscleGroup: 'Core' },
    { name: 'Mountain Climbers', restSeconds: 45, muscleGroup: 'Core' },
    { name: 'Leg Raises', restSeconds: 60, muscleGroup: 'Core' },
    { name: 'Russian Twists', restSeconds: 45, muscleGroup: 'Core' },
  ],
  cardio: [
    { name: 'Burpees', restSeconds: 60, muscleGroup: 'Ganzkörper' },
    { name: 'Jumping Jacks', restSeconds: 30, muscleGroup: 'Ganzkörper' },
    { name: 'High Knees', restSeconds: 30, muscleGroup: 'Beine' },
    { name: 'Sprint on Spot', restSeconds: 45, muscleGroup: 'Beine' },
  ],
};

/**
 * Vordefinierte Quest-Templates nach Fitness-Ziel.
 */
const QUEST_TEMPLATES: Record<FitnessGoal, QuestTemplate[]> = {
  strength: [
    { title: 'Upper Body Power', description: 'Push & Pull für maximale Kraft', exercises: [], minDuration: 45, maxDuration: 60, targetMuscles: ['Brust', 'Rücken', 'Trizeps', 'Bizeps'], requiredEquipment: [] },
    { title: 'Lower Body Strength', description: 'Beine wie Baumstämme', exercises: [], minDuration: 45, maxDuration: 60, targetMuscles: ['Beine', 'Waden'], requiredEquipment: [] },
    { title: 'Core Crusher', description: 'Stahlkern aufbauen', exercises: [], minDuration: 30, maxDuration: 45, targetMuscles: ['Core'], requiredEquipment: [] },
  ],
  endurance: [
    { title: 'Cardio Blast', description: 'Ausdauer auf Maximum', exercises: [], minDuration: 45, maxDuration: 90, targetMuscles: ['Ganzkörper', 'Beine'], requiredEquipment: [] },
    { title: 'HIIT Circuit', description: 'High Intensity Intervals', exercises: [], minDuration: 30, maxDuration: 45, targetMuscles: ['Ganzkörper', 'Core'], requiredEquipment: [] },
  ],
  weightloss: [
    { title: 'Fat Burner', description: 'Kalorien verbrennen', exercises: [], minDuration: 45, maxDuration: 90, targetMuscles: ['Ganzkörper'], requiredEquipment: [] },
    { title: 'Metabolic Conditioning', description: 'Stoffwechsel ankurbeln', exercises: [], minDuration: 30, maxDuration: 60, targetMuscles: ['Ganzkörper', 'Core'], requiredEquipment: [] },
  ],
  muscle: [
    { title: 'Hypertrophy Upper', description: 'Muskelwachstum Oberkörper', exercises: [], minDuration: 60, maxDuration: 90, targetMuscles: ['Brust', 'Rücken', 'Schulter', 'Trizeps', 'Bizeps'], requiredEquipment: [] },
    { title: 'Hypertrophy Lower', description: 'Muskelwachstum Unterkörper', exercises: [], minDuration: 60, maxDuration: 90, targetMuscles: ['Beine', 'Waden'], requiredEquipment: [] },
  ],
};

/**
 * Ermittelt die Intensität basierend auf User-Preference.
 */
function determineIntensity(intensityValue: number): IntensityLevel {
  if (intensityValue <= 3) return 'light';
  if (intensityValue <= 7) return 'medium';
  return 'hard';
}

/**
 * Berechnet Sets und Reps basierend auf Erfahrungslevel und Intensität.
 */
function calculateSetsReps(experience: ExperienceLevel, intensity: IntensityLevel): { sets: number; reps: string } {
  const baseSets = { beginner: 3, intermediate: 4, advanced: 5 };
  const repsMap = {
    beginner: { light: '8-10', medium: '6-8', hard: '5-6' },
    intermediate: { light: '10-12', medium: '8-10', hard: '6-8' },
    advanced: { light: '12-15', medium: '10-12', hard: '8-10' },
  };

  return {
    sets: baseSets[experience],
    reps: repsMap[experience][intensity],
  };
}

/**
 * Wählt Übungen basierend auf Template aus.
 */
function selectExercises(template: QuestTemplate): Exercise[] {
  const categories = Object.keys(EXERCISE_POOL);
  const selectedExercises: Exercise[] = [];

  for (const muscle of template.targetMuscles) {
    for (const category of categories) {
      const pool = EXERCISE_POOL[category].filter((ex) => ex.muscleGroup === muscle);
      if (pool.length > 0) {
        const randomExercise = pool[Math.floor(Math.random() * pool.length)];
        const { sets, reps } = calculateSetsReps('intermediate', 'medium');
        selectedExercises.push({ ...randomExercise, sets, reps });
        break;
      }
    }
  }

  // Fülle mit zufälligen Übungen auf, falls nicht genug gefunden
  while (selectedExercises.length < 4) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const pool = EXERCISE_POOL[randomCategory];
    const randomExercise = pool[Math.floor(Math.random() * pool.length)];
    const { sets, reps } = calculateSetsReps('intermediate', 'medium');
    if (!selectedExercises.find((ex) => ex.name === randomExercise.name)) {
      selectedExercises.push({ ...randomExercise, sets, reps });
    }
  }

  return selectedExercises.slice(0, 6);
}

/**
 * Generiert eine einzelne Quest für einen Tag.
 */
function generateDailyQuest(dayIndex: number, template: QuestTemplate, preferences: UserPreferences): Quest {
  const exercises = selectExercises(template);
  const intensity = determineIntensity(preferences.intensity);

  return {
    day: DAYS[dayIndex],
    dayIndex,
    title: template.title,
    description: template.description,
    exercises,
    duration: template.minDuration + Math.floor(Math.random() * (template.maxDuration - template.minDuration)),
    intensity,
    equipment: [...new Set(exercises.flatMap((ex) => (ex.name.includes('Klimmzug') ? ['Klimmzugstange'] : [])))],
    completed: false,
  };
}

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
 * Generiert einen vollständigen Wochenplan basierend auf Preferences.
 * Dies ist die Hauptfunktion des Local AI Services.
 */
export function generateWeeklyPlan(preferences: UserPreferences): WeeklyPlan {
  const templates = QUEST_TEMPLATES[preferences.fitnessGoal];
  const activeDays = preferences.includeWeekend ? 7 : 5;
  const quests: Quest[] = [];

  for (let i = 0; i < activeDays; i++) {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    quests.push(generateDailyQuest(i, randomTemplate, preferences));
  }

  return {
    weekNumber: 1,
    quests,
    totalDuration: quests.reduce((sum, q) => sum + q.duration, 0),
    createdAt: new Date(),
  };
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
