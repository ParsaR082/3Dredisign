import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Sparkles } from 'lucide-react';
import { getLiveBlogData, getLiveBlogPostBySlug } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const { articles } = await getLiveBlogData();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getLiveBlogPostBySlug(slug);
  if (!post) return {};

  return generatePageMetadata({
    title: post.title + ' | وبلاگ اروم سیما',
    description: post.excerpt,
    path: '/blog/' + post.slug + '/',
    ogImage: post.cover_image,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getLiveBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <MotionDiv variant="fade-up">
        <Link
          href="/blog/"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
          <span>بازگشت به فهرست مقالات</span>
        </Link>
      </MotionDiv>

      <MotionDiv variant="fade-up" delay={0.05} className="space-y-3 sm:space-y-4">
        <MotionBadge className="inline-block text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
          {post.category}
        </MotionBadge>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-gray-400 pt-2 border-b border-white/10 pb-4 sm:pb-6">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
            <span>نویسنده: {post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
            <span>تاریخ انتشار: {post.published_at}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>زمان مطالعه: {post.reading_time}</span>
          </div>
        </div>
      </MotionDiv>

      {/* Cover Image */}
      <MotionDiv variant="scale-up" delay={0.1} className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-auto object-cover max-h-[480px]"
        />
      </MotionDiv>

      {/* Article Content */}
      <MotionDiv variant="fade-up" delay={0.15} className="prose prose-invert max-w-none text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 sm:space-y-6">
        <p className="font-semibold text-white text-base sm:text-lg leading-relaxed">
          {post.excerpt}
        </p>
        <div className="pt-4 border-t border-white/10 space-y-4 text-justify">
          <p>{post.content}</p>
        </div>
      </MotionDiv>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <StaggerContainer className="pt-4 sm:pt-6 border-t border-white/10 flex flex-wrap gap-1.5 sm:gap-2">
          {post.tags.map((tag, idx) => (
            <StaggerItem key={idx}>
              <span className="text-[11px] sm:text-xs bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:border-brand-500/30 transition-colors cursor-default">
                #{tag}
              </span>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Bottom CTA */}
      <MotionDiv variant="scale-up">
        <InteractiveCard className="glass-panel-brand rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-brand-500/30 text-center space-y-3 sm:space-y-4 shadow-2xl">
          <h3 className="text-lg sm:text-xl font-bold text-white">برای اجرای پروژه‌ای در این حوزه آماده‌اید؟</h3>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto leading-relaxed">
            با مهندسان و مشاوران ارشد اروم‌سیما تماس بگیرید و نقشه راه اختصاصی برند خود را دریافت کنید.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-white text-dark-base font-bold text-xs hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <span>درخواست مشاوره رایگان</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </InteractiveCard>
      </MotionDiv>
    </div>
  );
}
