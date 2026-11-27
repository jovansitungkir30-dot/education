import type { SourceId } from './sources';

export type Knowledge = 'history' | 'tradition' | 'folklore' | 'interpretation' | 'contemporary';

export const KNOWLEDGE: Record<Knowledge, { label: string; hint: string }> = {
  history: { label: 'Documented history', hint: 'Supported by records, research or physical evidence.' },
  tradition: { label: 'Cultural tradition', hint: 'Practice or custom held by a community. Details vary by place and family.' },
  folklore: { label: 'Folklore', hint: 'A told story. Valuable as culture, not a factual account.' },
  interpretation: { label: 'Interpretation', hint: 'A reading of meaning offered by researchers or practitioners.' },
  contemporary: { label: 'Contemporary practice', hint: 'How something is done or recognised today.' },
};

export interface Fact {
  text: string;
  kind: Knowledge;
  /** Empty means no source is attached yet; the interface says so. */
  sources: SourceId[];
}

export const fact = (kind: Knowledge, text: string, ...sources: SourceId[]): Fact => ({ kind, text, sources });
