import type { ImageSourcePropType } from 'react-native';
import type { VideoSource } from 'expo-video';

/** The six axes shown on the DNA "Psychological Matrix" radar. */
export const TRAITS = ['vision', 'courage', 'risk', 'control', 'empathy', 'ethics'] as const;
export type Trait = (typeof TRAITS)[number];
export type TraitVector = Record<Trait, number>;

export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
};

/** One visual beat of the intro when no video file is bundled. */
export type Scene = {
  caption: string;
  durationMs: number;
  tint: [string, string];
};

export type DecisionOption = {
  id: string;
  label: string;
  /** Hidden per-trait effect, roughly -10…+10. */
  impact: Partial<TraitVector>;
  /** Shown after the choice is locked in. */
  outcome: string;
  outcomeVideo?: VideoSource;
};

export type Decision = {
  id: string;
  prompt: string;
  timeLimitSec: number;
  options: DecisionOption[];
};

export type Scenario = {
  id: string;
  categoryId: string;
  title: string;
  year: number;
  teaser: string;
  role: string;
  durationLabel: string;
  tint: [string, string];
  cover?: ImageSourcePropType;
  video?: VideoSource;
  /** Still image shown behind the options while the user decides. */
  decisionBackdrop?: ImageSourcePropType;
  scenes: Scene[];
  decisions: Decision[];
  available: boolean;
};

export type DecisionRecord = {
  scenarioId: string;
  decisionId: string;
  optionId: string | null; // null = time ran out
  responseMs: number;
  at: number;
};

export type Archetype = {
  id: number;
  code: string;
  nameTr: string;
  nameEn: string;
  quote: string;
  description: string;
  target: TraitVector;
  portrait?: ImageSourcePropType;
  /** Extra variants from Figma (e.g. "-Girl", "-Boy"). */
  altPortraits?: ImageSourcePropType[];
};
