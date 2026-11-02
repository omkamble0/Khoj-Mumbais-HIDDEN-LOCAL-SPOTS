export type PlaceCategory =
  | 'all'
  | 'walks'
  | 'treks'
  | 'gardens'
  | 'cafes'
  | 'forts'
  | 'viewpoints'
  | 'waterfront'
  | 'heritage';

export type SpotTier = 'all' | 'hidden_gem' | 'underrated' | 'iconic';
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

export interface FilterState {
  category: PlaceCategory;
  spotTier: SpotTier;
  radiusKm: number;
  maxCrowdLevel: number;
  searchQuery: string;
}

export interface PlaceReportPayload {
  placeId: string;
  reason: 'private_property' | 'unsafe' | 'closed' | 'wrong_location' | 'other';
  details?: string;
}
