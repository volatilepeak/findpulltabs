'use client';

import { useEffect, useRef, useState } from 'react';
import type { Location } from '@/lib/data';
import { getTypeIcon, getTypeLabel, formatAddress, getDirectionsUrl, slugify } from '@/lib/data';

interface MapProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onBoundsChange?: (bounds: any) => void;
  selectedId?: number | null;
  className?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export function LeafletMap({
  locations,
  center = [46.7296, -94.6859],
  zoom = 7,
  height = '100%',
  onBoundsChange,
  selectedId,
  className = '',
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  // Block wheel events from leaking out of the map container
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    function stopWheel(e: WheelEvent) {
      e.stopPropagation();
    }
    el.addEventListener('wheel', stopWheel, { passive: false });
    return () => el.removeEventListener('wheel', stopWheel);
  }, []);

  // Load Leaflet scripts
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.L) {
      setLoaded(true);
      return;
    }

    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
      });

    loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
      .then(() => loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'))
      .then(() => setLoaded(true))
      .catch(console.error);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    // Dark map tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    if (onBoundsChange) {
      map.on('moveend', () => {
        onBoundsChange(map.getBounds());
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers
  useEffect(() => {
    if (!loaded || !mapInstanceRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Remove old markers
    if (markersRef.current) {
      map.removeLayer(markersRef.current);
    }

    // Create marker cluster group with performance tuning
    const markers = L.markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 15,
      chunkedLoading: true,
      chunkInterval: 100,
      chunkDelay: 10,
      animate: false,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count > 50) size = 'large';
        else if (count > 10) size = 'medium';
        return L.divIcon({
          html: `<div>${count}</div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(40, 40),
        });
      },
    });

    // Custom gold marker icon
    const goldIcon = L.divIcon({
      html: `<svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="#D4C5A3"/>
        <circle cx="12" cy="11" r="5" fill="#1A1A1A"/>
      </svg>`,
      className: 'custom-marker',
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32],
    });

    const selectedIcon = L.divIcon({
      html: `<svg width="30" height="40" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="#B49A5E"/>
        <circle cx="12" cy="11" r="5" fill="#FFFFFF"/>
      </svg>`,
      className: 'custom-marker-selected',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

    // Batch add markers for performance
    const markerArray: any[] = [];
    locations.forEach((loc) => {
      if (!loc.lat || !loc.lng) return;

      const icon = loc.id === selectedId ? selectedIcon : goldIcon;
      const marker = L.marker([loc.lat, loc.lng], { icon });

      const stateSlug = loc.state.toLowerCase();
      const citySlug = slugify(loc.city);
      const venueSlug = slugify(loc.name);
      const venueUrl = `/states/${stateSlug}/${citySlug}/${venueSlug}`;

      marker.bindPopup(`
        <div style="min-width: 220px;">
          <div style="font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 600; margin-bottom: 6px; color: #D4C5A3;">
            ${getTypeIcon(loc.type)} ${loc.name}
          </div>
          <div style="font-size: 12px; color: #CCCCCC; margin-bottom: 4px;">
            ${getTypeLabel(loc.type)}
          </div>
          <div style="font-size: 13px; color: #F0F0F0; margin-bottom: 10px;">
            ${formatAddress(loc)}
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="${venueUrl}" style="flex: 1; text-align: center; padding: 6px 12px; background: #D4C5A3; color: #1A1A1A; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">
              View Details
            </a>
            <a href="${getDirectionsUrl(loc)}" target="_blank" rel="noopener" style="flex: 1; text-align: center; padding: 6px 12px; background: rgba(212,197,163,0.15); color: #D4C5A3; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500; border: 1px solid rgba(212,197,163,0.3);">
              Directions
            </a>
          </div>
        </div>
      `);

      markerArray.push(marker);
    });

    markers.addLayers(markerArray);
    map.addLayer(markers);
    markersRef.current = markers;
  }, [loaded, locations, selectedId]);

  // Pan to center when it changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`${className}`}
      style={{ height, width: '100%', background: '#1A1A1A' }}
    />
  );
}
