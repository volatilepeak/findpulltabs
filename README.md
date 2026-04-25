# FindPullTabs.com — Next.js Rebuild

A Next.js 14 site for discovering pull tab locations across Minnesota, Alaska, Iowa, and Wisconsin. 3,371 venues auto-generated into state, city, and venue pages.

## Stack

- **Framework**: Next.js 14 (App Router, static generation)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS with custom gold/charcoal/cream theme
- **Fonts**: Playfair Display + Outfit (Google Fonts)
- **Map**: Leaflet + MarkerCluster (dark CartoDB tiles)
- **Auth**: Supabase magic link
- **Favorites**: Supabase Postgres + RLS
- **Forms**: Netlify Forms + email fallback

## Pages Generated

| Route | Count | Description |
|---|---|---|
| `/` | 1 | Full-width map hero with search, filters, sidebar |
| `/states/[state]` | 4 | State pages with map, city directory |
| `/states/[state]/[city]` | ~1,217 | City pages with venue cards |
| `/states/[state]/[city]/[venue]` | ~3,371 | Venue detail pages with claim CTA |
| `/blog` | 1 | Blog index |
| `/blog/[slug]` | 7 | Blog posts |
| `/submit` | 1 | Submit location form |
| `/auth/callback` | 1 | Supabase auth callback |

**Total: ~4,600+ statically generated pages**

## Setup

```bash
# Install dependencies
npm install

# Copy env template
cp .env.local.example .env.local
# Fill in your Supabase anon key

# Run dev server
npm run dev

# Build for production
npm run build
```

## Supabase Setup

1. Go to your Supabase dashboard
2. Run this SQL in the SQL editor to create the favorites table:

```sql
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all favorites counts" ON favorites
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_favorites_location ON favorites(location_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
```

3. Enable Magic Link auth in Authentication → Providers → Email
4. Add your site URL to Authentication → URL Configuration

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Data

Location data lives in `src/data/locations.json` (generated from the original JS data files). To update data, modify the source files and re-run `node convert-data.js`.

## Design

- **Colors**: Gold (#D4C5A3), Charcoal (#5A5A5A), Cream (#F8F5EF)
- **Fonts**: Playfair Display (headings), Outfit (body)
- **Map**: CartoDB Dark Matter tiles with gold markers
- **Glass effect**: Translucent dark panels with blur
- **Dark mode**: Default on, togglable via header button
