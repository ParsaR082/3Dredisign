import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Calendar,
  MapPin,
  Layers,
  FileText,
  TrendingUp,
  Clock,
  Film,
  Image as ImageIcon,
  Check,
  Globe,
  Share2,
} from 'lucide-react';
import { getLiveProjects, getLiveProjectBySlug } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';
import ProjectDeviceShowcase from '@/components/portfolio/ProjectDeviceShowcase';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { TiltCard } from '@/components/ui/TiltCard';
import { MagneticButton } from '@/components/ui/MagneticButton';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getLiveProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getLiveProjectBySlug(slug);
  if (!project) return {};

  return generatePageMetadata({
    title: (project.meta_title || project.title) + ' | نمونه‌کار اروم‌سیما',
    description: project.meta_description || project.subtitle || project.description,
    path: '/portfolio/' + project.slug + '/',
    ogImage: project.thumbnail_image,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getLiveProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getLiveProjects();
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && (p.category_slug === project.category_slug || p.industry === project.industry))
    .slice(0, 3);

  const hasShowcase = Boolean(
    project.website_url ||
    project.mockups?.desktop ||
    project.mockups?.mobile ||
    project.mockups?.tablet
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-16">
      {/* ── 1. HEADER SECTION ── */}
      <MotionDiv variant="fade-up" className="space-y-5 sm:space-y-6">
        {/* Navigation Breadcrumb Links */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link
            href={`/?returnFrom=${project.slug}`}
            className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-600/25 border border-white/10 hover:border-brand-500/40 text-gray-300 hover:text-white text-xs font-semibold transition-all group shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-brand-400 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">بازگشت به محوطه ۳بعدی</span>
            <span className="sm:hidden">بازگشت ۳بعدی</span>
          </Link>

          <Link
            href="/portfolio/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-300 transition-colors"
          >
            <span>مشاهده همه نمونه‌کارها</span>
          </Link>
        </div>

        {/* Title, Subtitle & Meta Badges */}
        <div className="max-w-4xl space-y-3 sm:space-y-4">
          {/* Categories & Industry Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {project.category && (
              <MotionBadge className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full glass-panel-brand text-brand-300 text-xs font-bold">
                <span>{project.category}</span>
              </MotionBadge>
            )}

            {project.additional_categories &&
              project.additional_categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium"
                >
                  <span>{cat}</span>
                </span>
              ))}

            {project.industry && (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                <span>صنعت: {project.industry}</span>
              </span>
            )}
          </div>

          {/* Project Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {project.title}
          </h1>

          {/* Subtitle */}
          {project.subtitle && (
            <p className="text-base sm:text-xl text-brand-300 leading-relaxed font-medium">
              {project.subtitle}
            </p>
          )}

          {/* Short Description */}
          {project.description && (
            <p className="text-xs sm:text-base text-gray-300 leading-relaxed font-light">
              {project.description}
            </p>
          )}

          {/* Quick Meta Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 text-xs text-gray-400 border-t border-white/5">
            {project.project_date && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
                <span>تاریخ اجرا: {project.project_date}</span>
              </div>
            )}

            {project.location_zone && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
                <span>موقعیت: {project.location_zone}</span>
              </div>
            )}

            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>مشاهده وب‌سایت پروژه</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.pdf_url && (
              <a
                href={project.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold transition-colors"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>دریافت کاتالوگ PDF</span>
              </a>
            )}
          </div>
        </div>
      </MotionDiv>

      {/* ── 2. INTERACTIVE DEVICE SHOWCASE ── */}
      {hasShowcase && (
        <MotionDiv variant="scale-up">
          <ProjectDeviceShowcase project={project} />
        </MotionDiv>
      )}

      {/* ── 3. KPIS & RESULTS BAR ── */}
      {project.kpis && project.kpis.length > 0 && (
        <MotionDiv variant="fade-up">
          <InteractiveCard className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-brand-500/30 shadow-2xl">
            <h3 className="text-xs sm:text-sm font-bold text-gray-300 mb-4 sm:mb-6 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              <span>شاخص‌های کلیدی عملکرد و نتایج ملموس (KPIs)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              {project.kpis.map((kpi, idx) => (
                <div key={idx} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-2xl sm:text-4xl font-black text-gradient-brand">
                    {kpi.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">{kpi.label}</div>
                  {kpi.detail && <div className="text-[10px] sm:text-xs text-gray-400">{kpi.detail}</div>}
                </div>
              ))}
            </div>
          </InteractiveCard>
        </MotionDiv>
      )}

      {/* ── 4. MAIN BODY & SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8 sm:space-y-12">
          {/* Detailed Story */}
          {project.detailed_description && (
            <MotionDiv variant="fade-up" className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">داستان پروژه و رویکرد اجرایی</h2>
              <div className="text-xs sm:text-base text-gray-300 leading-loose space-y-4 text-justify whitespace-pre-line">
                <p>{project.detailed_description}</p>
              </div>
            </MotionDiv>
          )}

          {/* Challenge & Engineering Solution */}
          {project.challenge && (
            <MotionDiv variant="fade-up">
              <InteractiveCard className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-amber-500/30 bg-amber-500/[0.03] space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <h3>چالش اصلی و راه‌حل مهندسی اروم‌سیما</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed text-justify">
                  {project.challenge}
                </p>
              </InteractiveCard>
            </MotionDiv>
          )}

          {/* Timeline / Milestones Steps */}
          {project.timeline_steps && project.timeline_steps.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
                <span>مراحل اجرای پروژه (Timeline & Milestones)</span>
              </h3>
              <StaggerContainer className="space-y-3 sm:space-y-4">
                {project.timeline_steps.map((step, idx) => (
                  <StaggerItem key={idx}>
                    <InteractiveCard className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 flex items-start gap-3 sm:gap-4 hover:border-brand-500/30 transition-colors">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 font-black text-xs flex items-center justify-center shrink-0">
                        ۰{idx + 1}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{step.title}</h4>
                          {step.date && (
                            <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono">{step.date}</span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">{step.description}</p>
                      </div>
                    </InteractiveCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}

          {/* ROI Analysis Section */}
          {project.roi && (project.roi.percentage != null || project.roi.cost != null || project.roi.revenue != null) && (
            <MotionDiv variant="scale-up">
              <InteractiveCard className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/30 via-dark-card to-dark-surface border border-emerald-500/30 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <h3>تحلیل بازگشت سرمایه (ROI)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2">
                  {project.roi.percentage != null && (
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/30 border border-white/5 text-center space-y-1">
                      <div className="text-[11px] sm:text-xs text-gray-400">نرخ بازگشت سرمایه (ROI)</div>
                      <div className="text-xl sm:text-3xl font-black text-emerald-400">
                        +{project.roi.percentage}%
                      </div>
                    </div>
                  )}
                  {project.roi.cost != null && (
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/30 border border-white/5 text-center space-y-1">
                      <div className="text-[11px] sm:text-xs text-gray-400">هزینه اولیه سرمایه‌گذاری</div>
                      <div className="text-sm sm:text-lg font-bold text-gray-200">
                        {project.roi.cost.toLocaleString('fa-IR')} تومان
                      </div>
                    </div>
                  )}
                  {project.roi.revenue != null && (
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/30 border border-white/5 text-center space-y-1">
                      <div className="text-[11px] sm:text-xs text-gray-400">درآمد حاصله برآورد شده</div>
                      <div className="text-sm sm:text-lg font-bold text-white">
                        {project.roi.revenue.toLocaleString('fa-IR')} تومان
                      </div>
                    </div>
                  )}
                </div>
              </InteractiveCard>
            </MotionDiv>
          )}

          {/* Videos Showcase */}
          {project.videos && project.videos.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
                <span>ویدیوهای مستند و تیزرهای پروژه</span>
              </h3>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {project.videos.map((vid) => (
                  <StaggerItem key={vid.id}>
                    <InteractiveCard className="rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-white/10 space-y-2 sm:space-y-3 p-2.5 sm:p-3 shadow-xl">
                      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video bg-black">
                        {vid.video_file || vid.optimized_file ? (
                          <video
                            src={vid.optimized_file || vid.video_file || ''}
                            poster={vid.thumbnail || undefined}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : vid.embed_url ? (
                          <iframe
                            src={vid.embed_url}
                            title={vid.title}
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        ) : null}
                      </div>
                      <div className="px-2 pb-1 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{vid.title}</h4>
                        {vid.orientation && (
                          <span className="text-[10px] text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                            {vid.orientation}
                          </span>
                        )}
                      </div>
                    </InteractiveCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}

          {/* Gallery Showcase */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
                <span>گالری تصاویر و مستندات گرافیکی</span>
              </h3>
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                {project.gallery.map((img) => (
                  <StaggerItem key={img.id}>
                    <div
                      data-cursor="view"
                      className="group relative rounded-xl sm:rounded-2xl overflow-hidden glass-panel border border-white/10 aspect-[4/3] bg-dark-card shadow-lg"
                    >
                      <ImageReveal
                        src={img.image}
                        alt={img.caption || project.title}
                        aspectRatio="4/3"
                        mode="hover-zoom"
                        className="w-full h-full"
                      />
                      {img.caption && (
                        <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 bg-black/75 backdrop-blur-sm text-[10px] sm:text-[11px] text-gray-200 truncate z-10 pointer-events-none">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}
        </div>

        {/* ── SIDEBAR SPECIFICATIONS COLUMN ── */}
        <div className="lg:col-span-4 space-y-6">
          <MotionDiv variant="fade-up" delay={0.1} className="lg:sticky lg:top-24">
            <InteractiveCard className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 space-y-5 sm:space-y-6 shadow-2xl">
              <h3 className="text-sm sm:text-base font-bold text-white border-b border-white/5 pb-3">
                اطلاعات و پشته فنی پروژه
              </h3>

              <div className="space-y-4 text-xs">
                {project.category && (
                  <div>
                    <span className="block text-gray-400 mb-1">دسته‌بندی اصلی</span>
                    <span className="font-semibold text-white">{project.category}</span>
                  </div>
                )}

                {project.additional_categories && project.additional_categories.length > 0 && (
                  <div>
                    <span className="block text-gray-400 mb-1">دسته‌بندی‌های مکمل</span>
                    <div className="flex flex-wrap gap-1">
                      {project.additional_categories.map((c, i) => (
                        <span key={i} className="bg-white/5 px-2 py-0.5 rounded text-gray-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.industry && (
                  <div>
                    <span className="block text-gray-400 mb-1">صنعت و حوزه فعالیت</span>
                    <span className="font-semibold text-white">{project.industry}</span>
                  </div>
                )}

                {project.project_date && (
                  <div>
                    <span className="block text-gray-400 mb-1">تاریخ تکمیل</span>
                    <span className="font-semibold text-white">{project.project_date}</span>
                  </div>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <span className="block text-gray-400 mb-2">فناوری‌های به‌کاررفته</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-md text-brand-300 font-mono text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.website_url && (
                  <div className="pt-2">
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>باز کردن وب‌سایت اصلی</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* CTA Box */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  href="/contact-us/"
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>سفارش پروژه‌ای مشابه</span>
                </Link>
              </div>
            </InteractiveCard>
          </MotionDiv>
        </div>
      </div>

      {/* ── 5. RELATED PROJECTS ── */}
      {relatedProjects.length > 0 && (
        <MotionDiv variant="fade-up" className="space-y-6 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">سایر پروژه‌های مرتبط</h3>
            <Link
              href="/portfolio/"
              className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
            >
              مشاهده همه پرونده‌ها
            </Link>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProjects.map((rel) => (
              <StaggerItem key={rel.id}>
                <Link href={`/portfolio/${rel.slug}/`}>
                  <InteractiveCard className="group rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-brand-500/40 p-4 space-y-3 transition-colors shadow-lg">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-dark-card">
                      <img
                        src={rel.thumbnail_image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                      {rel.title}
                    </h4>
                    <div className="text-[11px] text-gray-400 flex items-center justify-between">
                      <span>{rel.category}</span>
                      <span>{rel.project_date}</span>
                    </div>
                  </InteractiveCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </MotionDiv>
      )}
    </div>
  );
}
