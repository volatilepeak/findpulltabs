import { MetadataRoute } from 'next';
import { STATES, getCitiesForState, getLocationsForCity, slugify, venueSlug } from '@/lib/data';
import { getAllBlogSlugs } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://findpulltabs.com';
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push({ url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 });

  // Blog
  entries.push({ url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
  getAllBlogSlugs().forEach((slug) => {
    entries.push({ url: `${baseUrl}/blog/${slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
  });

  // Submit
  entries.push({ url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 });

  // States, cities, venues
  Object.keys(STATES).forEach((stateKey) => {
    const stateInfo = STATES[stateKey];
    entries.push({
      url: `${baseUrl}/states/${stateKey}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    const cities = getCitiesForState(stateInfo.abbr);
    cities.forEach((city) => {
      entries.push({
        url: `${baseUrl}/states/${stateKey}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });

      const locs = getLocationsForCity(stateInfo.abbr, city.slug);
      locs.forEach((loc) => {
        entries.push({
          url: `${baseUrl}/states/${stateKey}/${city.slug}/${venueSlug(loc)}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      });
    });
  });

  return entries;
}
