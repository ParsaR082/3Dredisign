import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { getLiveSiteSettings } from '@/lib/db';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

export const metadata: Metadata = generatePageMetadata({
  title: 'سیاست حریم خصوصی و قوانین استفاده | اروم سیما',
  description: 'سیاست حفظ حریم خصوصی کاربران و قوانین استفاده از خدمات دیجیتال مارکتینگ و طراحی سایت اروم سیما.',
  path: '/privacy-policy/',
});

export default async function PrivacyPolicyPage() {
  const settings = await getLiveSiteSettings();

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <MotionDiv variant="fade-up" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">حریم خصوصی</span>
      </MotionDiv>

      {/* Hero Header */}
      <MotionDiv
        variant="scale-up"
        className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-dark-surface/90 via-dark-card/90 to-brand-950/20 backdrop-blur-xl shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <MotionBadge className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold cursor-default">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
            <span>امنیت و شفافیت در تعهدات</span>
          </MotionBadge>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            سیاست <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-400">حریم خصوصی</span> اروم‌سیما
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            ما در آژانس دیجیتال مارکتینگ اروم‌سیما متعهد به حفظ بالاترین استانداردهای امنیتی، رازداری حرفه‌ای و حفاظت از اطلاعات تجاری و هویتی مشتریان و کاربران عزیز خود هستیم.
          </p>
          <div className="pt-1 sm:pt-2 text-[11px] sm:text-xs text-gray-400">
            <span>آخرین بروزرسانی: مرداد ۱۴۰۴ • ویرایش پروداکشن</span>
          </div>
        </div>
      </MotionDiv>

      {/* Main Content Cards */}
      <StaggerContainer className="space-y-6 sm:space-y-8">
        {/* Section 1 */}
        <StaggerItem>
          <InteractiveCard className="rounded-2xl p-4 sm:p-8 bg-white/[0.02] border border-white/5 space-y-3 sm:space-y-4 shadow-xl hover:border-brand-500/25 transition-colors">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white">۱. مقدمه و اصول اخلاقی</h2>
            </div>
            <p className="text-gray-300 text-xs sm:text-base leading-relaxed text-justify">
              اروم سیما (UrumSima) متعهد به حفاظت از حریم خصوصی و حقوق کاربران خود است. این سند قانونی مشخص می‌سازد که داده‌های ورودی از طریق وبسایت، فرم‌های مشاوره، کمپین‌ها و قراردادهای توسعه وب چگونه دریافت، تحلیل، نگهداری و محافظت می‌شوند.
            </p>
          </InteractiveCard>
        </StaggerItem>

        {/* Section 2 */}
        <StaggerItem>
          <InteractiveCard className="rounded-2xl p-6 sm:p-8 bg-white/[0.02] border border-white/5 space-y-4 shadow-xl hover:border-teal-500/25 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">۲. اطلاعات جمع‌آوری‌شده</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              در جریان ارائه مشاوره‌های دیجیتال و اجرای پروژه‌ها، ممکن است اطلاعات زیر به صورت مستقیم یا خودکار دریافت شوند:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-300">
              <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                <span className="text-brand-400 font-bold">•</span>
                <span><strong>اطلاعات هویتی:</strong> نام، نام خانوادگی، نام برند تجاری، شماره تلفن و آدرس ایمیل.</span>
              </li>
              <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                <span className="text-brand-400 font-bold">•</span>
                <span><strong>مشخصات پروژه:</strong> درخواست‌های توسعه، بودجه‌های پیشنهادی و نیازهای فنی.</span>
              </li>
              <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                <span className="text-brand-400 font-bold">•</span>
                <span><strong>داده‌های فنی:</strong> نوع سیستم‌عامل، مرورگر، نشانی IP و لاگ‌های امنیتی جهت پایش شبکه.</span>
              </li>
              <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                <span className="text-brand-400 font-bold">•</span>
                <span><strong>کوکی‌های ضروری:</strong> برای بهبود رابط کاربری و حفظ نشست‌های معتبر در سیستم.</span>
              </li>
            </ul>
          </InteractiveCard>
        </StaggerItem>

        {/* Section 3 */}
        <StaggerItem>
          <InteractiveCard className="rounded-2xl p-6 sm:p-8 bg-white/[0.02] border border-white/5 space-y-4 shadow-xl hover:border-indigo-500/25 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">۳. اهداف استفاده از اطلاعات</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              تمامی اطلاعات دریافتی منحصراً برای اهداف مشروع و با ارزش افزوده مستقیم برای مشتریان مورد استفاده قرار می‌گیرند:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300 pr-4 list-disc marker:text-brand-400">
              <li>بررسی تخصصی پروژه‌ها، تهیه پروپوزال فنی و ارائه تخمین مالی شفاف.</li>
              <li>برقراری ارتباط از طریق تماس تلفنی، پیام‌رسان‌ها یا جلسات حضوری در دفتر ارومیه.</li>
              <li>ارائه پشتیبانی فنی، مانیتورینگ عملکرد سایت‌ها و سرویس‌های سئو.</li>
              <li>ارتقای مداوم تجربه بصری و استانداردهای رابط کاربری وبسایت اروم‌سیما.</li>
              <li>رعایت کامل موازین حقوقی و قوانین تجارت الکترونیک کشور.</li>
            </ul>
          </InteractiveCard>
        </StaggerItem>

        {/* Section 4 */}
        <StaggerItem>
          <InteractiveCard className="rounded-2xl p-6 sm:p-8 bg-white/[0.02] border border-white/5 space-y-4 shadow-xl hover:border-brand-500/25 transition-colors">
            <h2 className="text-xl font-bold text-white">۴. تعهد عدم افشا (NDA) و محرمانگی داده‌ها</h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-justify">
              اروم‌سیما اطلاعات کسب‌وکارها، استراتژی‌های فروش، دیتابیس مشتریان و مستندات فنی هیچ پروژه‌ای را تحت هیچ شرایطی به اشخاص ثالث، رقبا یا نهادهای تبلیغاتی غیرمرتبط واگذار نخواهد کرد، مگر در چارچوب دستور کتبی مراجع ذی‌صلاح قانونی.
            </p>
          </InteractiveCard>
        </StaggerItem>

        {/* Section 5: Contact & Inquiries */}
        <StaggerItem>
          <InteractiveCard className="rounded-3xl p-8 bg-gradient-to-br from-brand-950/40 via-dark-card/90 to-dark-surface/90 border border-brand-500/20 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">تماس در خصوص حریم خصوصی</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              در صورت وجود هرگونه ابهام، درخواست تصحیح یا حذف داده‌های شخصی، می‌توانید با تیم پشتیبانی اروم‌سیما در تماس باشید:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-400" />
                <div>
                  <p className="text-[11px] text-gray-400">تلفن پشتیبانی</p>
                  <a href={`tel:${settings.phone_e164}`} className="text-sm font-bold text-white dir-ltr font-mono hover:text-brand-300">
                    {settings.phone_display}
                  </a>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400" />
                <div>
                  <p className="text-[11px] text-gray-400">پست الکترونیک</p>
                  <a href="mailto:info@urumsima.ir" className="text-sm font-bold text-white hover:text-teal-300">
                    info@urumsima.ir
                  </a>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-[11px] text-gray-400">دفتر مرکزی</p>
                  <p className="text-xs font-bold text-white truncate">{settings.office_address}</p>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
