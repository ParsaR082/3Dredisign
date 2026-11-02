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
    badgeOffset: [2, 1.8, -5], // دقیقاً در مرکز مدل میز و لپ‌تاپ (X=0)
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
    badgeOffset: [6, 2, -3], // دقیقاً در مرکز مدل میز و گوشی (X=0)
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
    badgeOffset: [1, 2, -5], // دقیقاً در مرکز مدل میز و دوربین (X=0)
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
    badgeOffset: [4.5, 2, 0], // دقیقاً در مرکز مدل میز و طراحی (X=0)
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
    badgeOffset: [3, 4.5, -4], // دقیقاً در مرکز و بالای بیلبورد (X=0, Y=4.4)
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
    position: [18.0, -8.0, -275.0],
    rotationY: -Math.PI / 6,
    badgeOffset: [0, 2.5, 0],
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
    position: [-18.0, 12.0, -330.0],
    rotationY: Math.PI / 6,
    badgeOffset: [0, 2.5, 0],
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
    position: [15.0, 14.0, -385.0],
    rotationY: -Math.PI / 7,
    badgeOffset: [0, 2.5, 0],
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
    position: [-16.0, -12.0, -440.0],
    rotationY: Math.PI / 7,
    badgeOffset: [0, 2.5, 0],
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
    badgeOffset: [1, 2, -7], // دقیقاً در مرکز مدل میز همکاری ۱ (X=0)
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
    badgeOffset: [8, 3, -4], // دقیقاً در مرکز مدل میز همکاری ۲ (X=0)
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
    badgeOffset: [1, 2, -7], // دقیقاً در مرکز مدل میز همکاری ۳ (X=0)
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
    badgeOffset: [8, 2.6, -3], // دقیقاً در مرکز مدل میز همکاری ۴ (X=0)
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
    badgeOffset: [1, 2.5, -8], // دقیقاً در مرکز مدل میز همکاری ۵ (X=0)
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
    badgeOffset: [1, 2, -7] as [number, number, number], // دقیقاً در مرکز لانژ (X=0)
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
    badgeOffset: [8, 2, -2] as [number, number, number], // دقیقاً در مرکز کانتر رسیپشن (X=0)
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
    position: [0, -1, -154] as [number, number, number],
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
  // ۱. مانیتور طراحی وبسایت (ایستگاه ۱.۱ - سحابی بالا-چپ در Z = -40.0)
  'web-design': {
    slug: 'web-design',
    targetUrl: '/web-design-urmia/',
    stagingProgress: 0.23,
    startPosition: [-10.2, 7.4, -36.5],
    startLookAt: [-12.0, 7.0, -40.0],
    camPosition: [-11.4, 7.15, -38.6],
    camLookAt: [-12.0, 7.0, -40.0],
  },
  'corporate-industrial-web-design': {
    slug: 'web-design',
    targetUrl: '/web-design-urmia/',
    stagingProgress: 0.23,
    startPosition: [-10.2, 7.4, -36.5],
    startLookAt: [-12.0, 7.0, -40.0],
    camPosition: [-11.4, 7.15, -38.6],
    camLookAt: [-12.0, 7.0, -40.0],
  },
  // ۲. آیفون ۱۸ پرو مکس تولید محتوا و اینستاگرام (ایستگاه ۱.۲ - کهکشان پایین-راست در Z = -85.0)
  'instagram-content': {
    slug: 'instagram-content',
    targetUrl: '/content-production-urmia/',
    stagingProgress: 0.28,
    startPosition: [13.4, -5.0, -81.5],
    startLookAt: [15.0, -5.5, -85.0],
    camPosition: [14.4, -5.35, -83.8],
    camLookAt: [15.0, -5.5, -85.0],
  },
  'content-production': {
    slug: 'instagram-content',
    targetUrl: '/content-production-urmia/',
    stagingProgress: 0.28,
    startPosition: [13.4, -5.0, -81.5],
    startLookAt: [15.0, -5.5, -85.0],
    camPosition: [14.4, -5.35, -83.8],
    camLookAt: [15.0, -5.5, -85.0],
  },
  'instagram-content-creation-management': {
    slug: 'instagram-content',
    targetUrl: '/content-production-urmia/',
    stagingProgress: 0.28,
    startPosition: [13.4, -5.0, -81.5],
    startLookAt: [15.0, -5.5, -85.0],
    camPosition: [14.4, -5.35, -83.8],
    camLookAt: [15.0, -5.5, -85.0],
  },
  // ۳. دوربین فیلمبرداری و تیزر صنعتی (ایستگاه ۱.۳ - زاویه چپ عمیق در Z = -130.0)
  'video-teaser': {
    slug: 'video-teaser',
    targetUrl: '/video-teaser-urmia/',
    stagingProgress: 0.33,
    startPosition: [-14.4, -6.5, -126.5],
    startLookAt: [-16.0, -7.0, -130.0],
    camPosition: [-15.4, -6.85, -128.8],
    camLookAt: [-16.0, -7.0, -130.0],
  },
  'industrial-commercial-video-production': {
    slug: 'video-teaser',
    targetUrl: '/video-teaser-urmia/',
    stagingProgress: 0.33,
    startPosition: [-14.4, -6.5, -126.5],
    startLookAt: [-16.0, -7.0, -130.0],
    camPosition: [-15.4, -6.85, -128.8],
    camLookAt: [-16.0, -7.0, -130.0],
  },
  // ۴. آیپد پرو طراحی لوگو و هویت بصری (ایستگاه ۱.۴ - سحابی اوج بالا-راست در Z = -175.0)
  'branding-identity': {
    slug: 'branding-identity',
    targetUrl: '/services/branding-identity/',
    stagingProgress: 0.38,
    startPosition: [12.4, 11.4, -171.5],
    startLookAt: [14.0, 11.0, -175.0],
    camPosition: [13.4, 11.15, -173.8],
    camLookAt: [14.0, 11.0, -175.0],
  },
  'branding-logo': {
    slug: 'branding-identity',
    targetUrl: '/services/branding-identity/',
    stagingProgress: 0.38,
    startPosition: [12.4, 11.4, -171.5],
    startLookAt: [14.0, 11.0, -175.0],
    camPosition: [13.4, 11.15, -173.8],
    camLookAt: [14.0, 11.0, -175.0],
  },
  'logo-corporate-identity-design': {
    slug: 'branding-identity',
    targetUrl: '/services/branding-identity/',
    stagingProgress: 0.38,
    startPosition: [12.4, 11.4, -171.5],
    startLookAt: [14.0, 11.0, -175.0],
    camPosition: [13.4, 11.15, -173.8],
    camLookAt: [14.0, 11.0, -175.0],
  },
  // ۵. بیلبورد تبلیغات محیطی شهری (ایستگاه ۱.۵ - درگاه مداری در Z = -220.0)
  'billboard-advertising': {
    slug: 'billboard-advertising',
    targetUrl: '/billboard-urmia/',
    stagingProgress: 0.43,
    startPosition: [-6.4, 6.5, -216.0],
    startLookAt: [-8.0, 6.0, -220.0],
    camPosition: [-7.4, 6.2, -218.6],
    camLookAt: [-8.0, 6.0, -220.0],
  },
  'billboard': {
    slug: 'billboard-advertising',
    targetUrl: '/billboard-urmia/',
    stagingProgress: 0.43,
    startPosition: [-6.4, 6.5, -216.0],
    startLookAt: [-8.0, 6.0, -220.0],
    camPosition: [-7.4, 6.2, -218.6],
    camLookAt: [-8.0, 6.0, -220.0],
  },
  'billboard-outdoor-advertising-design': {
    slug: 'billboard-advertising',
    targetUrl: '/billboard-urmia/',
    stagingProgress: 0.43,
    startPosition: [-6.4, 6.5, -216.0],
    startLookAt: [-8.0, 6.0, -220.0],
    camPosition: [-7.4, 6.2, -218.6],
    camLookAt: [-8.0, 6.0, -220.0],
  },

  // ── تلویزیون‌های نمونه‌کارها (Project TVs - Sector 2) ──
  'araz-metal-industrial-portal': {
    slug: 'araz-metal-industrial-portal',
    targetUrl: '/portfolio/araz-metal-industrial-portal/',
    stagingProgress: 0.51,
    startPosition: [16.2, -7.5, -271.0],
    startLookAt: [18.0, -8.0, -275.0],
    camPosition: [17.4, -7.85, -273.8],
    camLookAt: [18.0, -8.0, -275.0],
  },
  'dr-sadeghi-medical-branding': {
    slug: 'dr-sadeghi-medical-branding',
    targetUrl: '/portfolio/dr-sadeghi-medical-branding/',
    stagingProgress: 0.55,
    startPosition: [-16.2, 11.5, -326.0],
    startLookAt: [-18.0, 12.0, -330.0],
    camPosition: [-17.4, 11.85, -328.8],
    camLookAt: [-18.0, 12.0, -330.0],
  },
  'sepid-kooh-outdoor-campaign': {
    slug: 'sepid-kooh-outdoor-campaign',
    targetUrl: '/portfolio/sepid-kooh-outdoor-campaign/',
    stagingProgress: 0.59,
    startPosition: [13.2, 13.5, -381.0],
    startLookAt: [15.0, 14.0, -385.0],
    camPosition: [14.4, 13.85, -383.8],
    camLookAt: [15.0, 14.0, -385.0],
  },
  'baran-leather-ecommerce': {
    slug: 'baran-leather-ecommerce',
    targetUrl: '/portfolio/baran-leather-ecommerce/',
    stagingProgress: 0.63,
    startPosition: [-14.2, -11.5, -436.0],
    startLookAt: [-16.0, -12.0, -440.0],
    camPosition: [-15.4, -11.85, -438.8],
    camLookAt: [-16.0, -12.0, -440.0],
  },

  // ── ایستگاه مشاوره و تلفن مدیریت (Sector 4) ──
  'contact-us': {
    slug: 'contact-us',
    targetUrl: '/contact-us/',
    stagingProgress: 0.962,
    startPosition: [0.0, 3.4, -772.0],
    startLookAt: [0.0, 3.0, -780.0],
    camPosition: [-2.4, 2.7, -778.0],
    camLookAt: [-3.2, 2.6, -780.0],
  },
  'consultation-lounge': {
    slug: 'contact-us',
    targetUrl: '/contact-us/',
    stagingProgress: 0.962,
    startPosition: [0.0, 3.4, -772.0],
    startLookAt: [0.0, 3.0, -780.0],
    camPosition: [-2.4, 2.7, -778.0],
    camLookAt: [-3.2, 2.6, -780.0],
  },
};
