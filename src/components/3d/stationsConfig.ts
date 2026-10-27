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
    badgeOffset: [2, 2.8, 0], // متن شناور در مرکز مدل (X=0)
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
    badgeOffset: [4, 2.8, 0], // متن شناور در سمت راست مدل (X=+1.8)
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
    badgeOffset: [2, 2.8, 0], // متن شناور در مرکز مدل (X=0)
    badgeY: 2.8,
    table: {
      position: [0, 0, 0],
      scale: 1.20,
      rotation: [0, 0, 0],
    },
    camera: {
      position: [0.24, 1.14, 0],
      scale: 0.088,
      rotation: [0, -Math.PI * 0.25, 0],
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
    badgeOffset: [4, 2.8, 0], // متن شناور در سمت راست مدل (X=+1.8)
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
    badgeOffset: [1, 4.4, 0], // متن شناور بالای بیلبورد (X=0, Y=4.4)
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
    badgeOffset: [2, 3.2, 0], // سمت چپ - مرکز مدل
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
    badgeOffset: [5, 3.2, 0], // سمت راست - شیفت به سمت راست
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
    badgeOffset: [2, 3.2, 0], // سمت چپ - مرکز مدل
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
    badgeOffset: [5, 3.2, 0], // سمت راست - شیفت به سمت راست
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
    badgeOffset: [1, 3.2, 0], // سمت چپ - مرکز مدل
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
    badgeOffset: [7, 3.2, 0], // سمت راست - شیفت به سمت راست
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
    badgeOffset: [1, 3.2, 0], // سمت چپ - مرکز مدل
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
    badgeOffset: [7, 3.2, 0], // سمت راست - شیفت به سمت راست
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
    badgeOffset: [1, 3.2, 0], // سمت چپ - مرکز مدل
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
    badgeOffset: [5.5, 3.2, 0] as [number, number, number],
    sofa: {
      position: [0, 0.25, 0] as [number, number, number],
      scale: 1.35,
      rotation: [0,-8.7, 0] as [number, number, number],
    },
    coffeeTable: {
      position: [0.55, 0, 0.75] as [number, number, number],
      scale: [0.45, 0.35, 0.45] as [number, number, number],
      rotation: [0, Math.PI / 5, 0] as [number, number, number],
    },
    cup: {
      position: [0.42, 0.425, 0.68] as [number, number, number],
      scale: 0.45,
    },
    paper: {
      position: [0.65, 0.435, 0.78] as [number, number, number],
      scale: 1.4,
      rotation: [0, 0.3, 0] as [number, number, number],
    },
    pen: {
      position: [0.72, 0.43, 0.84] as [number, number, number],
      scale: 0.028,
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
    badgeOffset: [5, 3.2, 0] as [number, number, number],
    desk: {
      position: [0, 0, 0] as [number, number, number],
      scale: 1.15,
      rotation: [0, -Math.PI / 6, 0] as [number, number, number],
    },
    chair: {
      position: [0.35, 0, -0.68] as [number, number, number],
      scale: 1.15,
      rotation: [0, (5 * Math.PI) / 6, 0] as [number, number, number],
    },
    phone: {
      // مقیاس استاندارد تلفن اداری رومیزی (عرض حدود ۲۲ سانتیمتر)
      position: [-0.42, 1.14, 0.05] as [number, number, number],
      scale: 0.052,
      rotation: [0, -Math.PI / 6 - 0.2, 0] as [number, number, number],
    },
    lamp: {
      position: [0.62, 1.06, -0.25] as [number, number, number],
      scale: 0.8,
      rotation: [0, -Math.PI / 6 - 0.3, 0] as [number, number, number],
    },
    tablet: {
      position: [0.08, 1.065, 0.12] as [number, number, number],
      scale: 0.0055,
      rotation: [-0.2, -Math.PI / 6, 0] as [number, number, number],
    },
  },

  // ── درگاه انتهای مسیر و لوگوی ۳D معلق ──
  portal: {
    position: [0, 0, -154] as [number, number, number],
    badgeOffset: [0, 7, 0] as [number, number, number],
    logoScale: [1.35, 1.35, 1.35] as [number, number, number],
  },
};
