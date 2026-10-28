import type { Metadata } from 'next';
import PortfolioView from '@/components/portfolio/PortfolioView';
import { getLiveProjects } from '@/lib/db';
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

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_MAP[slug] || {
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
  const allProjects = await getLiveProjects();
  const cat = CATEGORY_MAP[slug] || {
    title: 'نمونه‌کارها',
    desc: '',
  };

  return (
    <PortfolioView
      allProjects={allProjects}
      initialCategory={slug}
      categoryTitle={cat.title}
    />
  );
}
