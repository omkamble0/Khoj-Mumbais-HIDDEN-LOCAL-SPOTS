const fs = require('fs');
const path = require('path');

const MASTER_FILE = path.join(__dirname, '..', 'data', 'places_mumbai.json');
const FF_FILE = path.join(__dirname, '..', 'data', 'places_mumbai', 'fastfood.json');

const VILEPARLE_JUHU_BATCH = [
  {
    id: "ff-mcd-vileparle-west-mithibai",
    slug: "mcdonalds-vile-parle-west-mithibai",
    name: "McDonald's (Vile Parle West / Mithibai Hub)",
    short_name: "McD Mithibai",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle West / JVPD Scheme",
    latitude: 19.10310,
    longitude: 72.83760,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Vibrant, high-security college district outside Mithibai and NMIMS campuses.",
    hiddenness_score: 0.1,
    vibe_score: 0.94,
    safety_score: 0.98,
    accessibility_score: 0.97,
    crowd_level: 5,
    best_time_to_visit: "College lunch breaks and post-class hangouts (12:30 PM – 5:30 PM)",
    description: "The primary youth and student hangout in suburban Mumbai directly opposite Mithibai, NMIMS, and DJ Sanghvi colleges. Filled with students grabbing McSpicy burgers, Peri Peri fries, and cold coffees.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "mithibai",
      "nmims",
      "vile-parle-west",
      "student-adda",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Mithibai Hub",
        floor: "Ground & 1st Floor",
        timing: "8:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-bk-juhu-beach-tara-road",
    slug: "burger-king-juhu-beach-tara-road",
    name: "Burger King (Juhu Beach / Tara Road)",
    short_name: "Burger King Juhu",
    category: "cafes",
    subcategory: "Burger King Fast Food Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Juhu / Tara Road",
    latitude: 19.09880,
    longitude: 72.82720,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Prime tourist corridor along Juhu Tara Road near beach approach.",
    hiddenness_score: 0.1,
    vibe_score: 0.92,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Sunset and evening beach walks (5:00 PM – 10:30 PM)",
    description: "Sea-facing Burger King on Juhu Tara Road. Flame-grilled Whoppers, crunchy fries, and cold milkshakes after an evening on Juhu Beach.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "whopper",
      "juhu-beach",
      "juhu-tara-road",
      "burgers",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger king",
        name: "Burger King Juhu Tara Road",
        floor: "Ground Floor",
        timing: "10:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-bk-vileparle-west-station",
    slug: "burger-king-vile-parle-west-station",
    name: "Burger King (Vile Parle West / Station Road)",
    short_name: "Burger King Parle West",
    category: "cafes",
    subcategory: "Burger King Fast Food Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle West / Station Approach",
    latitude: 19.10080,
    longitude: 72.84350,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly located on busy station road with constant police patrolling.",
    hiddenness_score: 0.1,
    vibe_score: 0.87,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Evening commuter hours (5:30 PM – 9:00 PM)",
    description: "High-speed transit burger outlet right outside Vile Parle West local railway station. Serving Whoppers and quick combo meals.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "vile-parle-west",
      "station-road",
      "whopper",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger king",
        name: "Burger King Vile Parle West",
        floor: "Ground Floor",
        timing: "9:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-kfc-juhu-tara-road",
    slug: "kfc-juhu-beach-tara-road",
    name: "KFC (Juhu Beach / Tara Road)",
    short_name: "KFC Juhu",
    category: "cafes",
    subcategory: "KFC Fried Chicken Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹399 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Juhu / Tara Road",
    latitude: 19.09910,
    longitude: 72.82750,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Popular culinary strip with heavy evening foot traffic near Juhu Beach.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Evenings and weekend dinners (6:00 PM – 11:00 PM)",
    description: "Prime Juhu Tara Road KFC serving signature Hot & Crispy fried chicken, Zinger burgers, and popcorn chicken to beachgoers and tourists.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "juhu-beach",
      "juhu-tara-road",
      "zinger",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC Juhu Beach",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:30 AM"
      }
    ]
  },
  {
    id: "ff-kfc-vileparle-west-sv-road",
    slug: "kfc-vile-parle-west-sv-road",
    name: "KFC (Vile Parle West / SV Road)",
    short_name: "KFC Vile Parle West",
    category: "cafes",
    subcategory: "KFC Fried Chicken Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹399 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle West / SV Road",
    latitude: 19.10520,
    longitude: 72.83700,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Major SV Road junction near Cooper Hospital and Irla Market.",
    hiddenness_score: 0.2,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Lunch and dinner (1:00 PM – 9:30 PM)",
    description: "Conveniently located on SV Road near Irla shopping street and Mithibai college area. Crispy chicken tenders, burgers, and bucket meals.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "vile-parle-west",
      "sv-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC Vile Parle West",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-subway-vileparle-east",
    slug: "subway-vile-parle-east-hanuman-road",
    name: "Subway (Vile Parle East / Hanuman Road)",
    short_name: "Subway Parle East",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle East / Station Road",
    latitude: 19.09820,
    longitude: 72.84950,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Leafy residential and retail high street in Vile Parle East.",
    hiddenness_score: 0.2,
    vibe_score: 0.87,
    safety_score: 0.97,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Afternoon lunch & quick dinner (1:00 PM – 8:00 PM)",
    description: "Custom sandwiches, toasted multi-grain subs, and fresh salads on Hanuman Road near Vile Parle East station.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "healthy-bites",
      "vile-parle-east",
      "hanuman-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Vile Parle East",
        floor: "Ground Floor",
        timing: "9:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-subway-vileparle-west-nmims",
    slug: "subway-vile-parle-west-nmims",
    name: "Subway (Vile Parle West / NMIMS Campus)",
    short_name: "Subway NMIMS",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle West / JVPD Scheme",
    latitude: 19.10380,
    longitude: 72.83680,
    access_type: "public",
    safety_level: "high",
    safety_notes: "High-energy university campus street with private college security.",
    hiddenness_score: 0.2,
    vibe_score: 0.93,
    safety_score: 0.98,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Between college lectures (11:00 AM – 4:30 PM)",
    description: "Very popular student refueling spot right between NMIMS and Mithibai campuses. Custom footlong subs, wraps, and cookies.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "nmims",
      "mithibai",
      "vile-parle-west",
      "college-adda",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway NMIMS Campus",
        floor: "Ground Floor",
        timing: "8:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-dominos-vileparle-east",
    slug: "dominos-vile-parle-east-nehru-road",
    name: "Domino's Pizza (Vile Parle East / Nehru Road)",
    short_name: "Domino's Parle East",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle East / Nehru Road",
    latitude: 19.09750,
    longitude: 72.85120,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Arterial road connecting station east to domestic airport road.",
    hiddenness_score: 0.2,
    vibe_score: 0.86,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Lunch & evening pizza time (1:00 PM – 10:00 PM)",
    description: "Well-established neighborhood pizzeria serving hot Cheese Burst pizzas, Garlic Bread, and pasta to Vile Parle East families.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "vile-parle-east",
      "nehru-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Vile Parle East",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-dominos-vileparle-west-irla",
    slug: "dominos-vile-parle-west-irla",
    name: "Domino's Pizza (Vile Parle West / Irla Market)",
    short_name: "Domino's Irla",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle West / Irla SV Road",
    latitude: 19.10550,
    longitude: 72.83720,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Busy shopping lane near Alfa Market and SV Road junction.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Evening shopping & late dinner (6:00 PM – 11:00 PM)",
    description: "High-energy pizza outlet in the heart of Irla's shopping district. Hot cheese burst pizzas and pasta combos for shoppers and students.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "vile-parle-west",
      "irla",
      "cheese-burst",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Irla",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-pizzahut-juhu-beach",
    slug: "pizza-hut-juhu-beach-tara-road",
    name: "Pizza Hut (Juhu Beach / Tara Road)",
    short_name: "Pizza Hut Juhu",
    category: "cafes",
    subcategory: "Pizza Hut Pan Pizza & Pasta",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹550 for two",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Juhu / Tara Road",
    latitude: 19.09950,
    longitude: 72.82710,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly located on Juhu Tara Road opposite beach entry.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Evenings & weekends (6:00 PM – 11:00 PM)",
    description: "Casual dining Pizza Hut right across from Juhu Beach. Serving hot pan pizzas, cheesy garlic bread, and desserts to families and tourists.",
    vibe_tags: [
      "fast-food",
      "pizza-hut",
      "pizza",
      "pan-pizza",
      "juhu-beach",
      "juhu-tara-road",
      "comfort-food"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "pizza hut",
        name: "Pizza Hut Juhu",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-tacobell-juhu-dynamix",
    slug: "taco-bell-juhu-dynamix",
    name: "Taco Bell (Juhu / Dynamix Mall Zone)",
    short_name: "Taco Bell Juhu",
    category: "cafes",
    subcategory: "Taco Bell Mexican Quick Bites",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹399 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Juhu / JVPD 10th Road",
    latitude: 19.10750,
    longitude: 72.82680,
    access_type: "public",
    safety_level: "high",
    safety_notes: "High-end residential and cinema hub near Juhu Circle.",
    hiddenness_score: 0.2,
    vibe_score: 0.92,
    safety_score: 0.97,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Pre-movie and post-movie hours (4:00 PM – 10:00 PM)",
    description: "Crunchy tacos, 7-layer burritos, cheesy quesadillas, and seasoned Mexican fries near Juhu Circle and Dynamix PVR cinema corridor.",
    vibe_tags: [
      "fast-food",
      "taco-bell",
      "tacos",
      "burritos",
      "mexican",
      "juhu",
      "dynamix-pvr",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "taco bell",
        name: "Taco Bell Juhu",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tibbs-vileparle-west-mithibai",
    slug: "tibbs-frankie-vile-parle-west-mithibai",
    name: "Tibbs Frankie (Vile Parle West / Mithibai Gully)",
    short_name: "Tibbs Mithibai",
    category: "cafes",
    subcategory: "Tibbs Original Mumbai Frankie",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹70–₹160 per frankie",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle West / Mithibai College Lane",
    latitude: 19.10280,
    longitude: 72.83730,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Dense student street with famous food stalls like Anand Stall and Mithibai corner.",
    hiddenness_score: 0.1,
    vibe_score: 0.96,
    safety_score: 0.97,
    accessibility_score: 0.98,
    crowd_level: 5,
    best_time_to_visit: "College afternoons and sunset (1:00 PM – 7:30 PM)",
    description: "The most legendary student roll joint in the western suburbs situated right in the Mithibai College food gully. Hot chicken tikka, mutton, and schezwan paneer frankies with signature vinegar onions.",
    vibe_tags: [
      "fast-food",
      "tibbs",
      "frankie",
      "rolls",
      "mithibai",
      "vile-parle-west",
      "legendary-street-food",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "tibbs frankie",
        name: "Tibbs Frankie Mithibai",
        floor: "Street Stall Kiosk",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-vileparle-east",
    slug: "jumbo-king-vile-parle-station-east",
    name: "Jumbo King (Vile Parle Station East)",
    short_name: "Jumbo King Parle East",
    category: "cafes",
    subcategory: "Jumbo King Mumbai Burger Chain",
    spot_tier: "iconic",
    budget_tier: "free",
    approx_cost: "₹39–₹89 per burger",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle East / Station Exit",
    latitude: 19.09850,
    longitude: 72.84550,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Right opposite Vile Parle East Western Railway entrance.",
    hiddenness_score: 0.1,
    vibe_score: 0.86,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Morning rush & evening return commute",
    description: "Grab-and-go Mumbai burger joint right outside Vile Parle East station. Crispy Schezwan, cheese, and crunchy potato burgers served steaming hot.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "burger",
      "desi-burger",
      "vile-parle-east",
      "pocket-friendly",
      "quick-grab"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo king",
        name: "Jumbo King Vile Parle East",
        floor: "Station Exit 1",
        timing: "7:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-vileparle-west",
    slug: "jumbo-king-vile-parle-station-west",
    name: "Jumbo King (Vile Parle Station West)",
    short_name: "Jumbo King Parle West",
    category: "cafes",
    subcategory: "Jumbo King Mumbai Burger Chain",
    spot_tier: "iconic",
    budget_tier: "free",
    approx_cost: "₹39–₹89 per burger",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Vile Parle West / Station Exit",
    latitude: 19.10010,
    longitude: 72.84360,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Right outside station ticket counter with non-stop footfall.",
    hiddenness_score: 0.1,
    vibe_score: 0.86,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Commuter rush hours",
    description: "High-volume commuter burger kiosk directly at Vile Parle West local station exit. Hot potato patties in toasted buns.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "burger",
      "desi-burger",
      "vile-parle-west",
      "pocket-friendly",
      "quick-grab"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo king",
        name: "Jumbo King Vile Parle West",
        floor: "Station Road Kiosk",
        timing: "7:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-starbucks-juhu-tara-road",
    slug: "starbucks-juhu-beach-tara-road",
    name: "Starbucks Flagship (Juhu Tara Road)",
    short_name: "Starbucks Juhu",
    category: "cafes",
    subcategory: "Starbucks Specialty Coffee & Lounge",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹500 coffees",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Juhu / Tara Road",
    latitude: 19.09860,
    longitude: 72.82690,
    access_type: "commercial",
    safety_level: "high",
    safety_notes: "Upmarket Juhu beachfront stretch with private security and valet.",
    hiddenness_score: 0.2,
    vibe_score: 0.96,
    safety_score: 0.98,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Morning coffee (9:00 AM – 11:30 AM) or sunset twilight",
    description: "One of Mumbai's most iconic celebrity-spotting cafes on Juhu Tara Road right opposite Juhu Beach. Expansive outdoor deck, sea breeze, iced frappes, and signature roasts.",
    vibe_tags: [
      "coffee",
      "starbucks",
      "juhu-beach",
      "juhu-tara-road",
      "cafe",
      "celebrity-spotting",
      "youth-adda"
    ],
    photo_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "starbucks",
        name: "Starbucks Juhu Beach",
        floor: "Ground & Outdoor Deck",
        timing: "7:30 AM – 1:00 AM"
      }
    ]
  }
];

function seed() {
  console.log('Seeding Vile Parle & Juhu Batch into Fastfood and Master places...');
  let ff = JSON.parse(fs.readFileSync(FF_FILE, 'utf8'));
  let master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));

  let addedCount = 0;
  for (const place of VILEPARLE_JUHU_BATCH) {
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

  console.log(`Successfully added ${addedCount} verified Vile Parle & Juhu fast-food venues.`);
  console.log(`fastfood.json count: ${ff.length}`);
  console.log(`master places_mumbai.json count: ${master.length}`);
}

seed();

