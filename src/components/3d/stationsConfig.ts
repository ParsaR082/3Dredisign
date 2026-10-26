/**
 * تنظیمات مختصات، مقیاس و چرخش ایستگاه‌های بخش خدمات (Services Station)
 * 
 * راهنمای تغییر دستی مقادیر:
 * - position: [X, Y, Z]
 *     • X: جابجایی افقی (عدد مثبت = راست، عدد منفی = چپ)
 *     • Y: ارتفاع عمودی (0 = دقیقاً مماس روی سطح زمین/میز، عدد مثبت = بالاتر)
 *     • Z: موقعیت طولی در امتداد مسیر حرکت (عدد بزرگتر/مثبت‌تر = نزدیک‌تر به اول صفحه، عدد منفی‌تر = انتهای مسیر)
 * - scale: [SX, SY, SZ] (یا عدد یکنواخت برای بزرگ/کوچک کردن شیء)
 * - rotation: [RX, RY, RZ] بر حسب رادیان (مثلاً Math.PI / 2 برای ۹۰ درجه)
 */

export interface ItemTransform {
  position: [number, number, number];
  scale: [number, number, number] | number;
  rotation?: [number, number, number];
}

export interface StationConfig {
  id: string;
  slug: string;
  title: string;
  iconSymbol: string;
  stationPosition: [number, number, number];
  badgeY: number;
  table?: ItemTransform;
  items?: Record<string, ItemTransform>;
}

export const STATIONS_CONFIG = {
  // ── ایستگاه ۱: طراحی سایت (میز ۱ + لپ‌تاپ سه‌بعدی) ──
  webDesign: {
    stationPosition: [-3.8, 0, -22] as [number, number, number],
    badgeY: 2.8,
    table: {
      position: [0, 0, 0] as [number, number, number],
      scale: 0.95,
      rotation: [0, 0, 0] as [number, number, number],
    },
    laptop: {
      // موقعیت قرارگیری روی سطح میز (Y = 1.15 متر از زمین)
      position: [0, 1.15, 0] as [number, number, number],
      scale: 0.00088,
      rotation: [0, Math.PI * 0.75, 0] as [number, number, number],
    },
  },

  // ── ایستگاه ۲: تولید محتوا (میز ۲ + گوشی شناور) ──
  contentProduction: {
    stationPosition: [0.5, 0, -26] as [number, number, number],
    badgeY: 2.8,
    table: {
      position: [0, 0, 0] as [number, number, number],
      scale: 1.15,
      rotation: [0, 0, 0] as [number, number, number],
    },
    phone: {
      // شناور در ارتفاع ۱.۵۵ متر (حدود ۴۰ سانتیمتر بالای سطح میز)
      position: [0, 1.55, 0] as [number, number, number],
      scale: 0.45,
      rotation: [0.18, Math.PI, 0] as [number, number, number], // صفحه به سمت کاربر
    },
  },

  // ── ایستگاه ۳: تیزر تبلیغاتی (میز ۳ + دوربین و گیمبال) ──
  videoTeaser: {
    stationPosition: [-3.2, 0, -32] as [number, number, number],
    badgeY: 2.8,
    table: {
      position: [0, 0, 0] as [number, number, number],
      scale: 1.20,
      rotation: [0, 0, 0] as [number, number, number],
    },
    camera: {
      // قرارگیری در سمت راست میز (Y = 1.14 متر سطح میز)
      position: [0.24, 1.14, 0] as [number, number, number],
      scale: 0.088,
      rotation: [0, -Math.PI * 0.25, 0] as [number, number, number],
    },
    gimbal: {
      // قرارگیری در سمت چپ میز (Y = 1.14 متر سطح میز)
      position: [-0.25, 1.14, 0] as [number, number, number],
      scale: 0.035,
      rotation: [0, Math.PI * 0.25, 0] as [number, number, number],
    },
  },

  // ── ایستگاه ۴: طراحی لوگو (میز ۴ + کاغذ، تخته شاسی و قلم) ──
  logoDesign: {
    stationPosition: [0.8, 0, -37] as [number, number, number],
    badgeY: 2.8,
    table: {
      position: [0, 0, 0] as [number, number, number],
      scale: 1.18,
      rotation: [0, 0, 0] as [number, number, number],
    },
    paperStack: {
      // دسته کاغذ سمت چپ میز (Y = 1.11 متر سطح میز)
      position: [-0.35, 1.11, 0] as [number, number, number],
      scale: 2.0,
      rotation: [0, 0.15, 0] as [number, number, number],
    },
    clipboard: {
      // تخته شاسی سمت راست میز به حالت تخت
      position: [0.24, 1.11, 0] as [number, number, number],
      scale: 1.0,
      rotation: [0, 0, -Math.PI / 2] as [number, number, number],
    },
    pen: {
      // قلم استایلوس روی میز
      position: [0.0, 1.11, 0.14] as [number, number, number],
      scale: 0.035,
      rotation: [0, 0.45, 0] as [number, number, number],
    },
  },

  // ── ایستگاه ۵: بیلبورد محیطی (بدون میز - مستقیم روی زمین) ──
  billboard: {
    stationPosition: [-2.5, 0, -42] as [number, number, number],
    badgeY: 4.4,
    billboard: {
      // پایه‌ها دقیقاً مماس روی سطح زمین Y = 0
      position: [0, 0, 0] as [number, number, number],
      scale: 0.0055, // ارتفاع کل حدود ۳.۷ متر
      rotation: [0, Math.PI / 2, 0] as [number, number, number], // جهت رو به ورودی جاده
    },
  },
};
