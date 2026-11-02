import sys

sys.stdout.reconfigure(encoding='utf-8')

sql = """-- ========================================================
-- UrumSima Production Database Patch: Add Showcase Websites
-- ========================================================

BEGIN;

-- 1. Ensure Categories Exist
INSERT INTO public.websites_websitecategory (name, slug, description, "order", is_active)
SELECT 'کافه و رستوران', 'cafe-restaurant', 'وبسایت‌ها و پلتفرم‌های تخصصی کافه، رستوران و سفارش آنلاین', 4, true
WHERE NOT EXISTS (SELECT 1 FROM public.websites_websitecategory WHERE slug = 'cafe-restaurant');

INSERT INTO public.websites_websitecategory (name, slug, description, "order", is_active)
SELECT 'سامانه‌ها و داشبوردها', 'fintech-dashboards', 'داشبوردهای مدیریتی، وب‌اپلیکیشن‌ها و سامانه‌های فین‌تک و معاملاتی', 5, true
WHERE NOT EXISTS (SELECT 1 FROM public.websites_websitecategory WHERE slug = 'fintech-dashboards');

-- 2. Insert or Update Neo Cafe Website
DO $$
DECLARE
    v_cafe_cat_id bigint;
    v_cafe_site_id bigint;
    v_fin_cat_id bigint;
    v_fin_site_id bigint;
BEGIN
    SELECT id INTO v_cafe_cat_id FROM public.websites_websitecategory WHERE slug = 'cafe-restaurant';
    SELECT id INTO v_fin_cat_id FROM public.websites_websitecategory WHERE slug = 'fintech-dashboards';

    -- Neo Cafe
    IF NOT EXISTS (SELECT 1 FROM public.websites_website WHERE slug = 'neo-cafe') THEN
        INSERT INTO public.websites_website (
            title, slug, subtitle, excerpt, body,
            cover_image, mobile_preview, live_url, client_name, industry,
            year, is_one_page, accent_color, tech_stack_csv, pages_label,
            status, is_featured, "order", published_at, created_at, updated_at,
            meta_title, meta_description, category_id, canonical_url, meta_robots
        ) VALUES (
            'کافه رستری نئو (Neo Cafe)',
            'neo-cafe',
            'پلتفرم جامع کافه رستری، فروشگاه تخصصی قهوه و سفارش آنلاین',
            'پلتفرم یکپارچه نئو کافه شامل معرفی برند، فروشگاه قهوه تازه رست، ابزارهای تخصصی باریستا، منوی سفارش آنلاین و سیستم رزرواسیون VIP.',
            'پلتفرم یکپارچه نئو کافه (Neo Cafe) با سبک طراحی سینمایی و دارک‌مود فاخر، تجربه‌ای منحصربه‌فرد برای شیفتگان قهوه و مشتریان وفادار خلق کرده است.',
            'websites/covers/neo-cafe.jpg',
            'websites/covers/neo-cafe.jpg',
            'https://neo-cafe.vercel.app/',
            'مجموعه کافه رستری نئو',
            'کافه، رستوران و فروشگاهی',
            1403, false, '#d97706', 'Next.js 15, Tailwind CSS, TypeScript, Framer Motion, Django REST', 'چند صفحه‌ای و فروشگاه تخصصی',
            'published', true, 6, NOW(), NOW(), NOW(),
            'طراحی سایت کافه رستری نئو | نمونه کار طراحی سایت اروم سیما',
            'مشاهده دمو زنده و ویژگی‌های فنی وب‌سایت کافه رستری تخصصی نئو کافه توسعه داده شده توسط تیم فنی اروم سیما.',
            v_cafe_cat_id, '/websites/neo-cafe/', 'index, follow'
        ) RETURNING id INTO v_cafe_site_id;

        -- Neo Cafe Features
        INSERT INTO public.websites_websitefeature (title, description, icon_label, "order", website_id) VALUES
        ('روایت سینمایی برند و هویت بصری دارک', 'طراحی بصری لوکس با تم تیره و انیمیشن‌های روان برای القای حس پرمیوم قهوه تخصصی.', '🎨', 1, v_cafe_site_id),
        ('فروشگاه قهوه تازه رست و ابزارهای دم‌آوری', 'کاتالوگ جامع دانه‌های قهوه با مشخصات خاستگاه، درجه برشتگی و نت‌های طعمی.', '☕', 2, v_cafe_site_id),
        ('منوی آنلاین تعاملی سرو در سالن و بیرون‌بر', 'دسته‌بندی هوشمند بار گرم، سرد و بیکری همراه با جزئیات کاپینگ و مواد اولیه.', '📋', 3, v_cafe_site_id),
        ('رزرواسیون آنلاین میز و پکیج‌های VIP', 'سیستم رزرو آنلاین برای دورهمی‌های اختصاصی، ایونت‌ها و کارگاه‌های قهوه‌آزمایی.', '📅', 4, v_cafe_site_id),
        ('سبد خرید تعاملی و پرفورمنس بهینه', 'تجربه تسویه‌حساب سریع و بهینه‌سازی پیشرفته برای بارگذاری آنی در تمام دیوایس‌ها.', '⚡', 5, v_cafe_site_id);
    END IF;

    -- FinMatrix Digital Dashboard
    IF NOT EXISTS (SELECT 1 FROM public.websites_website WHERE slug = 'digital-dashboard') THEN
        INSERT INTO public.websites_website (
            title, slug, subtitle, excerpt, body,
            cover_image, mobile_preview, live_url, client_name, industry,
            year, is_one_page, accent_color, tech_stack_csv, pages_label,
            status, is_featured, "order", published_at, created_at, updated_at,
            meta_title, meta_description, category_id, canonical_url, meta_robots
        ) VALUES (
            'داشبورد مدیریتی فین‌ماتریکس (FinMatrix)',
            'digital-dashboard',
            'سامانه هوشمند مانیتورینگ بلادرنگ، مدیریت پورتفولیو و تبادلات مالی چندارزی',
            'داشبورد مدرن تحلیل داده‌های مالی، پایش جریان نقدینگی و تسویه حساب‌های بین‌بانکی با رابط کاربری تعاملی دارک و چارت‌های Real-time.',
            'سامانه داشبورد مدیریتی فین‌ماتریکس (FinMatrix Digital Dashboard) یک زیرساخت نرم‌افزاری پیشرفته با معماری میکروسرویس برای شرکت‌های مالی و هلدینگ‌های تجاری است.',
            'websites/covers/finmatrix-dashboard.jpg',
            'websites/covers/finmatrix-dashboard.jpg',
            'https://digital-dashboard-beta.vercel.app/',
            'هلدینگ فین‌تک فین‌ماتریکس',
            'فین‌تک و داشبورد سازمانی',
            1403, false, '#3b82f6', 'Next.js 15, TypeScript, Tailwind CSS, Recharts, Framer Motion', 'داشبورد تک‌صفحه‌ای تعاملی',
            'published', true, 7, NOW(), NOW(), NOW(),
            'طراحی داشبورد مدیریتی فین‌ماتریکس | نمونه کار اروم سیما',
            'مشاهده دمو و مشخصات فنی داشبورد مدیریت مالی و ارزی هوشمند فین‌ماتریکس توسعه یافته توسط اروم سیما.',
            v_fin_cat_id, '/websites/digital-dashboard/', 'index, follow'
        ) RETURNING id INTO v_fin_site_id;

        -- FinMatrix Features
        INSERT INTO public.websites_websitefeature (title, description, icon_label, "order", website_id) VALUES
        ('مانیتورینگ بلادرنگ و توازن نقدینگی چندارزی', 'داشبورد یکپارچه تحلیل نرخ ارز، طلا، رمزارز و پایش جریان ورودی و خروجی سرمایه.', '📊', 1, v_fin_site_id),
        ('اوردربوک پیشرفته و مصورسازی عمق بازار', 'نمودارهای زنده نقدشوندگی با فید شبیه‌سازی WebSocket و سرعت بازخورد میلی‌ثانیه‌ای.', '📈', 2, v_fin_site_id),
        ('دفتر کل تسویه برون‌مرزی (Bilateral Settlement Ledger)', 'سیستم مدیریت حوالجات بین‌المللی با کد پیگیری یکتا و محاسبه اتوماتیک کارمزدها.', '🌐', 3, v_fin_site_id),
        ('معماری دوطرفه قرینه‌ای RTL و LTR', 'طراحی مهندسی‌شده و منعطف برای هماهنگی کامل با کاربران داخلی و بازارهای جهانی.', '🔄', 4, v_fin_site_id),
        ('سیستم ممیزی انطباق و امنیت سازمانی (Compliance Engine)', 'ثبت دقیق لاگ‌های سیستمی، مدیریت سطوح دسترسی پیشرفته و محافظت در برابر ریسک‌ها.', '🛡️', 5, v_fin_site_id);
    END IF;
END $$;

COMMIT;
"""

with open("scratch/patch_prod_db.sql", "w", encoding="utf-8") as f:
    f.write(sql)

print("Generated scratch/patch_prod_db.sql successfully!")
