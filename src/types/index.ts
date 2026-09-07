// ============================================================================
// Core domain types for Cell Salts & Astrology Tracking
// ============================================================================

export type ZodiacId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type CellSaltId =
  | 'kali-phos'
  | 'nat-sulph'
  | 'kali-mur'
  | 'calc-fluor'
  | 'mag-phos'
  | 'kali-sulph'
  | 'nat-phos'
  | 'calc-sulph'
  | 'silicea'
  | 'calc-phos'
  | 'nat-mur'
  | 'ferr-phos';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface ZodiacSign {
  id: ZodiacId;
  name: string;
  symbol: string; // unicode glyph
  element: Element;
  dateRange: string;
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number;
  endDay: number;
  cellSaltId: CellSaltId;
  rulingPlanet: string;
}

export interface CellSalt {
  id: CellSaltId;
  chemicalName: string;
  commonName: string;
  abbreviation: string;
  zodiacId: ZodiacId;
  bodySystem: string[];
  rulingBodyPart: string;
  indications: string[];
  deficiencySymptoms: string[];
  dietarySources: string[];
  description: string;
  color: string; // accent color for UI theming
}

export type Potency = '3X' | '6X' | '12X' | '30X' | '6C' | '30C';

export type ReliefStatus =
  | 'completely_relieved'
  | 'moderate_relief'
  | 'slight_relief'
  | 'no_effect'
  | 'worse';

export interface FollowUpRating {
  id: string;
  ratedAt: string; // ISO date string
  intervalLabel: '2h' | '12h' | '24h' | 'custom';
  starRating: number; // 1-5
  reliefStatus: ReliefStatus;
  notes?: string;
}

export interface LogEntry {
  id: string;
  createdAt: string; // ISO date string
  symptoms: string[];
  cellSaltId: CellSaltId;
  potency: Potency;
  startDateTime: string; // ISO date string
  baselineSeverity: number; // 1-10
  followUps: FollowUpRating[];
  notes?: string;
}

export interface UserProfile {
  name?: string;
  birthDate?: string; // ISO date string
  sunSign?: ZodiacId;
  ascendant?: ZodiacId;
  moonSign?: ZodiacId;
  darkMode: boolean;
  hasSeenDisclaimer: boolean;
  notificationsEnabled: boolean;
}

export interface SaltEfficacyStat {
  cellSaltId: CellSaltId;
  totalUses: number;
  totalFollowUps: number;
  averageStars: number;
  successRate: number; // 0-100, percentage rated "completely_relieved" or "moderate_relief"
}

export const COMMON_SYMPTOMS: string[] = [
  'Headache',
  'Muscle Cramp',
  'Acidity / Heartburn',
  'Fatigue',
  'Anxiety',
  'Congestion',
  'Joint Pain',
  'Skin Irritation',
  'Insomnia',
  'Digestive Upset',
  'Nerve Pain',
  'Inflammation',
  'Dryness',
  'Slow-Healing Wound',
  'Emotional Imbalance',
];

export const POTENCIES: Potency[] = ['3X', '6X', '12X', '30X', '6C', '30C'];

export const RELIEF_STATUS_LABELS: Record<ReliefStatus, string> = {
  completely_relieved: 'Completely Relieved',
  moderate_relief: 'Moderate Relief',
  slight_relief: 'Slight Relief',
  no_effect: 'No Effect',
  worse: 'Felt Worse',
};
