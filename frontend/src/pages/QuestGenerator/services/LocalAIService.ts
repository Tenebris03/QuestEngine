/**
 * Local AI Service mit Transformers.js.
 * Nutzt ein kleines Text2Text-Modell für die Quest-Generierung.
 * Läuft komplett client-side im Browser und nutzt lokale Hardware.
 */

import { pipeline } from '@xenova/transformers';
import type {
  UserPreferences,
  WeeklyPlan,
  AIProgress,
  AIGenerationResult,
  Quest,
  Exercise,
  IntensityLevel,
} from '../QuestGenerator.types';

const MODEL_NAME = 'Xenova/LaMini-Flan-T5-248M';
const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

let generatorPipeline: any = null;
let modelLoading = false;

/**
 * Prüft, ob das KI-Modell bereits geladen ist.
 */
export function isModelLoaded(): boolean {
  return generatorPipeline !== null;
}

/**
 * Prüft, ob WebGPU verfügbar ist (Hardware-Beschleunigung).
 */
export function isWebGPUAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

/**
 * Initialisiert das KI-Modell asynchron.
 * @param onProgress - Callback für Lade-Fortschritt
 * @returns true wenn erfolgreich, false bei Fehler
 */
export async function initModel(
  onProgress?: (progress: AIProgress) => void,
): Promise<boolean> {
  if (generatorPipeline !== null) return true;
  if (modelLoading) return false;

  modelLoading = true;
  onProgress?.({
    status: 'loading_model',
    message: 'KI-Modell wird initialisiert...',
    percent: 5,
  });

  try {
    generatorPipeline = await pipeline('text2text-generation', MODEL_NAME, {
      quantized: true,
      revision: 'main',
      progress_callback: (progress: any) => {
        if (progress.status === 'progress') {
          const percent = Math.round(progress.progress * 100);
          onProgress?.({
            status: 'loading_model',
            message: `Modell wird geladen... ${percent}%`,
            percent: 5 + percent * 0.9,
          });
        }
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
    console.error('Fehler beim Laden des KI-Modells:', error);
    onProgress?.({
      status: 'error',
      message: 'Fehler beim Laden des KI-Modells. Fallback wird genutzt.',
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

Gib den Plan im folgenden Format aus:
Tag: [Wochentag]
Titel: [Name des Trainings]
Dauer: [XX] Minuten
Intensität: [leicht/mittel/hart]
Übungen:
1. [Name] - [Sets] Sets x [Reps] Reps
2. [Name] - [Sets] Sets x [Reps] Reps`;
}

/**
 * Parst die KI-Ausgabe in einen WeeklyPlan.
 * Fallback auf null bei unparsebarer Ausgabe.
 */
function parseAIOutput(output: string, prefs: UserPreferences): WeeklyPlan | null {
  try {
    const days = prefs.includeWeekend ? 7 : 5;
    const quests: Quest[] = [];
    const lines = output.split('\n').filter((l) => l.trim());

    let currentQuest: Partial<Quest> | null = null;
    let currentExercises: Exercise[] = [];
    let dayCounter = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 2) continue;

      // Neuer Tag erkannt
      if (/^Tag\s*[:.\s]/i.test(trimmed) && dayCounter < days) {
        if (currentQuest && currentExercises.length > 0) {
          quests.push(finalizeQuest(currentQuest, currentExercises, dayCounter, prefs));
          dayCounter++;
        }
        const titleMatch = trimmed.match(/Tag\s*[:.\s]*(.+)/i);
        currentQuest = {
          title: titleMatch?.[1]?.trim() || `Training ${dayCounter + 1}`,
        };
        currentExercises = [];
        continue;
      }

      // Wochentag erkannt (Montag, Dienstag, etc.)
      if (/^(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\s*[:.\s]/i.test(trimmed)) {
        if (currentQuest && currentExercises.length > 0 && dayCounter < days) {
          quests.push(finalizeQuest(currentQuest, currentExercises, dayCounter, prefs));
          dayCounter++;
        }
        const titleMatch = trimmed.match(/^(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\s*[:.\s]*(.+)/i);
        currentQuest = {
          title: titleMatch?.[1]?.trim() || `Training ${dayCounter + 1}`,
        };
        currentExercises = [];
        continue;
      }

      // Übung erkannt (verschiedene Formate)
      const exerciseMatch = trimmed.match(/^[\d\-\*\.]+\s*([^:-]+)(?::\s*|-\s*)(\d+)\s*(?:Sets?)?\s*[x*]\s*([^\n]+)/i);
      if (exerciseMatch && currentQuest) {
        const [, name, setsStr, repsStr] = exerciseMatch;
        currentExercises.push({
          name: name.trim(),
          sets: parseInt(setsStr, 10) || 3,
          reps: repsStr.trim(),
          restSeconds: 60,
          muscleGroup: 'Allgemein',
        });
        continue;
      }

      // Dauer erkannt
      const durationMatch = trimmed.match(/Dauer[:\s]*(\d+)\s*Min/i);
      if (durationMatch && currentQuest) {
        currentQuest.duration = parseInt(durationMatch[1], 10);
      }

      // Intensität erkannt
      const intensityMatch = trimmed.match(/Intensität[:\s]*(leicht|mittel|hart)/i);
      if (intensityMatch && currentQuest) {
        currentQuest.intensity = intensityMatch[1].toLowerCase() as IntensityLevel;
      }

      // Titel erkannt
      const titleMatch = trimmed.match(/Titel[:\s]*(.+)/i);
      if (titleMatch && currentQuest) {
        currentQuest.title = titleMatch[1].trim();
      }
    }

    // Letzten Tag abschließen
    if (currentQuest && currentExercises.length > 0 && dayCounter < days) {
      quests.push(finalizeQuest(currentQuest, currentExercises, dayCounter, prefs));
      dayCounter++;
    }

    // Fülle fehlende Tage mit Fallback
    while (dayCounter < days) {
      quests.push(createFallbackQuest(dayCounter, prefs));
      dayCounter++;
    }

    if (quests.length === 0) return null;

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
 * Finalisiert einen Quest-Eintrag aus geparsten Daten.
 */
function finalizeQuest(
  partial: Partial<Quest>,
  exercises: Exercise[],
  dayIndex: number,
  prefs: UserPreferences,
): Quest {
  const intensity = partial.intensity || determineIntensity(prefs.intensity);
  return {
    day: DAYS[dayIndex],
    dayIndex,
    title: partial.title || `Training ${dayIndex + 1}`,
    description: `KI-generiertes Training für ${prefs.fitnessGoal}`,
    exercises,
    duration: partial.duration || prefs.availableTime,
    intensity,
    equipment: [...prefs.equipment],
    completed: false,
  };
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
 * Erstellt einen Prompt-basierten Plan ohne KI (Fallback-Algorithmus).
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
  // Versuche KI-Generierung wenn Modell geladen
  if (generatorPipeline !== null) {
    onProgress?.({
      status: 'generating',
      message: 'Trainingsplan wird generiert...',
      percent: 0,
    });

    try {
      const prompt = buildPrompt(prefs);
      const result = await generatorPipeline(prompt, {
        max_new_tokens: 512,
        temperature: 0.7,
        do_sample: true,
      });

      const generatedText = Array.isArray(result)
        ? result[0].generated_text
        : result.generated_text;

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
