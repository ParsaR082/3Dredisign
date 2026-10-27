/**
 * تنظیمات مختصات، مقیاس، چرخش و مکان نشان‌های متنی شناور (Floating Badges)
 * 
 * راهنمای تغییر دستی مختصات badgeOffset: [X, Y, Z]
 * ──────────────────────────────────────────────────────────
 *  • عدد اول [X]: جابجایی افقی
 *       0 = دقیقاً در مرکز مدل سه‌بعدی
 *       مثبت (مثلاً +1.8 یا +2.2) = شیفت به سمت راست مدل
 *       منفی (مثلاً -1.8) = شیفت به سمت چپ مدل
 * 
 *  • عدد دوم [Y]: ارتفاع عمودی از سطح زمین
 *       مثلاً 2.8 یا 3.2 یا 4.4 متر به سمت بالا
 * 
 *  • عدد سوم [Z]: جابجایی در راستای عمق (جلو یا عقب)
 *       0 = هم‌راستا با مدل
 *       مثبت = جلوتر به سمت دید کاربر
 *       منفی = عقب‌تر
 */

/**
 * ── تنظیمات سیستم هوشمند محو شدن و کنار رفتن نشان‌ها در فاصله نزدیک (Smart Proximity Badges) ──
 * 
 * راهنمای تغییر دستی فواصل محو شدن:
 * - minDist: فاصله بحرانی (متر). اگر کاربر از این فاصله نزدیک‌تر شود، متن کاملاً ناپدید می‌شود تا دید آیتم یا صفحات پشتی باز بماند
 * - maxDist: فاصله شروع محو شدن (متر). کاربر وقتی نزدیک‌تر از این عدد می‌شود، نشان به آرامی محو شده و به بالا شیفت پیدا می‌کند
 * - farFadeDist: فاصله افق دور (متر). نشان‌های دورتر از این فاصله برای خلوت ماندن دید محو می‌شوند
 */
export const BADGE_PROXIMITY_CONFIG = {
  minDist: 3.8,      // زیر ۳.۸ متر متن کاملاً ناپدید می‌شود
  maxDist: 6.8,      // بین ۶.۸ تا ۳.۸ متر با ترنزیشن نرم به بالا حرکت کرده و محو می‌شود
  farFadeDist: 22.0, // دورتر از ۲۲ متر برای خلوتی افق محو است
};

export interface ItemTransform {
  position: [number, number, number];
  scale: [number, number, number] | number;
  rotation: [number, number, number];
}

export interface ServiceStationSetting {
  stationPosition: [number, number, number];
  badgeOffset: [number, number, number]; // [X, Y, Z] مکان متن شناور
  badgeY: number;
  [key: string]: any;
}

export const STATIONS_CONFIG: Record<string, ServiceStationSetting> = {
  // ── ایستگاه ۱: طراحی سایت (میز ۱ + لپ‌تاپ سه‌بعدی) - سمت چپ ──
  webDesign: {
    stationPosition: [-2.2, 0, -22],
    badgeOffset: [0, 2.8, 0], // دقیقاً در مرکز مدل میز و لپ‌تاپ (X=0)
    badgeY: 2.8,
    table: {
      position: [0, 0, 0],
      scale: 0.95,
      rotation: [0, 0, 0],
    },
    laptop: {
      position: [0, 1.15, 0],
      scale: 0.00088,
      rotation: [0, Math.PI * 0.75, 0],
    },
  },

  // ── ایستگاه ۲: تولید محتوا (میز ۲ + گوشی شناور) - سمت راست ──
  contentProduction: {
    stationPosition: [2.2, 0, -27],
    badgeOffset: [0, 2.8, 0], // دقیقاً در مرکز مدل میز و گوشی (X=0)
    badgeY: 2.8,
    table: {
      position: [0, 0, 0],
      scale: 1.15,
      rotation: [0, 0, 0],
    },
    phone: {
      position: [0, 1.55, 0],
      scale: 0.45,
      rotation: [0.18, Math.PI - 0.22, 0],
    },
  },

  // ── ایستگاه ۳: تیزر تبلیغاتی (میز ۳ + دوربین و گیمبال) - سمت چپ ──
  videoTeaser: {
    stationPosition: [-2.2, 0, -32],
    badgeOffset: [0, 2.8, 0], // دقیقاً در مرکز مدل میز و دوربین (X=0)
    badgeY: 2.8,
    table: {
      position: [0, 0, 0],
      scale: 1.20,
      rotation: [0, 0, 0],
    },
    camera: {
      position: [0.24, 1.14, 0],
      scale: 0.088,
      rotation: [0, 4, 0],
    },
    gimbal: {
      position: [-0.25, 1.14, 0],
      scale: 0.035,
      rotation: [0, Math.PI * 0.25, 0],
    },
  },

  // ── ایستگاه ۴: طراحی لوگو (میز ۴ + کاغذ، تخته شاسی و قلم) - سمت راست ──
  logoDesign: {
    stationPosition: [2.2, 0, -37],
    badgeOffset: [0, 2.8, 0], // دقیقاً در مرکز مدل میز و طراحی (X=0)
    badgeY: 2.8,
    table: {
      position: [0, 0, 0],
      scale: 1.18,
      rotation: [0, 0, 0],
    },
    paperStack: {
      position: [-0.35, 1.11, 0],
      scale: 2.0,
      rotation: [0, 0.15, 0],
    },
    clipboard: {
      position: [0.24, 1.11, 0],
      scale: 1.0,
      rotation: [0, 0, -Math.PI / 2],
    },
    pen: {
      position: [0.0, 1.11, 0.14],
      scale: 0.035,
      rotation: [0, 0.45, 0],
    },
  },

  // ── ایستگاه ۵: بیلبورد محیطی (بدون میز - مستقیم روی زمین) - سمت چپ ──
  billboard: {
    stationPosition: [-2.6, 0, -43],
    badgeOffset: [0, 4.4, 0], // دقیقاً در مرکز و بالای بیلبورد (X=0, Y=4.4)
    badgeY: 4.4,
    billboard: {
      position: [0, 0, 0],
      scale: 0.0055,
      rotation: [0, Math.PI / 2, 0],
    },
  },
};

/**
 * ── تنظیمات ۴ مدل تلویزیون بخش نمونه‌پروژه‌ها (Sector 2 - Masterworks Exhibition) ──
 * 
 * - badgeOffset: [X, Y, Z] مکان برچسب عنوان و KPI نمونه‌پروژه
 * - screenImage: آدرس تصویر نمایش داده شده روی صفحه تلویزیون (اتصال‌پذیر به دیتابیس)
 */
export interface ProjectTVConfig {
  slug: string;
  title: string;
  category: string;
  kpi: string;
  model: 'TV1' | 'TV2' | 'TV3' | 'TV4';
  position: [number, number, number];
  rotationY: number;
  badgeOffset: [number, number, number];
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
    badgeOffset: [0, 3.4, 0], // دقیقاً در مرکز و بالای تلویزیون ۱ (X=0)
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
    badgeOffset: [0, 3.4, 0], // دقیقاً در مرکز و بالای تلویزیون ۲ (X=0)
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
    badgeOffset: [0, 3.4, 0], // دقیقاً در مرکز و بالای تلویزیون ۳ (X=0)
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
    badgeOffset: [0, 3.4, 0], // دقیقاً در مرکز و بالای تلویزیون ۴ (X=0)
    screenImage: '/media/portfolio/thumbnails/feel-oil-piece_thumb.jpg',
    screenSize: [3.20, 1.95],
    screenOffset: [0, 1.456, 0.06],
    screenRotation: [-0.14, 0, 0],
  },
];

/**
 * ── تنظیمات ۵ ایستگاه دپارتمان اداری مراحل همکاری (Sector 3 - Collaboration Workflow) ──
 * 
 * - badgeOffset: [X, Y, Z] مکان کادر شناور توضیحات مرحله
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
  badgeOffset: [number, number, number];
}

export const COLLABORATION_STATIONS_CONFIG: CollaborationStationConfig[] = [
  {
    id: 'step-discovery',
    stepNumber: '۰۱',
    stepTag: 'مرحله اول',
    title: 'کشف و تحلیل استراتژی',
    subtitle: 'جلسات نیازسنجی، تحلیل رقبا و تدوین نقشه راه اختصاصی برند',
    duration: '۲ الی ۴ روز کاری',
    position: [-2.6, 0, -94],
    rotationY: Math.PI / 5 + 0.1,
    badgeOffset: [0, 3.2, 0], // دقیقاً در مرکز مدل میز همکاری ۱ (X=0)
  },
  {
    id: 'step-design',
    stepNumber: '۰۲',
    stepTag: 'مرحله دوم',
    title: 'پروتوتایپ و طراحی UI/UX',
    subtitle: 'طراحی هویت بصری، وایرفریم‌ها و پروتوتایپ تعاملی فیگما',
    duration: '۵ الی ۸ روز کاری',
    position: [2.6, 0, -101],
    rotationY: -Math.PI / 5 - 0.1,
    badgeOffset: [0, 3.2, 0], // دقیقاً در مرکز مدل میز همکاری ۲ (X=0)
  },
  {
    id: 'step-engineering',
    stepNumber: '۰۳',
    stepTag: 'مرحله سوم',
    title: 'مهندسی و توسعه نرم‌افزار',
    subtitle: 'کدنویسی مقیاس‌پذیر، معماری فرانت‌اند و بک‌اند با انیمیشن‌های سه‌بعدی روان',
    duration: '۱۰ الی ۱۵ روز کاری',
    position: [-2.6, 0, -108],
    rotationY: Math.PI / 5 + 0.1,
    badgeOffset: [0, 3.2, 0], // دقیقاً در مرکز مدل میز همکاری ۳ (X=0)
  },
  {
    id: 'step-testing',
    stepNumber: '۰۴',
    stepTag: 'مرحله چهارم',
    title: 'تست، سئو و کنترل کیفیت',
    subtitle: 'آزمون ریسپانسیو چند دیوایسی، ارزیابی امنیت، ممیزی سئو و سرعت ۱۰۰/۱۰۰',
    duration: '۳ الی ۵ روز کاری',
    position: [2.6, 0, -115],
    rotationY: -Math.PI / 5 - 0.1,
    badgeOffset: [0, 3.2, 0], // دقیقاً در مرکز مدل میز همکاری ۴ (X=0)
  },
  {
    id: 'step-launch',
    stepNumber: '۰۵',
    stepTag: 'مرحله پنجم',
    title: 'لانچ رسمی و تحویل نهایی',
    subtitle: 'استقرار روی سرور پرسرعت، آموزش پنل مدیریت و پشتیبانی دائمی ۲۴/۷',
    duration: 'تحویل و لانچ قطعی',
    position: [-2.6, 0, -122],
    rotationY: Math.PI / 5 + 0.1,
    badgeOffset: [0, 3.2, 0], // دقیقاً در مرکز مدل میز همکاری ۵ (X=0)
  },
];

/**
 * ── تنظیمات بخش اطلاعات و تماس (Sector 4 - Executive Consultation Lounge & Reception) ──
 * 
 * راهنمای تغییر دستی:
 * - stationPosition: [X, Y, Z] موقعیت کل ایستگاه (منفی=چپ، مثبت=راست)
 * - badgeOffset: [X, Y, Z] موقعیت متن شناور
 * - scale / rotation: مقیاس و زاویه چرخش هر المان
 */
export const EXECUTIVE_LOUNGE_CONFIG = {
  // ── ایستگاه سمت چپ: لانژ مشاوره حضوری و نقشه موقعیت ارومیه ──
  lounge: {
    stationPosition: [-2.8, 0, -146] as [number, number, number],
    badgeOffset: [0, 3.2, 0] as [number, number, number], // دقیقاً در مرکز لانژ (X=0)
    sofa: {
      position: [-1, 0.5, -1] as [number, number, number],
      scale: 3,
      rotation: [0,-8.7, 0] as [number, number, number],
    },
    coffeeTable: {
      position: [0.55, 0, 0.75] as [number, number, number],
      scale: 0.60,
      rotation: [0, Math.PI / 5, 0] as [number, number, number],
    },
    cup: {
      position: [0.42, 0.7, 0.68] as [number, number, number],
      scale: 0.7,
    },
    paper: {
      position: [0.65, 0.7, 0.78] as [number, number, number],
      scale: 2,
      rotation: [0, 0.3, 0] as [number, number, number],
    },
    pen: {
      position: [0.8, 0.7, 0.6] as [number, number, number],
      scale: 0.08,
      rotation: [0, 0.6, 0] as [number, number, number],
    },
    mapPin: {
      position: [0, 6, 0] as [number, number, number],
      scale: 0.45,
    },
  },

  // ── ایستگاه سمت راست: کانتر رسیپشن و تماس مستقیم مدیریت ──
  reception: {
    stationPosition: [2.8, 0, -146] as [number, number, number],
    badgeOffset: [0, 3.2, 0] as [number, number, number], // دقیقاً در مرکز کانتر رسیپشن (X=0)
    desk: {
      position: [0, 0, 0] as [number, number, number],
      scale: 1.5,
      rotation: [0, 9, 0] as [number, number, number],
    },
    chair: {
      position: [0.35, 0, -0.68] as [number, number, number],
      scale: 1.8,
      rotation: [0, -0.5, 0] as [number, number, number],
    },
    phone: {
      // مقیاس استاندارد تلفن اداری رومیزی (عرض حدود ۲۲ سانتیمتر)
      position: [-1, 1.58, 0.5] as [number, number, number],
      scale: 0.08,
      rotation: [0, -Math.PI / 6 - 0.2, 0] as [number, number, number],
    },
    lamp: {
      position: [0.62, 1.42, 1] as [number, number, number],
      scale: 0.8,
      rotation: [0, 10, 0] as [number, number, number],
    },
    tablet: {
      position: [0.08, 1.4, 0.12] as [number, number, number],
      scale: 0.0075,
      rotation: [0, -Math.PI / 6, 0] as [number, number, number],
    },
  },

  // ── درگاه انتهای مسیر و لوگوی ۳D معلق ──
  portal: {
    position: [0, 0, -154] as [number, number, number],
    badgeOffset: [0, 7, 0] as [number, number, number],
    logoScale: [1.35, 1.35, 1.35] as [number, number, number],
  },
};

/**
 * ── راهنمای تنظیم دستی نقطه پایان زوم دوربین روی مانیتورها / آیتم‌ها ──
 * 
 * هر آیتم در DIVE_TARGETS_CONFIG دارای دو فیلد برای کنترل نقطه پایان انیمیشن (کلوزآپ مانیتور) است:
 * 
 * ۱. camPosition: [X, Y, Z]
 *    محل قرارگیری چشم دوربین در پایان زوم:
 *    - X (محور افقی): کم/زیاد کردنش زاویه دوربین رو به چپ یا راست مانیتور می‌بره.
 *    - Y (محور عمودی): ارتفاع دوربین از زمین (مثلاً 1.30 برای لپ‌تاپ، 1.55 برای گوشی عمودی).
 *    - Z (محور عمق): جلو/عقب بودن دوربین در طول راهرو.
 * 
 * ۲. camLookAt: [X, Y, Z]
 *    نقطه‌ای که دوربین مستقیماً به آن خیره می‌شود (مرکز صفحه نمایش/مانیتور).
 * 
 * 💡 نکته طلایی برای زوم بیشتر یا کمتر:
 *    - برای نزدیک‌تر شدن به مانیتور (زوم عمیق‌تر): camPosition را به مقادیر camLookAt نزدیک‌تر کنید.
 *    - برای دورتر شدن (نمای بازتر از لپ‌تاپ/میز): camPosition را چند سانتی‌متر عقب‌تر ببرید.
 */
export type DivePhase =
  | 'idle'
  | 'staging'
  | 'diving'
  | 'pullback_hold'
  | 'pullback'
  | 'navigating';

export interface DiveTargetConfig {
  slug: string;
  targetUrl: string;
  stagingProgress: number;
  startPosition: [number, number, number];
  startLookAt: [number, number, number];
  /** موقعیت دوربین در نمای کلوزآپ پایانی [X, Y, Z] */
  camPosition: [number, number, number];
  /** نقطه‌ای از مانیتور که دوربین به آن نگاه می‌کند [X, Y, Z] */
  camLookAt: [number, number, number];
}

export const DIVE_TARGETS_CONFIG: Record<string, DiveTargetConfig> = {
  // ۱. لپ‌تاپ طراحی وبسایت (ایستگاه ۱ - روی میز سمت چپ در Z = -22.0)
  // مانیتور لپ‌تاپ در X = -2.20 و Y = 1.25 قرار دارد
  'web-design': {
    slug: 'web-design',
    targetUrl: '/web-design-urmia/',
    stagingProgress: 0.42,
    startPosition: [0.0, 3.43, -20.54],
    startLookAt: [0.0, 1.80, -36.81],
    // 👈 برای تغییر موقعیت نهایی دوربین روی لپ‌تاپ، این دو خط را ویرایش کنید:
    camPosition: [-1.95, 1.5, -21.75], // موقعیت چشم دوربین
    camLookAt: [-2.20, 1.5, -22.00],   // مرکز صفحه لپ‌تاپ
  },
  // ۲. گوشی موبایل تولید محتوا و اینستاگرام (ایستگاه ۲ - Z = -27.0)
  'instagram-content': {
    slug: 'instagram-content',
    targetUrl: '/content-production-urmia/',
    stagingProgress: 0.45,
    startPosition: [0.0, 3.46, -26.79],
    startLookAt: [0.0, 1.80, -43.42],
    camPosition: [2.02, 1.55, -26.68],
    camLookAt: [2.20, 1.55, -27.00],
  },
  'content-production': {
    slug: 'instagram-content',
    targetUrl: '/content-production-urmia/',
    stagingProgress: 0.45,
    startPosition: [0.0, 3.46, -26.79],
    startLookAt: [0.0, 1.80, -43.42],
    camPosition: [2.02, 1.55, -26.68],
    camLookAt: [2.20, 1.55, -27.00],
  },
  // ۳. دوربین فیلمبرداری و تیزر صنعتی (ایستگاه ۳ - Z = -32.0)
  'video-teaser': {
    slug: 'video-teaser',
    targetUrl: '/video-teaser-urmia/',
    stagingProgress: 0.47,
    startPosition: [0.0, 3.49, -31.73],
    startLookAt: [0.0, 1.80, -48.65],
    camPosition: [-1.80, 1.25, -31.68],
    camLookAt: [-1.96, 1.25, -32.00],
  },
  // ۴. کاغذ و دفترچه اتود طراحی لوگو و هویت بصری (ایستگاه ۴ - Z = -37.0)
  'branding-identity': {
    slug: 'branding-identity',
    targetUrl: '/services/branding-identity/',
    stagingProgress: 0.49,
    startPosition: [0.0, 3.52, -36.78],
    startLookAt: [0.0, 1.80, -54.01],
    camPosition: [2.32, 1.46, -36.78],
    camLookAt: [2.32, 1.16, -36.95],
  },
  'branding-logo': {
    slug: 'branding-identity',
    targetUrl: '/services/branding-identity/',
    stagingProgress: 0.49,
    startPosition: [0.0, 3.52, -36.78],
    startLookAt: [0.0, 1.80, -54.01],
    camPosition: [2.32, 1.46, -36.78],
    camLookAt: [2.32, 1.16, -36.95],
  },
  // ۵. بیلبورد تبلیغات محیطی (ایستگاه ۵ - Z = -43.0)
  'billboard-advertising': {
    slug: 'billboard-advertising',
    targetUrl: '/billboard-urmia/',
    stagingProgress: 0.51,
    startPosition: [0.0, 3.55, -41.50],
    startLookAt: [0.0, 1.80, -59.00],
    camPosition: [-1.56, 2.20, -39.36],
    camLookAt: [-2.20, 2.20, -42.00],
  },
  'billboard': {
    slug: 'billboard-advertising',
    targetUrl: '/billboard-urmia/',
    stagingProgress: 0.51,
    startPosition: [0.0, 3.55, -41.50],
    startLookAt: [0.0, 1.80, -59.00],
    camPosition: [-1.56, 2.20, -39.36],
    camLookAt: [-2.20, 2.20, -42.00],
  },

  // ── تلویزیون‌های نمونه‌کارها (Project TVs - Sector 2) ──
  'araz-metal-industrial-portal': {
    slug: 'araz-metal-industrial-portal',
    targetUrl: '/portfolio/araz-metal-industrial-portal/',
    stagingProgress: 0.62,
    startPosition: [0.0, 3.58, -53.48],
    startLookAt: [0.0, 1.80, -71.82],
    camPosition: [-1.86, 1.36, -54.70],
    camLookAt: [-2.40, 1.36, -56.00],
  },
  'dr-sadeghi-medical-branding': {
    slug: 'dr-sadeghi-medical-branding',
    targetUrl: '/portfolio/dr-sadeghi-medical-branding/',
    stagingProgress: 0.65,
    startPosition: [0.0, 3.55, -60.00],
    startLookAt: [0.0, 1.80, -79.00],
    camPosition: [1.86, 1.45, -61.70],
    camLookAt: [2.40, 1.45, -63.00],
  },
  'sepid-kooh-outdoor-campaign': {
    slug: 'sepid-kooh-outdoor-campaign',
    targetUrl: '/portfolio/sepid-kooh-outdoor-campaign/',
    stagingProgress: 0.68,
    startPosition: [0.0, 3.51, -68.51],
    startLookAt: [0.0, 1.80, -88.36],
    camPosition: [-1.86, 1.58, -68.70],
    camLookAt: [-2.40, 1.58, -70.00],
  },
  'baran-leather-ecommerce': {
    slug: 'baran-leather-ecommerce',
    targetUrl: '/portfolio/baran-leather-ecommerce/',
    stagingProgress: 0.71,
    startPosition: [0.0, 3.46, -77.31],
    startLookAt: [0.0, 1.80, -98.04],
    camPosition: [1.86, 1.46, -75.70],
    camLookAt: [2.40, 1.46, -77.00],
  },
};
