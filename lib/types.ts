export type PlaceCategory =
  | 'all'
  | 'walks'
  | 'treks'
  | 'gardens'
  | 'cafes'
  | 'forts'
  | 'viewpoints'
  | 'waterfront'
  | 'heritage'
  | 'books'
  | 'culture'
  | 'spiritual'
  | 'bazaars'
  | 'bars';

export type SpotTier = 'all' | 'hidden_gem' | 'underrated' | 'iconic';
export type BudgetTier = 'all' | 'free' | 'pocket_friendly' | 'moderate' | 'splurge';
export type AccessType = 'public' | 'permissive' | 'commercial' | 'trail_required';
export type SafetyLevel = 'low' | 'medium' | 'high';

export interface Place {
  id: string;
  slug: string;
  name: string;
  short_name?: string;
  category: PlaceCategory;
  subcategory: string;
  spot_tier: SpotTier; // 'iconic' | 'underrated' | 'hidden_gem'
  budget_tier?: 'free' | 'pocket_friendly' | 'moderate' | 'splurge';
  approx_cost?: string; // e.g. 'Free', '₹150–350 for two', '₹85 entry'
  price_level?: number; // 0: Free, 1: ₹, 2: ₹₹, 3: ₹₹₹
  city: string;
  neighborhood?: string;
  latitude: number;
  longitude: number;
  access_type: AccessType;
  safety_level: SafetyLevel;
  safety_notes: string;
  hiddenness_score: number; // 0.0 to 1.0
  vibe_score: number;       // 0.0 to 1.0
  safety_score: number;     // 0.0 to 1.0
  accessibility_score: number; // 0.0 to 1.0
  crowd_level: number;      // 1 (empty/quiet) to 5 (crowded)
  best_time_to_visit: string;
  description: string;
  vibe_tags: string[];
  photo_url: string;
  source: string;
  distance_meters?: number;
  composite_score?: number;
}

export type TransitAccessFilter = 'all' | 'near_metro' | 'near_railway' | 'walkable_transit';
export type TransitFilterMode =
  | 'all'
  | 'local'
  | 'metro'
  | 'western'
  | 'central'
  | 'harbour'
  | 'metro_1'
  | 'metro_2a'
  | 'metro_7'
  | 'metro_3'
  | 'metro_navi';

export interface FilterState {
  category: PlaceCategory;
  spotTier: SpotTier;
  budget: BudgetTier;
  radiusKm: number;
  maxCrowdLevel: number;
  searchQuery: string;
  transitAccess?: TransitAccessFilter;
  transitLine?: TransitFilterMode;
}

export interface PlaceReportPayload {
  placeId: string;
  reason: 'private_property' | 'unsafe' | 'closed' | 'wrong_location' | 'other';
  details?: string;
}
