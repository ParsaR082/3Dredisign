'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink, RotateCcw } from 'lucide-react';

interface ContactOfficeMapProps {
  latitude?: number | string | null;
  longitude?: number | string | null;
  title?: string;
  address?: string;
  className?: string;
}

export default function ContactOfficeMap({
  latitude,
  longitude,
  title = 'دفتر مرکزی کانون تبلیغات اوروم سیما',
  address = 'ارومیه، خیابان خیام جنوبی، ساختمان اوروم سیما',
  className = '',
}: ContactOfficeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Urmia default coordinates
  const lat = Number(latitude) || 37.5527;
  const lng = Number(longitude) || 45.076;

  useEffect(() => {
    let isMounted = true;
    let observer: ResizeObserver | null = null;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Clean existing Leaflet instance if present
      if ((mapContainerRef.current as any)._leaflet_id != null) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        const L = (await import('leaflet')).default;
        if (!isMounted || !mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 15,
          scrollWheelZoom: false,
          dragging: true,
          zoomControl: true,
          attributionControl: false,
        });

        // Use reliable tile layer with dark styling
        // CartoDB Dark Matter with automatic OSM fallback
        const cartoTile = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 19,
            subdomains: 'abcd',
          }
        );

        const osmTile = L.tileLayer(
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            className: 'osm-dark-filter',
          }
        );

        // Add CartoDB tile; if error occurs, add OSM
        cartoTile.on('tileerror', () => {
          if (!map.hasLayer(osmTile)) {
            osmTile.addTo(map);
          }
        });

        cartoTile.addTo(map);

        // Custom pulsing marker pin
        const pinHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; transform: translate(-50%, -50%);">
            <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: #10b981; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <span style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #059669; color: #ffffff; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.6);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: pinHtml,
          className: 'custom-contact-office-pin',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -22],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="direction: rtl; font-family: inherit; font-size: 12px; color: #0f172a; padding: 4px 6px;">
            <div style="font-weight: 700; color: #047857; margin-bottom: 3px;">${title}</div>
            <div style="color: #475569; font-size: 11px; line-height: 1.5;">${address}</div>
          </div>
        `;
        marker.bindPopup(popupContent).openPopup();

        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Ensure tiles render with full dimensions when container animates into view
        const invalidate = () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        };

        setTimeout(invalidate, 100);
        setTimeout(invalidate, 300);
        setTimeout(invalidate, 600);
        setTimeout(invalidate, 1200);

        // Observe container size changes
        if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
          observer = new ResizeObserver(() => {
            invalidate();
          });
          observer.observe(mapContainerRef.current);
        }
      } catch (err) {
        console.warn('Failed to load Leaflet contact map:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (observer) observer.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, title, address]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* CSS style to ensure dark tiles and proper Leaflet rendering */}
      <style jsx global>{`
        .osm-dark-filter {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
        .leaflet-container {
          background: #09121d !important;
          font-family: inherit;
        }
      `}</style>

      {/* Map Window */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#09121d] h-60 sm:h-72 shadow-xl">
        <div
          ref={mapContainerRef}
          className="w-full h-full min-h-[240px] z-0"
          style={{ height: '100%', width: '100%', minHeight: '240px' }}
        />

        {/* Recenter button overlay */}
        <button
          type="button"
          onClick={handleRecenter}
          title="بازنشانی نقشه روی دفتر"
          className="absolute top-3 left-3 z-[400] p-2 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white transition-all shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Office Tag Badge */}
        <div className="absolute bottom-3 right-3 z-[400] px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-brand-500/30 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span>موقعیت حضوری دفتر کانون</span>
        </div>
      </div>

      {/* Direct Routing Links (Google Maps, Neshan, Balad) */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <a
          href={`https://maps.google.com/?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-2 rounded-xl bg-white/5 hover:bg-brand-500/10 hover:border-brand-500/30 text-gray-200 hover:text-white font-medium text-center border border-white/5 flex items-center justify-center gap-1.5 transition-all text-[11px] sm:text-xs"
        >
          <span>Google</span>
          <ExternalLink className="w-3 h-3 text-brand-400" />
        </a>

        <a
          href={`https://nshn.ir/?lat=${lat}&lng=${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-2 rounded-xl bg-white/5 hover:bg-brand-500/10 hover:border-brand-500/30 text-gray-200 hover:text-white font-medium text-center border border-white/5 flex items-center justify-center gap-1.5 transition-all text-[11px] sm:text-xs"
        >
          <span>نشان</span>
          <Navigation className="w-3 h-3 text-brand-400" />
        </a>

        <a
          href={`https://balad.ir/location?latitude=${lat}&longitude=${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-2 rounded-xl bg-white/5 hover:bg-brand-500/10 hover:border-brand-500/30 text-gray-200 hover:text-white font-medium text-center border border-white/5 flex items-center justify-center gap-1.5 transition-all text-[11px] sm:text-xs"
        >
          <span>بلد</span>
          <Navigation className="w-3 h-3 text-brand-400" />
        </a>
      </div>
    </div>
  );
}
