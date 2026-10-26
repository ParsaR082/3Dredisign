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
  // ── ایستگاه ۱: طراحی سایت (میز ۱ + لپ‌تاپ سه‌بعدی) - سمت چپ ──
  webDesign: {
    stationPosition: [-2.2, 0, -22] as [number, number, number],
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

  // ── ایستگاه ۲: تولید محتوا (میز ۲ + گوشی شناور) - سمت راست (متقارن نسبت به خط وسط) ──
  contentProduction: {
    stationPosition: [2.2, 0, -27] as [number, number, number],
    badgeY: 2.8,
    table: {
      position: [0, 0, 0] as [number, number, number],
      scale: 1.15,
      rotation: [0, 0, 0] as [number, number, number],
    },
    phone: {
      // شناور در ارتفاع ۱.۵۵ متر (حدود ۴۰ سانتیمتر بالای سطح میز رو به دید کاربر)
      position: [0, 1.55, 0] as [number, number, number],
      scale: 0.45,
      rotation: [0.18, Math.PI - 0.22, 0] as [number, number, number],
    },
  },

  // ── ایستگاه ۳: تیزر تبلیغاتی (میز ۳ + دوربین و گیمبال) - سمت چپ ──
  videoTeaser: {
    stationPosition: [-2.2, 0, -32] as [number, number, number],
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

  // ── ایستگاه ۴: طراحی لوگو (میز ۴ + کاغذ، تخته شاسی و قلم) - سمت راست (متقارن نسبت به خط وسط) ──
  logoDesign: {
    stationPosition: [2.2, 0, -37] as [number, number, number],
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

  // ── ایستگاه ۵: بیلبورد محیطی (بدون میز - مستقیم روی زمین) - سمت چپ ──
  billboard: {
    stationPosition: [-2.6, 0, -43] as [number, number, number],
    badgeY: 4.4,
    billboard: {
      // پایه‌ها دقیقاً مماس روی سطح زمین Y = 0
      position: [0, 0, 0] as [number, number, number],
      scale: 0.0055, // ارتفاع کل حدود ۳.۷ متر
      rotation: [0, Math.PI / 2, 0] as [number, number, number], // جهت رو به ورودی جاده
    },
  },
};

/**
 * ── تنظیمات ۴ مدل تلویزیون بخش نمونه‌پروژه‌ها (Sector 2 - Masterworks Exhibition) ──
 * 
 * - screenImage: آدرس تصویر نمایش داده شده روی صفحه تلویزیون.
 *   در حال حاضر از فایل لوکال خوانده می‌شود اما با اتصال به دیتابیس،
 *   دقیقاً این فیلد از ستون دیتابیس (مانند project.screen_image یا thumbnail_image) مقداردهی خواهد شد.
 */
export interface ProjectTVConfig {
  slug: string;
  title: string;
  category: string;
  kpi: string;
  model: 'TV1' | 'TV2' | 'TV3' | 'TV4';
  position: [number, number, number];
  rotationY: number;
  screenImage?: string;
  screenSize: [number, number];
  screenOffset: [number, number, number];
  screenRotation?: [number, number, number];
}

export const PORTFOLIO_TVS_CONFIG: ProjectTVConfig[] = [
  {
    slug: 'araz-metal-industrial-portal',
    title: 'پورتال سازمانی آراز متال',
    category: 'طراحی سایت صنعتی',
    kpi: '+۲۴۰٪ ترافیک ارگانیک',
    model: 'TV1',
    position: [-2.4, 0, -56],
    rotationY: Math.PI / 8,
    screenImage: '/media/portfolio/thumbnails/attorney-anything_thumb.jpg',
    screenSize: [3.25, 2.02],
    screenOffset: [0, 1.356, 0.035],
  },
  {
    slug: 'dr-sadeghi-medical-branding',
    title: 'کمپین کلینیک دکتر صادقی',
    category: 'اینستاگرام و ویدیو مارکتینگ',
    kpi: '+۱.۸M بازدید ریلزها',
    model: 'TV2',
    position: [2.4, 0, -63],
    rotationY: -Math.PI / 8,
    screenImage: '/media/portfolio/thumbnails/detail-feel-result_thumb.jpg',
    screenSize: [3.10, 1.88],
    screenOffset: [0, 1.451, 0.11],
  },
  {
    slug: 'sepid-kooh-outdoor-campaign',
    title: 'کمپین محیطی سپید کوه',
    category: 'بیلبورد و تیزر سینمایی',
    kpi: '+۲.۵M ایمپرشن شهری',
    model: 'TV3',
    position: [-2.4, 0, -70],
    rotationY: Math.PI / 8,
    screenImage: '/media/portfolio/thumbnails/east-practice-plant_thumb.jpg',
    screenSize: [3.11, 1.68],
    screenOffset: [0, 1.58, 0.081],
  },
  {
    slug: 'baran-leather-ecommerce',
    title: 'فروشگاه آنلاین چرم باران',
    category: 'تجارت الکترونیک Jamstack',
    kpi: '+۲,۸۰۰ سفارش ماهانه',
    model: 'TV4',
    position: [2.4, 0, -77],
    rotationY: -Math.PI / 8,
    screenImage: '/media/portfolio/thumbnails/feel-oil-piece_thumb.jpg',
    screenSize: [3.20, 1.95],
    screenOffset: [0, 1.456, 0.06],
    screenRotation: [-0.14, 0, 0],
  },
];

/**
 * ── تنظیمات ۵ ایستگاه دپارتمان اداری مراحل همکاری (Sector 3 - Collaboration Workflow) ──
 * 
 * چیدمان در طول مسیر Z = -94 تا Z = -122 متقارن در دو طرف چپ (X = -2.4) و راست (X = +2.4)
 */
export interface CollaborationStationConfig {
  id: string;
  stepNumber: string;
  stepTag: string;
  title: string;
  subtitle: string;
  duration: string;
  position: [number, number, number];
  rotationY: number;
}

export const COLLABORATION_STATIONS_CONFIG: CollaborationStationConfig[] = [
  {
    id: 'step-discovery',
    stepNumber: '۰۱',
    stepTag: 'مرحله اول',
    title: 'کشف و تحلیل استراتژی',
    subtitle: 'جلسات نیازسنجی، تحلیل رقبا و تدوین نقشه راه اختصاصی برند',
    duration: '۲ الی ۴ روز کاری',
    position: [-2.4, 0, -94],
    rotationY: Math.PI / 2 + 0.1,
  },
  {
    id: 'step-design',
    stepNumber: '۰۲',
    stepTag: 'مرحله دوم',
    title: 'پروتوتایپ و طراحی UI/UX',
    subtitle: 'طراحی هویت بصری، وایرفریم‌ها و پروتوتایپ تعاملی فیگما',
    duration: '۵ الی ۸ روز کاری',
    position: [2.4, 0, -101],
    rotationY: -Math.PI / 2 - 0.1,
  },
  {
    id: 'step-engineering',
    stepNumber: '۰۳',
    stepTag: 'مرحله سوم',
    title: 'مهندسی و توسعه نرم‌افزار',
    subtitle: 'کدنویسی مقیاس‌پذیر، معماری فرانت‌اند و بک‌اند با انیمیشن‌های سه‌بعدی روان',
    duration: '۱۰ الی ۱۵ روز کاری',
    position: [-2.4, 0, -108],
    rotationY: Math.PI / 2 + 0.1,
  },
  {
    id: 'step-testing',
    stepNumber: '۰۴',
    stepTag: 'مرحله چهارم',
    title: 'تست، سئو و کنترل کیفیت',
    subtitle: 'آزمون ریسپانسیو چند دیوایسی، ارزیابی امنیت، ممیزی سئو و سرعت ۱۰۰/۱۰۰',
    duration: '۳ الی ۵ روز کاری',
    position: [2.4, 0, -115],
    rotationY: -Math.PI / 2 - 0.1,
  },
  {
    id: 'step-launch',
    stepNumber: '۰۵',
    stepTag: 'مرحله پنجم',
    title: 'لانچ رسمی و تحویل نهایی',
    subtitle: 'استقرار روی سرور پرسرعت، آموزش پنل مدیریت و پشتیبانی دائمی ۲۴/۷',
    duration: 'تحویل و لانچ قطعی',
    position: [-2.4, 0, -122],
    rotationY: Math.PI / 2 + 0.1,
  },
];

