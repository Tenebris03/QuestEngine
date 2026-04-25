/**
 * Local AI Service mit WebLLM.
 * Nutzt ein lokales LLM für die Quest-Generierung.
 * Läuft komplett client-side im Browser.
 */

import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';
import type {
  UserPreferences,
  WeeklyPlan,
  AIProgress,
  AIGenerationResult,
  Quest,
  Exercise,
  IntensityLevel,
} from '../QuestGenerator.types';

const MODEL_NAME = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

let engine: MLCEngine | null = null;
let modelLoading = false;
let lastError: string | null = null;

/**
 * Prüft, ob das KI-Modell bereits geladen ist.
 */
export function isModelLoaded(): boolean {
  return engine !== null;
}

/**
 * Prüft, ob WebGPU verfügbar ist (Hardware-Beschleunigung).
 */
export function isWebGPUAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

/**
 * Gibt die letzte Fehlermeldung zurück.
 */
export function getLastError(): string | null {
  return lastError;
}

/**
 * Setzt den Engine-Status zurück für Retry.
 */
export function resetEngine(): void {
  engine = null;
  modelLoading = false;
  lastError = null;
}

/**
 * Initialisiert das KI-Modell asynchron.
 * @param onProgress - Callback für Lade-Fortschritt
 * @returns true wenn erfolgreich, false bei Fehler
 */
export async function initModel(
  onProgress?: (progress: AIProgress) => void,
): Promise<boolean> {
  if (engine !== null) return true;
  if (modelLoading) return false;

  // Prüfe WebGPU-Verfügbarkeit
  if (!isWebGPUAvailable()) {
    lastError = 'WebGPU ist in diesem Browser nicht verfügbar. Bitte verwenden Sie Chrome oder Edge in der neuesten Version.';
    console.warn(lastError);
    onProgress?.({
      status: 'error',
      message: lastError,
      percent: 0,
    });
    return false;
  }

  modelLoading = true;
  lastError = null;
  onProgress?.({
    status: 'loading_model',
    message: 'KI-Modell wird initialisiert...',
    percent: 5,
  });

  try {
    engine = await CreateMLCEngine(MODEL_NAME, {
      initProgressCallback: (progress: { progress: number; text: string }) => {
        const percent = Math.round(progress.progress * 100);
        onProgress?.({
          status: 'loading_model',
          message: progress.text || `Modell wird geladen... ${percent}%`,
          percent: 5 + percent * 0.9,
        });
      },
    });

    onProgress?.({
      status: 'ready',
      message: 'KI-Modell bereit!',
      percent: 100,
    });
    modelLoading = false;
    return true;
  } catch (error) {
    lastError = error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden des KI-Modells';
    console.error('Fehler beim Laden des KI-Modells:', error);
    onProgress?.({
      status: 'error',
      message: lastError,
      percent: 0,
    });
    modelLoading = false;
    return false;
  }
}

/**
 * Ermittelt die Intensität basierend auf User-Preference.
 */
function determineIntensity(intensityValue: number): IntensityLevel {
  if (intensityValue <= 3) return 'light';
  if (intensityValue <= 7) return 'medium';
  return 'hard';
}

/**
 * Baut den Prompt für das KI-Modell basierend auf User-Preferences.
 */
function buildPrompt(prefs: UserPreferences): string {
  const goalMap: Record<string, string> = {
    strength: 'Kraftaufbau',
    endurance: 'Ausdauer',
    weightloss: 'Gewichtsverlust',
    muscle: 'Muskelaufbau',
  };

  const levelMap: Record<string, string> = {
    beginner: 'Anfänger',
    intermediate: 'Fortgeschritten',
    advanced: 'Experte',
  };

  const days = prefs.includeWeekend ? 7 : 5;
  const intensity = prefs.intensity <= 3 ? 'leicht' : prefs.intensity <= 7 ? 'mittel' : 'hart';

  return `Erstelle einen ${days}-Tage Trainingsplan für ${goalMap[prefs.fitnessGoal]}.
Level: ${levelMap[prefs.experienceLevel]}
Zeit: ${prefs.availableTime} Minuten pro Tag
Intensität: ${intensity}
Equipment: ${prefs.equipment.join(', ')}

Gib den Plan als JSON aus mit dieser exakten Struktur:
{
  "quests": [
    {
      "day": "Montag",
      "dayIndex": 0,
      "title": "Name des Trainings",
      "description": "Beschreibung des Trainings",
      "exercises": [
        {
          "name": "Übungsname",
          "sets": 3,
          "reps": "8-12",
          "restSeconds": 60,
          "muscleGroup": "Muskelgruppe"
        }
      ],
      "duration": 45,
      "intensity": "medium",
      "equipment": ["Equipment1"]
    }
  ]
}

Wichtig:
- Erstelle genau ${days} Quests (eine pro Tag: Montag${days > 5 ? ' bis Sonntag' : ' bis Freitag'})
- Intensität muss "light", "medium" oder "hard" sein
- Dauer sollte ca. ${prefs.availableTime} Minuten betragen
- Nutze nur das angegebene Equipment
- Antworte NUR mit dem JSON, keine zusätzlichen Erklärungen`;
}

/**
 * Parst die KI-Ausgabe in einen WeeklyPlan.
 * Fallback auf null bei unparsebarer Ausgabe.
 */
function parseAIOutput(output: string, prefs: UserPreferences): WeeklyPlan | null {
  try {
    // Extrahiere JSON aus der Antwort (falls das Modell Markdown-Codeblöcke verwendet)
    const jsonMatch = output.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || output.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : output;

    const parsed = JSON.parse(jsonStr);

    if (!parsed.quests || !Array.isArray(parsed.quests)) {
      return null;
    }

    const days = prefs.includeWeekend ? 7 : 5;
    const quests: Quest[] = parsed.quests.slice(0, days).map((q: any, index: number) => ({
      day: q.day || DAYS[index],
      dayIndex: q.dayIndex ?? index,
      title: q.title || `Training ${index + 1}`,
      description: q.description || `KI-generiertes Training für ${prefs.fitnessGoal}`,
      exercises: (q.exercises || []).map((ex: any) => ({
        name: ex.name || 'Unbekannte Übung',
        sets: ex.sets || 3,
        reps: ex.reps || '8-12',
        restSeconds: ex.restSeconds || 60,
        muscleGroup: ex.muscleGroup || 'Allgemein',
      })),
      duration: q.duration || prefs.availableTime,
      intensity: (q.intensity || determineIntensity(prefs.intensity)) as IntensityLevel,
      equipment: q.equipment || [...prefs.equipment],
      completed: false,
    }));

    // Fülle fehlende Tage auf
    while (quests.length < days) {
      quests.push(createFallbackQuest(quests.length, prefs));
    }

    return {
      weekNumber: 1,
      quests,
      totalDuration: quests.reduce((sum, q) => sum + q.duration, 0),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Fehler beim Parsen der KI-Ausgabe:', error);
    return null;
  }
}

/**
 * Erstellt einen Fallback-Quest für fehlende Tage.
 */
function createFallbackQuest(dayIndex: number, prefs: UserPreferences): Quest {
  return {
    day: DAYS[dayIndex],
    dayIndex,
    title: `Training ${dayIndex + 1}`,
    description: 'Automatisch generiert',
    exercises: [
      {
        name: 'Freies Training',
        sets: 3,
        reps: '10-12',
        restSeconds: 60,
        muscleGroup: 'Allgemein',
      },
    ],
    duration: prefs.availableTime,
    intensity: determineIntensity(prefs.intensity),
    equipment: [...prefs.equipment],
    completed: false,
  };
}

/**
 * Erstellt einen algorithmischen Plan als Fallback.
 * Nutzt komplexere Logik als reines Random.
 */
function createAlgorithmicPlan(prefs: UserPreferences): WeeklyPlan {
  const exercisePool: Record<string, Exercise[]> = {
    push: [
      { name: 'Liegestütze', sets: 3, reps: '8-12', restSeconds: 60, muscleGroup: 'Brust' },
      { name: 'Diamant-Liegestütze', sets: 3, reps: '6-10', restSeconds: 60, muscleGroup: 'Trizeps' },
      { name: 'Pike Push-ups', sets: 3, reps: '6-8', restSeconds: 90, muscleGroup: 'Schulter' },
      { name: 'Dips', sets: 3, reps: '8-10', restSeconds: 90, muscleGroup: 'Brust' },
    ],
    pull: [
      { name: 'Klimmzüge', sets: 4, reps: '5-8', restSeconds: 120, muscleGroup: 'Rücken' },
      { name: 'Australian Pull-ups', sets: 3, reps: '8-12', restSeconds: 90, muscleGroup: 'Rücken' },
      { name: 'Chin-ups', sets: 3, reps: '6-8', restSeconds: 120, muscleGroup: 'Bizeps' },
      { name: 'Superman Holds', sets: 3, reps: '30s', restSeconds: 60, muscleGroup: 'Rücken' },
    ],
    legs: [
      { name: 'Kniebeugen', sets: 4, reps: '8-10', restSeconds: 120, muscleGroup: 'Beine' },
      { name: 'Ausfallschritte', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Beine' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '8-10', restSeconds: 120, muscleGroup: 'Beine' },
      { name: 'Wadenheben', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Waden' },
    ],
    core: [
      { name: 'Plank', sets: 3, reps: '45s', restSeconds: 60, muscleGroup: 'Core' },
      { name: 'Mountain Climbers', sets: 3, reps: '20', restSeconds: 45, muscleGroup: 'Core' },
      { name: 'Leg Raises', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Core' },
      { name: 'Russian Twists', sets: 3, reps: '20', restSeconds: 45, muscleGroup: 'Core' },
    ],
    cardio: [
      { name: 'Burpees', sets: 4, reps: '10', restSeconds: 60, muscleGroup: 'Ganzkörper' },
      { name: 'Jumping Jacks', sets: 3, reps: '30', restSeconds: 30, muscleGroup: 'Ganzkörper' },
      { name: 'High Knees', sets: 3, reps: '30', restSeconds: 30, muscleGroup: 'Beine' },
      { name: 'Sprint on Spot', sets: 4, reps: '20', restSeconds: 45, muscleGroup: 'Beine' },
    ],
  };

  const goalSplit: Record<string, string[][]> = {
    strength: [['push', 'pull'], ['legs', 'core'], ['push', 'core'], ['pull', 'legs'], ['cardio', 'core']],
    endurance: [['cardio', 'core'], ['cardio', 'legs'], ['cardio', 'core'], ['cardio', 'pull'], ['cardio', 'push']],
    weightloss: [['cardio', 'legs'], ['cardio', 'core'], ['cardio', 'push'], ['cardio', 'pull'], ['cardio', 'legs']],
    muscle: [['push', 'legs'], ['pull', 'core'], ['push', 'legs'], ['pull', 'legs'], ['push', 'pull']],
  };

  const days = prefs.includeWeekend ? 7 : 5;
  const split = goalSplit[prefs.fitnessGoal] || goalSplit.strength;
  const quests: Quest[] = [];

  for (let i = 0; i < days; i++) {
    const daySplit = split[i % split.length];
    const selectedExercises: Exercise[] = [];

    for (const category of daySplit) {
      const pool = exercisePool[category];
      if (pool) {
        const randomExercise = pool[Math.floor(Math.random() * pool.length)];
        selectedExercises.push({ ...randomExercise });
      }
    }

    // Fülle auf, falls nicht genug Übungen
    const allExercises = Object.values(exercisePool).flat();
    while (selectedExercises.length < 4) {
      const randomEx = allExercises[Math.floor(Math.random() * allExercises.length)];
      if (!selectedExercises.find((e) => e.name === randomEx.name)) {
        selectedExercises.push({ ...randomEx });
      }
    }

    const intensity = determineIntensity(prefs.intensity);
    const duration = Math.min(prefs.availableTime, 30 + selectedExercises.length * 12);

    quests.push({
      day: DAYS[i],
      dayIndex: i,
      title: `${daySplit.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ')} Training`,
      description: `Algorithmisch generiert für ${prefs.fitnessGoal}`,
      exercises: selectedExercises.slice(0, 6),
      duration,
      intensity,
      equipment: [...prefs.equipment],
      completed: false,
    });
  }

  return {
    weekNumber: 1,
    quests,
    totalDuration: quests.reduce((sum, q) => sum + q.duration, 0),
    createdAt: new Date(),
  };
}

/**
 * Generiert einen Wochenplan mit KI-Unterstützung.
 * Fallback auf algorithmische Generierung wenn KI nicht verfügbar oder fehlschlägt.
 */
export async function generatePlanWithAI(
  prefs: UserPreferences,
  onProgress?: (progress: AIProgress) => void,
): Promise<AIGenerationResult> {
  // Versuche KI-Modell zu laden falls noch nicht geladen
  if (engine === null && !modelLoading) {
    const loaded = await initModel(onProgress);
    if (!loaded) {
      // Fallback: Algorithmische Generierung
      onProgress?.({
        status: 'ready',
        message: 'Plan mit lokalem Algorithmus erstellt.',
        percent: 100,
      });
      const plan = createAlgorithmicPlan(prefs);
      return { plan, generatedBy: 'template' };
    }
  }

  // Versuche KI-Generierung wenn Modell geladen
  if (engine !== null) {
    onProgress?.({
      status: 'generating',
      message: 'Trainingsplan wird generiert...',
      percent: 0,
    });

    try {
      const prompt = buildPrompt(prefs);

      const messages = [
        {
          role: 'system' as const,
          content: 'Du bist ein professioneller Fitness-Trainer. Erstelle personalisierte Trainingspläne im JSON-Format. Antworte NUR mit gültigem JSON, keine zusätzlichen Erklärungen.',
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ];

      const reply = await engine.chat.completions.create({
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      });

      const generatedText = reply.choices[0].message.content || '';

      onProgress?.({
        status: 'generating',
        message: 'Plan wird verarbeitet...',
        percent: 70,
      });

      const plan = parseAIOutput(generatedText, prefs);
      if (plan) {
        onProgress?.({
          status: 'ready',
          message: 'Trainingsplan fertig!',
          percent: 100,
        });
        return { plan, generatedBy: 'ai', modelName: MODEL_NAME };
      }
    } catch (error) {
      console.error('KI-Generierung fehlgeschlagen:', error);
    }
  }

  // Fallback: Algorithmische Generierung
  onProgress?.({
    status: 'ready',
    message: 'Plan mit lokalem Algorithmus erstellt.',
    percent: 100,
  });

  const plan = createAlgorithmicPlan(prefs);
  return { plan, generatedBy: 'template' };
}
