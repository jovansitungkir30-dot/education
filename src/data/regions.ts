import { fact, type Fact } from './types';
import type { PhotoId } from './photos';

export type TopicKey = 'identity' | 'history' | 'architecture' | 'clothing' | 'traditions' | 'crafts' | 'food' | 'stories';

export const TOPICS: Record<TopicKey, string> = {
  identity: 'Cultural identity',
  history: 'Historical background',
  architecture: 'Architecture',
  clothing: 'Clothing and textiles',
  traditions: 'Local traditions',
  crafts: 'Arts and crafts',
  food: 'Food',
  stories: 'Cultural stories',
};

export interface Region {
  id: string;
  name: string;
  category: 'Landscape' | 'Cultural community' | 'City' | 'Regency';
  /** Representative reference point, not a cultural boundary. */
  coords: [number, number];
  anchor: string;
  summary: string;
  /** A missing topic is a deliberate research gap. */
  topics: Partial<Record<TopicKey, Fact[]>>;
  photos: PhotoId[];
  modules: string[];
}

export const REGIONS: Region[] = [
  {
    id: 'lake-toba', name: 'Lake Toba', category: 'Landscape', coords: [2.68, 98.86], anchor: 'Central lake basin',
    summary: 'A vast volcanic caldera lake in the highlands, bordered by several cultural communities.',
    topics: {
      identity: [fact('history', 'Lake Toba is a landscape rather than a single culture. Communities with their own identities live around it and in the surrounding highlands.')],
      history: [
        fact('history', 'The lake occupies a caldera shaped by very large eruptions. The most recent giant eruption is commonly dated to about 74,000 years ago; published estimates differ by a few thousand years.', 'britannicaToba', 'nasaToba'),
        fact('interpretation', 'How strongly that eruption affected global climate and early human populations is still debated among researchers.', 'britannicaToba'),
      ],
      stories: [fact('folklore', 'A widely told legend explains the lake through a man named Toba, a woman who had been a golden fish, a broken promise, and their son Samosir. Many versions exist. It is folklore, not geology.', 'legendGnfi', 'legendDetik')],
      traditions: [fact('contemporary', 'UNESCO has supported a recovery project for ulos weavers and gorga carvers in the Toba region after the COVID-19 pandemic. A safeguarding project is not the same as a heritage-list inscription.', 'unescoUlosProject')],
    },
    photos: ['toba-panorama', 'samosir-ferry'], modules: ['intro'],
  },
  {
    id: 'samosir', name: 'Samosir Island', category: 'Landscape', coords: [2.58, 98.84], anchor: 'Island interior; Tomok, Ambarita and Simanindo are on the shore',
    summary: 'An island within Lake Toba and an important place for encountering Batak Toba village heritage.',
    topics: {
      identity: [fact('tradition', 'Samosir is closely associated with Batak Toba communities, villages and family histories.')],
      architecture: [
        fact('history', 'Batak Toba houses are raised on posts and have a sweeping, saddle-shaped roof with projecting gables.', 'batakArchitecture', 'tobaHouseForm'),
        fact('interpretation', 'A study of a house in Siallagan village reports that the carved singa-singa motif is understood as protection for the house.', 'gorgaFloresiensis'),
      ],
      crafts: [fact('tradition', 'Gorga is the Batak Toba art of decorative carving and painting, widely recognised for its use of red, white and black.', 'gorgaFloresiensis')],
      stories: [fact('folklore', 'In versions of the Lake Toba legend, the son Samosir climbs to high ground as the water rises, linking his name to the island.', 'legendGnfi')],
      food: [fact('tradition', 'Arsik, a spiced fish dish often made with carp, is strongly associated with Batak cooking in the Toba area.', 'arsik')],
    },
    photos: ['samosir-ferry', 'gorga-house'], modules: ['batak', 'architecture'],
  },
  {
    id: 'toba', name: 'Toba (Batak Toba)', category: 'Cultural community', coords: [2.333, 99.063], anchor: 'Balige, Toba Regency',
    summary: 'The Batak Toba community, with homelands around the southern lake and a wide diaspora.',
    topics: {
      identity: [fact('tradition', 'Batak Toba is one distinct community among those often grouped under the broad term “Batak”. Its language, kinship usage and ceremonial forms should not be assumed to apply to the others. Toba cultural areas extend beyond present-day Toba Regency.')],
      architecture: [fact('history', 'The traditional Toba house is a raised timber house with a saddle-shaped roof. Studies examine how its form and interior carry cultural meaning.', 'tobaHouseForm', 'batakArchitecture')],
      clothing: [
        fact('tradition', 'Ulos are woven textiles used in daily and ceremonial life. In mangulosi, a cloth is given as an expression of blessing and affection, following kinship relationships.', 'ulosEncyclopedia', 'ulosStudy'),
        fact('tradition', 'Named types include ragidup, ragihotang and sibolang. Published accounts differ about who gives or wears each one, so local ceremonial guidance matters.', 'ulosStudy'),
      ],
      traditions: [
        fact('tradition', 'Dalihan Na Tolu describes three interdependent kinship positions that organise roles in ceremony. The same person can hold different positions in different events.', 'dalihanCore'),
        fact('tradition', 'Tortor dance and gondang music are closely linked in ceremonial settings, including rites surrounding death.', 'gondangRitual'),
      ],
      crafts: [fact('contemporary', 'Ulos weaving and gorga carving continue as living crafts and livelihoods.', 'unescoUlosProject')],
      food: [fact('tradition', 'Andaliman, a citrus-family pepper with a tingling effect, is a signature spice in many Toba dishes, including arsik.', 'andaliman', 'arsik')],
    },
    photos: ['tortor', 'ulos-weaving', 'gondang', 'arsik'], modules: ['batak', 'ulos', 'music', 'culinary'],
  },
  {
    id: 'karo', name: 'Karo', category: 'Cultural community', coords: [3.1, 98.49], anchor: 'Kabanjahe, Karo highlands',
    summary: 'A highland community north of the lake with its own language, architecture and customs.',
    topics: {
      identity: [fact('tradition', 'Karo people have their own language and customary system. Many describe their identity specifically as Karo, and views differ on the wider “Batak” label.')],
      architecture: [
        fact('history', 'Siwaluh jabu refers to a large house for eight household units. Examples are associated with villages such as Lingga and Dokan.', 'karoSpace', 'karoHeritage'),
        fact('tradition', 'The position of each household inside the house follows Karo customary rules.', 'karoSpace'),
        fact('contemporary', 'Research from Lingga records changes in how interior space is used today.', 'karoSpace'),
      ],
      clothing: [fact('tradition', 'Karo ceremonial dress uses woven textiles known as uis, with distinctive headdresses in wedding attire.')],
      food: [fact('contemporary', 'Karo versions of arsik are described as using torch ginger flower and fruit, in places where other versions rely on andaliman.', 'arsik')],
    },
    photos: ['karo-house', 'karo-wedding'], modules: ['batak', 'architecture', 'culinary'],
  },
  {
    id: 'mandailing', name: 'Mandailing', category: 'Cultural community', coords: [0.86, 99.55], anchor: 'Panyabungan, Mandailing Natal',
    summary: 'A southern community known for the Gordang Sambilan drum ensemble and customary village architecture.',
    topics: {
      identity: [fact('tradition', 'Mandailing is a distinct southern community. Islam is central to the lives of most Mandailing people today, and many identify as Mandailing rather than under a broader label.', 'dalihanCore')],
      architecture: [fact('history', 'Bagas Godang is the house of the traditional ruler. Sopo Godang is an open public hall for customary deliberation. They belong to a planned village setting with a wide yard.', 'mandailingBuildings')],
      traditions: [
        fact('tradition', 'Dalihan Na Tolu, with the groups known as mora, kahanggi and anak boru, structures obligations in ceremony.', 'dalihanCore'),
        fact('tradition', 'Gordang Sambilan is an ensemble of nine drums of graded size, played at significant ceremonies. Its use has customary rules.', 'gordang'),
      ],
      crafts: [fact('tradition', 'Customary buildings carry painted and carved geometric ornament.')],
    },
    photos: ['mandailing-house', 'gordang-sambilan'], modules: ['music', 'wisdom'],
  },
  {
    id: 'angkola', name: 'Angkola', category: 'Cultural community', coords: [1.37, 99.27], anchor: 'Padangsidimpuan area',
    summary: 'A southern community of the Tapanuli region, related to but distinct from Mandailing.',
    topics: {
      identity: [fact('tradition', 'Angkola has its own community identity. It shares many cultural features with neighbouring Mandailing, and the two are often studied together, but they should not be treated as interchangeable.', 'dalihanCore')],
      traditions: [fact('tradition', 'Dalihan Na Tolu relationships guide roles and speech in customary ceremonies.', 'dalihanCore')],
    },
    photos: ['angkola-tortor'], modules: ['wisdom'],
  },
  {
    id: 'pakpak', name: 'Pakpak', category: 'Cultural community', coords: [2.55, 98.32], anchor: 'Salak, Pakpak Bharat',
    summary: 'A community of the western highlands whose homeland crosses modern administrative borders.',
    topics: {
      identity: [fact('tradition', 'The idea of Silima Suak, five customary areas, names Simsim, Keppas, Pegagan, Kelasen and Boang. They are distinguished partly by dialect and linked by kinship. Boang communities live in Aceh.', 'pakpakSuak')],
      history: [fact('history', 'Colonial-era administration divided the Pakpak customary areas among separate government units in the early twentieth century.', 'pakpakHistory')],
      traditions: [fact('contemporary', 'Research reports declining use of the Pakpak language in some mixed areas, such as parts of Sumbul.', 'pakpakSuak')],
    },
    photos: [], modules: ['intro'],
  },
  {
    id: 'simalungun', name: 'Simalungun', category: 'Cultural community', coords: [2.94, 98.69], anchor: 'Pematang Purba',
    summary: 'A community northeast of the lake with its own language, royal heritage and customary food.',
    topics: {
      identity: [fact('tradition', 'Simalungun is a distinct community with its own language and customs.')],
      architecture: [
        fact('history', 'The Rumah Bolon complex at Pematang Purba is associated with the former Purba ruling house. Its ornament has been the subject of semiotic study.', 'simalungunOrnament'),
      ],
      traditions: [fact('tradition', 'Tolu Sahundulan, Lima Saodoran is a Simalungun customary framework describing kinship positions and how they sit and act together.', 'simalungunAdat')],
      food: [fact('tradition', 'Dayok binatur is chicken arranged in an orderly way on a plate and served with words of advice at customary occasions, including weddings.', 'simalungunAdat')],
      clothing: [fact('tradition', 'Simalungun woven textiles are known as hiou.')],
    },
    photos: ['simalungun-house'], modules: ['batak', 'culinary', 'wisdom'],
  },
  {
    id: 'nias', name: 'Nias', category: 'Cultural community', coords: [0.62, 97.77], anchor: 'Bawomataluo, South Nias',
    summary: 'An island society off the west coast with its own language, monumental stonework and architecture. Nias is not a Batak culture.',
    topics: {
      identity: [fact('history', 'Ono Niha, the people of Nias, have their own language and heritage. Customs and house forms differ between northern, central and southern Nias.')],
      history: [
        fact('contemporary', 'The traditional settlement of Bawomataluo has been on Indonesia’s UNESCO Tentative List since 2009. It is not an inscribed World Heritage Site.', 'unescoBawomataluo'),
      ],
      architecture: [
        fact('history', 'Omo sebua, the great houses of chiefs, stand on massive timber posts under very tall, steep roofs.', 'omoSebua'),
        fact('history', 'Traditional timber houses with joined, braced structures performed notably well in the earthquakes of 2004 and 2005.', 'niasQuake', 'wmfNias'),
      ],
      traditions: [
        fact('history', 'Hombo batu, or fahombo, is stone jumping associated especially with South Nias. Accounts connect it to preparation for inter-village conflict. Today it is a cultural demonstration and symbol.', 'hombo'),
        fact('tradition', 'Maena is a communal performance studied in the context of the Falöwa wedding ceremony.', 'niasMaena'),
      ],
      crafts: [fact('history', 'Bawomataluo is noted for monumental stonework integrated into the settlement plan.', 'unescoBawomataluo')],
      clothing: [fact('contemporary', 'Performers of the war dance wear distinctive costume and carry shields as part of a staged cultural performance.', 'niasMinistry')],
    },
    photos: ['nias-house', 'nias-hombo', 'nias-dance'], modules: ['nias', 'architecture'],
  },
  {
    id: 'medan', name: 'Medan', category: 'City', coords: [3.585, 98.675], anchor: 'City centre',
    summary: 'The provincial capital: a plural city with deep Malay Deli roots and many communities.',
    topics: {
      identity: [fact('contemporary', 'Medan is home to many communities, including Malay, Batak groups, Javanese, Chinese Indonesian, Minangkabau, Indian-descended and other residents. No single culture stands for the city.')],
      history: [fact('history', 'The city grew with the plantation economy of the colonial era, in lands linked to the Malay Sultanate of Deli.')],
      architecture: [
        fact('history', 'Istana Maimun, a palace of the Sultanate of Deli, was built around 1887 to 1892; sources give slightly different dates. Its design combines several architectural traditions.', 'maimun'),
        fact('history', 'The Tjong A Fie Mansion, home of a prominent Chinese merchant, blends Chinese, Malay and European-influenced design. It opened to the public as a museum in 2009.', 'medanSites'),
      ],
    },
    photos: ['maimun', 'tjong-a-fie'], modules: ['intro'],
  },
];

export const regionById = (id: string | null) => REGIONS.find((r) => r.id === id);
