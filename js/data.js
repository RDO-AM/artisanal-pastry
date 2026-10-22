/**
 * Artisanal Pastry - Central Data Store & Local Storage Synchronization
 * Provides initial catalog matching the 12 categories from user reference, branches, and reactive helpers.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'artisanal_pastry_products',
  CATEGORIES: 'artisanal_pastry_categories',
  BRANCHES: 'artisanal_pastry_branches',
  CUSTOM_ORDERS: 'artisanal_pastry_custom_orders',
  CAKE_ORDERS: 'artisanal_pastry_cake_orders',
  CART: 'artisanal_pastry_cart',
  ADMIN_USERS: 'artisanal_pastry_admin_users',
  CURRENT_USER: 'artisanal_pastry_current_user',
  EASTER_EGG_WORDS: 'artisanal_pastry_easter_egg_words',
  SHOP_ORDERS: 'artisanal_pastry_shop_orders',
  SITE_SEO: 'artisanal_pastry_site_seo',
  USER_LOCATIONS: 'artisanal_pastry_user_locations',
  CUSTOMER_USER: 'artisanal_pastry_customer_user'
};

// Default Curated Luxury Delivery Locations for Customers
const DEFAULT_USER_LOCATIONS = [
  {
    id: 'loc-home',
    title: 'منزل (زعفرانیه)',
    icon: 'home',
    district: 'زعفرانیه',
    address: 'تهران، زعفرانیه، خیابان اعجازی (آصف)، کوچه بهار، پلاک ۱۲، واحد ۴',
    lat: 35.8082,
    lng: 51.4173,
    isDefault: true,
    recipientName: 'مریم تهرانی',
    recipientPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    notes: 'تحویل درب لابی ساختمان با هماهنگی نگهبانی'
  },
  {
    id: 'loc-work',
    title: 'محل کار (سعادت‌آباد)',
    icon: 'briefcase',
    district: 'سعادت‌آباد',
    address: 'تهران، سعادت‌آباد، میدان کاج، خیابان مروارید، مجتمع اداری پارس، طبقه ۵',
    lat: 35.7834,
    lng: 51.3711,
    isDefault: false,
    recipientName: 'دفتر مرکزی شرکت',
    recipientPhone: '۰۲۱۲۲۰۶۴۵۰۰',
    notes: 'تحویل در ساعات اداری (۹ صبح الی ۱۸ عصر)'
  }
];

// Default Site-wide SEO Configuration
const DEFAULT_SITE_SEO = {
  metaTitle: 'نام برند شما | قنادی و دسرسازی اصیل فاخر',
  metaDescription: 'بوتیک قنادی دست‌ساز فاخر؛ پخت روز کراسان فرانسوی، شیرینی‌های تر، تارت‌های میوه طبیعی و سفارش آنلاین کیک‌های مجلسی با تحویل اکسپرس.',
  metaKeywords: 'قنادی لوکس, شیرینی فرانسوی, کراسان کره ای, سفارش کیک تولد, دسر بوتیکی, باقلوا عسلی, شیرینی تر دستچین',
  brandName: 'قنادی فاخر برند شما',
  canonicalUrl: 'https://brand-pastry.ir/',
  ogImage: 'images/branch_1.jpg',
  googleVerification: 'google-site-verification-luxury-pastry-demo',
  robotsIndex: true,
  enableSchema: true
};

// Default Admins (CEO and regular Admin)
const DEFAULT_ADMIN_USERS = [
  {
    username: 'ceo',
    password: '123',
    name: 'مدیر ارشد و موسس',
    role: 'ceo', // has master authority to view, create, edit, and delete admins
    phone: '۰۹۱۲۰۰۰۰۰۰۰',
    createdAt: '۱۴۰۳/۰۱/۰۱'
  },
  {
    username: 'admin',
    password: '123',
    name: 'مدیر داخلی و شعبات',
    role: 'admin', // can manage products, prices, and orders
    phone: '۰۹۱۲۱۱۱۱۱۱۱',
    createdAt: '۱۴۰۳/۰۲/۱۵'
  }
];

// 12 Core Categories from User Reference with precise gold line SVG icons
const DEFAULT_CATEGORIES = [
  {
    id: 'dry',
    name: 'شیرینی خشک',
    desc: 'انواع شیرینی‌های ترد، دانمارکی، کره‌ای و پای سیب',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 18l16-6v6H4z"/><path d="M4 12l16-6v6H4z"/><path d="M4 18V6l16 6"/></svg>`
  },
  {
    id: 'fresh',
    name: 'شیرینی تر',
    desc: 'دسرهای تر، رولت‌ها و لطیفه‌ها با خامه طبیعی سبک',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 10a6 6 0 0 1 12 0v1H6v-1z"/><path d="M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z"/><circle cx="12" cy="4" r="1.5"/></svg>`
  },
  {
    id: 'mixed',
    name: 'شیرینی مخلوط',
    desc: 'پک‌های منتخب مجلسی برای پذیرایی، مهمانی و دورهمی',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="4"/><circle cx="16" cy="8" r="4"/><path d="M4 14h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/></svg>`
  },
  {
    id: 'traditional',
    name: 'شیرینی سنتی',
    desc: 'باقلوای استانبولی، نخودچی، برنجی و کلمپه اصیل با عسل',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`
  },
  {
    id: 'nuts',
    name: 'آجیل و تنقلات',
    desc: 'آجیل اعلا، پسته اکبری دستچین، بادام هندی و میوه خشک',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="9" r="4"/><circle cx="15" cy="14" r="5"/><circle cx="15" cy="7" r="3"/></svg>`
  },
  {
    id: 'gift',
    name: 'پک کادویی',
    desc: 'بسته‌بندی‌های لوکس هاردباکس و مخمل برای هدیه و سورپرایز',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13"/><path d="M3 13h18"/><path d="M12 8a3 3 0 1 0-3-3c2 0 3 3 3 3z"/><path d="M12 8a3 3 0 1 1 3-3c-2 0-3 3-3 3z"/></svg>`
  },
  {
    id: 'dessert',
    name: 'دسر',
    desc: 'چیزکیک نیویورکی، موس بلژیکی، تارت میوه و پودینگ',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 19h10l-2-10H9L7 19z"/><circle cx="12" cy="6" r="2"/><path d="M4 19h16"/></svg>`
  },
  {
    id: 'halva',
    name: 'حلوا و خرما',
    desc: 'تارت حلوا بوتیکی، خرمای مجلسی مغزدار و سینی ترحیم',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="12" cy="14" rx="8" ry="4"/><path d="M4 14c0 3 3.6 6 8 6s8-3 8-6"/><ellipse cx="12" cy="9" rx="3" ry="1.5"/><ellipse cx="8" cy="10" rx="2.5" ry="1.2"/><ellipse cx="16" cy="10" rx="2.5" ry="1.2"/></svg>`
  },
  {
    id: 'saffron',
    name: 'زعفران و زرشک',
    desc: 'زعفران سرگل صادراتی قائنات و زرشک پفکی دستچین',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3a5 5 0 0 1 5 5c0 4-5 13-5 13S7 12 7 8a5 5 0 0 1 5-5z"/><circle cx="12" cy="8" r="2"/></svg>`
  },
  {
    id: 'chocolate',
    name: 'شکلات و آبنبات',
    desc: 'شکلات دست‌ساز بلژیکی، دراژه طعم‌دار و آبنبات بوتیکی',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="12" height="15" rx="1.5"/><line x1="9" y1="5" x2="9" y2="20"/><line x1="3" y1="10" x2="15" y2="10"/><line x1="3" y1="15" x2="15" y2="15"/><circle cx="18" cy="8" r="3"/><line x1="18" y1="11" x2="21" y2="20"/></svg>`
  },
  {
    id: 'bread',
    name: 'فینگرفود و نان',
    desc: 'کراسان کره‌ای خالص، نان خمیرترش و مینی لقمه‌های عصرانه',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 18c0-4 2-9 6-9s6 5 6 9H6z"/><path d="M14 5a3 3 0 0 0-4 0"/><path d="M3 18h18v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z"/></svg>`
  },
  {
    id: 'gaz',
    name: 'گز و سوهان',
    desc: 'گز آردی لقمه‌ای انگبین ۴۲٪ و سوهان خودکار اعلای قم',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><circle cx="9" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/><circle cx="12" cy="15" r="1.5"/><circle cx="12" cy="12" r="1.5"/></svg>`
  }
];

// Rich Products Catalog
const DEFAULT_PRODUCTS = [
  // شیرینی خشک
  {
    id: 'prod-dry-1',
    categoryId: 'dry',
    title: 'کراسان کره‌ای فرانسوی با عسل و کره طبیعی',
    weightUnit: 'بسته ۲ عددی',
    price: 240000,
    rating: 4.9,
    badge: 'پرفروش',
    image: 'images/pastry_showcase.jpg',
    isPlaceholder: false,
    desc: 'لایه لایه برشته، پخت روز با ۱۰۰٪ کره حیوانی طبیعی فرانسوی'
  },
  {
    id: 'prod-dry-2',
    categoryId: 'dry',
    title: 'شیرینی دانمارکی وینی کاراملی',
    weightUnit: 'کیلوگرم',
    price: 340000,
    rating: 4.8,
    badge: 'پخت روز',
    image: '',
    isPlaceholder: true,
    desc: 'خمیر ورقی لطیف پر شده با کرم پاتیسیر زعفرانی و کارامل'
  },
  {
    id: 'prod-dry-3',
    categoryId: 'dry',
    title: 'پای سیب مینیاتوری دارچینی هلندی',
    weightUnit: 'جعبه ۵۰۰ گرمی',
    price: 290000,
    rating: 4.7,
    badge: '',
    image: '',
    isPlaceholder: true,
    desc: 'سیب‌های تازه کاراملیزه شده همراه با دارچین سیلان و جوز هندی'
  },
  {
    id: 'prod-dry-4',
    categoryId: 'dry',
    title: 'کوکی نیویورکی با مغز شکلات روان',
    weightUnit: 'بسته ۶ عددی',
    price: 230000,
    rating: 5.0,
    badge: 'محبوب',
    image: '',
    isPlaceholder: true,
    desc: 'کوکی داغ با بافت نرم و مغز غنی از شکلات بلژیکی ۷۰٪'
  },

  // شیرینی تر
  {
    id: 'prod-fresh-1',
    categoryId: 'fresh',
    title: 'تارت میوه وحشی و تمشک با کرم وانیل',
    weightUnit: 'عدد تک‌نفره',
    price: 195000,
    rating: 5.0,
    badge: 'شاهکار سرآشپز',
    image: 'images/pastry_showcase.jpg',
    isPlaceholder: false,
    desc: 'کراست سابله ترد فرانسوی، کرم دیپلمات و تمشک‌های دستچین'
  },
  {
    id: 'prod-fresh-2',
    categoryId: 'fresh',
    title: 'رولت ابریشمی شکلات تلخ و فندق',
    weightUnit: 'کیلوگرم',
    price: 430000,
    rating: 4.9,
    badge: 'ویژه',
    image: '',
    isPlaceholder: true,
    desc: 'اسفنج سبک کاکائویی با خامه تازه بدون چربی اشباع و پرک فندق'
  },
  {
    id: 'prod-fresh-3',
    categoryId: 'fresh',
    title: 'شیرینی لطیفه خامه‌ای پسته‌ای اصیل',
    weightUnit: 'کیلوگرم',
    price: 480000,
    rating: 4.9,
    badge: 'تازه پخت',
    image: '',
    isPlaceholder: true,
    desc: 'بافت سبک پنبه‌ای با خامه زده شده ارگانیک و خلال پسته تازه'
  },
  {
    id: 'prod-fresh-4',
    categoryId: 'fresh',
    title: 'اکلر فرانسوی با گاناش پسته و کارامل',
    weightUnit: 'عدد',
    price: 175000,
    rating: 4.8,
    badge: '',
    image: '',
    isPlaceholder: true,
    desc: 'خمیر شو برشته با کرم پسته کالیفرنیا و روکش صیقلی'
  },

  // شیرینی مخلوط
  {
    id: 'prod-mix-1',
    categoryId: 'mixed',
    title: 'سینی سوپر لوکس پذیرایی مجالس و تشریفات',
    weightUnit: 'سینی ۲.۵ کیلوگرمی',
    price: 1150000,
    rating: 5.0,
    badge: 'تشریفاتی VIP',
    image: 'images/luxury_event_catering.jpg',
    isPlaceholder: false,
    desc: 'مجموعه‌ای با شکوه از ۱۰ رقم شیرینی بوتیکی، تارت و ماکارون'
  },
  {
    id: 'prod-mix-2',
    categoryId: 'mixed',
    title: 'پک میکس عصرانه خانواده ممتاز',
    weightUnit: 'جعبه ۱ کیلوگرمی',
    price: 520000,
    rating: 4.8,
    badge: '',
    image: '',
    isPlaceholder: true,
    desc: 'ترکیب شیرینی‌های کره‌ای، دانمارکی و کشمشی اعلا'
  },

  // شیرینی سنتی
  {
    id: 'prod-trad-1',
    categoryId: 'traditional',
    title: 'باقلوای استانبولی گردویی با عسل طبیعی',
    weightUnit: 'کیلوگرم',
    price: 640000,
    rating: 5.0,
    badge: 'دست‌پخت اصیل',
    image: '',
    isPlaceholder: true,
    desc: '۴۰ لایه خمیر نازک یوفکا با شهد عسل طبیعی و هل اعلا'
  },
  {
    id: 'prod-trad-2',
    categoryId: 'traditional',
    title: 'نان نخودچی زعفرانی دو آتیشه اعلا',
    weightUnit: 'جعبه ۸۰۰ گرمی',
    price: 390000,
    rating: 4.9,
    badge: 'نوستالژی',
    image: '',
    isPlaceholder: true,
    desc: 'تهیه شده از آرد نخودچی خالص دو آتیشه و روغن حیوانی اعلا'
  },

  // آجیل و تنقلات
  {
    id: 'prod-nuts-1',
    categoryId: 'nuts',
    title: 'آجیل ۴ مغز شور سلطنتی اعلا',
    weightUnit: 'کیلوگرم',
    price: 1480000,
    rating: 5.0,
    badge: 'سوپرلوکس',
    image: '',
    isPlaceholder: true,
    desc: 'پسته اکبری خندان، بادام هندی زعفرانی، مغز فندق و بادام درختی'
  },
  {
    id: 'prod-nuts-2',
    categoryId: 'nuts',
    title: 'چیپس میوه خشک مخلوط استوایی ممتاز',
    weightUnit: 'بسته ۵۰۰ گرمی',
    price: 490000,
    rating: 4.8,
    badge: '',
    image: '',
    isPlaceholder: true,
    desc: 'توت فرنگی، انبه، کیوی، هلو و موز بدون هرگونه شکر افزوده'
  },

  // پک کادویی
  {
    id: 'prod-gift-1',
    categoryId: 'gift',
    title: 'باکس چرمی زرکوب VIP ولنتاین و جشن‌ها',
    weightUnit: 'جعبه هاردباکس لوکس',
    price: 1950000,
    rating: 5.0,
    badge: 'هدیه لوکس',
    image: 'images/luxury_event_catering.jpg',
    isPlaceholder: false,
    desc: 'حاوی ۲۴ عدد شکلات بلژیکی، ترافل و شیرینی دست‌ساز'
  },

  // دسر
  {
    id: 'prod-dessert-1',
    categoryId: 'dessert',
    title: 'کیک اسلایس پسته و موس شکلات سفید',
    weightUnit: 'اسلایس مجلسی',
    price: 210000,
    rating: 5.0,
    badge: 'پیشنهاد باریستا',
    image: 'images/pastry_showcase.jpg',
    isPlaceholder: false,
    desc: 'اسفنج لطیف پسته، ژله بلوبری و موس مخملی شکلات سفید'
  },
  {
    id: 'prod-dessert-2',
    categoryId: 'dessert',
    title: 'چیزکیک نیویورکی با سس میوه جنگلی',
    weightUnit: 'اسلایس',
    price: 205000,
    rating: 4.9,
    badge: 'محبوب',
    image: '',
    isPlaceholder: true,
    desc: 'پنیر ماسکارپونه ارگانیک سبک با کراست لوتوس برشته'
  },

  // حلوا و خرما
  {
    id: 'prod-halva-1',
    categoryId: 'halva',
    title: 'سینی تارت حلوای هویج ارومیه و خرمای مجلسی',
    weightUnit: 'سینی ۳۰ عددی',
    price: 720000,
    rating: 5.0,
    badge: 'سفارش مراسم',
    image: '',
    isPlaceholder: true,
    desc: 'تزیین شده با خلال پسته، بادام برشته و گل سرخ کاشان'
  },

  // زعفران و زرشک
  {
    id: 'prod-saf-1',
    categoryId: 'saffron',
    title: 'زعفران سرگل صادراتی قائنات (یک مثقال)',
    weightUnit: 'بسته خاتم ۴.۶ گرم',
    price: 840000,
    rating: 5.0,
    badge: 'ضمانت اصالت',
    image: '',
    isPlaceholder: true,
    desc: 'رنگ‌دهی بالا، عطر غلیظ، دستچین شده با گواهی آزمایشگاهی'
  },

  // شکلات و آبنبات
  {
    id: 'prod-choc-1',
    categoryId: 'chocolate',
    title: 'بون‌بون دست‌ساز بلژیکی با فیلینگ پشن‌فروت',
    weightUnit: 'جعبه ۱۲ عددی',
    price: 540000,
    rating: 4.9,
    badge: 'شکلات دست‌ساز',
    image: '',
    isPlaceholder: true,
    desc: 'شکلات تلخ ۷۰٪ کاله‌بوات با پوره طبیعی میوه و نمک مالدون'
  },

  // فینگرفود و نان
  {
    id: 'prod-bread-1',
    categoryId: 'bread',
    title: 'مینی بورک گوشت و اسفناج مجلسی',
    weightUnit: 'سینی ۱۸ عددی',
    price: 680000,
    rating: 4.9,
    badge: 'عصرانه',
    image: '',
    isPlaceholder: true,
    desc: 'خمیر ترد فیلو با فیلینگ گوشت چرخ‌کرده، اسفناج تازه و پنیر موزارلا'
  },

  // گز و سوهان
  {
    id: 'prod-gaz-1',
    categoryId: 'gaz',
    title: 'گز لقمه‌ای ۴۲٪ پسته سفارشی با شهد ترنجبین',
    weightUnit: 'جعبه ۴۵۰ گرمی',
    price: 620000,
    rating: 5.0,
    badge: 'صادراتی',
    image: '',
    isPlaceholder: true,
    desc: 'انگبین خالص طبیعی، گلاب دوآتیشه قمصر و مغز پسته درشت'
  }
];

// Branches of the Brand
const DEFAULT_BRANCHES = [
  {
    id: 'branch-central',
    name: 'شعبه مرکزی (شیرینی فروشی شما)',
    address: 'تهران، زعفرانیه، خیابان مقدس اردبیلی، پلاک ۱۱۸',
    phone: '۰۲۱-۲۲۴۰۰۱۰۰',
    workingHours: 'همه‌روزه از ۸:۰۰ صبح الی ۲۳:۳۰ شب',
    manager: 'آقای شمس',
    image: 'images/branch_1.jpg',
    badge: 'شعبه مرکزی'
  },
  {
    id: 'branch-pasdaran',
    name: 'شعبه پاسداران (بوتیک کافه شما)',
    address: 'تهران، پاسداران، نبش بوستان پنجم، برج پارس',
    phone: '۰۲۱-۲۲۸۸۵۵۴۴',
    workingHours: 'همه‌روزه از ۸:۳۰ صبح الی ۲۳:۰۰ شب',
    manager: 'خانم رضایی',
    image: 'images/branch_2.jpg',
    badge: 'بوتیک کافه'
  },
  {
    id: 'branch-saadatabad',
    name: 'شعبه سعادت‌آباد (قنادی شما)',
    address: 'تهران، سعادت‌آباد، میدان کاج، بلوار سرو غربی، پلاک ۲۴',
    phone: '۰۲۱-۲۲۰۹۸۸۷۷',
    workingHours: 'همه‌روزه از ۹:۰۰ صبح الی ۲۳:۰۰ شب',
    manager: 'آقای کمالی',
    image: 'images/branch_3.jpg',
    badge: 'پذیرایی و تحویل'
  }
];

class PastryDataStore {
  constructor() {
    this.initStore();
  }

  initStore() {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BRANCHES)) {
      localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(DEFAULT_BRANCHES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAKE_ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.CAKE_ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(DEFAULT_ADMIN_USERS));
    }
  }

  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  getProductsByCategory(categoryId) {
    const prods = this.getProducts();
    if (!categoryId || categoryId === 'all') return prods;
    return prods.filter(p => p.categoryId === categoryId);
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  saveProduct(product) {
    const prods = this.getProducts();
    const index = prods.findIndex(p => p.id === product.id);

    // Auto-complete standard SEO metadata if not provided
    const seoTitle = product.seoTitle || `${product.title || 'محصول فاخر'} | قنادی آنلاین`;
    const seoSlug = product.seoSlug || (product.title ? product.title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-+|-+$/g, '') : `item-${Date.now()}`);
    const seoDescription = product.seoDescription || (product.desc ? `${product.desc} - سفارش آنلاین با پخت روز و کیفیت عالی.` : `خرید آنلاین ${product.title} از قنادی فاخر با ارسال مستقیم.`);
    const seoKeywords = product.seoKeywords || `${product.title || ''}, شیرینی, قنادی, خرید آنلاین`;
    const seoAlt = product.seoAlt || product.title || 'عکس محصول شیرینی';

    const fullProduct = {
      ...product,
      seoTitle,
      seoSlug,
      seoDescription,
      seoKeywords,
      seoAlt
    };

    if (index >= 0) {
      prods[index] = { ...prods[index], ...fullProduct };
    } else {
      prods.unshift({
        ...fullProduct,
        id: fullProduct.id || 'prod-' + Date.now()
      });
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
    window.dispatchEvent(new CustomEvent('pastry-data-updated', { detail: { type: 'products' } }));
    return true;
  }

  updateProductPrice(id, newPrice) {
    const prods = this.getProducts();
    const item = prods.find(p => p.id === id);
    if (item) {
      item.price = Number(newPrice);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
      window.dispatchEvent(new CustomEvent('pastry-data-updated', { detail: { type: 'products' } }));
      return true;
    }
    return false;
  }

  deleteProduct(id) {
    let prods = this.getProducts();
    prods = prods.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
    window.dispatchEvent(new CustomEvent('pastry-data-updated', { detail: { type: 'products' } }));
    return true;
  }

  resetCatalogToDefault() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(DEFAULT_BRANCHES));
    window.dispatchEvent(new CustomEvent('pastry-data-updated', { detail: { type: 'all' } }));
    return true;
  }

  getBranches() {
    try {
      let branches = JSON.parse(localStorage.getItem(STORAGE_KEYS.BRANCHES)) || DEFAULT_BRANCHES;
      return branches.map((b, idx) => {
        const def = DEFAULT_BRANCHES[idx] || DEFAULT_BRANCHES[0];
        return {
          ...def,
          ...b,
          image: b.image || def.image || `images/branch_${idx + 1}.jpg`
        };
      });
    } catch {
      return DEFAULT_BRANCHES;
    }
  }

  getBranchById(id) {
    return this.getBranches().find(b => b.id === id);
  }

  // --- Cart Management ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch {
      return [];
    }
  }

  addToCart(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) return false;
    const cart = this.getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId,
        title: product.title,
        price: product.price,
        weightUnit: product.weightUnit,
        image: product.image,
        isPlaceholder: product.isPlaceholder,
        quantity
      });
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.updateCartBadge();
    return true;
  }

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.updateCartBadge();
    return cart;
  }

  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      this.updateCartBadge();
    }
    return cart;
  }

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateCartBadge() {
    const count = this.getCartCount();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
      b.textContent = new Intl.NumberFormat('fa-IR').format(count);
    });
    window.dispatchEvent(new CustomEvent('pastry-cart-updated', { detail: { count, total: this.getCartTotal() } }));
  }

  clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    this.updateCartBadge();
    return true;
  }

  // --- Coupon / Discount Validator ---
  validateCoupon(code, subtotal = 0) {
    if (!code) return { valid: false, message: 'لطفاً کد تخفیف را وارد نمایید.' };
    const cleanCode = code.trim().toUpperCase();
    
    // Sample valid coupons
    const coupons = {
      'LUXURY': { percent: 10, label: '۱۰٪ تخفیف خرید لوکس' },
      'VIP': { percent: 15, label: '۱۵٪ تخفیف مشتریان ویژه' },
      'PASTRY2026': { fixed: 50000, label: '۵۰,۰۰۰ تومان هدیه قنادی' },
      'GOLD': { percent: 12, label: '۱۲٪ تخفیف باشگاه زرین' }
    };

    if (coupons[cleanCode]) {
      const c = coupons[cleanCode];
      let discountAmount = 0;
      if (c.percent) {
        discountAmount = Math.round((subtotal * c.percent) / 100);
      } else if (c.fixed) {
        discountAmount = Math.min(c.fixed, subtotal);
      }
      return {
        valid: true,
        code: cleanCode,
        label: c.label,
        discountAmount,
        message: `کد تخفیف ${cleanCode} اعمال شد: ${this.formatPrice(discountAmount)} تخفیف!`
      };
    }
    return { valid: false, message: 'کد تخفیف وارد شده نامعتبر یا منقضی است.' };
  }

  // --- Shop Checkout Orders ---
  saveShopOrder(orderData) {
    const orders = this.getShopOrders();
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      persianDate: new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
      status: 'در حال آماده‌سازی و ارسال'
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.SHOP_ORDERS, JSON.stringify(orders));
    this.clearCart();
    window.dispatchEvent(new CustomEvent('pastry-shop-order-created', { detail: newOrder }));
    return newOrder;
  }

  getShopOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOP_ORDERS)) || [];
    } catch {
      return [];
    }
  }

  // --- Custom Event Orders ---
  saveCustomOrder(order) {
    const orders = this.getCustomOrders();
    const newOrder = {
      ...order,
      id: 'EVT-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'در حال بررسی توسط شعبه'
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('pastry-order-created', { detail: newOrder }));
    return newOrder;
  }

  getCustomOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS)) || [];
    } catch {
      return [];
    }
  }

  updateCustomOrderStatus(id, newStatus) {
    const orders = this.getCustomOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify(orders));
      return true;
    }
    return false;
  }

  // --- Cake Custom Orders ---
  saveCakeOrder(order) {
    const orders = this.getCakeOrders();
    const newOrder = {
      ...order,
      id: 'CAKE-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'در حال بررسی توسط شعبه'
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.CAKE_ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('pastry-cake-order-created', { detail: newOrder }));
    return newOrder;
  }

  getCakeOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAKE_ORDERS)) || [];
    } catch {
      return [];
    }
  }

  updateCakeOrderStatus(id, newStatus) {
    const orders = this.getCakeOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.CAKE_ORDERS, JSON.stringify(orders));
      return true;
    }
    return false;
  }

  formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }

  // --- Hot Weekly Products ---
  getHotWeeklyProducts() {
    const prods = this.getProducts();
    // Return curated hot products
    const hotIds = ['prod-dry-1', 'prod-fresh-1', 'prod-gift-1', 'prod-dessert-1', 'prod-trad-1', 'prod-nuts-1'];
    const hotList = prods.filter(p => hotIds.includes(p.id) || p.badge === 'پرفروش' || p.badge === 'شاهکار سرآشپز');
    return hotList.slice(0, 6);
  }

  // --- Admin & CEO User Management ---
  getAdminUsers() {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) || DEFAULT_ADMIN_USERS;
      return list.map(u => ({
        ...u,
        name: (u.name || '').replace(/\s*\(CEO\)/gi, '').trim() || (u.role === 'ceo' ? 'مدیر ارشد و موسس' : 'ادمین')
      }));
    } catch {
      return DEFAULT_ADMIN_USERS;
    }
  }

  saveAdminUser(user) {
    let users = this.getAdminUsers();
    const index = users.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push({
        ...user,
        role: user.role || 'admin',
        createdAt: new Intl.DateTimeFormat('fa-IR').format(new Date())
      });
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));
    return true;
  }

  deleteAdminUser(username) {
    // CEO cannot be deleted
    if (username.toLowerCase() === 'ceo') {
      return { success: false, error: 'حذف کاربر CEO امکان‌پذیر نمی‌باشد.' };
    }
    let users = this.getAdminUsers();
    users = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));
    return { success: true };
  }

  changeUserPassword(username, newPassword) {
    let users = this.getAdminUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return { success: false, error: 'کاربر یافت نشد.' };
    user.password = newPassword;
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));

    // Update current session if matching
    const current = this.getCurrentUser();
    if (current && current.username.toLowerCase() === username.toLowerCase()) {
      current.password = newPassword;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(current));
    }
    return { success: true };
  }

  updateUserProfile(username, newName, newUsername, newPassword, newPhone) {
    let users = this.getAdminUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return { success: false, error: 'کاربر یافت نشد.' };

    if (newName && typeof newName === 'string') {
      user.name = newName.trim();
    }

    if (newPhone !== undefined && typeof newPhone === 'string') {
      user.phone = newPhone.trim();
    }

    if (newUsername && typeof newUsername === 'string') {
      const cleanNewUser = newUsername.trim().toLowerCase();
      if (cleanNewUser !== user.username.toLowerCase()) {
        const conflict = users.find(u => u.username.toLowerCase() === cleanNewUser);
        if (conflict) {
          return { success: false, error: 'این نام کاربری قبلاً توسط حساب دیگری استفاده شده است.' };
        }
        user.username = cleanNewUser;
      }
    }

    if (newPassword && typeof newPassword === 'string' && newPassword.trim().length > 0) {
      user.password = newPassword.trim();
    }

    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));

    // Update current session if matching
    const current = this.getCurrentUser();
    if (current && (current.username.toLowerCase() === username.toLowerCase() || (newUsername && current.username.toLowerCase() === newUsername.toLowerCase()))) {
      current.name = user.name;
      current.username = user.username;
      current.role = user.role;
      if (user.phone) current.phone = user.phone;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(current));
    }
    return { success: true, user };
  }

  // --- Easter Egg Trigger Words (Staff Login) ---
  getEasterEggWords() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.EASTER_EGG_WORDS));
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch {}
    return ['admin', 'ceo', 'مدیریت', 'پرسنل', 'staff', 'chef'];
  }

  setEasterEggWords(wordsArray) {
    if (!Array.isArray(wordsArray)) return false;
    const cleanList = wordsArray
      .map(w => (typeof w === 'string' ? w.trim().toLowerCase() : ''))
      .filter(w => w.length > 0);
    localStorage.setItem(STORAGE_KEYS.EASTER_EGG_WORDS, JSON.stringify(cleanList));
    return true;
  }

  isEasterEggWord(word) {
    if (!word || typeof word !== 'string') return false;
    const clean = word.trim().toLowerCase();
    const list = this.getEasterEggWords();
    return list.some(item => item.toLowerCase() === clean);
  }

  authenticateAdmin(identifier, password) {
    // 1. Security Check: Rate Limit Guard
    if (window.pastrySecurity) {
      const limitCheck = window.pastrySecurity.checkRateLimit('admin_login');
      if (!limitCheck.allowed) {
        return { success: false, error: limitCheck.message };
      }
    }

    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const users = this.getAdminUsers();
    const found = users.find(u => u.username.toLowerCase() === cleanId && u.password === cleanPass);

    if (found) {
      // Reset failed attempts on success
      if (window.pastrySecurity) {
        window.pastrySecurity.resetRateLimit('admin_login');
      }

      const sessionUser = {
        username: found.username,
        name: found.name,
        role: found.role,
        phone: found.phone
      };
      sessionStorage.setItem('artisanal_pastry_admin_auth', 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }

    // Record failed attempt
    let errMsg = 'نام کاربری یا رمز عبور اشتباه است.';
    if (window.pastrySecurity) {
      const failResult = window.pastrySecurity.recordFailedAttempt('admin_login');
      if (failResult.locked) {
        errMsg = failResult.message;
      } else if (failResult.remainingAttempts !== undefined) {
        errMsg += ` (${failResult.remainingAttempts} تلاش مجاز باقی‌مانده)`;
      }
    }

    return { success: false, error: errMsg };
  }

  getCurrentUser() {
    try {
      const u = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
      if (u && u.name) {
        u.name = u.name.replace(/\s*\(CEO\)/gi, '').trim() || (u.role === 'ceo' ? 'مدیر ارشد و موسس' : 'ادمین');
      }
      return u;
    } catch {
      return null;
    }
  }

  logout() {
    sessionStorage.removeItem('artisanal_pastry_admin_auth');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // --- Global SEO Management ---
  getSiteSEO() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.SITE_SEO));
      return { ...DEFAULT_SITE_SEO, ...(stored || {}) };
    } catch {
      return DEFAULT_SITE_SEO;
    }
  }

  saveSiteSEO(seoConfig) {
    if (!seoConfig || typeof seoConfig !== 'object') return false;
    const current = this.getSiteSEO();
    const updated = { ...current, ...seoConfig };
    localStorage.setItem(STORAGE_KEYS.SITE_SEO, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('pastry-data-updated', { detail: { type: 'seo', data: updated } }));
    return true;
  }

  // --- Customer & Delivery Location Management ---
  getUserLocations() {
    try {
      const locs = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_LOCATIONS));
      if (Array.isArray(locs) && locs.length > 0) return locs;
      localStorage.setItem(STORAGE_KEYS.USER_LOCATIONS, JSON.stringify(DEFAULT_USER_LOCATIONS));
      return DEFAULT_USER_LOCATIONS;
    } catch {
      return DEFAULT_USER_LOCATIONS;
    }
  }

  saveUserLocation(location) {
    if (!location) return false;
    let locs = this.getUserLocations();
    const id = location.id || ('loc-' + Date.now());
    const isDefault = Boolean(location.isDefault);

    if (isDefault) {
      locs.forEach(l => { l.isDefault = false; });
    }

    const index = locs.findIndex(l => l.id === id);
    const newLoc = {
      ...location,
      id,
      isDefault: isDefault || locs.length === 0
    };

    if (index >= 0) {
      locs[index] = newLoc;
    } else {
      locs.push(newLoc);
    }

    localStorage.setItem(STORAGE_KEYS.USER_LOCATIONS, JSON.stringify(locs));
    window.dispatchEvent(new CustomEvent('pastry-locations-updated', { detail: locs }));
    return newLoc;
  }

  deleteUserLocation(id) {
    let locs = this.getUserLocations();
    locs = locs.filter(l => l.id !== id);
    if (locs.length > 0 && !locs.some(l => l.isDefault)) {
      locs[0].isDefault = true;
    }
    localStorage.setItem(STORAGE_KEYS.USER_LOCATIONS, JSON.stringify(locs));
    window.dispatchEvent(new CustomEvent('pastry-locations-updated', { detail: locs }));
    return true;
  }

  setDefaultUserLocation(id) {
    let locs = this.getUserLocations();
    let found = false;
    locs.forEach(l => {
      if (l.id === id) {
        l.isDefault = true;
        found = true;
      } else {
        l.isDefault = false;
      }
    });
    if (found) {
      localStorage.setItem(STORAGE_KEYS.USER_LOCATIONS, JSON.stringify(locs));
      window.dispatchEvent(new CustomEvent('pastry-locations-updated', { detail: locs }));
      return true;
    }
    return false;
  }

  getDefaultUserLocation() {
    const locs = this.getUserLocations();
    return locs.find(l => l.isDefault) || locs[0] || null;
  }

  // --- Customer User Session ---
  getCustomerUser() {
    try {
      const u = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER_USER));
      return u || null;
    } catch {
      return null;
    }
  }

  saveCustomerUser(user) {
    if (!user) return false;
    const cleanUser = {
      phone: (user.phone || '').trim(),
      name: (user.name || 'مشتری گرامی').trim(),
      registeredAt: user.registeredAt || new Intl.DateTimeFormat('fa-IR').format(new Date()),
      email: (user.email || '').trim()
    };
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(cleanUser));
    window.dispatchEvent(new CustomEvent('pastry-customer-updated', { detail: cleanUser }));
    return cleanUser;
  }

  logoutCustomer() {
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_USER);
    window.dispatchEvent(new CustomEvent('pastry-customer-updated', { detail: null }));
  }

  getCustomerOrders(phone) {
    const all = this.getShopOrders();
    if (!phone) return all.slice(0, 10);
    const cleanPhone = phone.trim();
    return all.filter(o => o.customerPhone && (o.customerPhone.includes(cleanPhone) || cleanPhone.includes(o.customerPhone)));
  }
}

// Global Single Instance
window.pastryStore = new PastryDataStore();

// Auto update badge on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (window.pastryStore) {
    window.pastryStore.updateCartBadge();
  }
});
