import raw from './photos.json';

export type PhotoId = keyof typeof raw;

/** Alt text written for this site. Author and licence come from Wikimedia Commons metadata (photos.json). */
const ALT: Record<PhotoId, string> = {
  'toba-panorama': 'Panorama of Lake Toba seen from a beach on Samosir',
  'samosir-ferry': 'Samosir Island seen across the water from the Tomok ferry',
  'gorga-house': 'Batak Toba house decorated with gorga carving in Lumban Lontung, Samosir',
  'ulos-weaving': 'A weaver making ulos cloth on a traditional loom',
  'ulos-museum': 'A ulos ceremonial cloth in the Honolulu Museum of Art collection',
  tortor: 'Dancers performing tortor',
  gondang: 'Toba Batak gondang sabangunan instruments displayed in a museum in Osaka',
  'karo-house': 'A siwaluh jabu house in Lingga cultural village, Karo',
  'karo-wedding': 'A couple in Karo wedding dress',
  'mandailing-house': 'Bagas Godang in Huta Godang, Mandailing',
  'gordang-sambilan': 'The Gordang Sambilan drum ensemble',
  'angkola-tortor': 'A bridal couple dancing tortor in the southern Tapanuli region',
  'simalungun-house': 'Rumah Bolon at Pematang Purba, Simalungun',
  'nias-house': 'A traditional house in Bawomataluo, South Nias',
  'nias-hombo': 'Stone jumping in Nias',
  'nias-dance': 'War dance performers in Bawomataluo',
  maimun: 'The facade of Istana Maimun in Medan',
  'tjong-a-fie': 'Front of the Tjong A Fie Mansion in Medan',
  arsik: 'Arsik, a spiced carp dish',
};

export const photo = (id: PhotoId) => ({ id, ...raw[id], alt: ALT[id] });
export const ALL_PHOTOS = (Object.keys(raw) as PhotoId[]).map(photo);
