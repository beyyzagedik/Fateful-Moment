import { archetypes, blindSpots, traitLabels } from '@/data/archetypes';
import { scenarios } from '@/data/scenarios';
import { TRAITS, type Archetype, type DecisionRecord, type Trait, type TraitVector } from '@/types';

const BASELINE = 50;
/** How far one average decision moves a trait (impact ±10 → ±25 points). */
const SCALE = 2.5;
/** Running out of time is a choice too: it reads as hesitation. */
const TIMEOUT_IMPACT: Partial<TraitVector> = { control: -8, courage: -6 };

export type DnaProfile = {
  scores: TraitVector;
  archetype: Archetype;
  match: number; // 0–100 similarity to the archetype target
  patterns: string[];
  blindSpot: { trait: Trait; label: string; question: string; text: string };
  decisionsCount: number;
  scenariosCount: number;
  avgResponseSec: number;
  timeouts: number;
};

const emptyVector = (): TraitVector =>
  Object.fromEntries(TRAITS.map((t) => [t, 0])) as TraitVector;

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function impactFor(record: DecisionRecord): Partial<TraitVector> {
  if (record.optionId === null) return TIMEOUT_IMPACT;
  const scenario = scenarios.find((s) => s.id === record.scenarioId);
  const decision = scenario?.decisions.find((d) => d.id === record.decisionId);
  return decision?.options.find((o) => o.id === record.optionId)?.impact ?? {};
}

export function computeScores(records: DecisionRecord[]): TraitVector {
  const sum = emptyVector();
  for (const record of records) {
    const impact = impactFor(record);
    for (const t of TRAITS) sum[t] += impact[t] ?? 0;
  }
  const n = Math.max(records.length, 1);
  const scores = emptyVector();
  for (const t of TRAITS) scores[t] = clamp(BASELINE + (sum[t] / n) * SCALE);
  return scores;
}

function distance(a: TraitVector, b: TraitVector) {
  return Math.sqrt(TRAITS.reduce((acc, t) => acc + (a[t] - b[t]) ** 2, 0));
}

export function matchArchetype(scores: TraitVector): { archetype: Archetype; match: number } {
  let best = archetypes[0];
  let bestDist = Infinity;
  for (const a of archetypes) {
    const d = distance(scores, a.target);
    if (d < bestDist) {
      best = a;
      bestDist = d;
    }
  }
  const maxDist = Math.sqrt(TRAITS.length * 100 ** 2);
  return { archetype: best, match: clamp(100 - (bestDist / maxDist) * 100 * 2) };
}

const sortedTraits = (scores: TraitVector) => [...TRAITS].sort((a, b) => scores[b] - scores[a]);

function buildPatterns(scores: TraitVector, records: DecisionRecord[]): string[] {
  const [top, second] = sortedTraits(scores);
  const patterns: string[] = [];

  const timed = records.filter((r) => r.optionId !== null);
  const avg = timed.length ? timed.reduce((a, r) => a + r.responseMs, 0) / timed.length / 1000 : 0;
  const timeouts = records.length - timed.length;

  if (avg > 0 && avg < 6) {
    patterns.push(
      `You are not afraid to take action under pressure. You decide in ${avg.toFixed(1)}s on average — while others hesitate, you have already taken a step.`,
    );
  } else if (avg >= 6) {
    patterns.push(
      `You take your time under pressure (${avg.toFixed(1)}s on average). You prefer understanding the situation over reacting to it.`,
    );
  }

  patterns.push(
    `${traitLabels[top]} and ${traitLabels[second].toLowerCase()} drive most of your choices. They are the first lens you look through when the clock is ticking.`,
  );

  if (scores.risk >= 60 && scores.control < 55) {
    patterns.push('You accept big risks even when the plan is not fully under control. It works in the short term — but creates exposure in the long term.');
  } else if (scores.ethics < 45) {
    patterns.push('When ethics conflict with interests, your tendency is clear: you choose the interest. This pattern repeats across scenarios.');
  } else if (scores.empathy >= 60) {
    patterns.push('You consistently weigh the human cost of a decision, even when it slows you down.');
  } else {
    patterns.push('You look for the middle path: few extremes, few regrets.');
  }

  const result = patterns.slice(0, 3);
  if (timeouts > 0) {
    // Hesitation is the most telling signal, so it takes the last slot.
    result[2] = `The clock ran out ${timeouts} time${timeouts > 1 ? 's' : ''}. In a real crisis, indecision is also a decision.`;
  }
  return result;
}

export function buildProfile(records: DecisionRecord[]): DnaProfile | null {
  if (records.length === 0) return null;
  const scores = computeScores(records);
  const { archetype, match } = matchArchetype(scores);
  const weakest = sortedTraits(scores)[TRAITS.length - 1];
  const timed = records.filter((r) => r.optionId !== null);

  return {
    scores,
    archetype,
    match,
    patterns: buildPatterns(scores, records),
    blindSpot: { trait: weakest, label: traitLabels[weakest], ...blindSpots[weakest] },
    decisionsCount: records.length,
    scenariosCount: new Set(records.map((r) => r.scenarioId)).size,
    avgResponseSec: timed.length ? timed.reduce((a, r) => a + r.responseMs, 0) / timed.length / 1000 : 0,
    timeouts: records.length - timed.length,
  };
}
