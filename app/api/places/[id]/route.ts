import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Place } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const filePath = path.join(process.cwd(), 'data', 'places_mumbai.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const places: Place[] = JSON.parse(fileContent);

    const place = places.find((p) => p.id === id || p.slug === id);
    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    // Generate turn-by-turn deep links
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    const appleMapsUrl = `https://maps.apple.com/?daddr=${place.latitude},${place.longitude}`;

    return NextResponse.json({
      status: 'success',
      place: {
        ...place,
        navigation: {
          google_maps: googleMapsUrl,
          apple_maps: appleMapsUrl,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching place by id:', error);
    return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 });
  }
}
