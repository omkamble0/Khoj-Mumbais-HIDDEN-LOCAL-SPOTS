const fs = require('fs');
const path = require('path');

const MASTER_FILE = path.join(__dirname, '..', 'data', 'places_mumbai.json');
const FF_FILE = path.join(__dirname, '..', 'data', 'places_mumbai', 'fastfood.json');

const KHAR_SANTACRUZ_BATCH = [
  {
    id: "ff-mcd-khar-west-sv-road",
    slug: "mcdonalds-khar-west-sv-road",
    name: "McDonald's (Khar West / SV Road)",
    short_name: "McD Khar West",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Khar West / SV Road",
    latitude: 19.06950,
    longitude: 72.83620,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Arterial SV Road location with steady pedestrian movement and street lighting.",
    hiddenness_score: 0.2,
    vibe_score: 0.86,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Afternoon & late evening (3:00 PM – 9:00 PM)",
    description: "Convenient suburban high-street McDonald's on SV Road. Popular among college students from National and Thadomal Shahani for McSpicy burgers, fries, and milkshakes.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "khar-west",
      "burgers",
      "college-hangout",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Khar West",
        floor: "Ground Floor",
        timing: "8:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-mcd-santacruz-west-station",
    slug: "mcdonalds-santacruz-west-sv-road",
    name: "McDonald's (Santacruz West / SV Road)",
    short_name: "McD Santacruz West",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Santacruz West / Station Approach",
    latitude: 19.08150,
    longitude: 72.83850,
    access_type: "public",
    safety_level: "high",
    safety_notes: "High-density retail junction near Podar School and Santacruz Station.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Lunch and evening rush (1:00 PM – 8:30 PM)",
    description: "Spacious two-level McDonald's right on the bustling SV Road junction near Santacruz local station and Podar School. Serving signature burgers, wraps, and soft serves.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "santacruz-west",
      "burgers",
      "station-approach",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Santacruz West",
        floor: "Ground & 1st Floor",
        timing: "8:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-mcd-santacruz-east-vakola",
    slug: "mcdonalds-santacruz-east-vakola",
    name: "McDonald's (Santacruz East / Vakola)",
    short_name: "McD Vakola",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Santacruz East / Vakola",
    latitude: 19.08380,
    longitude: 72.85620,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Major transit point connecting Western Express Highway and Santacruz East.",
    hiddenness_score: 0.2,
    vibe_score: 0.85,
    safety_score: 0.95,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Evening and highway commute hours",
    description: "Western Express Highway corridor drive-thru and quick-bite McDonald's serving Vakola residents and airport transit commuters with hot burgers and fast service.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "santacruz-east",
      "vakola",
      "highway-corridor",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Vakola",
        floor: "Ground Floor",
        timing: "7:30 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-bk-khar-linking-road",
    slug: "burger-king-khar-linking-road",
    name: "Burger King (Khar West / 14th Road)",
    short_name: "Burger King Khar",
    category: "cafes",
    subcategory: "Burger King Fast Food Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Khar West / Linking Road",
    latitude: 19.06820,
    longitude: 72.83510,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Premier retail strip with continuous shopping footfall and private security.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.96,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Evening shopping hours (4:30 PM – 9:00 PM)",
    description: "Vibrant Burger King on the bustling Khar-Bandra shopping stretch. Flame-grilled Whoppers, Crispy Veg Burgers, and thick chocolate shakes.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "whopper",
      "khar-west",
      "linking-road",
      "burgers",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger king",
        name: "Burger King Khar Linking Road",
        floor: "Ground Floor",
        timing: "10:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-bk-santacruz-east-kalina",
    slug: "burger-king-santacruz-east-kalina",
    name: "Burger King (Santacruz East / Kalina)",
    short_name: "Burger King Kalina",
    category: "cafes",
    subcategory: "Burger King Fast Food Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Santacruz East / Kalina University Corridor",
    latitude: 19.07720,
    longitude: 72.86450,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly located on CST Road connecting Kalina to BKC with heavy student flow.",
    hiddenness_score: 0.2,
    vibe_score: 0.90,
    safety_score: 0.96,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Lunch & college break hours (12:30 PM – 5:30 PM)",
    description: "High-volume youth hangout near Mumbai University Kalina campus and BKC connector. Popular study hub and affordable burger spot for university students.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "whopper",
      "kalina",
      "santacruz-east",
      "university-adda",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger king",
        name: "Burger King Kalina",
        floor: "Ground Floor",
        timing: "10:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-kfc-santacruz-west",
    slug: "kfc-santacruz-west-station-road",
    name: "KFC (Santacruz West / Station Road)",
    short_name: "KFC Santacruz",
    category: "cafes",
    subcategory: "KFC Fried Chicken Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹399 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Santacruz West / Station Road",
    latitude: 19.08210,
    longitude: 72.83900,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Busy commercial street leading directly to Santacruz Western Railway station.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.95,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Evening and weekend dinners (5:00 PM – 9:30 PM)",
    description: "Quick-serve KFC restaurant serving Hot & Crispy chicken buckets, Zinger burgers, and popcorn chicken right off Santacruz station.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "zinger",
      "santacruz-west",
      "station-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC Santacruz West",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-subway-santacruz-west",
    slug: "subway-santacruz-west-juhu-road",
    name: "Subway (Santacruz West / Juhu Road)",
    short_name: "Subway Santacruz",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Santacruz West / Juhu Road",
    latitude: 19.08020,
    longitude: 72.83540,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Arterial road connecting SV Road to Juhu with well-lit retail frontage.",
    hiddenness_score: 0.2,
    vibe_score: 0.87,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Lunch (1:00 PM – 3:30 PM) or quick dinner",
    description: "Fresh custom 6-inch subs, wraps, and cookies on the arterial route connecting Santacruz Station to Juhu Beach.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "healthy-bites",
      "santacruz-west",
      "juhu-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Santacruz West",
        floor: "Ground Floor",
        timing: "9:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-dominos-khar-west",
    slug: "dominos-khar-west-14th-road",
    name: "Domino's Pizza (Khar West / 14th Road)",
    short_name: "Domino's Khar West",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Khar West / 14th Road",
    latitude: 19.07010,
    longitude: 72.83420,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Quiet, leafy residential bylane off Linking Road.",
    hiddenness_score: 0.2,
    vibe_score: 0.88,
    safety_score: 0.97,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Evening pizza cravings (6:00 PM – 10:30 PM)",
    description: "Cozy neighborhood Domino's in Khar West. Hot Cheese Burst pizzas, Stuffed Garlic Bread, and Choco Lava Cakes.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "khar-west",
      "14th-road",
      "cheese-burst",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Khar West",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-dominos-santacruz-east-vakola",
    slug: "dominos-santacruz-east-vakola",
    name: "Domino's Pizza (Santacruz East / Vakola)",
    short_name: "Domino's Vakola",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Santacruz East / Vakola",
    latitude: 19.08180,
    longitude: 72.85450,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Commercial retail row on Nehru Road with dense local residential footfall.",
    hiddenness_score: 0.2,
    vibe_score: 0.86,
    safety_score: 0.95,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Lunch and dinner rush (12:00 PM – 10:00 PM)",
    description: "Bustling central kitchen and dine-in pizzeria serving Vakola, Kalina, and Mumbai Airport transit corridors with quick-serve pizzas.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "santacruz-east",
      "vakola",
      "airport-transit",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Vakola",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-pizzahut-santacruz-west",
    slug: "pizza-hut-santacruz-west-sv-road",
    name: "Pizza Hut (Santacruz West / Podar Junction)",
    short_name: "Pizza Hut Santacruz",
    category: "cafes",
    subcategory: "Pizza Hut Pan Pizza & Pasta",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹550 for two",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Santacruz West / SV Road",
    latitude: 19.08420,
    longitude: 72.83480,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Well-patrolled SV Road retail hub near school junction.",
    hiddenness_score: 0.2,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Evenings (6:30 PM – 10:30 PM)",
    description: "Casual dining Pizza Hut serving signature personal pan pizzas, cheesy garlic bread, and pastas near Podar World School junction.",
    vibe_tags: [
      "fast-food",
      "pizza-hut",
      "pizza",
      "pan-pizza",
      "santacruz-west",
      "sv-road",
      "comfort-food"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "pizza hut",
        name: "Pizza Hut Santacruz West",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tibbs-santacruz-station-west",
    slug: "tibbs-frankie-santacruz-station-west",
    name: "Tibbs Frankie (Santacruz Station West)",
    short_name: "Tibbs Santacruz",
    category: "cafes",
    subcategory: "Tibbs Original Mumbai Frankie",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹70–₹160 per frankie",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Santacruz West / Station Forecourt",
    latitude: 19.08220,
    longitude: 72.83980,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Right outside station ticket hall with heavy commuter pedestrian traffic.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 4,
    best_time_to_visit: "Evening commuter rush (5:30 PM – 9:00 PM)",
    description: "Classic commuter kiosk serving piping-hot Mumbai frankies with tangy vinegar onions and secret spices right outside the local station.",
    vibe_tags: [
      "fast-food",
      "tibbs",
      "frankie",
      "rolls",
      "mumbai-original",
      "santacruz-station",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "tibbs frankie",
        name: "Tibbs Frankie Santacruz",
        floor: "Station Road Kiosk",
        timing: "11:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-khar-station-west",
    slug: "jumbo-king-khar-station-west",
    name: "Jumbo King (Khar Station West)",
    short_name: "Jumbo King Khar",
    category: "cafes",
    subcategory: "Jumbo King Mumbai Burger Chain",
    spot_tier: "iconic",
    budget_tier: "free",
    approx_cost: "₹39–₹89 per burger",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Khar West / Station Exit",
    latitude: 19.06830,
    longitude: 72.83990,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Direct station exit location with constant auto-rickshaw queue and security.",
    hiddenness_score: 0.1,
    vibe_score: 0.85,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Morning rush & evening return commute",
    description: "Grab-and-go Mumbai burger joint right at Khar station. Crispy Schezwan and cheese potato burgers for fast suburban transit snacking.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "burger",
      "desi-burger",
      "khar-station",
      "pocket-friendly",
      "quick-grab"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo king",
        name: "Jumbo King Khar Station",
        floor: "Station Exit 1",
        timing: "7:00 AM – 11:00 PM"
      }
    ]
  }
];

function seed() {
  console.log('Seeding Khar & Santacruz Batch into Fastfood and Master places...');
  let ff = JSON.parse(fs.readFileSync(FF_FILE, 'utf8'));
  let master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));

  let addedCount = 0;
  for (const place of KHAR_SANTACRUZ_BATCH) {
    if (!ff.some(p => p.id === place.id)) {
      ff.push(place);
      addedCount++;
    }
    if (!master.some(p => p.id === place.id)) {
      master.push(place);
    }
  }

  fs.writeFileSync(FF_FILE, JSON.stringify(ff, null, 2), 'utf8');
  fs.writeFileSync(MASTER_FILE, JSON.stringify(master, null, 2), 'utf8');

  console.log(`Successfully added ${addedCount} verified Khar & Santacruz fast-food venues.`);
  console.log(`fastfood.json count: ${ff.length}`);
  console.log(`master places_mumbai.json count: ${master.length}`);
}

seed();

