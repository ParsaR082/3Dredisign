import type { Metadata } from 'next';
import PortfolioView from '@/components/portfolio/PortfolioView';
import { getLiveProjects, getLiveCategories } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';

const CATEGORY_MAP: Record<string, { title: string; desc: string }> = {
  'branding-graphic-design': {
    title: 'طراحی لوگو، برندینگ و هویت بصری',
    desc: 'نمونه‌کارهای طراحی هویت سازمانی، لوگو دیزاین و ست اداری در ارومیه و سراسر کشور.',
  },
  'integrated-digital-marketing-services': {
    title: 'خدمات یکپارچه دیجیتال مارکتینگ و کمپین‌ها',
    desc: 'پروژه‌های جامع بازاریابی دیجیتال، جذب سرنخ و بهینه‌سازی نرخ تبدیل.',
  },
  'sanat-va-sakhteman': {
    title: 'پروژه‌های صنعت، ساختمان و تولیدی',
    desc: 'برندینگ، فیلمبرداری صنعتی و وبسایت‌های هلدینگ‌های ساختمانی و صنعتی ارومیه.',
  },
  'ecommerce-website-design-development': {
    title: 'طراحی و توسعه وبسایت‌های فروشگاهی',
    desc: 'نمونه‌کارهای ساخت فروشگاه اینترنتی آنلاین با سیستم انبارداری، پرداخت و واکنش‌گرا.',
  },
  'social-media-management-content-production': {
    title: 'تولید محتوا و مدیریت اینستاگرام',
    desc: 'سناریونویسی، تصویربرداری ریلز و مدیریت صفحات پرمخاطب اینستاگرام کسب‌وکارها.',
  },
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getLiveCategories();
  const dbSlugs = categories.map((c) => ({ slug: c.slug }));
  const mapSlugs = Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
  const seen = new Set<string>();
  const all: { slug: string }[] = [];
  for (const item of [...dbSlugs, ...mapSlugs]) {
    if (!seen.has(item.slug)) {
      seen.add(item.slug);
      all.push(item);
    }
  }
  return all;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getLiveCategories();
  const matched = categories.find((c) => c.slug === slug);

  const cat = matched
    ? { title: matched.name, desc: matched.description || 'آرشیو نمونه‌کارهای تخصصی اروم سیما در ارومیه.' }
    : CATEGORY_MAP[slug] || {
        title: 'دسته‌بندی نمونه‌کارها',
        desc: 'آرشیو نمونه‌کارهای تخصصی اروم سیما در ارومیه.',
      };

  return generatePageMetadata({
    title: `${cat.title} | نمونه‌کارهای اروم سیما`,
    description: cat.desc,
    path: `/portfolio/category/${slug}/`,
  });
}

export default async function PortfolioCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [allProjects, categories] = await Promise.all([
    getLiveProjects(),
    getLiveCategories(),
  ]);

  const matched = categories.find((c) => c.slug === slug);
  const cat = matched
    ? { title: matched.name, desc: matched.description || '' }
    : CATEGORY_MAP[slug] || {
        title: 'نمونه‌کارها',
        desc: '',
      };

  return (
    <PortfolioView
      allProjects={allProjects}
      initialCategories={categories}
      initialCategory={slug}
      categoryTitle={cat.title}
    />
  );
}
