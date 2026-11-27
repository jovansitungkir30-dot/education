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
      ],
      crafts: [
        fact('contemporary', 'Gorga, Batak Toba decorative carving, was part of a UNESCO recovery project for local craft practitioners.', 'unescoUlosProject'),
        fact('tradition', 'Gorga is widely recognised for its use of red, white and black.'),
      ],
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
        fact('history', 'Siwaluh jabu is a raised house, reaching about 12 metres, with outward-sloping walls. The name refers to eight household units under one roof. A study documents examples in Lingga village.', 'karoSpace'),
        fact('tradition', 'Traditionally the rooms had no walls between them. Custom marked the boundaries and set which relatives lived in each of the eight places, with their own responsibilities.', 'karoSpace'),
        fact('contemporary', 'A 2020 study in Lingga found added partitions, houses no longer occupied by eight families, and the role-based placement no longer practised. It also reports declining upkeep.', 'karoSpace'),
      ],
      clothing: [
        fact('tradition', 'Uis nipes is a thin woven cloth worn by Karo women at customary events. Bright versions appear at weddings and black ones in mourning.', 'uisKaro'),
        fact('tradition', 'Beka buluh is a larger, heavier, red-based cloth. At weddings it is worn as a head covering by the groom and the couple’s fathers, or folded over the shoulder.', 'uisKaro'),
        fact('contemporary', 'A study in Barusjahe describes parents passing on these cloths by bringing children to ceremonies, while many young people mostly choose modern clothing.', 'uisKaro'),
      ],
      food: [fact('contemporary', 'Karo versions of arsik are described as using torch ginger flower and fruit, in places where other versions rely on andaliman.', 'arsik')],
    },
    photos: ['karo-house', 'karo-wedding'], modules: ['batak', 'architecture', 'culinary'],
  },
  {
    id: 'mandailing', name: 'Mandailing', category: 'Cultural community', coords: [0.86, 99.55], anchor: 'Panyabungan, Mandailing Natal',
    summary: 'A southern community known for the Gordang Sambilan drum ensemble and customary village architecture.',
    topics: {
      identity: [fact('tradition', 'Mandailing is a distinct southern community. Islam is central to the lives of most Mandailing people today, and many identify as Mandailing rather than under a broader label.', 'dalihanCore')],
      architecture: [
        fact('history', 'Bagas Godang is the raised house of the traditional ruler. It has also served as a place for customary ceremonies and as a refuge for community members.', 'mandailingBuildings'),
        fact('history', 'Sopo Godang is an open hall without walls, across the wide yard. It is used for deliberation, customary justice, performances and learning.', 'mandailingBuildings'),
      ],
      clothing: [fact('tradition', 'The hampu and bulang headdresses were first part of the dress of the ruler and consort. Today they are worn by couples at customary weddings.', 'mandailingBuildings')],
      traditions: [
        fact('tradition', 'Dalihan Na Tolu groups kin as suhut with kahanggi, anak boru, and mora. Each has distinct roles in ceremony and decision-making.', 'mandailingBuildings'),
        fact('tradition', 'Gordang Sambilan is an ensemble of nine drums of graded size, played at significant ceremonies. Its use has customary rules.', 'gordang'),
      ],
      crafts: [fact('interpretation', 'A triangular ornament called bindu, on the front roof of the Bagas Godang and Sopo Godang, is read as a symbol of Dalihan Na Tolu.', 'mandailingBuildings')],
    },
    photos: ['mandailing-house', 'gordang-sambilan'], modules: ['music', 'wisdom'],
  },
  {
    id: 'angkola', name: 'Angkola', category: 'Cultural community', coords: [1.37, 99.27], anchor: 'Padangsidimpuan area',
    summary: 'A southern community of the Tapanuli region, related to but distinct from Mandailing.',
    topics: {
      identity: [fact('tradition', 'Angkola has its own community identity. It shares many cultural features with neighbouring Mandailing, and the two are often studied together, but they should not be treated as interchangeable.', 'dalihanCore')],
      history: [fact('history', 'A study of Mandailing rulers records that one village head took office under Angkola custom in 1885 and led until 1928.', 'mandailingBuildings')],
      traditions: [
        fact('tradition', 'Dalihan Na Tolu relationships guide roles and speech in customary ceremonies.', 'dalihanCore'),
        fact('tradition', 'In Angkola and Sipirok, a respected leader is described with the expression banir parkolipkolipan, an image of someone who gives shelter.', 'mandailingBuildings'),
      ],
    },
    photos: ['angkola-tortor'], modules: ['wisdom'],
  },
  {
    id: 'pakpak', name: 'Pakpak', category: 'Cultural community', coords: [2.55, 98.32], anchor: 'Salak, Pakpak Bharat',
    summary: 'A community of the western highlands whose homeland crosses modern administrative borders.',
    topics: {
      identity: [
        fact('tradition', 'Silima Suak, five customary areas, names Simsim, Keppas, Pegagan, Kelasen and Boang. They differ mainly in dialect and historically dominant clans, within one Pakpak identity.', 'pakpakSuak'),
        fact('contemporary', 'Pakpak communities live in areas including Dairi, Pakpak Bharat, Humbang Hasundutan and Central Tapanuli, and in Aceh Singkil and Subulussalam in Aceh.', 'pakpakSuak'),
      ],
      history: [fact('history', 'Colonial-era administration divided the Pakpak customary areas among separate government units in the early twentieth century.', 'pakpakHistory')],
      traditions: [
        fact('tradition', 'Sulang Silima joins five kinship elements: the eldest, middle and youngest sibling lines (perisang-isang, pertulan tengah, perekur-ekur), berru and puang. They take part in customary decisions.', 'pakpakSuak'),
        fact('contemporary', 'The community association HIMPAK describes itself as a shared home for the five areas and works on culture, youth training and welfare.', 'pakpakSuak'),
      ],
      crafts: [fact('contemporary', 'Tatak moccak, a Pakpak martial art, and traditional dance studios are among the arts being passed on.', 'pakpakSuak')],
      food: [fact('contemporary', 'Pelleng is described as a signature Pakpak food and was the focus of a community celebration day in 2025.', 'pakpakSuak')],
    },
    photos: [], modules: ['intro'],
  },
  {
    id: 'simalungun', name: 'Simalungun', category: 'Cultural community', coords: [2.94, 98.69], anchor: 'Pematang Purba',
    summary: 'A community northeast of the lake with its own language, royal heritage and customary food.',
    topics: {
      identity: [
        fact('tradition', 'Simalungun is a distinct community, set apart by its own custom, culture and history.', 'simalungunAdat'),
        fact('interpretation', 'The saying habonaron do bona, “truth is the foundation”, is described as a guiding Simalungun philosophy.', 'simalungunAdat'),
      ],
      architecture: [
        fact('history', 'The Rumah Bolon complex at Pematang Purba is associated with the former Purba ruling house. Its ornament has been the subject of semiotic study.', 'simalungunOrnament'),
      ],
      traditions: [fact('tradition', 'Tolu Sahundulan names three kin positions with complementary gifts: tondong offers counsel, sanina shares in deliberation, and boru provides strength. It is spoken of together with Lima Saodoran.', 'simalungunAdat')],
      stories: [fact('tradition', 'Hata-hata mambere podah is an oral tradition at weddings: elders and relatives give the couple advice, often introduced by a verse. The study notes it is fading, especially in cities.', 'simalungunAdat')],
      food: [fact('tradition', 'Dayok binatur is chicken arranged in an orderly way on a plate and served with words of advice at customary occasions, including weddings.', 'simalungunAdat')],
      clothing: [fact('tradition', 'Wedding dress includes the gotong headdress for men, the bulang headdress for women, the suri-suri shoulder cloth and the hiou, a woven cloth wrapped around the body.', 'simalungunAdat')],
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
        fact('history', 'Research on the 2004 and 2005 earthquakes found that traditional Nias houses performed notably well, although some tilted, toppled or were damaged.', 'niasQuake'),
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
      identity: [fact('contemporary', 'Medan is home to many communities, including Malay, Batak groups, Javanese, Chinese Indonesian, Minangkabau, Indian-descended and other residents. No single culture stands for the city.', 'medanWiki')],
      history: [
        fact('history', 'From the 1860s, land in Deli was opened to tobacco plantations, and Medan grew with this colonial plantation economy in the lands of the Malay Sultanate of Deli.', 'medanWiki'),
        fact('tradition', 'The city’s earlier founding is attributed to Guru Patimpus, a Karo man.', 'medanWiki'),
      ],
      architecture: [
        fact('history', 'Istana Maimun, a palace of the Sultanate of Deli, was built around 1887 to 1892; sources give slightly different dates. Its design combines several architectural traditions.', 'maimun'),
        fact('history', 'The Tjong A Fie Mansion, home of a prominent Chinese merchant, blends Chinese, Malay and European-influenced design. It opened to the public as a museum in 2009.', 'medanSites'),
      ],
    },
    photos: ['maimun', 'tjong-a-fie'], modules: ['intro'],
  },
];

export const regionById = (id: string | null) => REGIONS.find((r) => r.id === id);
