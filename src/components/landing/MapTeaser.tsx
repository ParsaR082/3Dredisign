'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

interface MapTeaserProps {
  projectsCount: number;
  projects?: { id: string; title: string; lat: number; lng: number }[];
}

export default function MapTeaser({ projectsCount, projects = [] }: MapTeaserProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Convert number to Persian
  const toPersian = (num: number) => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      try {
        const L = (await import('leaflet')).default;
        if (!isMounted || !mapContainerRef.current) return;

        // Urmia default center
        const defaultCenter: [number, number] = [37.5518, 45.0782];

        const map = L.map(mapContainerRef.current, {
          scrollWheelZoom: false,
          dragging: true,
          zoomControl: false,
          attributionControl: false,
        }).setView(defaultCenter, 12);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 16,
          className: 'osm-dark-tiles',
        }).addTo(map);

        // Add markers for projects
        const defaultPins: [number, number][] = [
          [37.5518, 45.0782],
          [37.545, 45.068],
          [37.562, 45.085],
          [37.538, 45.092],
          [37.558, 45.055],
          [37.541, 45.071],
          [37.567, 45.062],
          [37.531, 45.084],
        ];

        const pins = projects.length > 0
          ? projects.map((p) => [p.lat, p.lng] as [number, number])
          : defaultPins;

        pins.forEach(([lat, lng]) => {
          L.circleMarker([lat, lng], {
            radius: 5,
            color: '#5ef0c4',
            fillColor: '#0E946E',
            fillOpacity: 0.85,
            weight: 1.5,
          }).addTo(map);

          L.circleMarker([lat, lng], {
            radius: 9,
            color: '#5ef0c4',
            fill: false,
            weight: 1,
            opacity: 0.4,
          }).addTo(map);
        });

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet map teaser error:', err);
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [projects]);

  return (
    <section className="pmap-teaser rv py-16 px-4 sm:px-6 bg-[#050C0A]" id="projects-map-teaser">
      <div className="pmap-teaser__inner max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 bg-[#091512] border border-emerald-500/20 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="pmap-teaser__map w-full lg:w-1/2 h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-emerald-500/20 shadow-inner relative z-0"
          aria-hidden="true"
        />

        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-right">
          <span className="pmap-teaser__lbl inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>ارومیه و شمال‌غرب کشور</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            <span className="text-emerald-400">{toPersian(projectsCount || 12)}+</span> برند روی نقشه
          </h2>

          <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed mb-8 max-w-lg">
            پروژه‌های اروم‌سیما در نقاط مختلف ارومیه و شهرهای همجوار؛
            از کارخانجات صنعتی شهرک فاز ۲ تا کلینیک‌ها و فروشگاه‌های برتر خیابان‌های خیام، حسنی، استادان و بهداری.
          </p>

          <Link
            href="/portfolio/map/"
            className="pmap-teaser__btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:scale-105"
          >
            <span>مشاهده نقشه کامل پروژه‌ها</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
