/** Photos and recordings, with their provenance. Edit the JSON files to add or correct an item. */
import areaPhotos from './landmark-photos.json';
import audio from './audio.json';
import { CONTENT_LINKS } from './atlas';
import { photo } from './photos';
import { regionById } from './regions';

/** What a photograph actually shows in relation to the area it appears under. */
export type Relation = 'objek' | 'wilayah' | 'arsip' | 'ilustrasi' | 'komunitas';

export const RELATIONS: Record<Relation, { label: string; hint: string }> = {
  objek: { label: 'Objek yang dibahas', hint: 'Memperlihatkan landmark atau benda yang dibahas, atau bagiannya.' },
  wilayah: { label: 'Suasana wilayah', hint: 'Diambil di wilayah ini, tetapi bukan foto landmarknya.' },
  arsip: { label: 'Foto arsip', hint: 'Foto lama. Keadaan sekarang bisa sudah berbeda.' },
  ilustrasi: { label: 'Ilustrasi', hint: 'Subjeknya berkaitan, tetapi difoto di tempat lain atau tempatnya tidak diketahui.' },
  komunitas: { label: 'Materi komunitas', hint: 'Berasal dari halaman komunitas terkait. Belum tentu diambil di wilayah ini.' },
};

export interface MediaItem {
  file: string;
  alt: string;
  relation: Relation;
  /** Where the picture was taken, as far as it is known. */
  place?: string;
  /** 'koordinat': the file's GPS tag falls inside the area. 'keterangan': relies on the uploader's description. */
  verification: 'koordinat' | 'keterangan';
  author: string;
  license: string;
  licenseUrl: string;
  page: string;
  title?: string;
}

export const AREA_PHOTOS = areaPhotos as unknown as Record<string, MediaItem[]>;

/** An area's own photographs, then those of linked community pages, labelled as such. */
export function photosFor(id: string): MediaItem[] {
  const own = AREA_PHOTOS[id] ?? [];
  const linked = [...new Set((CONTENT_LINKS[id] ?? []).flatMap((c) => regionById(c)?.photos ?? []))];
  return [...own, ...linked.map((p) => ({ ...photo(p), relation: 'komunitas' as const, verification: 'keterangan' as const }))];
}

export interface Recording {
  word: string;
  file: string;
  speaker: string;
  author: string;
  license: string;
  licenseUrl: string;
  page: string;
}

export type Language = 'bbc' | 'btx' | 'btm' | 'nia';

export const LANGUAGES: Record<Language, string> = {
  bbc: 'Batak Toba',
  btx: 'Karo',
  btm: 'Mandailing',
  nia: 'Nias (Li Niha)',
};

export const RECORDINGS = audio as Record<Language, Recording[]>;

/** Languages of communities named on an area's page. A language is not confined to that area. */
export const AREA_LANGUAGES: Record<string, Language[]> = {
  samosir: ['bbc'], toba: ['bbc'], 'tapanuli-utara': ['bbc'], karo: ['btx'], 'mandailing-natal': ['btm'],
  nias: ['nia'], 'nias-selatan': ['nia'], 'nias-utara': ['nia'], 'nias-barat': ['nia'], 'kota-gunungsitoli': ['nia'],
};
