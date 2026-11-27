import type { PhotoId } from './photos';
import type { SourceId } from './sources';
import type { Knowledge } from './types';

export interface Lesson {
  title: string;
  body: string;
  photo: PhotoId;
}

export type Activity =
  | { type: 'reveal'; title: string; cards: { front: string; back: string }[] }
  | { type: 'match'; title: string; pairs: { left: string; right: string }[] }
  | { type: 'classify'; title: string; items: { text: string; answer: Knowledge }[] };

export interface Question {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Module {
  id: string;
  title: string;
  badge: string;
  /** Number of passed modules needed to open this one. */
  requires: number;
  objectives: string[];
  lessons: Lesson[];
  activity: Activity;
  quiz: Question[];
  sources: SourceId[];
}

/** Rotates the options by a stable amount so the correct answer does not cluster in one position. */
const q = (text: string, options: string[], answer: number, why: string): Question => {
  const shift = text.length % options.length;
  return {
    q: text,
    options: options.map((_, i) => options[(i + shift) % options.length]),
    answer: (answer - shift + options.length) % options.length,
    why,
  };
};

export const MODULES: Module[] = [
  {
    id: 'intro', title: 'Introduction to North Sumatra', badge: 'Pathfinder', requires: 0,
    objectives: ['Describe North Sumatra as a region of many communities', 'Separate geological history from folklore', 'Know what a label on this site means'],
    lessons: [
      { title: 'Many communities', photo: 'toba-panorama', body: 'North Sumatra includes Batak Toba, Karo, Mandailing, Angkola, Pakpak, Simalungun, Nias, Malay and many other communities. They have different languages, histories and customs. “Batak” is a broad term that not everyone applies to themselves in the same way, and Nias is not a Batak culture.' },
      { title: 'One lake, two kinds of account', photo: 'samosir-ferry', body: 'Geology explains Lake Toba as a volcanic caldera. A well-known legend explains it through a broken promise. One is evidence-based history of the land; the other is folklore that carries cultural memory and values. Both deserve attention, under the right label.' },
    ],
    activity: { type: 'classify', title: 'What kind of statement is it?', items: [
      { text: 'Lake Toba occupies a volcanic caldera.', answer: 'history' },
      { text: 'A woman who had been a golden fish returned to the water, and the lake formed.', answer: 'folklore' },
      { text: 'Bawomataluo is on a UNESCO Tentative List today.', answer: 'contemporary' },
    ] },
    quiz: [
      q('Which statement is accurate?', ['North Sumatra has one shared culture', 'North Sumatra is home to many distinct communities', 'All communities there are Batak'], 1, 'The province is plural, and Nias, Malay and other communities are not Batak.'),
      q('How should the golden fish legend be presented?', ['As geology', 'As folklore', 'As a government record'], 1, 'It is a told story with many versions.'),
      q('What formed the basin of Lake Toba?', ['Volcanic caldera collapse', 'A meteor', 'A dam'], 0, 'The lake fills a volcanic caldera.'),
      q('The giant eruption’s effect on early humans is…', ['Completely settled', 'Still debated', 'Never studied'], 1, 'Researchers disagree about the scale of its effects.'),
    ],
    sources: ['nasaToba', 'britannicaToba', 'legendGnfi'],
  },
  {
    id: 'batak', title: 'Exploring Batak Cultural Diversity', badge: 'Many Voices', requires: 0,
    objectives: ['Name several communities often grouped as Batak', 'Avoid applying one community’s terms to all', 'Connect each community with a geographical area'],
    lessons: [
      { title: 'A broad label', photo: 'karo-wedding', body: 'Toba, Karo, Simalungun, Pakpak, Angkola and Mandailing are often grouped as Batak. They differ in language, dress, architecture and ceremony. Some people, including many Karo and Mandailing, prefer their specific name.' },
      { title: 'Places', photo: 'simalungun-house', body: 'In broad terms, Karo highlands lie north of the lake, Simalungun to the northeast, Pakpak to the west, Toba around the south, and Angkola and Mandailing farther south. These are simplifications: people live and move far beyond these areas.' },
    ],
    activity: { type: 'match', title: 'Match each community with a feature', pairs: [
      { left: 'Karo', right: 'Siwaluh jabu house' },
      { left: 'Mandailing', right: 'Gordang Sambilan' },
      { left: 'Simalungun', right: 'Dayok binatur' },
      { left: 'Pakpak', right: 'Silima Suak' },
    ] },
    quiz: [
      q('Silima Suak refers to…', ['Five Pakpak customary areas', 'Nine drums', 'A Nias dance'], 0, 'Simsim, Keppas, Pegagan, Kelasen and Boang.'),
      q('Which community is north of Lake Toba in the highlands?', ['Mandailing', 'Karo', 'Angkola'], 1, 'The Karo highlands lie to the north.'),
      q('A custom is documented for Toba. What can you conclude about Karo?', ['It is identical', 'Nothing without Karo evidence', 'It is forbidden'], 1, 'Evidence about one community does not automatically transfer.'),
      q('Tolu Sahundulan, Lima Saodoran belongs to which community?', ['Simalungun', 'Nias', 'Malay Deli'], 0, 'It is a Simalungun customary framework.'),
    ],
    sources: ['pakpakSuak', 'simalungunAdat', 'karoSpace', 'gordang'],
  },
  {
    id: 'ulos', title: 'Understanding Ulos', badge: 'Thread Keeper', requires: 0,
    objectives: ['Explain ulos as both textile and relationship', 'Describe mangulosi', 'Recognise that accounts of use vary'],
    lessons: [
      { title: 'More than fabric', photo: 'ulos-weaving', body: 'Ulos is woven cloth with roles in everyday and ceremonial life. Weaving it demands skill and time, and it remains a working craft.' },
      { title: 'Giving ulos', photo: 'tortor', body: 'In mangulosi, a ulos is draped to express blessing and affection. Kinship position shapes who may give to whom. Ragidup, ragihotang and sibolang are among the named types, and published descriptions of their uses do not fully agree.' },
    ],
    activity: { type: 'reveal', title: 'Open each card', cards: [
      { front: 'Mangulosi', back: 'The act of giving ulos as blessing and affection.' },
      { front: 'Why sources differ', back: 'Practice varies between villages, families and ceremonies.' },
      { front: 'Is ulos on a UNESCO list?', back: 'Our research found a UNESCO safeguarding project involving ulos weavers, but did not find a UNESCO list inscription.' },
    ] },
    quiz: [
      q('Mangulosi means…', ['Selling cloth', 'Giving ulos as an expression of blessing', 'Dyeing thread'], 1, 'It is a meaningful act of giving.'),
      q('What shapes who gives ulos to whom?', ['Kinship relationships', 'The price', 'Random choice'], 0, 'Kinship position matters.'),
      q('When sources disagree about a type of ulos, the best response is to…', ['Pick one and call it universal', 'Note the variation and seek local guidance', 'Ignore ulos'], 1, 'Variation is part of living tradition.'),
      q('Which of these is a named type of ulos?', ['Ragidup', 'Hesek', 'Omo sebua'], 0, 'Hesek is an instrument and omo sebua a Nias house.'),
    ],
    sources: ['ulosStudy', 'ulosEncyclopedia', 'unescoUlosProject'],
  },
  {
    id: 'architecture', title: 'Traditional Architecture', badge: 'Master Reader of Houses', requires: 1,
    objectives: ['Compare Toba, Karo, Mandailing and Nias buildings', 'Read a house as both structure and social space', 'Link timber construction with earthquake response'],
    lessons: [
      { title: 'Roofs and posts', photo: 'gorga-house', body: 'Many traditional houses in the province are raised on posts, but their forms differ. The Toba house has a saddle-shaped roof; the Karo siwaluh jabu houses several households.' },
      { title: 'Social space', photo: 'mandailing-house', body: 'In Mandailing villages the ruler’s house, the open hall and the yard have different civic roles. In a Karo siwaluh jabu, household positions follow customary rules.' },
      { title: 'Structure that moves', photo: 'nias-house', body: 'Research on Nias after the 2004 and 2005 earthquakes found that traditional houses largely performed well. Bracing, joints and supports that can accommodate movement are central to the explanation. Performance still depends on maintenance and the strength of shaking.' },
    ],
    activity: { type: 'match', title: 'Match the building and its role', pairs: [
      { left: 'Sopo Godang', right: 'Open hall for deliberation' },
      { left: 'Bagas Godang', right: 'House of a traditional ruler' },
      { left: 'Siwaluh jabu', right: 'Shared house for eight household units' },
      { left: 'Omo sebua', right: 'Nias chief’s great house' },
    ] },
    quiz: [
      q('“Siwaluh jabu” refers to…', ['A house for eight household units', 'A drum set', 'A textile'], 0, 'The name relates to eight household units.'),
      q('Sopo Godang is associated with…', ['Deliberation', 'Fishing', 'Weaving only'], 0, 'It is a customary public hall.'),
      q('Which houses largely performed well in the 2004–2005 Nias earthquakes?', ['Traditional timber houses', 'All modern buildings', 'Neither was studied'], 0, 'Studies record strong performance by traditional houses.'),
      q('The Rumah Bolon of Simalungun and Toba houses are…', ['Always identical', 'Distinct traditions despite shared naming', 'Both from Nias'], 1, 'Shared words do not mean identical buildings.'),
    ],
    sources: ['tobaHouseForm', 'karoSpace', 'mandailingBuildings', 'niasQuake'],
  },
  {
    id: 'music', title: 'Music and Dance', badge: 'Rhythm Listener', requires: 1,
    objectives: ['Identify parts of the gondang sabangunan', 'Distinguish it from Gordang Sambilan', 'Understand the link between dance, music and ceremony'],
    lessons: [
      { title: 'Gondang sabangunan', photo: 'gondang', body: 'The Toba ensemble combines taganing, gordang, ogung, sarune bolon and hesek. The taganing can carry melody as well as rhythm, while gongs interlock in repeating cycles.' },
      { title: 'Nine drums', photo: 'gordang-sambilan', body: 'Gordang Sambilan is Mandailing: nine drums of graded size played by a group, at occasions governed by custom.' },
      { title: 'Dance in context', photo: 'tortor', body: 'Studies describe gondang and tortor as closely linked in Toba ceremony. Movement communicates within relationships, not only as performance.' },
    ],
    activity: { type: 'match', title: 'Match the sound and the role', pairs: [
      { left: 'Taganing', right: 'Tuned drum set' },
      { left: 'Ogung', right: 'Suspended gongs' },
      { left: 'Sarune bolon', right: 'Reed wind instrument' },
      { left: 'Hesek', right: 'Keeps a steady pulse' },
    ] },
    quiz: [
      q('Gordang Sambilan is chiefly associated with…', ['Mandailing', 'Nias', 'Malay Deli'], 0, 'It is a Mandailing ensemble.'),
      q('The sarune bolon is…', ['A gong', 'A reed instrument', 'A dance'], 1, 'It is a wind instrument with a reed.'),
      q('In Toba ceremony, tortor is…', ['Closely linked with gondang', 'Never danced to music', 'A kind of textile'], 0, 'Music and movement belong together there.'),
      q('Maena is studied in which context?', ['Nias wedding ceremony', 'Karo house building', 'Medan trade'], 0, 'It has been studied in the Falöwa wedding ceremony.'),
    ],
    sources: ['gondangRitual', 'taganing', 'gordang', 'niasMaena'],
  },
  {
    id: 'nias', title: 'Nias Cultural Heritage', badge: 'Island Witness', requires: 2,
    objectives: ['Recognise Nias as a distinct culture', 'State Bawomataluo’s heritage status accurately', 'Discuss hombo batu in historical context'],
    lessons: [
      { title: 'Its own world', photo: 'nias-house', body: 'Ono Niha have their own language and heritage, with regional differences across the island. Bawomataluo in the south combines houses and monumental stonework in a planned settlement.' },
      { title: 'Past and present', photo: 'nias-hombo', body: 'Hombo batu is linked in accounts to training for past conflicts. Today it is demonstrated as a cultural symbol. Avoid presenting historical warfare imagery as a description of contemporary people.' },
    ],
    activity: { type: 'classify', title: 'Label each statement', items: [
      { text: 'Traditional houses performed well in the 2004–2005 earthquakes.', answer: 'history' },
      { text: 'Maena is performed communally within wedding custom.', answer: 'tradition' },
      { text: 'South Nias heritage is the subject of current preservation efforts.', answer: 'contemporary' },
    ] },
    quiz: [
      q('Bawomataluo’s UNESCO status, per the sources used here, is…', ['Inscribed World Heritage Site', 'On the Tentative List', 'Removed from all lists'], 1, 'A Tentative List entry is not an inscription.'),
      q('Hombo batu today is mainly…', ['Preparation for current war', 'A cultural demonstration and symbol', 'A cooking method'], 1, 'Its purpose has changed.'),
      q('Is Nias a Batak culture?', ['Yes', 'No'], 1, 'Nias has a distinct language and heritage.'),
      q('Omo sebua are…', ['Chiefs’ great houses', 'War songs', 'Textiles'], 0, 'They are monumental houses.'),
    ],
    sources: ['unescoBawomataluo', 'hombo', 'omoSebua', 'niasQuake'],
  },
  {
    id: 'culinary', title: 'Traditional Culinary Heritage', badge: 'Spice Explorer', requires: 2,
    objectives: ['Recognise andaliman and arsik', 'Notice differences between community recipes', 'Understand food as ceremonial communication'],
    lessons: [
      { title: 'Andaliman and arsik', photo: 'arsik', body: 'Andaliman gives a citrus aroma and tingling sensation. Arsik is a spiced fish dish, often carp. Published descriptions note that Karo versions use torch ginger in place of the andaliman emphasis found elsewhere.' },
      { title: 'Food that speaks', photo: 'simalungun-house', body: 'In Simalungun custom, dayok binatur is chicken arranged in order and presented with words of advice. The arrangement and the speech belong together. Food practices also differ by religion and family: many Mandailing and Angkola Muslims, for example, follow halal rules.' },
    ],
    activity: { type: 'reveal', title: 'Taste the vocabulary', cards: [
      { front: 'Andaliman', back: 'A citrus-family spice with a tingling effect.' },
      { front: 'Arsik', back: 'Spiced fish, cooked until the seasoning soaks in.' },
      { front: 'Dayok binatur', back: 'An orderly arranged Simalungun customary chicken dish.' },
    ] },
    quiz: [
      q('Andaliman is a…', ['Spice', 'House', 'Drum'], 0, 'It is a characteristic spice.'),
      q('Dayok binatur belongs to which custom?', ['Simalungun', 'Nias', 'Karo'], 0, 'It is Simalungun.'),
      q('Do all communities prepare arsik identically?', ['Yes', 'No'], 1, 'Described versions differ.'),
    ],
    sources: ['andaliman', 'arsik', 'simalungunAdat'],
  },
  {
    id: 'wisdom', title: 'Local Wisdom and Cultural Philosophy', badge: 'Relationship Thinker', requires: 3,
    objectives: ['Describe Dalihan Na Tolu as a relational framework', 'Compare it with Simalungun’s framework', 'Separate practice from interpretation'],
    lessons: [
      { title: 'Relationship before rank', photo: 'angkola-tortor', body: 'Dalihan Na Tolu organises three interdependent kinship positions. A person occupies different positions in different relationships, so honour and service rotate.' },
      { title: 'More than one framework', photo: 'simalungun-house', body: 'Simalungun speaks of Tolu Sahundulan, Lima Saodoran. Similar concerns about cooperation can have different names, categories and rules. The hearth-stone explanation of Dalihan Na Tolu is a helpful interpretive image.' },
    ],
    activity: { type: 'classify', title: 'Practice or interpretation?', items: [
      { text: 'Kinship positions assign roles in ceremony.', answer: 'tradition' },
      { text: 'Three hearth stones symbolise balance between the positions.', answer: 'interpretation' },
    ] },
    quiz: [
      q('A kinship position in Dalihan Na Tolu is…', ['A permanent social class', 'Relative to the relationship and event', 'Chosen by wealth'], 1, 'People move between positions.'),
      q('Simalungun’s related framework is called…', ['Tolu Sahundulan, Lima Saodoran', 'Silima Suak', 'Hombo Batu'], 0, 'Silima Suak is Pakpak.'),
      q('The three-stone image is best treated as…', ['An interpretive explanation', 'A geological fact', 'A recipe'], 0, 'It is a way of explaining meaning.'),
    ],
    sources: ['dalihanCore', 'simalungunAdat'],
  },
];
