export type PlaceCategory =
  | 'all'
  | 'scenic'
  | 'quiet_chill'
  | 'historical'
  | 'nature_forest'
  | 'viewpoint'
  | 'ruin_historic'
  | 'waterfront'
  | 'hidden_gem';

export type AccessType = 'public' | 'permissive' | 'trail_required' | 'unknown';
export type SafetyLevel = 'low' | 'medium' | 'high';

export interface Place {
  id: string;
  slug: string;
  name: string;
  category: PlaceCategory;
  subcategory: string;
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
  radiusKm: number; // e.g. 5, 10, 25, 50
  maxCrowdLevel: number; // 1 to 5
  minHiddenness: number; // 0.0 to 1.0
  searchQuery: string;
  selectedVibe?: string;
}

export interface PlaceReportPayload {
  placeId: string;
  reason: 'private_property' | 'unsafe' | 'closed' | 'wrong_location' | 'other';
  details?: string;
}
