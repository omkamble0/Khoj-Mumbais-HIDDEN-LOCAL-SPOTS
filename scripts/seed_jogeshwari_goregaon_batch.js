const fs = require('fs');
const path = require('path');

const MASTER_FILE = path.join(__dirname, '..', 'data', 'places_mumbai.json');
const FF_FILE = path.join(__dirname, '..', 'data', 'places_mumbai', 'fastfood.json');

const JOGESHWARI_GOREGAON_BATCH = [
  {
    id: "ff-mcd-goregaon-west-station",
    slug: "mcdonalds-goregaon-west-station-road",
    name: "McDonald's (Goregaon West / Topiwala Theatre)",
    short_name: "McD Goregaon West",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon West / Station Road",
    latitude: 19.16450,
    longitude: 72.84820,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Very high footfall shopping junction near Topiwala National Theatre and Goregaon station.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.99,
    crowd_level: 4,
    best_time_to_visit: "Evening market & commuter hours (5:00 PM – 9:30 PM)",
    description: "Two-level McDonald's right in the heart of Goregaon West's bustling market corridor near the station. Popular among shoppers and commuters for McSpicy burgers, fries, and cold cokes.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "goregaon-west",
      "station-road",
      "topiwala",
      "burgers",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Goregaon West",
        floor: "Ground & 1st Floor",
        timing: "8:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-mcd-goregaon-east-oberoi",
    slug: "mcdonalds-goregaon-east-oberoi-mall",
    name: "McDonald's (Goregaon East / Oberoi Mall)",
    short_name: "McD Oberoi Mall",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon East / Oberoi Mall",
    latitude: 19.17380,
    longitude: 72.86060,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Premier air-conditioned mall with airport-grade security and parking.",
    hiddenness_score: 0.1,
    vibe_score: 0.92,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 5,
    best_time_to_visit: "Afternoon lunch & weekend movie hours (1:00 PM – 8:30 PM)",
    description: "High-volume flagship McDonald's inside Oberoi Mall on the Western Express Highway. Serving golden crispy fries, McFlurry desserts, and burgers directly adjacent to Dindoshi Metro Station.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "oberoi-mall",
      "goregaon-east",
      "dindoshi-metro",
      "mall-hangout",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Oberoi Mall",
        floor: "Level 3 Food Court",
        timing: "10:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-mcd-jogeshwari-west",
    slug: "mcdonalds-jogeshwari-west-sv-road",
    name: "McDonald's (Jogeshwari West / SV Road)",
    short_name: "McD Jogeshwari",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Jogeshwari West / SV Road",
    latitude: 19.13520,
    longitude: 72.84210,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Prominent SV Road retail frontage with high vehicular and foot transit.",
    hiddenness_score: 0.2,
    vibe_score: 0.86,
    safety_score: 0.95,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Lunch and evening snacks (1:00 PM – 7:30 PM)",
    description: "Convenient suburban high-street McDonald's on SV Road connecting Jogeshwari to Oshiwara. Quick burgers, milkshakes, and soft serves.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "jogeshwari-west",
      "sv-road",
      "burgers",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Jogeshwari West",
        floor: "Ground Floor",
        timing: "8:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-bk-goregaon-east-oberoi",
    slug: "burger-king-goregaon-east-oberoi-mall",
    name: "Burger King (Goregaon East / Oberoi Mall)",
    short_name: "Burger King Oberoi",
    category: "cafes",
    subcategory: "Burger King Fast Food Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon East / Oberoi Mall",
    latitude: 19.17390,
    longitude: 72.86040,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Secure air-conditioned food court inside Oberoi Mall.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Pre-movie snacks & weekend dinners (4:00 PM – 10:00 PM)",
    description: "Popular food court burger hub in Oberoi Mall. Flame-grilled Whoppers, Crispy Veg patties, cheese fries, and thick shakes right next to PVR Cinemas.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "whopper",
      "oberoi-mall",
      "goregaon-east",
      "mall-hub",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger king",
        name: "Burger King Oberoi Mall",
        floor: "Level 3 Food Court",
        timing: "10:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-bk-goregaon-west-station",
    slug: "burger-king-goregaon-west-station-road",
    name: "Burger King (Goregaon West / Jawahar Nagar)",
    short_name: "Burger King Goregaon West",
    category: "cafes",
    subcategory: "Burger King Fast Food Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon West / Station Road",
    latitude: 19.16380,
    longitude: 72.84850,
    access_type: "public",
    safety_level: "high",
    safety_notes: "High pedestrian shopping corridor near station.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Evening commute and dinner (5:00 PM – 9:30 PM)",
    description: "Transit burger joint on Goregaon West Station Road. Fast flame-grilled Whoppers and value meals for suburban commuters and local residents.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "whopper",
      "goregaon-west",
      "station-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger king",
        name: "Burger King Goregaon West",
        floor: "Ground Floor",
        timing: "10:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-kfc-goregaon-east-oberoi",
    slug: "kfc-goregaon-east-oberoi-mall",
    name: "KFC (Goregaon East / Oberoi Mall)",
    short_name: "KFC Oberoi Mall",
    category: "cafes",
    subcategory: "KFC Fried Chicken Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹399 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon East / Oberoi Mall",
    latitude: 19.17370,
    longitude: 72.86070,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Located inside the secure Oberoi Mall food court on Level 3.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Weekend afternoons & movie nights (1:00 PM – 9:00 PM)",
    description: "Prime KFC food court outlet inside Oberoi Mall Goregaon. Signature Hot & Crispy chicken buckets, Zinger burgers, and popcorn chicken with rapid food court service.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "oberoi-mall",
      "goregaon-east",
      "zinger",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC Oberoi Mall",
        floor: "Level 3 Food Court",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-kfc-goregaon-east-hubmall",
    slug: "kfc-goregaon-east-hub-mall",
    name: "KFC (Goregaon East / The Hub Mall)",
    short_name: "KFC Hub Mall",
    category: "cafes",
    subcategory: "KFC Fried Chicken Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹399 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon East / WEH Corridor",
    latitude: 19.15550,
    longitude: 72.85450,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Western Express Highway commercial frontage with dedicated mall parking.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.97,
    crowd_level: 3,
    best_time_to_visit: "Highway transit stops & movie hours (2:00 PM – 9:00 PM)",
    description: "Conveniently located at The Hub Mall directly on the Western Express Highway in Goregaon East. Quick-serve chicken tenders, buckets, and meal combos for highway drivers and cinema crowds.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "hub-mall",
      "goregaon-east",
      "weh-corridor",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC The Hub Mall",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-subway-goregaon-east-oberoi",
    slug: "subway-goregaon-east-oberoi-mall",
    name: "Subway (Goregaon East / Oberoi Mall)",
    short_name: "Subway Oberoi Mall",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon East / Oberoi Mall",
    latitude: 19.17360,
    longitude: 72.86050,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Inside Oberoi Mall food court on Level 3.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Lunch (12:30 PM – 3:30 PM)",
    description: "Custom 6-inch subs, footlongs, and fresh tossed salad bowls in Oberoi Mall's food court. Healthy choice for shoppers and corporate professionals from nearby Commerz towers.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "oberoi-mall",
      "goregaon-east",
      "healthy-bites",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Oberoi Mall",
        floor: "Level 3 Food Court",
        timing: "10:30 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-subway-goregaon-east-nirlon",
    slug: "subway-goregaon-east-nirlon-knowledge-park",
    name: "Subway (Goregaon East / Nirlon Knowledge Park)",
    short_name: "Subway Nirlon",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon East / Nirlon Park",
    latitude: 19.15650,
    longitude: 72.85620,
    access_type: "commercial",
    safety_level: "high",
    safety_notes: "Gated IT tech park courtyard with 24/7 security.",
    hiddenness_score: 0.2,
    vibe_score: 0.91,
    safety_score: 0.98,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Corporate lunch hours (12:30 PM – 2:30 PM)",
    description: "High-volume corporate tech park sub shop inside Nirlon Knowledge Park courtyard. Healthy customized subs, wraps, and cookies for MNC professionals.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "nirlon-park",
      "goregaon-east",
      "corporate-adda",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Nirlon Park",
        floor: "Ground Floor Courtyard",
        timing: "8:30 AM – 10:30 PM"
      }
    ]
  },
  {
    id: "ff-subway-goregaon-west",
    slug: "subway-goregaon-west-sv-road",
    name: "Subway (Goregaon West / SV Road)",
    short_name: "Subway Goregaon West",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon West / SV Road",
    latitude: 19.16420,
    longitude: 72.84780,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Station approach road with well-lit storefronts.",
    hiddenness_score: 0.1,
    vibe_score: 0.87,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 3,
    best_time_to_visit: "Lunch & evening commute",
    description: "Fresh sub counter near Goregaon West local station on SV Road. Toasted multi-grain subs, protein wraps, and drinks.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "goregaon-west",
      "sv-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Goregaon West",
        floor: "Ground Floor",
        timing: "9:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-dominos-goregaon-west",
    slug: "dominos-goregaon-west-jawahar-nagar",
    name: "Domino's Pizza (Goregaon West / Jawahar Nagar)",
    short_name: "Domino's Goregaon West",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon West / Station Road",
    latitude: 19.16500,
    longitude: 72.84800,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Busy shopping lane near Topiwala and Jawahar Nagar.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Evening and dinner (5:00 PM – 10:30 PM)",
    description: "High-volume pizzeria serving Goregaon West residents and commuters. Hot Cheese Burst pizzas, Garlic Bread, and pasta bowls.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "goregaon-west",
      "station-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Goregaon West",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-dominos-goregaon-east-gokuldham",
    slug: "dominos-goregaon-east-gokuldham",
    name: "Domino's Pizza (Goregaon East / Gokuldham)",
    short_name: "Domino's Gokuldham",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon East / Film City Road",
    latitude: 19.17120,
    longitude: 72.86950,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Gokuldham residential market hub with dense residential foot traffic.",
    hiddenness_score: 0.2,
    vibe_score: 0.87,
    safety_score: 0.96,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Family dinner hours (6:00 PM – 10:00 PM)",
    description: "Neighborhood Domino's in Gokuldham on the way to Film City. Hot stuffed garlic bread, pan pizzas, and desserts for local families and TV production crews.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "gokuldham",
      "goregaon-east",
      "film-city-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Gokuldham",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-pizzahut-goregaon-east-oberoi",
    slug: "pizza-hut-goregaon-east-oberoi-mall",
    name: "Pizza Hut (Goregaon East / Oberoi Mall)",
    short_name: "Pizza Hut Oberoi",
    category: "cafes",
    subcategory: "Pizza Hut Pan Pizza & Pasta",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹550 for two",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Goregaon East / Oberoi Mall",
    latitude: 19.17400,
    longitude: 72.86030,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Oberoi Mall dining level with excellent security.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Evenings & weekends (5:00 PM – 10:30 PM)",
    description: "Classic dining Pizza Hut inside Oberoi Mall Goregaon. Sizzling deep-dish pan pizzas, stuffed crusts, and cheesy garlic breadsticks near the cinema floor.",
    vibe_tags: [
      "fast-food",
      "pizza-hut",
      "pizza",
      "pan-pizza",
      "oberoi-mall",
      "goregaon-east",
      "comfort-food"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "pizza hut",
        name: "Pizza Hut Oberoi Mall",
        floor: "Level 3 Dining",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tacobell-goregaon-east-oberoi",
    slug: "taco-bell-goregaon-east-oberoi-mall",
    name: "Taco Bell (Goregaon East / Oberoi Mall)",
    short_name: "Taco Bell Oberoi",
    category: "cafes",
    subcategory: "Taco Bell Mexican Quick Bites",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹399 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon East / Oberoi Mall",
    latitude: 19.17350,
    longitude: 72.86080,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Inside Oberoi Mall Level 3 Food Court.",
    hiddenness_score: 0.1,
    vibe_score: 0.92,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Afternoons & movie crowds (3:00 PM – 9:30 PM)",
    description: "Crispy and soft shell tacos, loaded burritos, cheesy quesadillas, and Mexican seasoned fries in Oberoi Mall's buzzing food court directly on the Western Express Highway.",
    vibe_tags: [
      "fast-food",
      "taco-bell",
      "tacos",
      "burritos",
      "mexican",
      "oberoi-mall",
      "goregaon-east",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "taco bell",
        name: "Taco Bell Oberoi Mall",
        floor: "Level 3 Food Court",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tibbs-goregaon-station-west",
    slug: "tibbs-frankie-goregaon-station-west",
    name: "Tibbs Frankie (Goregaon Station West Forecourt)",
    short_name: "Tibbs Goregaon West",
    category: "cafes",
    subcategory: "Tibbs Original Mumbai Frankie",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹70–₹160 per frankie",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon West / Station Forecourt",
    latitude: 19.16400,
    longitude: 72.84920,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Active commuter street outside Western Railway booking hall.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Evening transit rush (5:30 PM – 9:00 PM)",
    description: "Classic street roll kiosk right outside Goregaon local station west exit. Hot flaky frankies filled with chicken tikka, schezwan paneer, and mutton with tangy masala vinegar onions.",
    vibe_tags: [
      "fast-food",
      "tibbs",
      "frankie",
      "rolls",
      "goregaon-west",
      "goregaon-station",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "tibbs frankie",
        name: "Tibbs Frankie Goregaon",
        floor: "Station Road Kiosk",
        timing: "11:30 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-goregaon-station-west",
    slug: "jumbo-king-goregaon-station-west",
    name: "Jumbo King (Goregaon Station West)",
    short_name: "Jumbo King Goregaon",
    category: "cafes",
    subcategory: "Jumbo King Mumbai Burger Chain",
    spot_tier: "iconic",
    budget_tier: "free",
    approx_cost: "₹39–₹89 per burger",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Goregaon West / Station Exit 1",
    latitude: 19.16430,
    longitude: 72.84960,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Direct station exit 1 with constant auto-rickshaw queue and security.",
    hiddenness_score: 0.1,
    vibe_score: 0.86,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Commuter rush hours",
    description: "Grab-and-go Mumbai burger joint directly facing Goregaon local station exit. Hot potato burgers in toasted sesame buns served in seconds.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "burger",
      "desi-burger",
      "goregaon-station",
      "pocket-friendly",
      "quick-grab"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo king",
        name: "Jumbo King Goregaon West",
        floor: "Station Exit 1",
        timing: "6:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-jogeshwari-station-west",
    slug: "jumbo-king-jogeshwari-station-west",
    name: "Jumbo King (Jogeshwari Station West)",
    short_name: "Jumbo King Jogeshwari",
    category: "cafes",
    subcategory: "Jumbo King Mumbai Burger Chain",
    spot_tier: "iconic",
    budget_tier: "free",
    approx_cost: "₹39–₹89 per burger",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Jogeshwari West / Station Forecourt",
    latitude: 19.13600,
    longitude: 72.84380,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Station road junction with high pedestrian commuter density.",
    hiddenness_score: 0.1,
    vibe_score: 0.85,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Morning and evening rush commute",
    description: "High-speed burger stall right outside Jogeshwari Western Railway station west exit. Fast, hot Mumbai potato burgers for daily commuters.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "burger",
      "desi-burger",
      "jogeshwari-station",
      "pocket-friendly",
      "quick-grab"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo king",
        name: "Jumbo King Jogeshwari West",
        floor: "Station Concourse",
        timing: "7:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-starbucks-goregaon-east-oberoi",
    slug: "starbucks-goregaon-east-oberoi-mall",
    name: "Starbucks Flagship (Goregaon East / Oberoi Mall)",
    short_name: "Starbucks Oberoi Mall",
    category: "cafes",
    subcategory: "Starbucks Specialty Coffee & Lounge",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹500 coffees",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Goregaon East / Oberoi Mall",
    latitude: 19.17420,
    longitude: 72.86010,
    access_type: "commercial",
    safety_level: "high",
    safety_notes: "Grand atrium entrance level of Oberoi Mall with dedicated security.",
    hiddenness_score: 0.1,
    vibe_score: 0.95,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Morning meetings & evening coffee (10:00 AM – 9:00 PM)",
    description: "Flagship Starbucks lounge situated at the grand entrance atrium of Oberoi Mall. Handcrafted espresso, cold brews, matcha lattes, and artisanal sandwiches.",
    vibe_tags: [
      "coffee",
      "starbucks",
      "oberoi-mall",
      "goregaon-east",
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
        name: "Starbucks Oberoi Mall",
        floor: "Ground Floor Atrium",
        timing: "8:00 AM – 11:30 PM"
      }
    ]
  }
];

function seed() {
  console.log('Seeding Jogeshwari & Goregaon Batch into Fastfood and Master places...');
  let ff = JSON.parse(fs.readFileSync(FF_FILE, 'utf8'));
  let master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));

  let addedCount = 0;
  for (const place of JOGESHWARI_GOREGAON_BATCH) {
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

  console.log(`Successfully added ${addedCount} verified Jogeshwari & Goregaon fast-food venues.`);
  console.log(`fastfood.json count: ${ff.length}`);
  console.log(`master places_mumbai.json count: ${master.length}`);
}

seed();
