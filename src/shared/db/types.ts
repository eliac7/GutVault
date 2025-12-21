// Bristol Stool Scale (Types 1-7)
export type BristolType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Pain Level (1-10)
export type PainLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Common symptoms for IBS
export type Symptom =
  | "bloating"
  | "cramping"
  | "gas"
  | "nausea"
  | "urgency"
  | "incomplete_evacuation"
  | "constipation"
  | "diarrhea"
  | "fatigue"
  | "anxiety"
  | "headache"
  | "back_pain";

// Common trigger foods
export type TriggerFood =
  | "dairy"
  | "gluten"
  | "caffeine"
  | "alcohol"
  | "spicy"
  | "fatty"
  | "beans"
  | "onions"
  | "garlic"
  | "artificial_sweeteners"
  | "carbonated_drinks"
  | "processed_foods";

// Log entry type
export type LogType = "bowel_movement" | "meal" | "symptom" | "medication";

// Main log entry interface
export interface LogEntry {
  id?: number;
  type: LogType;
  timestamp: Date;

  bristolType?: BristolType;
  painLevel?: PainLevel;
  symptoms?: Symptom[];

  foods?: string[];
  triggerFoods?: TriggerFood[];

  medication?: string;
  medicationDose?: string;

  notes?: string;

  aiGenerated?: boolean;
  rawTranscript?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type NewLogEntry = Omit<LogEntry, "id" | "createdAt" | "updatedAt">;

export const BRISTOL_DESCRIPTIONS: Record<
  BristolType,
  { label: string; description: string }
> = {
  1: { label: "Type 1", description: "Separate hard lumps" },
  2: { label: "Type 2", description: "Lumpy, sausage-shaped" },
  3: { label: "Type 3", description: "Sausage with cracks" },
  4: { label: "Type 4", description: "Smooth, soft sausage" },
  5: { label: "Type 5", description: "Soft blobs with edges" },
  6: { label: "Type 6", description: "Fluffy, mushy pieces" },
  7: { label: "Type 7", description: "Watery, no solid" },
};

// Symptom labels for UI
export const SYMPTOM_LABELS: Record<Symptom, string> = {
  bloating: "Bloating",
  cramping: "Cramping",
  gas: "Gas",
  nausea: "Nausea",
  urgency: "Urgency",
  incomplete_evacuation: "Incomplete",
  constipation: "Constipation",
  diarrhea: "Diarrhea",
  fatigue: "Fatigue",
  anxiety: "Anxiety",
  headache: "Headache",
  back_pain: "Back Pain",
};

// Trigger food labels for UI
export const TRIGGER_FOOD_LABELS: Record<TriggerFood, string> = {
  dairy: "Dairy",
  gluten: "Gluten",
  caffeine: "Caffeine",
  alcohol: "Alcohol",
  spicy: "Spicy Food",
  fatty: "Fatty Food",
  beans: "Beans",
  onions: "Onions",
  garlic: "Garlic",
  artificial_sweeteners: "Sweeteners",
  carbonated_drinks: "Carbonated",
  processed_foods: "Processed",
};

export interface AppSetting {
  id: string; // key, e.g., 'reminderEnabled', 'reminderTime'
  value: unknown;
}

export interface CachedFood {
  name: string;
  status: "low" | "medium" | "high";
  category?: string;
  notes?: string;
  createdAt: Date;
}
