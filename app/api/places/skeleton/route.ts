import { NextResponse } from 'next/server';
import { getAllPlaces } from '@/lib/places';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache on edge CDN for 1 hour

/**
 * 2-Tier Payload Architecture: Tier 1 Lightweight Skeleton
 * Returns only essential coordinates, categories and IDs for ultra-fast initial map rendering (<30ms).
 */
export async function GET() {
  try {
    const places = getAllPlaces();
    
    // Extract only lightweight attributes needed for map markers and filters
    const skeleton = places.map((p) => ({
      id: p.id,
      name: p.name,
      short_name: p.short_name,
      latitude: p.latitude,
      longitude: p.longitude,
      category: p.category,
      subcategory: p.subcategory,
      spot_tier: p.spot_tier,
      budget_tier: p.budget_tier,
      approx_cost: p.approx_cost,
      crowd_level: p.crowd_level,
      hiddenness_score: p.hiddenness_score,
      vibe_score: p.vibe_score,
      safety_score: p.safety_score,
      accessibility_score: p.accessibility_score,
    }));

    return NextResponse.json(
      {
        total: skeleton.length,
        version: '2026.11',
        places: skeleton,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate skeleton payload' }, { status: 500 });
  }
}
