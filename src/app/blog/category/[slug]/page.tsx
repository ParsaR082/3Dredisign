import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import { getBlogData } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

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
  const { articles } = getBlogData();
  const cat = BLOG_CATEGORY_MAP[slug] || {
    title: 'مقالات تخصصی',
    desc: 'مجموعه مقالات و آموزش‌های کاربردی اروم‌سیما.',
  };

  // Filter or show all matching
  const filtered = articles.filter((art) => {
    if (slug === 'website-design') return art.category.includes('وب') || art.slug.includes('site') || art.slug.includes('tarahi');
    if (slug === 'tolid-mohtava') return art.category.includes('محتوا') || art.slug.includes('tolid') || art.slug.includes('tizer') || art.slug.includes('instagram');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <Link href="/blog/" className="hover:text-brand-400 transition-colors">وبلاگ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">{cat.title}</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>دسته‌بندی مقالات</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
          {cat.title}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          {cat.desc}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(filtered.length > 0 ? filtered : articles).map((art) => (
          <article
            key={art.id}
            className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-brand-500/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-dark-elevated overflow-hidden">
                <img
                  src={art.cover_image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold text-brand-300 bg-dark-base/80 px-2.5 py-1 rounded-full border border-white/10">
                  {art.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{art.published_at}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
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

            <div className="p-6 pt-0 border-t border-white/5 mt-4">
              <Link
                href={`/blog/${art.slug}/`}
                className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 pt-4 group-hover:-translate-x-1 transition-transform"
              >
                <span>مطالعه متن کامل مقاله</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
