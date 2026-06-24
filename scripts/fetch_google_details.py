"""
fetch_google_details.py - Fetch Google ratings, reviews, photos for FindPullTabs venues

Usage:
  pip install requests

  $env:GOOGLE_API_KEY = "your-key"
  $env:SUPABASE_URL = "https://lkhirqrpfzxozkyclect.supabase.co"
  $env:SUPABASE_KEY = "your-service-role-key"
  python scripts/fetch_google_details.py

Enable in Google Cloud Console:
  - Places API
"""

import os, sys, json, time, requests, re
from pathlib import Path

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://lkhirqrpfzxozkyclect.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
DELAY = 0.2
BATCH_SIZE = 50
STATE_NAMES = {'MN': 'Minnesota', 'AK': 'Alaska', 'IA': 'Iowa', 'WI': 'Wisconsin'}
BAD_PHOTO = ["streetview", "street_view", "cbk0", "geo0", "geo1", "geo2", "geo3"]

def slugify(t):
    return re.sub(r'[^a-z0-9]+', '-', t.lower().strip()).strip('-')

def load_locations(path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return [{
        'id': l['id'], 'name': l['name'], 'address': l['address'],
        'city': l['city'], 'state': l['state'],
        'state_key': l['state'].lower(),
        'city_slug': slugify(l['city']),
        'venue_slug': slugify(l['name']),
    } for l in data]

def text_search(query):
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {'query': query, 'key': GOOGLE_API_KEY}
    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()
        if data.get('status') == 'REQUEST_DENIED':
            print(f"  API ERROR: {data.get('error_message', 'Denied')}")
            print(f"  Enable Places API in Google Cloud Console")
            return None
        if data.get('results'):
            r = data['results'][0]
            return {
                'place_id': r.get('place_id'),
                'rating': r.get('rating'),
                'review_count': r.get('user_ratings_total', 0),
            }
    except Exception as e:
        print(f"  Search error: {e}")
    return None

def get_photo_ref(place_id):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {'place_id': place_id, 'fields': 'photos', 'key': GOOGLE_API_KEY}
    try:
        resp = requests.get(url, params=params, timeout=10)
        photos = resp.json().get('result', {}).get('photos', [])
        for p in photos:
            ref = p.get('photo_reference', '')
            if not any(kw in ref.lower() for kw in BAD_PHOTO):
                return ref
    except Exception as e:
        print(f"  Details error: {e}")
    return None

def get_photo_url(ref):
    if not ref:
        return None
    url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference={ref}&key={GOOGLE_API_KEY}"
    try:
        resp = requests.get(url, allow_redirects=False, timeout=10)
        if resp.status_code in (301, 302):
            loc = resp.headers.get('Location', '')
            if loc and 'streetview' not in loc.lower():
                return loc
        return url
    except:
        pass
    return None

def upsert(batch):
    if not batch: return
    url = f"{SUPABASE_URL}/rest/v1/venue_details"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
    }
    try:
        resp = requests.post(url, json=batch, headers=headers, timeout=30)
        if resp.status_code in (200, 201):
            print(f"  >> Saved {len(batch)} to Supabase")
        else:
            print(f"  >> Supabase error {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"  >> Supabase error: {e}")

def get_fetched():
    url = f"{SUPABASE_URL}/rest/v1/venue_details"
    headers = {'apikey': SUPABASE_KEY, 'Authorization': f'Bearer {SUPABASE_KEY}'}
    try:
        resp = requests.get(url, headers=headers, params={'select': 'state_key,city_slug,venue_slug'}, timeout=30)
        if resp.status_code == 200:
            return set(f"{r['state_key']}/{r['city_slug']}/{r['venue_slug']}" for r in resp.json())
    except:
        pass
    return set()

def build_queries(loc):
    name = loc['name']
    addr = loc['address']
    city = loc['city']
    state = STATE_NAMES.get(loc['state'], loc['state'])
    queries = []
    if addr and city:
        queries.append(f"{name}, {addr}")
    queries.append(f"{name}, {city}, {state}")
    if addr:
        queries.append(f"{addr}, {city}, {state}")
    return queries

def main():
    if not GOOGLE_API_KEY:
        print("ERROR: Set GOOGLE_API_KEY"); print('  $env:GOOGLE_API_KEY = "your-key"'); sys.exit(1)
    if not SUPABASE_KEY:
        print("ERROR: Set SUPABASE_KEY"); print('  $env:SUPABASE_KEY = "your-key"'); sys.exit(1)

    print("Testing API key...")
    test = text_search("McDonald's, Minneapolis, Minnesota")
    if test is None:
        print("FAILED - check API key and that Places API is enabled"); sys.exit(1)
    print(f"API works! Test found place with rating {test.get('rating')}\n")

    json_path = None
    for p in ['src/data/locations.json', 'locations.json']:
        if Path(p).exists():
            json_path = p; break
    if not json_path:
        print("ERROR: Can't find locations.json - run from project folder"); sys.exit(1)

    locations = load_locations(json_path)
    print(f"Loaded {len(locations)} locations")

    fetched = get_fetched()
    print(f"Already fetched: {len(fetched)}")

    todo = [l for l in locations if f"{l['state_key']}/{l['city_slug']}/{l['venue_slug']}" not in fetched]
    print(f"To fetch: {len(todo)}\n")

    if not todo:
        print("All done!"); return

    batch, success, no_rating, failed = [], 0, 0, 0

    for i, loc in enumerate(todo):
        print(f"[{i+1}/{len(todo)}] {loc['name']} - {loc['city']}, {loc['state']}")

        result = None
        for q in build_queries(loc):
            result = text_search(q)
            time.sleep(DELAY)
            if result: break

        if not result:
            print(f"  Not found"); failed += 1; continue

        photo_url = None
        if result['place_id']:
            ref = get_photo_ref(result['place_id'])
            time.sleep(DELAY)
            if ref:
                photo_url = get_photo_url(ref)
                time.sleep(DELAY)

        batch.append({
            'state_key': loc['state_key'],
            'city_slug': loc['city_slug'],
            'venue_slug': loc['venue_slug'],
            'venue_name': loc['name'],
            'rating': result.get('rating'),
            'review_count': result.get('review_count', 0),
            'photo_url': photo_url,
            'google_place_id': result.get('place_id'),
        })

        if result.get('rating'):
            success += 1
            ph = " 📷" if photo_url else ""
            print(f"  ★ {result['rating']} ({result.get('review_count',0)} reviews){ph}")
        else:
            no_rating += 1
            print(f"  Found, no rating")

        if len(batch) >= BATCH_SIZE:
            upsert(batch); batch = []

        if (i+1) % 100 == 0:
            print(f"\n--- {i+1}/{len(todo)} | Rated: {success} | No rating: {no_rating} | Not found: {failed} ---\n")

    if batch: upsert(batch)

    print(f"\n{'='*50}")
    print(f"DONE! Rated: {success} | No rating: {no_rating} | Not found: {failed}")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
