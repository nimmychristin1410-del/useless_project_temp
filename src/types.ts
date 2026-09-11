export type ScreenStep = 'welcome' | 'customizer' | 'checklist' | 'analyzing' | 'results' | 'wheel';

export type IncidentCategory = 'serious' | 'lowkey' | 'romance' | 'work' | 'social';

export interface IncidentFormData {
  incidentText: string;
  category: IncidentCategory;
  actor: string;
  timeElapsed: string;
  initialPanic: number;
  triggerType: string;
}

export interface TranslationRow {
  actualEvent: string;
  brainInterpretation: string;
  dangerRating: string;
}

export interface TimelineItem {
  title: string;
  probability: string;
  description: string;
}

export interface BrainAllocationSlice {
  label: string;
  percentage: number;
  color: string;
}

export interface MicroAuditItem {
  clue: string;
  overthinkingObsession: string;
  rationalVerdict: string;
}

export interface IncidentAnalysisResult {
  incidentTitle: string;
  caseNumber: string;
  severityLabel: string;
  panicScore: number;
  executiveDiagnosis: string;
  translationMatrix: TranslationRow[];
  threeTimelines: {
    reality: TimelineItem;
    paranoid: TimelineItem;
    apocalyptic: TimelineItem;
  };
  brainAllocation: BrainAllocationSlice[];
  microAudit: MicroAuditItem[];
  certifiedPrescription: string;
  recommendedWheelOptions: string[];
  humorousNotes: string[];
}
