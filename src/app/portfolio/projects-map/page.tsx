import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Sparkles, ChevronRight, ArrowLeft, Building2, ExternalLink } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { getLiveProjects } from '@/lib/db';

export const metadata: Metadata = generatePageMetadata({
  title: 'نقشه تعاملی پروژه‌ها در ارومیه و استان | اروم سیما',
  description: 'نقشه و موقعیت جغرافیایی پروژه‌های طراحی سایت، سئو، هویت بصری و تیزر تبلیغاتی اروم‌سیما در سطح شهر ارومیه و استان آذربایجان غربی.',
  path: '/portfolio/projects-map/',
});

export default async function ProjectsMapPage() {
  const projects = await getLiveProjects();

  // Zone coordinates / mock locations in Urmia for realistic presentation
  const urmiaZones = [
    { name: 'خیابان حسنی و استادان', count: 4, desc: 'برندهای پزشکی، کلینیک‌ها و دفاتر مهندسی' },
    { name: 'خیابان کاشانی و امام رضا', count: 3, desc: 'مراکز خرید لوکس، طلا و جواهرات' },
    { name: 'شهرک صنعتی فاز ۲ ارومیه', count: 5, desc: 'کارخانجات صنعتی، ساختمانی و صادراتی' },
    { name: 'بلوار شیخ تپه و دانشکده', count: 3, desc: 'کافه‌ها، رستوران‌های زنجیره‌ای و استارتاپ‌ها' },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <Link href="/portfolio/" className="hover:text-brand-400 transition-colors">نمونه‌کارها</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">نقشه پروژه‌ها در ارومیه</span>
      </nav>

      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-white/10 bg-gradient-to-br from-dark-surface/90 via-dark-card/90 to-brand-950/30 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
            <MapPin className="w-4 h-4 text-brand-400" />
            <span>SEO محلی و حضور فیزیکی در ارومیه</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            قدرت برند در <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-400">نقاط مختلف ارومیه</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            بیش از {projects.length} پروژه و برند شاخص در مناطق اداری، تجاری و شهرک‌های صنعتی ارومیه با استراتژی و هدایت فنی آژانس اروم‌سیما به رشد و فروش پایدار دست یافته‌اند.
          </p>
        </div>
      </div>

      {/* Zone Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {urmiaZones.map((zone, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-dark-card/80 border border-white/5 space-y-3 hover:border-brand-500/20 transition-all shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">{zone.name}</h2>
              <p className="text-xs text-gray-400 leading-relaxed">{zone.desc}</p>
            </div>
            <div className="pt-2 text-xs font-bold text-brand-300 flex items-center justify-between">
              <span>تعداد برندها:</span>
              <span className="font-mono text-sm">{zone.count} پروژه</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Map Visual Presentation */}
      <div className="rounded-3xl border border-white/10 bg-dark-card/90 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>پراکندگی جغرافیایی مشتریان در نقشه کلانشهر ارومیه</span>
            </h2>
            <p className="text-xs text-gray-400">
              روی هر پروژه بزنید تا به پرونده تحلیلی و دستاوردهای آن هدایت شوید.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white/[0.04] text-xs font-mono text-gray-300 border border-white/5">
            مختصات مرکز: 37.5518° N, 45.0782° E
          </span>
        </div>

        {/* Visual Map Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-500/30 transition-all space-y-4 hover:shadow-xl"
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-dark-surface relative">
                <img
                  src={p.thumbnail_image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-dark-base/80 text-brand-300 backdrop-blur-sm border border-brand-500/20 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>ارومیه</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">{p.industry}</span>
                <Link
                  href={`/portfolio/${p.slug}/`}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  <span>پرونده پروژه</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
