'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  RotateCcw,
  ChevronLeft,
  Search,
  Building,
  Compass,
} from 'lucide-react';
import type { Project } from '@/types/content';

interface UrmiaInteractiveMapProps {
  projects: Project[];
}

// Fixed framing for Urmia with locked zoom
const URMIA_CENTER: [number, number] = [37.5525, 45.0800];
const FIXED_ZOOM = 13;

export default function UrmiaInteractiveMap({ projects }: UrmiaInteractiveMapProps) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const [activeZone, setActiveZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<'dark-osm' | 'cartodb'>('dark-osm');

  // Filter projects with valid coordinates
  const validProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.latitude != null &&
        p.longitude != null &&
        !isNaN(Number(p.latitude)) &&
        !isNaN(Number(p.longitude))
    );
  }, [projects]);

  // Extract distinct zones
  const zones = useMemo(() => {
    const list: { name: string; count: number }[] = [];
    const counts = new Map<string, number>();

    validProjects.forEach((p) => {
      const z = p.location_zone || 'سایر نقاط ارومیه';
      counts.set(z, (counts.get(z) || 0) + 1);
    });

    counts.forEach((count, name) => {
      list.push({ name, count });
    });

    return list.sort((a, b) => b.count - a.count);
  }, [validProjects]);

  // Filtered projects according to zone and search
  const displayedProjects = useMemo(() => {
    return validProjects.filter((p) => {
      const matchZone = activeZone === 'all' || (p.location_zone || 'سایر نقاط ارومیه') === activeZone;
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.location_zone && p.location_zone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.industry && p.industry.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchZone && matchSearch;
    });
  }, [validProjects, activeZone, searchQuery]);

  // 1. Initialize Map safely with completely locked zoom
  useEffect(() => {
    let isMounted = true;
    let mapInstance: any = null;

    const initMap = async () => {
      if (!mapContainerRef.current) return;

      // Clean up previous instance if any
      if ((mapContainerRef.current as any)._leaflet_id != null) {
        try {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
          }
        } catch (_) {}
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      try {
        const L = (await import('leaflet')).default;

        if (!isMounted || !mapContainerRef.current) return;

        // Initialize Map with zoom completely disabled
        mapInstance = L.map(mapContainerRef.current, {
          center: URMIA_CENTER,
          zoom: FIXED_ZOOM,
          minZoom: FIXED_ZOOM,
          maxZoom: FIXED_ZOOM,
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
          boxZoom: false,
          keyboard: false,
          dragging: true, // Smooth panning remains enabled
          attributionControl: true,
        });

        // OpenStreetMap standard tile layer with dark CSS filter (100% accessible in Iran, zero blocks)
        const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          className: 'osm-dark-tiles',
          maxZoom: FIXED_ZOOM,
          minZoom: FIXED_ZOOM,
        });

        // Esri World Dark Gray layer (keyless, zero watermark)
        const cartoLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          {
            attribution: 'Esri, HERE',
            maxZoom: FIXED_ZOOM,
            minZoom: FIXED_ZOOM,
          }
        );

        if (mapStyle === 'cartodb') {
          cartoLayer.addTo(mapInstance);
        } else {
          osmLayer.addTo(mapInstance);
        }

        const group = L.featureGroup();
        group.addTo(mapInstance);

        markersGroupRef.current = group;
        mapInstanceRef.current = mapInstance;

        // Invalidate size to guarantee tiles render with full dimensions
        setTimeout(() => {
          if (isMounted && mapInstance) {
            mapInstance.invalidateSize();
          }
        }, 150);

        setTimeout(() => {
          if (isMounted && mapInstance) {
            mapInstance.invalidateSize();
          }
        }, 600);

        // Smooth wheel panning handler: scroll moves the map, NEVER the whole page!
        const handleMapWheel = (e: WheelEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (mapInstance) {
            mapInstance.panBy([e.deltaX || 0, e.deltaY], { animate: false });
          }
        };

        const container = mapContainerRef.current;
        (container as any)._wheelHandler = handleMapWheel;
        container.addEventListener('wheel', handleMapWheel, { passive: false });

        setIsMapLoaded(true);
      } catch (err) {
        console.error('Failed to load Leaflet:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapContainerRef.current && (mapContainerRef.current as any)._wheelHandler) {
        mapContainerRef.current.removeEventListener('wheel', (mapContainerRef.current as any)._wheelHandler);
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (_) {}
        mapInstanceRef.current = null;
      }
    };
  }, [mapStyle]);

  // 2. Render Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group || !isMapLoaded) return;

    import('leaflet').then(({ default: L }) => {
      group.clearLayers();

      displayedProjects.forEach((project) => {
        const lat = Number(project.latitude);
        const lng = Number(project.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const isCurrentSelected = selectedProject?.slug === project.slug;

        const markerHtml = `
          <div class="urumsima-radar-pin group cursor-pointer relative w-10 h-10 flex items-center justify-center select-none">
            <!-- Pulsing outer wave -->
            <div class="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping duration-1000 pointer-events-none"></div>
            <!-- Second soft glow ring -->
            <div class="absolute w-7 h-7 rounded-full bg-emerald-500/25 border border-emerald-400/50 pointer-events-none group-hover:scale-125 transition-transform duration-300"></div>
            <!-- Solid Core Pin (dead center at 20px, 20px) -->
            <div class="relative z-10 w-4 h-4 rounded-full ${
              isCurrentSelected
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 scale-125 ring-4 ring-amber-400/40'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-300 ring-4 ring-emerald-500/30'
            } border-2 border-white shadow-[0_0_18px_rgba(16,185,129,0.95)] flex items-center justify-center transition-all duration-300 group-hover:scale-130">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <!-- Pin label visible on hover -->
            <div class="absolute top-10 whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-900/95 border border-emerald-500/40 text-[11px] font-bold text-white shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
              ${project.title.substring(0, 26)}${project.title.length > 26 ? '...' : ''}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          tooltipAnchor: [0, -22],
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const tooltipContent = `
          <div class="w-72 sm:w-80 p-3 rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-emerald-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-right select-none transition-all">
            <div class="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 mb-2.5 border border-white/5">
              <img 
                src="${project.thumbnail_image}" 
                alt="${project.title}" 
                class="w-full h-full object-cover"
                onerror="this.src='/images/urumsima3.webp'" 
              />
              <div class="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-sm border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                ${project.location_zone || 'ارومیه'}
              </div>
              <div class="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-sm text-[10px] text-gray-300">
                ${project.industry || 'پروژه شاخص'}
              </div>
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-white mb-1.5 line-clamp-1 leading-snug">
              ${project.title}
            </h4>
            <p class="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-3">
              ${project.description || 'پروژه موفق پیاده‌سازی شده توسط آژانس دیجیتال اروم سیما.'}
            </p>
            <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>مشاهده پرونده کامل پروژه</span>
              <span class="text-xs">←</span>
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          direction: 'top',
          offset: [0, -10],
          opacity: 1,
          className: 'custom-leaflet-tooltip',
          interactive: true,
        });

        marker.on('mouseover', () => {
          setHoveredProject(project);
        });

        marker.on('mouseout', () => {
          setHoveredProject(null);
        });

        marker.on('click', () => {
          setSelectedProject(project);
          router.push(`/portfolio/${project.slug}/`);
        });

        marker.addTo(group);
      });
    });
  }, [displayedProjects, isMapLoaded, selectedProject, router]);

  // Controls - Only smooth pan is used, zoom is completely locked
  const handleResetView = () => {
    mapInstanceRef.current?.panTo(URMIA_CENTER, { duration: 0.8 });
  };

  const handleZoneSelect = (zoneName: string) => {
    setActiveZone(zoneName);
    if (zoneName === 'all') {
      handleResetView();
      return;
    }

    const zoneProjects = validProjects.filter(
      (p) => (p.location_zone || 'سایر نقاط ارومیه') === zoneName
    );
    if (zoneProjects.length > 0 && mapInstanceRef.current) {
      const lats = zoneProjects.map((p) => Number(p.latitude));
      const lngs = zoneProjects.map((p) => Number(p.longitude));
      const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

      mapInstanceRef.current.panTo([avgLat, avgLng], { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0B0F17] shadow-2xl backdrop-blur-xl">
      {/* Top Bar: Search, Zone Filters & Stats */}
      <div className="p-4 sm:p-6 border-b border-white/5 space-y-4 bg-gradient-to-r from-dark-surface/95 via-dark-card/90 to-dark-surface/95">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                نقشه زنده پروژه‌ها و مشتریان در ارومیه
              </h2>
            </div>
            <p className="text-xs text-gray-400">
              موقعیت واقعی برندها، مراکز پزشکی، کارخانجات و کسب‌وکارهایی که به اروم‌سیما اعتماد کرده‌اند.
            </p>
          </div>

          {/* Stats & Style Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setMapStyle('dark-osm')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  mapStyle === 'dark-osm'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                تاریک شهری
              </button>
              <button
                type="button"
                onClick={() => setMapStyle('cartodb')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  mapStyle === 'cartodb'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                کارتو دارک
              </button>
            </div>

            <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold font-mono">
              {displayedProjects.length} پروژه فعال
            </span>
          </div>
        </div>

        {/* Filter Bar: Zone Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Zone Buttons */}
          <div 
            data-lenis-prevent="true"
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
                e.stopPropagation();
              }
            }}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs overscroll-contain"
            style={{ overscrollBehavior: 'contain' }}
          >
            <button
              type="button"
              onClick={() => handleZoneSelect('all')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-medium flex items-center gap-1.5 ${
                activeZone === 'all'
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 font-bold'
                  : 'bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] hover:text-white border border-white/5'
              }`}
            >
              <span>همه مناطق</span>
              <span className="text-[10px] opacity-75 font-mono">({validProjects.length})</span>
            </button>

            {zones.map((z) => (
              <button
                key={z.name}
                type="button"
                onClick={() => handleZoneSelect(z.name)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-medium flex items-center gap-1.5 ${
                  activeZone === z.name
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 font-bold'
                    : 'bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] hover:text-white border border-white/5'
                }`}
              >
                <span>{z.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({z.count})</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی برند یا منطقه..."
              className="w-full pl-3 pr-9 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[540px] sm:h-[640px] lg:h-[700px] bg-[#0d131f] overflow-hidden">
        {/* Decorative Grid Pattern behind tiles */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Leaflet Map DOM Target */}
        <div 
          ref={mapContainerRef} 
          dir="ltr" 
          data-lenis-prevent="true" 
          className="w-full h-full z-0 cursor-grab active:cursor-grabbing overscroll-contain" 
          style={{ direction: 'ltr', overscrollBehavior: 'contain' }} 
        />

        {/* Floating Custom Map Controls (Top Left) - Only Center/Reset button */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleResetView}
            title="مرکز ارومیه"
            className="h-9 px-3 rounded-xl bg-dark-card/90 backdrop-blur-md border border-white/10 text-white hover:text-brand-400 hover:border-brand-500/40 flex items-center gap-1.5 shadow-xl transition-all text-xs font-semibold"
          >
            <Compass className="w-4 h-4 text-brand-400" />
            <span className="hidden sm:inline">مرکز ارومیه</span>
          </button>
        </div>

        {/* Floating Legend / Instructions (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-dark-card/90 backdrop-blur-md border border-white/10 text-[11px] text-gray-300 shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>نقطه سبز: پروژه فعال اروم‌سیما</span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">هاور برای جزئیات • کلیک برای ورود به صفحه پروژه</span>
        </div>

        {/* Mobile Preview Floating Bar */}
        {hoveredProject && (
          <div className="sm:hidden absolute bottom-3 inset-x-3 z-30 p-3 rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl flex items-center gap-3">
            <img
              src={hoveredProject.thumbnail_image}
              alt={hoveredProject.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/urumsima3.webp';
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white line-clamp-1">{hoveredProject.title}</h4>
              <p className="text-[10px] text-emerald-400 line-clamp-1">
                {hoveredProject.location_zone || 'ارومیه'}
              </p>
            </div>
            <Link
              href={`/portfolio/${hoveredProject.slug}/`}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-bold shrink-0 flex items-center gap-1"
            >
              <span>مشاهده</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="p-3 sm:p-4 bg-dark-surface/80 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-brand-400" />
          <span>دفتر مرکزی اروم سیما: ارومیه، خیابان حسنی، مجتمع اورشاد</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 font-mono text-[11px]">نمای ثابت شهری ارومیه</span>
          <span className="text-emerald-400 font-bold">پوشش سراسری کلانشهر ارومیه</span>
        </div>
      </div>
    </div>
  );
}
