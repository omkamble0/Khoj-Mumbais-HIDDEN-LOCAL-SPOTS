const fs = require('fs');
const path = require('path');

const MASTER_FILE = path.join(__dirname, '..', 'data', 'places_mumbai.json');
const FF_FILE = path.join(__dirname, '..', 'data', 'places_mumbai', 'fastfood.json');

const BANDRA_BATCH = [
  {
    id: "ff-mcd-bandra-station-west",
    slug: "mcdonalds-bandra-station-west",
    name: "McDonald's (Bandra Station West)",
    short_name: "McD Bandra Station",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Bandra West / Station Road",
    latitude: 19.05552,
    longitude: 72.83951,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Busy, heavily monitored station forecourt outside Bandra Western Railway.",
    hiddenness_score: 0.1,
    vibe_score: 0.85,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Evening commuter rush (6:00 PM – 9:00 PM)",
    description: "High-velocity transit hub McDonald's situated directly outside Bandra Western Railway station exit. Perfect for a quick McSpicy burger, fries, and cold coke before hopping on the local train.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "bandra-station",
      "burgers",
      "transit-food",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Bandra Station",
        floor: "Ground Floor",
        timing: "7:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-subway-bandra-hill-road",
    slug: "subway-bandra-hill-road",
    name: "Subway (Bandra Hill Road)",
    short_name: "Subway Hill Rd",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Bandra West / Hill Road",
    latitude: 19.05481,
    longitude: 72.82912,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Well-lit retail boulevard near Elco Arcade with heavy pedestrian traffic.",
    hiddenness_score: 0.2,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Afternoon shopping hours (2:00 PM – 6:00 PM)",
    description: "Crisp 6-inch and footlong custom subs, salad bowls, and warm chocolate chip cookies on Hill Road's vibrant shopping street.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "healthy-bites",
      "hill-road",
      "bandra-west",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Hill Road",
        floor: "Ground Floor",
        timing: "9:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-pizzahut-bandra-waterfield",
    slug: "pizza-hut-bandra-waterfield",
    name: "Pizza Hut (Waterfield Road)",
    short_name: "Pizza Hut Bandra",
    category: "cafes",
    subcategory: "Pizza Hut Pan Pizza & Pasta",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹550 for two",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Bandra West / Waterfield Road",
    latitude: 19.06082,
    longitude: 72.83261,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Prime culinary crossroad near China Gate and Linking Road.",
    hiddenness_score: 0.2,
    vibe_score: 0.89,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Evening dinner & weekends (7:00 PM – 10:30 PM)",
    description: "Signature deep-dish pan pizzas, stuffed crusts, cheesy garlic breadsticks, and pastas on Bandra's prime Waterfield Road dining lane.",
    vibe_tags: [
      "fast-food",
      "pizza-hut",
      "pizza",
      "pan-pizza",
      "waterfield-road",
      "bandra-west",
      "comfort-food"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "pizza hut",
        name: "Pizza Hut Waterfield",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tacobell-bandra-linking-road",
    slug: "taco-bell-bandra-linking-road",
    name: "Taco Bell (Bandra Linking Road)",
    short_name: "Taco Bell Bandra",
    category: "cafes",
    subcategory: "Taco Bell Mexican Quick Bites",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹399 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Bandra West / Linking Road",
    latitude: 19.06482,
    longitude: 72.83471,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Well-patrolled retail high street opposite Shoppers Stop / Gazebo.",
    hiddenness_score: 0.2,
    vibe_score: 0.91,
    safety_score: 0.97,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Afternoon to late evening (4:00 PM – 9:00 PM)",
    description: "Crunchy & soft tacos, stuffed burritos, cheesy quesadillas, and seasoned Mexican fries with unlimited soda refills on Linking Road.",
    vibe_tags: [
      "fast-food",
      "taco-bell",
      "tacos",
      "burritos",
      "mexican",
      "linking-road",
      "bandra-west",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "taco bell",
        name: "Taco Bell Linking Road",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tibbs-bandra-carter-road",
    slug: "tibbs-frankie-carter-road",
    name: "Tibbs Frankie (Carter Road Promenade)",
    short_name: "Tibbs Carter Rd",
    category: "cafes",
    subcategory: "Tibbs Original Mumbai Frankie",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹70–₹160 per frankie",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Bandra West / Carter Road",
    latitude: 19.06291,
    longitude: 72.82251,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Vibrant coastal foodie strip with continuous sea breeze and youth crowd.",
    hiddenness_score: 0.1,
    vibe_score: 0.94,
    safety_score: 0.97,
    accessibility_score: 0.95,
    crowd_level: 4,
    best_time_to_visit: "Sunset and late night (5:30 PM – 11:30 PM)",
    description: "Mumbai's legendary wrap brand invented right here in 1969. Crisp flaky rotis stuffed with spicy mutton, chicken tikka, paneer, and signature secret masala vinegar onions right by the Carter Road sea.",
    vibe_tags: [
      "fast-food",
      "tibbs",
      "frankie",
      "rolls",
      "mumbai-original",
      "carter-road",
      "bandra-west",
      "sea-view"
    ],
    photo_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "tibbs frankie",
        name: "Tibbs Frankie Carter Road",
        floor: "Promenade Kiosk",
        timing: "12:00 PM – 12:30 AM"
      }
    ]
  },
  {
    id: "ff-jumboking-bandra-station-west",
    slug: "jumbo-king-bandra-station-west",
    name: "Jumbo King (Bandra Station West)",
    short_name: "Jumbo King Bandra",
    category: "cafes",
    subcategory: "Jumbo King Mumbai Burger Chain",
    spot_tier: "iconic",
    budget_tier: "free",
    approx_cost: "₹39–₹89 per burger",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Bandra West / Station Road",
    latitude: 19.05541,
    longitude: 72.83982,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly facing railway station exit 1 with constant security and commuter footfall.",
    hiddenness_score: 0.1,
    vibe_score: 0.86,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Morning rush (8:30 AM) or evening rush (6:00 PM – 8:30 PM)",
    description: "Mumbai's homegrown grab-and-go burger chain directly opposite Bandra local station. Crispy Schezwan, cheese, and crunchy potato patties served piping hot with chilled masala chai.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "burger",
      "desi-burger",
      "bandra-station",
      "pocket-friendly",
      "quick-grab"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo king",
        name: "Jumbo King Bandra Station",
        floor: "Station Concourse",
        timing: "7:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-starbucks-bandra-turner-road",
    slug: "starbucks-bandra-turner-road",
    name: "Starbucks Flagship (Turner Road)",
    short_name: "Starbucks Bandra",
    category: "cafes",
    subcategory: "Starbucks Specialty Coffee & Lounge",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹500 coffees",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Bandra West / Turner Road",
    latitude: 19.06121,
    longitude: 72.83151,
    access_type: "commercial",
    safety_level: "high",
    safety_notes: "Upmarket Bandra high street with valet parking and private security.",
    hiddenness_score: 0.2,
    vibe_score: 0.95,
    safety_score: 0.98,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Morning coffee hours (9:00 AM – 11:30 AM) or twilight",
    description: "Bandra's landmark glasshouse bungalow coffee lounge on Turner Road. Two expansive levels of seating, outdoor courtyard, specialty roasts, iced caramel macchiatos, and artisanal sandwiches.",
    vibe_tags: [
      "coffee",
      "starbucks",
      "turner-road",
      "bandra-west",
      "cafe",
      "study-spot",
      "youth-adda"
    ],
    photo_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "starbucks",
        name: "Starbucks Turner Road",
        floor: "Ground & 1st Floor",
        timing: "7:30 AM – 12:30 AM"
      }
    ]
  },
  {
    id: "ff-dominos-bandra-east-kalanagar",
    slug: "dominos-bandra-east-kalanagar",
    name: "Domino's Pizza (Bandra East / Kalanagar)",
    short_name: "Domino's Bandra East",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Bandra East / Kalanagar",
    latitude: 19.05921,
    longitude: 72.84851,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly accessible near Western Express Highway junction and BKC gateway.",
    hiddenness_score: 0.2,
    vibe_score: 0.87,
    safety_score: 0.96,
    accessibility_score: 0.97,
    crowd_level: 3,
    best_time_to_visit: "Lunch and late evening (1:00 PM – 10:00 PM)",
    description: "Primary Bandra East pizza hub catering to government offices, residential colonies, and BKC commuters. Serving hot cheese burst pizzas, garlic bread, and choco lava cakes.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "bandra-east",
      "kalanagar",
      "bkc-gateway",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Kalanagar",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  }
];

function seed() {
  console.log('Seeding Bandra Batch into Fastfood and Master places...');
  let ff = JSON.parse(fs.readFileSync(FF_FILE, 'utf8'));
  let master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));

  let addedCount = 0;
  for (const place of BANDRA_BATCH) {
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

  console.log(`Successfully added ${addedCount} verified Bandra fast-food venues.`);
  console.log(`fastfood.json count: ${ff.length}`);
  console.log(`master places_mumbai.json count: ${master.length}`);
}

seed();
