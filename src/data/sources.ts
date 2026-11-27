export interface Source {
  title: string;
  publisher: string;
  url: string;
  type: 'Heritage institution' | 'Academic' | 'Government / public media' | 'Encyclopedia' | 'Press';
}

/**
 * Starting points for verification. They were located through web search and reviewed as summaries and
 * excerpts, not as full texts. A subject specialist should check each claim before formal teaching use.
 */
export const SOURCES = {
  unescoBawomataluo: { title: 'Bawomataluo Site (Tentative List, ref. 5463)', publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/tentativelists/5463', type: 'Heritage institution' },
  unescoUlosProject: { title: 'Young professionals in Toba lead post-pandemic recovery: Ulos weavers and Gorga sculptors', publisher: 'UNESCO Intangible Cultural Heritage', url: 'https://ich.unesco.org/es/noticias/los-jvenes-profesionales-de-toba-indonesia-lideran-la-recuperacin-tras-la-pandemia-13404?newsID=13404', type: 'Heritage institution' },
  wmfNias: { title: 'Traditional architecture of Nias', publisher: 'World Monuments Fund', url: 'https://wmf.org/node/14016', type: 'Heritage institution' },
  nasaToba: { title: 'Toba Caldera', publisher: 'NASA Earth Observatory', url: 'https://earthobservatory.nasa.gov/images/7380/toba-caldera', type: 'Heritage institution' },
  britannicaToba: { title: 'Mount Toba', publisher: 'Encyclopaedia Britannica', url: 'https://www.britannica.com/place/Mount-Toba', type: 'Encyclopedia' },
  legendDetik: { title: '2 versi cerita asal usul Danau Toba', publisher: 'detikSumut', url: 'https://www.detik.com/sumut/wisata/d-6761917/2-versi-cerita-asal-usul-danau-toba', type: 'Press' },
  legendGnfi: { title: 'Legenda Putri Ikan dari Sumatra Utara', publisher: 'Good News From Indonesia', url: 'https://www.goodnewsfromindonesia.id/2024/10/25/legenda-putri-ikan-dari-sumatra-utara-yang-dipercaya-menjadi-asal-usul-danau-toba', type: 'Press' },
  tobaHouseForm: { title: 'Form and Meaning of Batak Toba House (Sitindjak & Wardani)', publisher: 'Atlantis Press', url: 'https://www.atlantis-press.com/article/25906963.pdf', type: 'Academic' },
  gorgaFloresiensis: { title: 'Study of the Rumah Bolon in Siallagan village and its gorga', publisher: 'Jurnal Floresiensis, Universitas Nusa Cendana', url: 'https://ejurnal.undana.ac.id/index.php/floresiensis/article/download/21423/8755', type: 'Academic' },
  batakArchitecture: { title: 'Batak architecture', publisher: 'Wikipedia (use its references)', url: 'https://en.wikipedia.org/wiki/Rumah_Batak', type: 'Encyclopedia' },
  gondangRitual: { title: 'Gondang function at the Patarias Debata Mulajadi Nabolon ritual ceremony', publisher: 'Gondang: Jurnal Seni dan Budaya, Unimed', url: 'https://jurnal.unimed.ac.id/2012/index.php/GDG/article/view/76555', type: 'Academic' },
  taganing: { title: 'Analisis taganing dalam tradisi musik gondang sabangunan Batak Toba', publisher: 'Saraswati, ISI Yogyakarta', url: 'https://journal.isi.ac.id/index.php/saraswati/article/view/297', type: 'Academic' },
  ulosStudy: { title: 'Study of ulos types and their use in Batak Toba ceremony', publisher: 'JOM FISIP, Universitas Riau', url: 'https://jom.unri.ac.id/index.php/JOMFSIP/article/download/26787/25895', type: 'Academic' },
  ulosEncyclopedia: { title: 'Ulos', publisher: 'Wikipedia (use its references)', url: 'https://en.wikipedia.org/wiki/Ulos', type: 'Encyclopedia' },
  karoSpace: { title: 'Studi tata ruang rumah adat Siwaluh Jabu, Desa Lingga', publisher: 'Dimensi, Universitas Trisakti', url: 'https://e-journal.trisakti.ac.id/index.php/dimensi/article/view/7057', type: 'Academic' },
  karoHeritage: { title: 'Rumah adat Siwaluh Jabu Desa Budaya Lingga sebagai warisan budaya', publisher: 'JPDSH', url: 'https://bajangjournal.com/index.php/JPDSH/article/view/6211', type: 'Academic' },
  mandailingBuildings: { title: 'Mandailing traditional buildings and village space', publisher: 'Bercadik, ISI Padangpanjang', url: 'https://journal.isi-padangpanjang.ac.id/index.php/Bercadik/article/download/44/32', type: 'Academic' },
  dalihanCore: { title: 'Dalihan Na Tolu in Angkola-Mandailing ceremony', publisher: 'CORE repository', url: 'https://core.ac.uk/download/304207208.pdf', type: 'Academic' },
  gordang: { title: 'Gordang sambilan', publisher: 'Wikipedia (use its references)', url: 'https://en.wikipedia.org/wiki/Gordang_sambilan', type: 'Encyclopedia' },
  pakpakSuak: { title: 'Study of the Pakpak Silima Suak (five customary regions)', publisher: 'Jurnal Universitas Islam Sumatera Utara', url: 'https://jurnal.uisu.ac.id/index.php/best/article/download/13232/8667', type: 'Academic' },
  pakpakHistory: { title: 'Article on Pakpak customary territory and its administrative division', publisher: 'Jurnal Masyarakat Indonesia, LIPI', url: 'https://jmi.ipsk.lipi.go.id/index.php/jmiipsk/article/download/609/400', type: 'Academic' },
  simalungunAdat: { title: 'Hata-hata mambere podah and the serving of dayok binatur', publisher: 'Bahastra, UISU', url: 'https://jurnal.uisu.ac.id/index.php/Bahastra/article/download/1720/1305', type: 'Academic' },
  simalungunOrnament: { title: 'Bolon House Pematang Purba Ornament: Semiotic Study', publisher: 'SciTePress', url: 'https://www.scitepress.org/publishedPapers/2018/99004/pdf/index.html', type: 'Academic' },
  niasQuake: { title: 'Earthquake resilience of traditional Nias Island houses: lessons from 2004 and 2005', publisher: 'IIETA', url: 'https://iieta.org/node/16371', type: 'Academic' },
  omoSebua: { title: 'Omo sebua', publisher: 'Wikipedia (use its references)', url: 'https://en.wikipedia.org/wiki/Omo_sebua', type: 'Encyclopedia' },
  hombo: { title: 'Makna di balik tradisi Lompat Batu Nias', publisher: 'detikSumut', url: 'https://www.detik.com/sumut/budaya/d-8759266/makna-di-balik-tradisi-lompat-batu-nias', type: 'Press' },
  niasMaena: { title: 'Cultural values of maena in the Falöwa wedding ceremony', publisher: 'Anthropos, Unimed', url: 'https://jurnal.unimed.ac.id/2012/index.php/antrophos/article/view/24772/16427', type: 'Academic' },
  niasMinistry: { title: 'Menteri Kebudayaan ajak semua pihak lestarikan budaya Nias Selatan', publisher: 'RRI (public broadcaster)', url: 'https://rri.co.id/nias-selatan/nasional/2606955/menteri-kebudayaan-ajak-semua-pihak-bersinergi-lestarikan-budaya-nias-selatan', type: 'Government / public media' },
  maimun: { title: 'Istana Maimun', publisher: 'Wonderful Indonesia (national tourism portal)', url: 'https://www.indonesia.travel/gb/en/destination/sumatra/north-sumatra/istana-maimun', type: 'Government / public media' },
  medanSites: { title: 'Five sites to visit on your trip to Medan', publisher: 'The Jakarta Post', url: 'https://www.thejakartapost.com/travel/2018/08/29/five-sites-to-visit-on-your-trip-to-medan', type: 'Press' },
  arsik: { title: 'Arsik', publisher: 'Wikipedia (use its references)', url: 'https://en.wikipedia.org/wiki/Arsik', type: 'Encyclopedia' },
  andaliman: { title: 'Andaliman, the Batak pepper culinary legacy of North Sumatra', publisher: 'RRI (public broadcaster)', url: 'https://rri.co.id/en/culinary/1515662/andaliman-the-batak-pepper-culinary-legacy-of-north-sumatra', type: 'Government / public media' },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;
