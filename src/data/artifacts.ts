import { fact, type Fact } from './types';

export type ModelId = 'rumah-bolon' | 'siwaluh-jabu' | 'omo-sebua' | 'hombo-batu' | 'ulos' | 'gondang' | 'gordang' | 'sigale-gale' | 'gorga';

export interface Hotspot {
  position: [number, number, number];
  label: string;
  text: string;
}

export interface Artifact {
  id: ModelId;
  name: string;
  origin: string;
  description: string;
  history: Fact;
  significance: Fact;
  /** Only filled where a source supports it. */
  materials?: Fact;
  hotspots: Hotspot[];
  regionId: string;
  camera: [number, number, number];
}

export const ARTIFACTS: Artifact[] = [
  {
    id: 'rumah-bolon', name: 'Batak Toba house (Rumah Bolon)', origin: 'Batak Toba', regionId: 'samosir', camera: [7, 3.5, 8],
    description: 'A simplified study of a raised house with a sweeping saddle roof and a decorated front gable.',
    history: fact('history', 'Batak Toba architecture is known for raised timber houses with curved roof ridges and projecting gables.', 'batakArchitecture', 'tobaHouseForm'),
    significance: fact('interpretation', 'Researchers read the form and ornament of the house as carrying cultural meaning.', 'tobaHouseForm'),
    hotspots: [
      { position: [0, 3.55, 2.35], label: 'Saddle roof', text: 'The ridge dips in the middle and rises toward both gables.' },
      { position: [0, 2.15, 2.05], label: 'Front gable', text: 'The front is a focus for carved and painted ornament. The patterns here are abstract placeholders for gorga, not copies of real motifs.' },
      { position: [1.35, 0.55, 1.4], label: 'Posts', text: 'The living floor is raised above the ground on timber posts.' },
    ],
  },
  {
    id: 'siwaluh-jabu', name: 'Karo house (Siwaluh Jabu)', origin: 'Karo', regionId: 'karo', camera: [7.5, 4, 8.5],
    description: 'A simplified study of a large shared house with a tall, layered roof.',
    history: fact('history', 'A study documents siwaluh jabu houses in Lingga, a Karo village.', 'karoSpace'),
    significance: fact('tradition', 'Traditionally, eight households shared the house in places set by custom. A 2020 study found this placement is no longer practised in Lingga.', 'karoSpace'),
    hotspots: [
      { position: [0, 4.1, 0], label: 'Layered roof', text: 'A tall roof dominates the profile. This model simplifies its tiers and gables.' },
      { position: [2.25, 1.35, 0], label: 'Shared interior', text: 'Traditionally several households lived under one roof, each in its own customary position.' },
      { position: [0, 0.75, 2.2], label: 'Front platform', text: 'A raised platform leads to the entrance in this representation.' },
    ],
  },
  {
    id: 'omo-sebua', name: 'Nias great house (Omo Sebua)', origin: 'Nias, southern tradition', regionId: 'nias', camera: [7.5, 4.5, 9],
    description: 'A simplified study of a chief’s house with a very tall roof and a dense system of posts and braces.',
    history: fact('history', 'Omo sebua are the great houses of chiefs, built on massive timber posts under steep roofs.', 'omoSebua'),
    significance: fact('history', 'Nias timber architecture is studied for its response to earthquakes.', 'niasQuake'),
    materials: fact('history', 'Heavy hardwood posts, with structural members joined without relying on nails.', 'omoSebua'),
    hotspots: [
      { position: [0, 4.9, 0.9], label: 'Steep roof', text: 'Roof height is one of the most striking features of these houses.' },
      { position: [1.2, 0.8, 1.55], label: 'Diagonal braces', text: 'Upright and oblique timbers work together. This helps the structure respond to shaking.' },
      { position: [-1.4, 0.12, 1.55], label: 'Stone bases', text: 'Posts rest on stones in this representation of the foundation principle.' },
    ],
  },
  {
    id: 'hombo-batu', name: 'Stone-jumping structure (Hombo Batu)', origin: 'Nias, southern tradition', regionId: 'nias', camera: [5.5, 3, 6.5],
    description: 'A representation of the tall stone structure cleared in fahombo. No jumper is simulated.',
    history: fact('history', 'Accounts connect stone jumping with training in a period of inter-village conflict.', 'hombo'),
    significance: fact('contemporary', 'Today it is a cultural demonstration and a symbol of South Nias.', 'hombo'),
    hotspots: [
      { position: [0, 2.7, 0], label: 'Top', text: 'Published descriptions give a height of roughly two metres or more; figures vary.' },
      { position: [0.85, 1.2, 0.35], label: 'Stacked stone', text: 'The block pattern in this model is illustrative.' },
      { position: [0, 0.35, 1.35], label: 'Take-off stone', text: 'A small stone in front of the structure marks the take-off in this representation.' },
    ],
  },
  {
    id: 'ulos', name: 'Ulos textile study', origin: 'Batak weaving traditions', regionId: 'toba', camera: [0, 1.2, 6.5],
    description: 'An original striped textile generated in code. It evokes woven structure and is not a copy of any named ulos type.',
    history: fact('contemporary', 'Ulos weaving continues as a living craft in the Toba region.', 'unescoUlosProject'),
    significance: fact('tradition', 'Giving ulos can express blessing and affection within kinship relationships.', 'ulosStudy', 'ulosEncyclopedia'),
    hotspots: [
      { position: [0, 0.9, 0.25], label: 'Central field', text: 'The bands shown here are decorative. Real types have specific designs and names that should be learned from weavers.' },
      { position: [-1.75, 0.1, 0.25], label: 'Border', text: 'Borders and stripes are visible results of how threads are arranged on the loom.' },
      { position: [0.6, -1.65, 0.2], label: 'Fringe', text: 'Loose ends form a fringe in this representation.' },
    ],
  },
  {
    id: 'gondang', name: 'Taganing and ogung', origin: 'Batak Toba', regionId: 'toba', camera: [4.5, 3, 7],
    description: 'A partial view of a gondang sabangunan: a row of tuned drums with hanging gongs.',
    history: fact('tradition', 'The full ensemble also includes the gordang drum, the sarune bolon and the hesek. Instrument counts vary.', 'gondangRitual', 'taganing'),
    significance: fact('tradition', 'Gondang and tortor are closely connected in Toba ceremony.', 'gondangRitual'),
    hotspots: [
      { position: [0, 2.05, 0.5], label: 'Taganing', text: 'Drums of different sizes give different pitches. They can carry melodic patterns.' },
      { position: [2.5, 1.6, 0.2], label: 'Ogung', text: 'Gongs play interlocking repeated patterns.' },
      { position: [-1.65, 0.7, 0.45], label: 'Frame', text: 'The frame in this model is a simplified support.' },
    ],
  },
  {
    id: 'gordang', name: 'Gordang Sambilan', origin: 'Mandailing', regionId: 'mandailing', camera: [5, 3.5, 7.5],
    description: 'Nine drums in graded sizes. Proportions and placement are simplified.',
    history: fact('tradition', 'Gordang Sambilan literally refers to nine drums.', 'gordang'),
    significance: fact('tradition', 'The ensemble belongs to significant ceremonies and its use follows customary rules.', 'gordang'),
    hotspots: [
      { position: [0, 2.55, 0], label: 'Largest drums', text: 'Size differences produce different voices.' },
      { position: [-2.4, 1.35, 0.2], label: 'Graded row', text: 'The nine drums are played together by several musicians.' },
    ],
  },
  {
    id: 'sigale-gale', name: 'Sigale-gale puppet study', origin: 'Batak Toba, Samosir', regionId: 'samosir', camera: [3.5, 2.5, 7],
    description: 'A deliberately plain representation of a wooden puppet figure standing on a box platform. It does not reproduce the face, dress or mechanism of any real sigale-gale.',
    history: fact('tradition', 'Sigale-gale is a Batak Toba wooden puppet from Samosir, associated with the papurpur sapata funeral rite for people of high standing who died without children.', 'sigalegale'),
    significance: fact('contemporary', 'Today it is also well known to visitors. Its funerary background deserves respect when it is presented as a performance.', 'sigalegale'),
    hotspots: [
      { position: [0, 3.15, 0.35], label: 'Figure', text: 'The puppet is a human-like wooden figure. Features are left plain here on purpose.' },
      { position: [0.74, 2.2, 0.3], label: 'Arms', text: 'The figure is made to move. The joints in this model are illustrative.' },
      { position: [1.0, 0.55, 0.68], label: 'Platform', text: 'The figure stands on a box-like platform in this representation.' },
    ],
  },
  {
    id: 'gorga', name: 'Ornament panel study', origin: 'Inspired by Batak Toba gorga colours', regionId: 'samosir', camera: [0, 0.6, 6],
    description: 'An original geometric panel using the red, white and black palette. It is deliberately not a reproduction of a gorga motif.',
    history: fact('contemporary', 'Gorga carving is a Batak Toba craft that UNESCO included in a recovery project.', 'unescoUlosProject'),
    significance: fact('interpretation', 'Individual motifs are understood to carry meanings. This site does not assign meanings to motifs without a verified source.'),
    hotspots: [
      { position: [0, 0, 0.35], label: 'Three colours', text: 'Red, white and black are widely associated with gorga.' },
      { position: [1.45, 1.1, 0.3], label: 'Why not a copy?', text: 'Inventing a lookalike motif and giving it a meaning would mislead. This panel claims no symbolic meaning.' },
    ],
  },
];
