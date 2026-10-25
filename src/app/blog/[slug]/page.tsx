import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Sparkles } from 'lucide-react';
import { getBlogData, getBlogPostBySlug } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { articles } = getBlogData();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
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
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <Link
        href="/blog/"
        className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" />
        <span>بازگشت به فهرست مقالات</span>
      </Link>

      <div className="space-y-4">
        <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
          {post.category}
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 pt-2 border-b border-white/10 pb-6">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-brand-400" />
            <span>نویسنده: {post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>تاریخ انتشار: {post.published_at}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>زمان مطالعه: {post.reading_time}</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-3xl overflow-hidden border border-white/10">
        <img src={post.cover_image} alt={post.title} className="w-full h-auto object-cover max-h-[480px]" />
      </div>

      {/* Article Content */}
      <div className="prose prose-invert max-w-none text-gray-300 text-sm sm:text-base leading-relaxed space-y-6">
        <p className="font-semibold text-white text-lg leading-relaxed">
          {post.excerpt}
        </p>
        <div className="pt-4 border-t border-white/10 space-y-4">
          <p>{post.content}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
        {post.tags.map((tag, idx) => (
          <span key={idx} className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-gray-300">
            #{tag}
          </span>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="glass-panel-brand rounded-2xl p-8 border border-brand-500/30 text-center space-y-3">
        <h3 className="text-lg font-bold text-white">برای اجرای پروژه‌ای در این حوزه آماده‌اید؟</h3>
        <p className="text-xs sm:text-sm text-gray-200">
          با مهندسان و مشاوران ارشد اروم‌سیما تماس بگیرید و نقشه راه اختصاصی برند خود را دریافت کنید.
        </p>
        <div className="pt-2">
          <Link
            href="/contact-us/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-dark-base font-bold text-xs hover:bg-gray-100 transition-all"
          >
            <span>درخواست مشاوره رایگان</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
