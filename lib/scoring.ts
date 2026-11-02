import { Place } from './types';

// Haversine formula to compute distance between two coordinates in meters
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Format meters to friendly km or m
export function formatDistance(meters?: number): string {
  if (meters === undefined || meters === null) return '';
  if (meters < 1000) {
    return `${Math.round(meters)} m away`;
  }
  return `${(meters / 1000).toFixed(1)} km away`;
}

// Distance decay score: 1 / (1 + (distance_km / 5)^2)
export function calculateDistanceScore(distanceMeters: number): number {
  const distKm = distanceMeters / 1000;
  return 1 / (1 + Math.pow(distKm / 5, 2));
}

// Blueprint scoring formula:
// place_score = (hiddenness * 0.30) + (vibe * 0.20) + (safety * 0.20) + (accessibility * 0.10) + (distance_score * 0.15) + (trust * 0.05)
export function computeCompositeScore(place: Place, distanceMeters: number): number {
  const distScore = calculateDistanceScore(distanceMeters);
  const trustScore = 0.90; // Default high trust for curated/verified sources

  const score =
    place.hiddenness_score * 0.30 +
    place.vibe_score * 0.20 +
    place.safety_score * 0.20 +
    place.accessibility_score * 0.10 +
    distScore * 0.15 +
    trustScore * 0.05;

  return Math.round(score * 100) / 100;
}
