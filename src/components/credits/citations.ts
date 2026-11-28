import { createContext } from 'react';
import type { SourceId } from '../../data/sources';

/** Inside a page that collects its references, a citation is a small number that opens the shared panel. */
export interface Citations {
  number: (id: SourceId) => number;
  open: (id?: SourceId) => void;
}

export const CitationContext = createContext<Citations | null>(null);
