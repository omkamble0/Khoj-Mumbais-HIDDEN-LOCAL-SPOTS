import { calculateDistanceMeters } from './scoring';
import { Place } from './types';

export type TransitLineType = 'western' | 'central' | 'harbour' | 'metro_1' | 'metro_2a' | 'metro_7' | 'metro_3';

export interface TransitStation {
  id: string;
  name: string;
  hindi_name: string;
  marathi_name: string;
  lines: TransitLineType[];
  latitude: number;
  longitude: number;
  zone: 'South Mumbai' | 'Western Suburbs' | 'Central Suburbs' | 'Navi Mumbai' | 'Thane / Beyond';
  fast_train_stop?: boolean;
  exit_tips: string;
  auto_rickshaw_available: boolean; // Autos operate north of Bandra / Sion
}

export const TRANSIT_STATIONS: TransitStation[] = [
  // Western Railway (WR)
  {
    id: 'stn-churchgate',
    name: 'Churchgate',
    hindi_name: 'चर्चगेट',
    marathi_name: 'चर्चगेट',
    lines: ['western'],
    latitude: 18.9322,
    longitude: 72.8264,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'East exit towards Oval Maidan / Fort. West exit towards Marine Drive & Wankhede.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-marine-lines',
    name: 'Marine Lines',
    hindi_name: 'मरीन लाइन्स',
    marathi_name: 'मरीन लाइन्स',
    lines: ['western'],
    latitude: 18.9436,
    longitude: 72.8236,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'Flyover skywalk directly connects to Marine Drive promenade and Chandanwadi.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-charni-road',
    name: 'Charni Road',
    hindi_name: 'चर्नी रोड',
    marathi_name: 'चर्नी रोड',
    lines: ['western'],
    latitude: 18.9519,
    longitude: 72.8189,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'West exit onto Girgaon Chowpatty beach. East exit leads to Khotachiwadi & Opera House.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-grant-road',
    name: 'Grant Road',
    hindi_name: 'ग्रांट रोड',
    marathi_name: 'ग्रँट रोड',
    lines: ['western'],
    latitude: 18.9632,
    longitude: 72.8158,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'East exit towards Lamington Road electronics market. West exit towards Nana Chowk.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-mumbai-central',
    name: 'Mumbai Central',
    hindi_name: 'मुंबई सेंट्रल',
    marathi_name: 'मुंबई सेंट्रल',
    lines: ['western'],
    latitude: 18.9696,
    longitude: 72.8193,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'Major intercity terminal with AC skywalk connecting local and outstation platforms.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-mahalaxmi',
    name: 'Mahalaxmi',
    hindi_name: 'महालक्ष्मी',
    marathi_name: 'महालक्ष्मी',
    lines: ['western'],
    latitude: 18.9828,
    longitude: 72.8242,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'Exit bridge overlooks the historic Dhobi Ghat open-air laundry and Mahalaxmi Racecourse.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-lower-parel',
    name: 'Lower Parel',
    hindi_name: 'लोअर परेल',
    marathi_name: 'लोअर परळ',
    lines: ['western'],
    latitude: 18.9953,
    longitude: 72.8306,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'West exit leads into Phoenix Palladium & mill compounds. East connects to Currey Road (CR).',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-dadar-wr',
    name: 'Dadar (Western)',
    hindi_name: 'दादर (पश्चिम)',
    marathi_name: 'दादर (पश्चिम)',
    lines: ['western'],
    latitude: 19.0178,
    longitude: 72.8426,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'Major railway junction. West exit opens into flower bazaar & Shivaji Park route.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-bandra',
    name: 'Bandra',
    hindi_name: 'बांद्रा',
    marathi_name: 'वांद्रे',
    lines: ['western', 'harbour'],
    latitude: 19.0553,
    longitude: 72.8402,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'West exit skywalk leads to Lucky Restaurant, Hill Road & Bandstand. Autos operate on meter here!',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-khar-road',
    name: 'Khar Road',
    hindi_name: 'खार रोड',
    marathi_name: 'खार रोड',
    lines: ['western', 'harbour'],
    latitude: 19.0697,
    longitude: 72.8394,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'West exit into 1st Road Khar & Union Park cafes. Quiet suburban vibe.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-santacruz',
    name: 'Santacruz',
    hindi_name: 'सांताक्रूज़',
    marathi_name: 'सांताक्रूझ',
    lines: ['western', 'harbour'],
    latitude: 19.0817,
    longitude: 72.8413,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'East exit towards Western Express Highway. West exit opens into bustling shopping bazaar.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-vile-parle',
    name: 'Vile Parle',
    hindi_name: 'विले पार्ले',
    marathi_name: 'विलेपार्ले',
    lines: ['western', 'harbour'],
    latitude: 19.0988,
    longitude: 72.8439,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'West exit towards Mithibai & NMIMS college hub. East exit leads towards historic Parle village.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-andheri',
    name: 'Andheri',
    hindi_name: 'अंधेरी',
    marathi_name: 'अंधेरी',
    lines: ['western', 'harbour', 'metro_1'],
    latitude: 19.1197,
    longitude: 72.8464,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'Direct seamless elevated interchange with Metro Line 1 (Versova-Ghatkopar) on the east side.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-jogeshwari',
    name: 'Jogeshwari',
    hindi_name: 'जोगेश्वरी',
    marathi_name: 'जोगेश्वरी',
    lines: ['western', 'harbour'],
    latitude: 19.1353,
    longitude: 72.8492,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'East exit gives quick access to Jogeshwari Caves (6th century rock-cut shrine).',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-goregaon',
    name: 'Goregaon',
    hindi_name: 'गोरेगांव',
    marathi_name: 'गोरेगाव',
    lines: ['western', 'harbour'],
    latitude: 19.1554,
    longitude: 72.8492,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'East exit towards Aarey Colony & Film City. West exit towards Link Road hubs.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-malad',
    name: 'Malad',
    hindi_name: 'मलाड',
    marathi_name: 'मालाड',
    lines: ['western'],
    latitude: 19.1868,
    longitude: 72.8488,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'West exit for Marve Beach, Aksa Beach & Madh Island ferries via Marve Road.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-kandivali',
    name: 'Kandivali',
    hindi_name: 'कांदिवली',
    marathi_name: 'कांदिवली',
    lines: ['western'],
    latitude: 19.2045,
    longitude: 72.8519,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'West exit towards Mahavir Nagar food street. East connects to Thakur Village.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-borivali',
    name: 'Borivali',
    hindi_name: 'बोरीवली',
    marathi_name: 'बोरिवली',
    lines: ['western'],
    latitude: 19.2291,
    longitude: 72.8569,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'East exit is 800m from Sanjay Gandhi National Park & Kanheri Caves gate. West exit for Gorai ferry.',
    auto_rickshaw_available: true,
  },

  // Central Railway Main Line (CR)
  {
    id: 'stn-csmt',
    name: 'CSMT (Chhatrapati Shivaji Maharaj Terminus)',
    hindi_name: 'सीएसएमटी',
    marathi_name: 'सीएसएमटी',
    lines: ['central', 'harbour'],
    latitude: 18.9401,
    longitude: 72.8358,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'UNESCO World Heritage Gothic marvel. Platform 1-7 for local trains. Subway connects to Fort.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-byculla',
    name: 'Byculla',
    hindi_name: 'भायखला',
    marathi_name: 'भायखळा',
    lines: ['central'],
    latitude: 18.9768,
    longitude: 72.8331,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'Heritage-restored station. East exit opens directly to Dr. Bhau Daji Lad Museum & Rani Bagh.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-dadar-cr',
    name: 'Dadar (Central)',
    hindi_name: 'दादर (मध्य)',
    marathi_name: 'दादर (मध्य)',
    lines: ['central'],
    latitude: 19.0185,
    longitude: 72.8436,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'East exit leads to Hindu Colony and Five Gardens Matunga. Cross-over bridge to WR.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-matunga-cr',
    name: 'Matunga (Central)',
    hindi_name: 'माटुंगा',
    marathi_name: 'माटुंगा',
    lines: ['central'],
    latitude: 19.0272,
    longitude: 72.8558,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'India\'s first all-women operated station. Steps from iconic South Indian filter coffee & dosa joints.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-kurla',
    name: 'Kurla',
    hindi_name: 'कुर्ला',
    marathi_name: 'कुर्ला',
    lines: ['central', 'harbour'],
    latitude: 19.0657,
    longitude: 72.8794,
    zone: 'Central Suburbs',
    fast_train_stop: true,
    exit_tips: 'West exit leads to BKC (Bandra-Kurla Complex) via auto/bus. Major interchange junction.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-ghatkopar',
    name: 'Ghatkopar',
    hindi_name: 'घाटकोपर',
    marathi_name: 'घाटकोपर',
    lines: ['central', 'metro_1'],
    latitude: 19.0864,
    longitude: 72.9081,
    zone: 'Central Suburbs',
    fast_train_stop: true,
    exit_tips: 'Direct skywalk interchange to Metro Line 1. West exit opens into Khau Galli street food.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-thane',
    name: 'Thane',
    hindi_name: 'ठाणे',
    marathi_name: 'ठाणे',
    lines: ['central', 'harbour'],
    latitude: 19.186,
    longitude: 72.9754,
    zone: 'Thane / Beyond',
    fast_train_stop: true,
    exit_tips: 'Historic termination point of India\'s first train (1853). Gateway to Yeoor Hills & Upvan Lake.',
    auto_rickshaw_available: true,
  },

  // Metro Line 1 (Blue Line: Versova ⇄ Ghatkopar)
  {
    id: 'metro-versova',
    name: 'Versova Metro',
    hindi_name: 'वर्सोवा मेट्रो',
    marathi_name: 'वर्सोवा मेट्रो',
    lines: ['metro_1'],
    latitude: 19.1311,
    longitude: 72.8183,
    zone: 'Western Suburbs',
    exit_tips: 'Terminal station. 10 min walk to Versova Beach, Koliwada village & coastal cafes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro-dn-nagar',
    name: 'D.N. Nagar Metro (Line 1 & 2A Interchange)',
    hindi_name: 'डी.एन. नगर मेट्रो',
    marathi_name: 'डी.एन. नगर मेट्रो',
    lines: ['metro_1', 'metro_2a'],
    latitude: 19.1306,
    longitude: 72.8322,
    zone: 'Western Suburbs',
    exit_tips: 'Major interchange between Metro Line 1 and Line 2A (Yellow Line to Dahisar West).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro-azad-nagar',
    name: 'Azad Nagar Metro',
    hindi_name: 'आज़ाद नगर मेट्रो',
    marathi_name: 'आझाद नगर मेट्रो',
    lines: ['metro_1'],
    latitude: 19.1287,
    longitude: 72.8364,
    zone: 'Western Suburbs',
    exit_tips: 'Steps from Road House Bluez & JP Road rock pubs.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro-andheri',
    name: 'Andheri Metro',
    hindi_name: 'अंधेरी मेट्रो',
    marathi_name: 'अंधेरी मेट्रो',
    lines: ['metro_1', 'western'],
    latitude: 19.1197,
    longitude: 72.8464,
    zone: 'Western Suburbs',
    exit_tips: 'Direct walkover to Andheri Western railway platform.',
    auto_rickshaw_available: true,
  },

  // Metro Line 3 (Aqua Underground Metro)
  {
    id: 'metro3-bkc',
    name: 'BKC Metro (Line 3 Underground)',
    hindi_name: 'बीकेसी मेट्रो',
    marathi_name: 'बीकेसी मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0665,
    longitude: 72.8685,
    zone: 'Western Suburbs',
    exit_tips: 'Underground air-conditioned terminal serving Bandra-Kurla Complex.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-aarey',
    name: 'Aarey JVLR Metro (Line 3)',
    hindi_name: 'आरे जेवीएलआर मेट्रो',
    marathi_name: 'आरे जेव्हीएलआर मेट्रो',
    lines: ['metro_3'],
    latitude: 19.1394,
    longitude: 72.8785,
    zone: 'Western Suburbs',
    exit_tips: 'At the gateway of Aarey Green forest trails and picnic spots.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-airport-t2',
    name: 'CSMI Airport T2 Metro (Line 3)',
    hindi_name: 'हवाई अड्डा टी२ मेट्रो',
    marathi_name: 'विमानतळ टी२ मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0968,
    longitude: 72.8745,
    zone: 'Western Suburbs',
    exit_tips: 'Direct subterranean connection to Terminal 2 Chhatrapati Shivaji Maharaj International Airport.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-worli',
    name: 'Worli Metro (Line 3)',
    hindi_name: 'वरली मेट्रो',
    marathi_name: 'वरळी मेट्रो',
    lines: ['metro_3'],
    latitude: 19.016,
    longitude: 72.818,
    zone: 'South Mumbai',
    exit_tips: 'Walking distance to Nehru Centre, Planetarium, and Worli Seaface.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-cuffe-parade',
    name: 'Cuffe Parade Metro (Line 3 Terminus)',
    hindi_name: 'कफ परेड मेट्रो',
    marathi_name: 'कफ परेड मेट्रो',
    lines: ['metro_3'],
    latitude: 18.915,
    longitude: 72.818,
    zone: 'South Mumbai',
    exit_tips: 'South-most terminus. Gateway to Colaba, Afghan Church, and Sassoon Docks.',
    auto_rickshaw_available: false,
  },

  // Harbour Line & Navi Mumbai Connectors
  {
    id: 'stn-wadala-road',
    name: 'Wadala Road',
    hindi_name: 'वडाला रोड',
    marathi_name: 'वडाळा रोड',
    lines: ['harbour'],
    latitude: 19.0163,
    longitude: 72.8593,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'Major Harbour junction splitting toward Panvel (Navi Mumbai) and Andheri (WR interchange).',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-chembur',
    name: 'Chembur',
    hindi_name: 'चेंबूर',
    marathi_name: 'चेंबर',
    lines: ['harbour'],
    latitude: 19.0624,
    longitude: 72.8997,
    zone: 'Central Suburbs',
    fast_train_stop: false,
    exit_tips: 'East exit towards Diamond Garden and Sindhi Camp food heritage.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-vashi',
    name: 'Vashi',
    hindi_name: 'वाशी',
    marathi_name: 'वाशी',
    lines: ['harbour'],
    latitude: 19.0645,
    longitude: 72.9984,
    zone: 'Navi Mumbai',
    fast_train_stop: true,
    exit_tips: 'First station across the Thane Creek bridge entering Navi Mumbai. Station complex has shopping mall & IT park.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-cbd-belapur',
    name: 'CBD Belapur',
    hindi_name: 'सीबीडी बेलापूर',
    marathi_name: 'सीबीडी बेलापूर',
    lines: ['harbour'],
    latitude: 19.0205,
    longitude: 73.0402,
    zone: 'Navi Mumbai',
    fast_train_stop: true,
    exit_tips: 'Gateway to Parsik Hill waterfalls, Artists Village, and Kharghar hills.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-panvel',
    name: 'Panvel',
    hindi_name: 'पनवेल',
    marathi_name: 'पनवेल',
    lines: ['harbour'],
    latitude: 18.9894,
    longitude: 73.1215,
    zone: 'Navi Mumbai',
    fast_train_stop: true,
    exit_tips: 'Terminal station of Harbour line. Hub for Karnala Bird Sanctuary and Western Ghats forts.',
    auto_rickshaw_available: true,
  },

  // Central Railway Suburbs & Beyond
  {
    id: 'stn-bhandup',
    name: 'Bhandup',
    hindi_name: 'भांडुप',
    marathi_name: 'भांडुप',
    lines: ['central'],
    latitude: 19.1437,
    longitude: 72.9366,
    zone: 'Central Suburbs',
    fast_train_stop: false,
    exit_tips: 'Access to Bhandup Pumping Station flamingo sanctuary & coastal wetland walks.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-mulund',
    name: 'Mulund',
    hindi_name: 'मुलुंड',
    marathi_name: 'मुलुंड',
    lines: ['central'],
    latitude: 19.1726,
    longitude: 72.9564,
    zone: 'Central Suburbs',
    fast_train_stop: true,
    exit_tips: 'Quiet tree-lined residential suburb. Starting point for Yogi Hills trails.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-kalyan',
    name: 'Kalyan Junction',
    hindi_name: 'कल्याण जंक्शन',
    marathi_name: 'कल्याण जंक्शन',
    lines: ['central'],
    latitude: 19.2372,
    longitude: 73.1308,
    zone: 'Thane / Beyond',
    fast_train_stop: true,
    exit_tips: 'Historic major terminus connecting Kasara/Nashik and Karjat/Pune mountain routes.',
    auto_rickshaw_available: true,
  },
];

/**
 * Ordered station tracks for rendering Mumbai's iconic suburban rail spine lines on Leaflet
 */
export interface TransitLineTrack {
  id: TransitLineType;
  name: string;
  code: string;
  color: string;
  coordinates: [number, number][];
}

export const TRANSIT_LINE_TRACKS: TransitLineTrack[] = [
  {
    id: 'western',
    name: 'Western Railway',
    code: 'WR',
    color: '#e11d48', // Crimson Red
    coordinates: [
      [18.9322, 72.8264], // Churchgate
      [18.9436, 72.8236], // Marine Lines
      [18.9519, 72.8189], // Charni Road
      [18.9632, 72.8158], // Grant Road
      [18.9696, 72.8193], // Mumbai Central
      [18.9828, 72.8242], // Mahalaxmi
      [18.9953, 72.8306], // Lower Parel
      [19.0178, 72.8426], // Dadar WR
      [19.0553, 72.8402], // Bandra
      [19.0697, 72.8394], // Khar Road
      [19.0817, 72.8413], // Santacruz
      [19.0988, 72.8439], // Vile Parle
      [19.1197, 72.8464], // Andheri
      [19.1353, 72.8492], // Jogeshwari
      [19.1554, 72.8492], // Goregaon
      [19.1868, 72.8488], // Malad
      [19.2045, 72.8519], // Kandivali
      [19.2291, 72.8569], // Borivali
    ],
  },
  {
    id: 'central',
    name: 'Central Railway Main',
    code: 'CR',
    color: '#d97706', // Ochre / Amber
    coordinates: [
      [18.9401, 72.8358], // CSMT
      [18.9768, 72.8331], // Byculla
      [19.0185, 72.8436], // Dadar CR
      [19.0272, 72.8558], // Matunga CR
      [19.0657, 72.8794], // Kurla
      [19.0864, 72.9081], // Ghatkopar
      [19.1437, 72.9366], // Bhandup
      [19.1726, 72.9564], // Mulund
      [19.1860, 72.9754], // Thane
      [19.2372, 73.1308], // Kalyan
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour Line',
    code: 'HR',
    color: '#2563eb', // Royal Cobalt Blue
    coordinates: [
      [18.9401, 72.8358], // CSMT
      [19.0163, 72.8593], // Wadala Road
      [19.0657, 72.8794], // Kurla
      [19.0624, 72.8997], // Chembur
      [19.0645, 72.9984], // Vashi
      [19.0205, 73.0402], // CBD Belapur
      [18.9894, 73.1215], // Panvel
    ],
  },
  {
    id: 'metro_1',
    name: 'Metro Line 1 (Versova-Ghatkopar)',
    code: 'M1',
    color: '#0891b2', // Cyan Blue
    coordinates: [
      [19.1311, 72.8183], // Versova
      [19.1306, 72.8322], // DN Nagar
      [19.1287, 72.8364], // Azad Nagar
      [19.1197, 72.8464], // Andheri
      [19.0864, 72.9081], // Ghatkopar
    ],
  },
  {
    id: 'metro_3',
    name: 'Metro Line 3 (Aqua Line)',
    code: 'M3',
    color: '#059669', // Emerald Green
    coordinates: [
      [18.9150, 72.8180], // Cuffe Parade
      [18.9322, 72.8264], // Churchgate
      [19.0160, 72.8180], // Worli
      [19.0665, 72.8685], // BKC
      [19.0968, 72.8745], // Airport T2
      [19.1394, 72.8785], // Aarey JVLR
    ],
  },
];

export interface SanctuaryTransitProfile {
  nearestRailway: {
    station: TransitStation;
    distanceMeters: number;
    distanceKm: number;
    walkMinutes: number;
    rickshawMinutes: number;
    estimatedFare: number;
  };
  nearestMetro?: {
    station: TransitStation;
    distanceMeters: number;
    distanceKm: number;
    walkMinutes: number;
  };
  recommendedConnection: string;
}

/**
 * Calculates nearest suburban railway station & metro for any given coordinate.
 */
export function getSanctuaryTransitProfile(lat: number, lng: number): SanctuaryTransitProfile {
  let nearestRail: TransitStation = TRANSIT_STATIONS[0];
  let minRailDist = Infinity;

  let nearestMetro: TransitStation | undefined = undefined;
  let minMetroDist = Infinity;

  for (const stn of TRANSIT_STATIONS) {
    const dist = calculateDistanceMeters(lat, lng, stn.latitude, stn.longitude);

    const isMetroOnly = stn.lines.some((l) => l.startsWith('metro')) && !stn.lines.includes('western') && !stn.lines.includes('central') && !stn.lines.includes('harbour');
    
    if (isMetroOnly) {
      if (dist < minMetroDist) {
        minMetroDist = dist;
        nearestMetro = stn;
      }
    } else {
      if (dist < minRailDist) {
        minRailDist = dist;
        nearestRail = stn;
      }
    }
  }

  const railDistKm = Math.round((minRailDist / 1000) * 10) / 10;
  const walkMinutes = Math.round(minRailDist / 80); // ~4.8 km/h walking speed
  const rickshawMinutes = Math.max(4, Math.round(minRailDist / 300)); // ~18 km/h suburban traffic speed
  
  // Mumbai Auto Rickshaw Minimum Meter Fare = ₹23 for first 1.5km, then ₹15.33 per km
  const estimatedFare = nearestRail.auto_rickshaw_available
    ? Math.max(23, Math.round(23 + Math.max(0, railDistKm - 1.5) * 15.33))
    : 0; // South Mumbai has Kaali Peeli taxis starting at ₹28

  let recommendedConnection = '';
  if (minRailDist <= 800) {
    recommendedConnection = `🚶 Quick ${walkMinutes} min walk from ${nearestRail.name} station. ${nearestRail.exit_tips}`;
  } else if (nearestRail.auto_rickshaw_available) {
    recommendedConnection = `🛺 ${rickshawMinutes} min meter rickshaw (approx ₹${estimatedFare}) or shared auto from ${nearestRail.name}.`;
  } else {
    recommendedConnection = `🚕 Short kaali-peeli taxi ride (min fare ₹28) or brisk walk from ${nearestRail.name}.`;
  }

  return {
    nearestRailway: {
      station: nearestRail,
      distanceMeters: Math.round(minRailDist),
      distanceKm: railDistKm,
      walkMinutes,
      rickshawMinutes,
      estimatedFare,
    },
    nearestMetro: nearestMetro
      ? {
          station: nearestMetro,
          distanceMeters: Math.round(minMetroDist),
          distanceKm: Math.round((minMetroDist / 1000) * 10) / 10,
          walkMinutes: Math.round(minMetroDist / 80),
        }
      : undefined,
    recommendedConnection,
  };
}

/**
 * Returns all sanctuaries reachable from a specific station within an accessible radius.
 */
export function getSanctuariesNearStation(station: TransitStation, places: Place[], radiusMeters: number = 3500) {
  return places
    .map((p) => {
      const dist = calculateDistanceMeters(station.latitude, station.longitude, p.latitude, p.longitude);
      return {
        ...p,
        distance_to_station: Math.round(dist),
        walk_minutes: Math.round(dist / 80),
      };
    })
    .filter((p) => p.distance_to_station <= radiusMeters)
    .sort((a, b) => a.distance_to_station - b.distance_to_station);
}

/**
 * Live Mumbai Suburban train rush hour advisory based on current local hour.
 */
export function getMumbaiTransitCrowdAdvisory() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const totalMinutes = currentHour * 60 + currentMinutes;

  // Morning Rush: 8:30 AM to 11:30 AM (510 min to 690 min)
  const isMorningRush = totalMinutes >= 510 && totalMinutes <= 690;
  // Evening Rush: 5:30 PM to 9:00 PM (1050 min to 1260 min)
  const isEveningRush = totalMinutes >= 1050 && totalMinutes <= 1260;
  // Afternoon Lull: 1:00 PM to 4:30 PM (780 min to 990 min)
  const isAfternoonLull = totalMinutes >= 780 && totalMinutes <= 990;

  if (isMorningRush) {
    return {
      status: 'HIGH RUSH (MORNING PEAK)',
      color: 'bg-rose-600 text-white',
      badge: '⚠️ PEAK CONGESTION',
      directionTip: 'Southbound trains to Churchgate & CSMT are intensely packed. Reverse/Northbound trains are comfortable!',
      travelAdvice: 'Board AC Locals, Metro lines, or travel against the peak flow.',
    };
  }

  if (isEveningRush) {
    return {
      status: 'HIGH RUSH (EVENING PEAK)',
      color: 'bg-rose-600 text-white',
      badge: '⚠️ PEAK CONGESTION',
      directionTip: 'Northbound trains towards Borivali, Virar, Kalyan & Thane are heavily crowded. Southbound trains have plenty of room!',
      travelAdvice: 'Take reverse trains to South Mumbai sanctuaries or wait until 9:15 PM.',
    };
  }

  if (isAfternoonLull) {
    return {
      status: 'GOLDEN HOURS (AFTERNOON CALM)',
      color: 'bg-emerald-600 text-white',
      badge: '🌿 BREEZY & COMFORTABLE',
      directionTip: 'Trains across all lines have plenty of open seats and breezy window spots.',
      travelAdvice: 'Ideal time for station-hopping and crossing between suburbs.',
    };
  }

  return {
    status: 'MODERATE (SMOOTH TRANSIT)',
    color: 'bg-amber-600 text-white',
    badge: '● MODERATE FLOW',
    directionTip: 'Suburban trains run smoothly on 3-minute headway with comfortable room.',
    travelAdvice: 'Use UTS mobile app for instant paperless QR ticketing.',
  };
}

