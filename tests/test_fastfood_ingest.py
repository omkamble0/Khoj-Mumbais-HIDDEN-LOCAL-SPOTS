#!/usr/bin/env python3
"""
Unit and Integration Tests for OpenStreetMap Fast-Food Chain Ingestion.
Verifies:
  1. Sloppy tag and brand regex matching
  2. Way center and node coordinate resolution
  3. Bounding box geo-fencing (rejects out-of-bounds nodes)
  4. Disused/abandoned filtering
  5. Stable ID generation (osm-node-*, osm-way-*)
  6. Internal 25m candidate deduplication
  7. Proximity flagging against existing curated places without overwriting
  8. Dry-run safety guarantee (0 disk writes)
"""

import json
import os
import sys
import unittest

# Add scripts directory to import path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts")))

from ingest_fastfood_chains import (
    match_brand,
    normalize_osm_element,
    deduplicate_internal_candidates,
    flag_proximity_with_curated_spots,
    haversine_distance_meters,
    SUPPORTED_BRANDS,
    DEFAULT_BBOX
)

class TestFastFoodIngest(unittest.TestCase):
    def setUp(self):
        self.fixture_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "fixtures", "overpass_sample.json")
        )
        with open(self.fixture_path, "r", encoding="utf-8") as f:
            self.fixture_data = json.load(f)

    def test_brand_matching_clean_and_sloppy(self):
        """Tests that fuzzy regex matches clean, sloppy, and informal brand tags."""
        # 1. Clean brand tag
        b, info = match_brand({"brand": "McDonald's"}, list(SUPPORTED_BRANDS.keys()))
        self.assertEqual(b, "mcdonalds")
        self.assertEqual(info["name"], "McDonald's")

        # 2. Sloppy name without brand tag
        b, info = match_brand({"name": "Dominos Pizza"}, list(SUPPORTED_BRANDS.keys()))
        self.assertEqual(b, "dominos")

        # 3. Slang shortcut tag
        b, info = match_brand({"name": "Bandra BK"}, list(SUPPORTED_BRANDS.keys()))
        self.assertEqual(b, "burger_king")

        # 4. KFC variant
        b, info = match_brand({"name": "Kentucky Fried Chicken"}, list(SUPPORTED_BRANDS.keys()))
        self.assertEqual(b, "kfc")

        # 5. Subway
        b, info = match_brand({"brand": "Subway"}, list(SUPPORTED_BRANDS.keys()))
        self.assertEqual(b, "subway")

    def test_disused_outlets_filtered_out(self):
        """Ensures that closed or disused fast-food tags are rejected."""
        b, _ = match_brand({"brand": "McDonald's", "disused": "yes"}, list(SUPPORTED_BRANDS.keys()))
        self.assertIsNone(b)

        b, _ = match_brand({"brand": "McDonald's", "abandoned": "yes"}, list(SUPPORTED_BRANDS.keys()))
        self.assertIsNone(b)

    def test_geo_fence_rejects_out_of_bounds(self):
        """Ensures candidates outside Mumbai MMR (e.g. Delhi) are discarded."""
        delhi_node = {
            "type": "node",
            "id": 999,
            "lat": 28.6139,
            "lon": 77.2090,
            "tags": {"brand": "McDonald's"}
        }
        b_key, b_info = match_brand(delhi_node["tags"], list(SUPPORTED_BRANDS.keys()))
        candidate = normalize_osm_element(delhi_node, b_key, b_info, DEFAULT_BBOX)
        self.assertIsNone(candidate)

    def test_way_center_coordinate_resolution(self):
        """Tests that polygon ways resolve their center coordinates properly."""
        way_element = {
            "type": "way",
            "id": 555,
            "center": {"lat": 19.0601, "lon": 72.8339},
            "tags": {"brand": "KFC", "name": "KFC Waterfield"}
        }
        b_key, b_info = match_brand(way_element["tags"], list(SUPPORTED_BRANDS.keys()))
        candidate = normalize_osm_element(way_element, b_key, b_info, DEFAULT_BBOX)
        self.assertIsNotNone(candidate)
        self.assertEqual(candidate["id"], "osm-way-555")
        self.assertEqual(candidate["latitude"], 19.0601)
        self.assertEqual(candidate["longitude"], 72.8339)
        self.assertEqual(candidate["source"], "openstreetmap")
        self.assertEqual(candidate["verification_status"], "candidate_unverified")

    def test_stable_id_and_provenance(self):
        """Verifies stable IDs and provenance source URLs."""
        node_element = {
            "type": "node",
            "id": 123456,
            "lat": 19.0683,
            "lon": 72.8228,
            "tags": {"brand": "McDonald's"}
        }
        b_key, b_info = match_brand(node_element["tags"], list(SUPPORTED_BRANDS.keys()))
        candidate = normalize_osm_element(node_element, b_key, b_info, DEFAULT_BBOX)
        self.assertEqual(candidate["id"], "osm-node-123456")
        self.assertEqual(candidate["source_url"], "https://www.openstreetmap.org/node/123456")
        self.assertIn("osm-candidate", candidate["vibe_tags"])

    def test_internal_deduplication_under_25m(self):
        """Tests that duplicate node/way pairs mapped within 25m are merged."""
        cand1 = {
            "id": "osm-node-1",
            "osm_type": "node",
            "latitude": 19.0683,
            "longitude": 72.8228,
            "outlets": [{"brand": "mcdonalds"}]
        }
        cand2 = {
            "id": "osm-way-2",
            "osm_type": "way",
            "latitude": 19.06831,
            "longitude": 72.82281,
            "outlets": [{"brand": "mcdonalds"}]
        }
        deduped, dropped = deduplicate_internal_candidates([cand1, cand2])
        self.assertEqual(len(deduped), 1)
        self.assertEqual(dropped, 1)
        # Prefers 'way' over 'node'
        self.assertEqual(deduped[0]["id"], "osm-way-2")

    def test_curated_proximity_flagging_without_overwriting(self):
        """Verifies that candidates within 40m of curated spots get flagged for review."""
        curated_place = {
            "id": "hub-mcd-carter-road-bandra",
            "latitude": 19.0683,
            "longitude": 72.8228,
            "hub_type": "standalone_drive_thru"
        }
        candidate = {
            "id": "osm-node-99",
            "latitude": 19.06832,
            "longitude": 72.82282,
            "outlets": [{"brand": "mcdonalds"}]
        }
        flagged, count = flag_proximity_with_curated_spots([candidate], [curated_place])
        self.assertEqual(count, 1)
        self.assertEqual(flagged[0]["possible_duplicate_of"], "hub-mcd-carter-road-bandra")

    def test_dry_run_preserves_disk_files(self):
        """Ensures that executing dry-run leaves disk files untouched."""
        fastfood_file = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "data", "places_mumbai", "fastfood.json")
        )
        pre_exists = os.path.exists(fastfood_file)
        pre_mtime = os.path.getmtime(fastfood_file) if pre_exists else None

        # Execute in-memory parsing without --apply
        from ingest_fastfood_chains import run_ingestion
        class Args:
            apply = False
            sync_db = False
            overpass_url = "https://overpass-api.de/api/interpreter"
            bbox = DEFAULT_BBOX
            brands = list(SUPPORTED_BRANDS.keys())
            fixture = self.fixture_path

        candidates = run_ingestion(Args())
        self.assertGreater(len(candidates), 0)

        # Confirm fastfood.json was not created or modified
        if pre_exists:
            self.assertEqual(os.path.getmtime(fastfood_file), pre_mtime)
        else:
            self.assertFalse(os.path.exists(fastfood_file))

if __name__ == "__main__":
    unittest.main()

