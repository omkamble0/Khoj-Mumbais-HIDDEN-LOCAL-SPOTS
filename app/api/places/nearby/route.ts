import { NextRequest, NextResponse } from 'next/server';
import { Place, PlaceCategory, SpotTier, BudgetTier } from '@/lib/types';
import { calculateDistanceMeters, computeCompositeScore } from '@/lib/scoring';
import { getPlacesFromDb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = parseFloat(searchParams.get('lat') || '19.0418');
    const lng = parseFloat(searchParams.get('lng') || '72.8398');
    const radiusKm = parseFloat(searchParams.get('radiusKm') || '40');
    const category = (searchParams.get('category') || 'all') as PlaceCategory;
    const spotTier = (searchParams.get('spotTier') || 'all') as SpotTier;
    const budget = (searchParams.get('budget') || 'all') as BudgetTier;
    const maxCrowd = parseInt(searchParams.get('maxCrowd') || '5', 10);
    const query = (searchParams.get('q') || '').toLowerCase().trim();

    const places: Place[] = await getPlacesFromDb();
    if (places.length === 0) {
      return NextResponse.json({ error: 'No places found' }, { status: 404 });
    }

    const enrichedPlaces: Place[] = places.map((place) => {
      const distance = calculateDistanceMeters(lat, lng, place.latitude, place.longitude);
      const compositeScore = computeCompositeScore(place, distance);
      return {
        ...place,
        distance_meters: Math.round(distance),
        composite_score: compositeScore,
      };
    });

    const radiusMeters = radiusKm * 1000;
    const filtered = enrichedPlaces.filter((place) => {
      // Radius filter (skip distance cutoff when radiusKm >= 120 / All MMR)
      if (radiusKm < 120 && place.distance_meters !== undefined && place.distance_meters > radiusMeters) {
        return false;
      }

      // Category filter (cafes, forts, parks, viewpoints, waterfront, heritage)
      if (category !== 'all' && place.category !== category) {
        return false;
      }

      // Tier filter (hidden_gem, underrated, iconic)
      if (spotTier !== 'all' && place.spot_tier !== spotTier) {
        return false;
      }

      // Budget filter (free, pocket_friendly, moderate, splurge)
      if (budget !== 'all' && place.budget_tier !== budget) {
        return false;
      }

      // Crowd level filter
      if (place.crowd_level > maxCrowd) {
        return false;
      }

      // Text query search
      if (query) {
        const matchName = place.name.toLowerCase().includes(query);
        const matchShort = place.short_name?.toLowerCase().includes(query);
        const matchDesc = place.description.toLowerCase().includes(query);
        const matchNeighborhood = place.neighborhood?.toLowerCase().includes(query);
        const matchCategory = place.category.toLowerCase().includes(query);
        const matchTags = place.vibe_tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchName && !matchShort && !matchDesc && !matchNeighborhood && !matchCategory && !matchTags) {
          return false;
        }
      }

      return true;
    });

    // Sort by composite score
    filtered.sort((a, b) => (b.composite_score || 0) - (a.composite_score || 0));

    return NextResponse.json({
      status: 'success',
      center: { lat, lng },
      count: filtered.length,
      places: filtered,
    });
  } catch (error) {
    console.error('Failed to get nearby places:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to process location discovery query' },
      { status: 500 }
    );
  }
}
