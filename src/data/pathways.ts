/**
 * Ways to move through the atlas. A pathway shows where THIS ATLAS has material. It never means that a
 * culture stops at an administrative boundary or exists only in the areas listed.
 */
import { ADMIN, CONTENT_LINKS } from './atlas';
import { LANDMARKS, type LandmarkCategory } from './landmarks';
import { AREA_LANGUAGES } from './media';
import { regionById, type TopicKey } from './regions';
import type { Section } from './landmarks';

export const ZONES: { id: string; name: string; areas: string[] }[] = [
  { id: 'timur', name: 'Pesisir timur dan Medan', areas: ['langkat', 'kota-binjai', 'kota-medan', 'deli-serdang', 'serdang-bedagai', 'kota-tebing-tinggi', 'batu-bara', 'asahan', 'kota-tanjungbalai', 'labuhanbatu-utara', 'labuhanbatu', 'labuhanbatu-selatan'] },
  { id: 'toba', name: 'Dataran tinggi dan sekitar Danau Toba', areas: ['karo', 'dairi', 'pakpak-bharat', 'simalungun', 'kota-pematangsiantar', 'samosir', 'toba', 'humbang-hasundutan', 'tapanuli-utara'] },
  { id: 'barat', name: 'Pantai barat dan Tapanuli bagian selatan', areas: ['tapanuli-tengah', 'kota-sibolga', 'tapanuli-selatan', 'kota-padangsidimpuan', 'mandailing-natal', 'padang-lawas', 'padang-lawas-utara'] },
  { id: 'nias', name: 'Kepulauan Nias', areas: ['nias-utara', 'nias-barat', 'kota-gunungsitoli', 'nias', 'nias-selatan'] },
];

export const zoneOf = (id: string) => ZONES.find((z) => z.areas.includes(id))!;

const hasMaterial = (id: string, own: Section[], topics: TopicKey[]) =>
  own.some((k) => LANDMARKS[id].facts[k]?.length) || (CONTENT_LINKS[id] ?? []).some((c) => topics.some((k) => regionById(c)?.topics[k]?.length));

const inCategory = (...list: LandmarkCategory[]) => (id: string) => list.includes(LANDMARKS[id].category);

const theme = (id: string, name: string, about: string, test: (area: string) => boolean) => ({ id, name, about, areas: ADMIN.map((d) => d.id).filter(test) });

export const THEMES = [
  theme('arsitektur', 'Bangunan dan arsitektur', 'Rumah adat, rumah ibadah, istana, dan bangunan bersejarah yang dipilih sebagai landmark.', inCategory('Arsitektur adat', 'Bangunan bersejarah', 'Tempat ibadah')),
  theme('situs', 'Situs dan koleksi', 'Candi, megalit, patung batu, benteng, makam tua, dan museum.', inCategory('Situs arkeologi', 'Museum')),
  theme('kuliner', 'Kuliner dan hasil bumi', 'Wilayah yang sudah punya materi makanan atau hasil bumi di atlas ini.', (id) => hasMaterial(id, ['culinary'], ['food'])),
  theme('seni', 'Seni, musik, dan kerajinan', 'Wilayah yang sudah punya materi kesenian atau kerajinan, termasuk dari materi komunitas terkait.', (id) => hasMaterial(id, ['arts'], ['crafts']) || inCategory('Seni pertunjukan', 'Kerajinan')(id)),
  theme('cerita', 'Cerita dan penuturan', 'Wilayah dengan cerita rakyat atau penuturan tradisi yang diberi label terpisah dari sejarah.', (id) =>
    [...Object.values(LANDMARKS[id].facts).flat(), ...(CONTENT_LINKS[id] ?? []).flatMap((c) => regionById(c)?.topics.stories ?? [])].some((f) => f.kind === 'folklore' || f.kind === 'tradition') ),
  theme('bahasa', 'Dengar bahasa', 'Halaman yang menyediakan rekaman pelafalan dari penutur bahasa komunitas terkait.', (id) => !!AREA_LANGUAGES[id]),
  theme('alam', 'Bentang alam dan transportasi', 'Landmark berupa air terjun dan sungai, atau kendaraan warisan.', inCategory('Warisan alam', 'Warisan transportasi', 'Kehidupan pesisir')),
];

export const themeById = (id: string | null) => THEMES.find((t) => t.id === id);
