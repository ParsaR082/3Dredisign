import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import { getLiveBlogData } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

const BLOG_CATEGORY_MAP: Record<string, { title: string; desc: string }> = {
  'digital-marketing': {
    title: 'مقالات دیجیتال مارکتینگ و رشد آنلاین',
    desc: 'راهنماهای جامع جذب مشتری، سئو سایت و تبلیغات بازده‌محور در ارومیه و سراسر کشور.',
  },
  'website-design': {
    title: 'مقالات طراحی و توسعه وبسایت',
    desc: 'بررسی مراحل طراحی سایت شرکتی و فروشگاهی، مقایسه وردپرس و سیستم‌های اختصاصی و تکنولوژی‌های مدرن وب.',
  },
  'tolid-mohtava': {
    title: 'مقالات تولید محتوا و شبکه‌های اجتماعی',
    desc: 'اصول تولید محتوای اینستاگرام، سناریونویسی تیزرهای تبلیغاتی و مدیریت حرفه‌ای پیج‌های بیزینس.',
  },
};

interface BlogCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return Object.keys(BLOG_CATEGORY_MAP).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = BLOG_CATEGORY_MAP[slug] || {
    title: 'دسته‌بندی مقالات',
    desc: 'مجموعه مقالات تخصصی آژانس اروم سیما در ارومیه.',
  };

  return generatePageMetadata({
    title: `${cat.title} | وبلاگ اروم سیما`,
    description: cat.desc,
    path: `/blog/category/${slug}/`,
  });
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { slug } = await params;
  const { articles } = await getLiveBlogData();
  const cat = BLOG_CATEGORY_MAP[slug] || {
    title: 'مقالات تخصصی',
    desc: 'مجموعه مقالات و آموزش‌های کاربردی اروم‌سیما.',
  };

  const filtered = articles.filter((art) => {
    if (slug === 'website-design') return art.category.includes('وب') || art.slug.includes('site') || art.slug.includes('tarahi');
    if (slug === 'tolid-mohtava') return art.category.includes('محتوا') || art.slug.includes('tolid') || art.slug.includes('tizer') || art.slug.includes('instagram');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-16">
      {/* Breadcrumb */}
      <MotionDiv variant="fade-up" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <Link href="/blog/" className="hover:text-brand-400 transition-colors">وبلاگ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">{cat.title}</span>
      </MotionDiv>

      {/* Header */}
      <MotionDiv variant="fade-up" delay={0.05} className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <MotionBadge className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold cursor-default">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          <span>دسته‌بندی مقالات</span>
        </MotionBadge>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {cat.title}
        </h1>
        <p className="text-gray-400 text-xs sm:text-base leading-relaxed">
          {cat.desc}
        </p>
      </MotionDiv>

      {/* Articles Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 items-stretch">
        {(filtered.length > 0 ? filtered : articles).map((art) => (
          <StaggerItem key={art.id} className="h-full">
            <InteractiveCard className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-brand-500/40 transition-colors group flex flex-col justify-between h-full shadow-xl">
              <div>
                <div className="relative h-44 sm:h-48 w-full bg-dark-elevated overflow-hidden">
                  <img
                    src={art.cover_image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-brand-300 bg-dark-base/80 px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    {art.category}
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-400" />
                      <span>{art.published_at}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>{art.reading_time}</span>
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                    {art.title}
                  </h2>

                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0 border-t border-white/5 mt-2 sm:mt-4">
                <Link
                  href={`/blog/${art.slug}/`}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 pt-3 sm:pt-4 group-hover:-translate-x-1.5 transition-transform"
                >
                  <span>مطالعه متن کامل مقاله</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </InteractiveCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
