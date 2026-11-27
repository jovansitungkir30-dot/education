import raw from './photos.json';

export type PhotoId = keyof typeof raw;

/** Alt text written for this site. Author and licence come from Wikimedia Commons metadata (photos.json). */
const ALT: Record<PhotoId, string> = {
  'toba-panorama': 'Panorama Danau Toba dilihat dari pantai di Samosir',
  'samosir-ferry': 'Pulau Samosir dilihat dari kapal feri menuju Tomok',
  'gorga-house': 'Rumah Batak Toba berhias ukiran gorga di Lumban Lontung, Samosir',
  'ulos-weaving': 'Seorang penenun membuat ulos dengan alat tenun tradisional',
  'ulos-museum': 'Ulos upacara koleksi Honolulu Museum of Art',
  tortor: 'Para penari membawakan tortor',
  gondang: 'Alat musik gondang sabangunan Batak Toba yang dipamerkan di museum di Osaka',
  'karo-house': 'Rumah siwaluh jabu di Desa Budaya Lingga, Karo',
  'karo-wedding': 'Sepasang pengantin berbusana adat Karo',
  'mandailing-house': 'Bagas Godang di Huta Godang, Mandailing',
  'gordang-sambilan': 'Ansambel gendang Gordang Sambilan',
  'angkola-tortor': 'Pengantin menari tortor di daerah Tapanuli bagian selatan',
  'simalungun-house': 'Rumah Bolon di Pematang Purba, Simalungun',
  'nias-house': 'Rumah tradisional di Bawomataluo, Nias Selatan',
  'nias-hombo': 'Lompat batu di Nias',
  'nias-dance': 'Para penampil tari perang di Bawomataluo',
  maimun: 'Bagian depan Istana Maimun di Medan',
  'tjong-a-fie': 'Bagian depan Rumah Tjong A Fie di Medan',
  arsik: 'Arsik, masakan ikan mas berbumbu',
};

export const photo = (id: PhotoId) => ({ id, ...raw[id], alt: ALT[id] });
export const ALL_PHOTOS = (Object.keys(raw) as PhotoId[]).map(photo);
