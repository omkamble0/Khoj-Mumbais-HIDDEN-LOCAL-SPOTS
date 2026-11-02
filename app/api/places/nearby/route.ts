import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Place, PlaceCategory } from '@/lib/types';
import { calculateDistanceMeters, computeCompositeScore } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Default to Mumbai center (e.g. Dadar / Bandra) if user hasn't provided location yet
    const lat = parseFloat(searchParams.get('lat') || '19.0418');
    const lng = parseFloat(searchParams.get('lng') || '72.8398');
    const radiusKm = parseFloat(searchParams.get('radiusKm') || '25');
    const category = (searchParams.get('category') || 'all') as PlaceCategory;
    const maxCrowd = parseInt(searchParams.get('maxCrowd') || '5', 10);
    const minHiddenness = parseFloat(searchParams.get('minHiddenness') || '0.0');
    const query = (searchParams.get('q') || '').toLowerCase().trim();

    // Read local seed dataset
    const filePath = path.join(process.cwd(), 'data', 'places_mumbai.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const places: Place[] = JSON.parse(fileContent);

    // Enrich with distance and composite scores
    const enrichedPlaces: Place[] = places.map((place) => {
      const distance = calculateDistanceMeters(lat, lng, place.latitude, place.longitude);
      const compositeScore = computeCompositeScore(place, distance);
      return {
        ...place,
        distance_meters: Math.round(distance),
        composite_score: compositeScore,
      };
    });

    // Apply filtering
    const radiusMeters = radiusKm * 1000;
    const filtered = enrichedPlaces.filter((place) => {
      // Radius filter
      if (place.distance_meters !== undefined && place.distance_meters > radiusMeters) {
        return false;
      }

      // Category filter
      if (category !== 'all' && place.category !== category) {
        return false;
      }

      // Crowd level filter
      if (place.crowd_level > maxCrowd) {
        return false;
      }

      // Hiddenness filter
      if (place.hiddenness_score < minHiddenness) {
        return false;
      }

      // Text query match
      if (query) {
        const matchName = place.name.toLowerCase().includes(query);
        const matchDesc = place.description.toLowerCase().includes(query);
        const matchNeighborhood = place.neighborhood?.toLowerCase().includes(query);
        const matchTags = place.vibe_tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchNeighborhood && !matchTags) {
          return false;
        }
      }

      return true;
    });

    // Sort by composite score descending (highest quality hidden/safe/nearby first)
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
