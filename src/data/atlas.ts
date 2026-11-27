import raw from './geo/sumatera-utara.json';
import type { ProgressState } from '../lib/progress';

/** One administrative area. Boundaries: geoBoundaries IDN ADM2 (BPS, WFP, OCHA ROAP), 2020, simplified. */
export interface District {
  id: string;
  name: string;
  type: 'kabupaten' | 'kota' | 'air';
  /** polygons -> rings (first is outer, the rest are holes) -> [longitude, latitude] */
  polygons: number[][][][];
}

export const DISTRICTS = raw as District[];
/** The 25 regencies and 8 cities. Lake Toba is a water body and is not counted. */
export const ADMIN = DISTRICTS.filter((d) => d.type !== 'air');

export const districtById = (id: string | null) => DISTRICTS.find((d) => d.id === id);

export const fullName = (d: District) => (d.type === 'kabupaten' ? `Kabupaten ${d.name}` : d.type === 'kota' ? `Kota ${d.name}` : d.name);

/**
 * Links an area to cultural content. A link means the content is relevant there, NOT that the area has a
 * single culture or that the community lives only there. Areas without an entry are open research gaps.
 */
export const CONTENT_LINKS: Record<string, string[]> = {
  'danau-toba': ['lake-toba'],
  samosir: ['samosir', 'lake-toba'],
  toba: ['toba', 'lake-toba'],
  karo: ['karo'],
  simalungun: ['simalungun'],
  'mandailing-natal': ['mandailing'],
  'tapanuli-selatan': ['angkola'],
  'kota-padangsidimpuan': ['angkola'],
  'pakpak-bharat': ['pakpak'],
  dairi: ['pakpak'],
  'humbang-hasundutan': ['pakpak'],
  'tapanuli-tengah': ['pakpak'],
  'nias-selatan': ['nias'],
  nias: ['nias'],
  'nias-utara': ['nias'],
  'nias-barat': ['nias'],
  'kota-gunungsitoli': ['nias'],
  'kota-medan': ['medan'],
};

/** Preferred map area when a link names a community or place instead of an administrative area. */
export const HOME_DISTRICT: Record<string, string> = {
  'lake-toba': 'danau-toba', samosir: 'samosir', toba: 'toba', karo: 'karo', mandailing: 'mandailing-natal',
  angkola: 'tapanuli-selatan', pakpak: 'pakpak-bharat', simalungun: 'simalungun', nias: 'nias-selatan', medan: 'kota-medan',
};

export const visitedDistricts = (s: ProgressState) => ADMIN.filter((d) => s.visited.region.includes(d.id));
