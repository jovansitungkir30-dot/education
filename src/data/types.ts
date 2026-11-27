import type { SourceId } from './sources';

export type Knowledge = 'history' | 'tradition' | 'folklore' | 'interpretation' | 'contemporary';

export const KNOWLEDGE: Record<Knowledge, { label: string; hint: string }> = {
  history: { label: 'Sejarah terdokumentasi', hint: 'Didukung catatan, penelitian, atau bukti fisik.' },
  tradition: { label: 'Tradisi budaya', hint: 'Praktik atau adat yang dipegang komunitas. Rinciannya berbeda menurut tempat dan keluarga.' },
  folklore: { label: 'Cerita rakyat', hint: 'Cerita tutur. Bernilai sebagai budaya, bukan catatan fakta.' },
  interpretation: { label: 'Penafsiran', hint: 'Pembacaan makna dari peneliti atau pelaku budaya.' },
  contemporary: { label: 'Praktik masa kini', hint: 'Bagaimana sesuatu dijalankan atau diakui saat ini.' },
};

export interface Fact {
  text: string;
  kind: Knowledge;
  /** Empty means no source is attached yet; the interface says so. */
  sources: SourceId[];
}

export const fact = (kind: Knowledge, text: string, ...sources: SourceId[]): Fact => ({ kind, text, sources });
