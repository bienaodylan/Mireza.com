import { StorefrontConfig } from '../types/commerce';

export const MIREZA_IMAGES = {
  // Exact Hero requested by user (8th image)
  hero: '/assets/aistudio/image_46fce9b6.png',
  // Brand Intro & Next Drop editorial visuals
  brandIntro: '/assets/shopify_editorial/lookbook_group_crew.jpg',
  nextDropBanner: '/assets/mireza/next_drop_banner.jpg',
  lookbookCrew: '/assets/shopify_editorial/lookbook_group_crew.jpg',
  lookbookParis: '/assets/shopify_editorial/lookbook_paris_sets.jpg',
  lookbookJersey: '/assets/shopify_editorial/ed_IMG_2435.jpg',
  lookbookJersey2: '/assets/shopify/products/jamaica-jersey__0.jpg',
  lookbookBikini: '/assets/shopify_editorial/ed_f496.jpg',
  lookbookBikini2: '/assets/shopify_editorial/ed_eed3.jpg',
  // Category lead imagery
  catJerseys: '/assets/shopify_editorial/ed_IMG_2435.jpg',
  catSwimwear: '/assets/shopify/products/bresil-bikini__0.jpg',
  catSet: '/assets/shopify_editorial/lookbook_paris_sets.jpg',
  catAccessories: '/assets/mireza/next_drop_banner.jpg',
  // Accessories: Exclusively Casquettes (multi-color) & Tapis
  capNoirRose: '/assets/mireza/cap_noir_rose.jpg',
  capEmeraudeOr: '/assets/mireza/cap_emeraude_or.jpg',
  capCremeCorail: '/assets/mireza/cap_creme_corail.jpg',
  capRosePastel: '/assets/mireza/cap_rose_pastel.jpg',
  tapisAtelier: '/assets/mireza/tapis_tufted_atelier.jpg',
  tapisCaribbean: '/assets/mireza/tapis_caribbean_rond.jpg',
  // Direct key aliases kept for backward compatibility
  jerseyBahamas: '/assets/shopify/products/bahamas-jersey__0.png',
  jerseyGuadeloupe: '/assets/shopify/products/guadeloupe-jersey__0.png',
  bknBresil: '/assets/shopify/products/bresil-bikini__0.jpg',
};

export const DEFAULT_STOREFRONT_CONFIG: StorefrontConfig = {
  heroImageUrl: MIREZA_IMAGES.hero,
  heroHeadline: 'Caribbean Poise & Bold Silhouettes',
  heroSubheadline: 'Jerseys, Bikinis, Sets, and Upcoming Accessories Drop crafted for sun and city.',
  heroCtaLabel: 'Explore Collections',
  brandIntroTitle: 'MIREZA Caribbean. Soleil, Confiance, Identité.',
  brandIntroBody:
    'MIREZA unit maillots caribéens, ensembles ringer, jerseys en maille technique et accessoires signature (casquettes multi-couleurs & tapis) dans une allure solaire et minimaliste.',
  brandIntroImageUrl: MIREZA_IMAGES.brandIntro,
  sectionOrder: [
    'hero',
    'next_drop',
    'categories',
    'brand_intro',
    'mireza_world',
    'newsletter',
  ],
  galleryItems: [
    {
      id: 'world_crew',
      title: 'MIREZA Caribbean Crew',
      caption: 'Full Sets & Jamaica #19 mesh jersey styled together from Paris to Abidjan.',
      imageUrl: MIREZA_IMAGES.lookbookCrew,
      tag: 'Lookbook',
    },
    {
      id: 'world_paris',
      title: 'Full Set — Paris Edit',
      caption: 'Signature cropped ringer sets paired with tailored shorts and pink MIREZA totes.',
      imageUrl: MIREZA_IMAGES.lookbookParis,
      tag: 'Set',
    },
    {
      id: 'world_jersey',
      title: 'Jamaica #19 Mesh Jersey',
      caption: 'Oversized breathable mesh designed for warm coastlines and golden hour streets.',
      imageUrl: MIREZA_IMAGES.lookbookJersey,
      tag: 'Jersey',
    },
    {
      id: 'world_bikini',
      title: 'Resort Bikinis & Sun',
      caption: 'Iconic silhouettes crafted for confidence by sea and poolside.',
      imageUrl: MIREZA_IMAGES.lookbookBikini,
      tag: 'Bikini',
    },
  ],
  newsletterTitle: 'Join the Private List',
  newsletterBody:
    'Receive early access to numbered drops, Accessories Drop 02 (Casquettes & Tapis), and Abidjan pop-up invitations.',
  campaignBannerText: 'Prochain Drop : Casquettes & Tapis MIREZA — Bientôt disponible',
  campaignBannerEnabled: true,
  standardShippingXof: 3500,
  expressShippingXof: 7500,
  freeShippingThresholdXof: 75000,
  supportEmail: 'contact@mireza.com',
  supportPhone: '+225 07 00 00 00 00',
};

export const INITIAL_CATEGORIES = [
  {
    id: 'cat_jerseys',
    name: 'Jersey',
    slug: 'jersey',
    description: 'Maillots oversize MIREZA en maille respirante inspirés des îles caribéennes et d’Afrique de l’Ouest.',
    imageUrl: MIREZA_IMAGES.catJerseys,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat_swimwear',
    name: 'Bikini',
    slug: 'bikini',
    description: 'Collection officielle de bikinis MIREZA : hauts triangles, bas échancrés et ensembles complets.',
    imageUrl: MIREZA_IMAGES.catSwimwear,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat_set',
    name: 'Set',
    slug: 'set',
    description: 'Ensembles complets crop baby tee ringer et short cordon aux couleurs de votre île ou nation.',
    imageUrl: MIREZA_IMAGES.catSet,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat_accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Casquettes brodées MIREZA en plusieurs coloris et tapis tuftés exclusivement.',
    imageUrl: MIREZA_IMAGES.catAccessories,
    sortOrder: 4,
    isActive: true,
  },
];

export interface SeedProductInput {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  sku: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  regularPriceXof: number;
  promoPriceXof: number | null;
  lowStockThreshold: number;
  isNewDrop: boolean;
  newDropOrder: number;
  isFeatured: boolean;
  featuredOrder: number;
  isPreorder?: boolean;
  preorderEstimateDate?: string | null;
  stockMatrix: Record<string, number>;
}
// 5 Real Jersey Collection Products (from Shopify)
export const INITIAL_JERSEY_PRODUCTS: SeedProductInput[] = [
  {
    "id": "prod_mireza_jrs_01",
    "name": "Bahamas JERSEY",
    "slug": "bahamas-jersey",
    "description": "𝐎𝐮𝐢, 𝐧𝐨𝐮𝐬 𝐚𝐯𝐨𝐧𝐬 𝐝𝐞́𝐜𝐢𝐝𝐞́ 𝐝𝐞 𝐦𝐚𝐫𝐪𝐮𝐞𝐫 𝐥𝐞𝐬 𝐞𝐬𝐩𝐫𝐢𝐭𝐬 𝐚𝐯𝐞𝐜 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧. 𝐃𝐞́𝐜𝐨𝐮𝐯𝐫𝐞𝐳 𝐝𝐞̀𝐬 𝐦𝐚𝐢𝐧𝐭𝐞𝐧𝐚𝐧𝐭 𝐧𝐨𝐭𝐫𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧 “𝐣𝐞𝐫𝐬𝐞𝐲𝐬 𝐦𝐢𝐱𝐭𝐞𝐬”. 𝐔𝐧 𝐣𝐞𝐫𝐬𝐞𝐲 𝐨𝐯𝐞𝐫𝐬𝐢𝐳𝐞 𝐢𝐧𝐬𝐩𝐢𝐫𝐞́ 𝐝𝐞𝐬 𝐞𝐦𝐛𝐥𝐞́𝐦𝐚𝐭𝐢𝐪𝐮𝐞𝐬 𝐦𝐚𝐢𝐥𝐥𝐨𝐭𝐬 𝐝𝐞 𝐟𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐚𝐦𝐞́𝐫𝐢𝐜𝐚𝐢𝐧, 𝐩𝐞𝐧𝐬𝐞́ 𝐩𝐨𝐮𝐫 𝐚𝐥𝐥𝐢𝐞𝐫 𝐜𝐨𝐧𝐟𝐨𝐫𝐭, 𝐬𝐭𝐲𝐥𝐞 𝐞𝐭 𝐢𝐝𝐞𝐧𝐭𝐢𝐭𝐞́. 𝐂𝐨𝐧𝐟𝐞𝐜𝐭𝐢𝐨𝐧𝐧𝐞́ 𝐚𝐯𝐞𝐜 𝐝𝐞𝐬 𝐦𝐚𝐭𝐢𝐞̀𝐫𝐞𝐬 𝐝𝐞 𝐪𝐮𝐚𝐥𝐢𝐭𝐞́, 𝐜𝐞 𝐦𝐨𝐝𝐞̀𝐥𝐞 𝐩𝐫",
    "categoryId": "cat_jerseys",
    "categoryName": "Jersey",
    "sku": "MRZ-JRS-01",
    "images": [
      "/assets/shopify/products/bahamas-jersey__0.png",
      "/assets/shopify/products/bahamas-jersey__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 35000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": true,
    "newDropOrder": 2,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_jrs_02",
    "name": "Jamaïca JERSEY",
    "slug": "jamaica-jersey",
    "description": "𝐎𝐮𝐢, 𝐧𝐨𝐮𝐬 𝐚𝐯𝐨𝐧𝐬 𝐝𝐞́𝐜𝐢𝐝𝐞́ 𝐝𝐞 𝐦𝐚𝐫𝐪𝐮𝐞𝐫 𝐥𝐞𝐬 𝐞𝐬𝐩𝐫𝐢𝐭𝐬 𝐚𝐯𝐞𝐜 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧. 𝐃𝐞́𝐜𝐨𝐮𝐯𝐫𝐞𝐳 𝐝𝐞̀𝐬 𝐦𝐚𝐢𝐧𝐭𝐞𝐧𝐚𝐧𝐭 𝐧𝐨𝐭𝐫𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧 “𝐣𝐞𝐫𝐬𝐞𝐲𝐬 𝐦𝐢𝐱𝐭𝐞𝐬”. 𝐔𝐧 𝐣𝐞𝐫𝐬𝐞𝐲 𝐨𝐯𝐞𝐫𝐬𝐢𝐳𝐞 𝐢𝐧𝐬𝐩𝐢𝐫𝐞́ 𝐝𝐞𝐬 𝐞𝐦𝐛𝐥𝐞́𝐦𝐚𝐭𝐢𝐪𝐮𝐞𝐬 𝐦𝐚𝐢𝐥𝐥𝐨𝐭𝐬 𝐝𝐞 𝐟𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐚𝐦𝐞́𝐫𝐢𝐜𝐚𝐢𝐧, 𝐩𝐞𝐧𝐬𝐞́ 𝐩𝐨𝐮𝐫 𝐚𝐥𝐥𝐢𝐞𝐫 𝐜𝐨𝐧𝐟𝐨𝐫𝐭, 𝐬𝐭𝐲𝐥𝐞 𝐞𝐭 𝐢𝐝𝐞𝐧𝐭𝐢𝐭𝐞́. 𝐂𝐨𝐧𝐟𝐞𝐜𝐭𝐢𝐨𝐧𝐧𝐞́ 𝐚𝐯𝐞𝐜 𝐝𝐞𝐬 𝐦𝐚𝐭𝐢𝐞̀𝐫𝐞𝐬 𝐝𝐞 𝐪𝐮𝐚𝐥𝐢𝐭𝐞́, 𝐜𝐞 𝐦𝐨𝐝𝐞̀𝐥𝐞 𝐩𝐫",
    "categoryId": "cat_jerseys",
    "categoryName": "Jersey",
    "sku": "MRZ-JRS-02",
    "images": [
      "/assets/shopify/products/jamaica-jersey__0.jpg",
      "/assets/shopify/products/jamaica-jersey__1.jpg",
      "/assets/shopify/products/jamaica-jersey__2.jpg"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 35000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": true,
    "newDropOrder": 4,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_jrs_03",
    "name": "HAÏTI JERSEY",
    "slug": "haiti-jersey",
    "description": "𝐎𝐮𝐢, 𝐧𝐨𝐮𝐬 𝐚𝐯𝐨𝐧𝐬 𝐝𝐞́𝐜𝐢𝐝𝐞́ 𝐝𝐞 𝐦𝐚𝐫𝐪𝐮𝐞𝐫 𝐥𝐞𝐬 𝐞𝐬𝐩𝐫𝐢𝐭𝐬 𝐚𝐯𝐞𝐜 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧. 𝐃𝐞́𝐜𝐨𝐮𝐯𝐫𝐞𝐳 𝐝𝐞̀𝐬 𝐦𝐚𝐢𝐧𝐭𝐞𝐧𝐚𝐧𝐭 𝐧𝐨𝐭𝐫𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧 “𝐣𝐞𝐫𝐬𝐞𝐲𝐬 𝐦𝐢𝐱𝐭𝐞𝐬”. 𝐔𝐧 𝐣𝐞𝐫𝐬𝐞𝐲 𝐨𝐯𝐞𝐫𝐬𝐢𝐳𝐞 𝐢𝐧𝐬𝐩𝐢𝐫𝐞́ 𝐝𝐞𝐬 𝐞𝐦𝐛𝐥𝐞́𝐦𝐚𝐭𝐢𝐪𝐮𝐞𝐬 𝐦𝐚𝐢𝐥𝐥𝐨𝐭𝐬 𝐝𝐞 𝐟𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐚𝐦𝐞́𝐫𝐢𝐜𝐚𝐢𝐧, 𝐩𝐞𝐧𝐬𝐞́ 𝐩𝐨𝐮𝐫 𝐚𝐥𝐥𝐢𝐞𝐫 𝐜𝐨𝐧𝐟𝐨𝐫𝐭, 𝐬𝐭𝐲𝐥𝐞 𝐞𝐭 𝐢𝐝𝐞𝐧𝐭𝐢𝐭𝐞́. 𝐂𝐨𝐧𝐟𝐞𝐜𝐭𝐢𝐨𝐧𝐧𝐞́ 𝐚𝐯𝐞𝐜 𝐝𝐞𝐬 𝐦𝐚𝐭𝐢𝐞̀𝐫𝐞𝐬 𝐝𝐞 𝐪𝐮𝐚𝐥𝐢𝐭𝐞́, 𝐜𝐞 𝐦𝐨𝐝𝐞̀𝐥𝐞 𝐩𝐫",
    "categoryId": "cat_jerseys",
    "categoryName": "Jersey",
    "sku": "MRZ-JRS-03",
    "images": [
      "/assets/shopify/products/haiti-jersey__0.png",
      "/assets/shopify/products/haiti-jersey__1.png",
      "/assets/shopify/products/haiti-jersey__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 35000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_jrs_04",
    "name": "Guadeloupe JERSEY",
    "slug": "guadeloupe-jersey",
    "description": "𝐎𝐮𝐢, 𝐧𝐨𝐮𝐬 𝐚𝐯𝐨𝐧𝐬 𝐝𝐞́𝐜𝐢𝐝𝐞́ 𝐝𝐞 𝐦𝐚𝐫𝐪𝐮𝐞𝐫 𝐥𝐞𝐬 𝐞𝐬𝐩𝐫𝐢𝐭𝐬 𝐚𝐯𝐞𝐜 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧. 𝐃𝐞́𝐜𝐨𝐮𝐯𝐫𝐞𝐳 𝐝𝐞̀𝐬 𝐦𝐚𝐢𝐧𝐭𝐞𝐧𝐚𝐧𝐭 𝐧𝐨𝐭𝐫𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧 “𝐣𝐞𝐫𝐬𝐞𝐲𝐬 𝐦𝐢𝐱𝐭𝐞𝐬”. 𝐔𝐧 𝐣𝐞𝐫𝐬𝐞𝐲 𝐨𝐯𝐞𝐫𝐬𝐢𝐳𝐞 𝐢𝐧𝐬𝐩𝐢𝐫𝐞́ 𝐝𝐞𝐬 𝐞𝐦𝐛𝐥𝐞́𝐦𝐚𝐭𝐢𝐪𝐮𝐞𝐬 𝐦𝐚𝐢𝐥𝐥𝐨𝐭𝐬 𝐝𝐞 𝐟𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐚𝐦𝐞́𝐫𝐢𝐜𝐚𝐢𝐧, 𝐩𝐞𝐧𝐬𝐞́ 𝐩𝐨𝐮𝐫 𝐚𝐥𝐥𝐢𝐞𝐫 𝐜𝐨𝐧𝐟𝐨𝐫𝐭, 𝐬𝐭𝐲𝐥𝐞 𝐞𝐭 𝐢𝐝𝐞𝐧𝐭𝐢𝐭𝐞́. 𝐂𝐨𝐧𝐟𝐞𝐜𝐭𝐢𝐨𝐧𝐧𝐞́ 𝐚𝐯𝐞𝐜 𝐝𝐞𝐬 𝐦𝐚𝐭𝐢𝐞̀𝐫𝐞𝐬 𝐝𝐞 𝐪𝐮𝐚𝐥𝐢𝐭𝐞́, 𝐜𝐞 𝐦𝐨𝐝𝐞̀𝐥𝐞 𝐩𝐫",
    "categoryId": "cat_jerseys",
    "categoryName": "Jersey",
    "sku": "MRZ-JRS-04",
    "images": [
      "/assets/shopify/products/guadeloupe-jersey__0.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 35000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_jrs_05",
    "name": "Côte d’Ivoire JERSEY",
    "slug": "cote-d-ivoire-jersey",
    "description": "𝐎𝐮𝐢, 𝐧𝐨𝐮𝐬 𝐚𝐯𝐨𝐧𝐬 𝐝𝐞́𝐜𝐢𝐝𝐞́ 𝐝𝐞 𝐦𝐚𝐫𝐪𝐮𝐞𝐫 𝐥𝐞𝐬 𝐞𝐬𝐩𝐫𝐢𝐭𝐬 𝐚𝐯𝐞𝐜 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧. 𝐃𝐞́𝐜𝐨𝐮𝐯𝐫𝐞𝐳 𝐝𝐞̀𝐬 𝐦𝐚𝐢𝐧𝐭𝐞𝐧𝐚𝐧𝐭 𝐧𝐨𝐭𝐫𝐞 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧 “𝐣𝐞𝐫𝐬𝐞𝐲𝐬 𝐦𝐢𝐱𝐭𝐞𝐬”. 𝐔𝐧 𝐣𝐞𝐫𝐬𝐞𝐲 𝐨𝐯𝐞𝐫𝐬𝐢𝐳𝐞 𝐢𝐧𝐬𝐩𝐢𝐫𝐞́ 𝐝𝐞𝐬 𝐞𝐦𝐛𝐥𝐞́𝐦𝐚𝐭𝐢𝐪𝐮𝐞𝐬 𝐦𝐚𝐢𝐥𝐥𝐨𝐭𝐬 𝐝𝐞 𝐟𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐚𝐦𝐞́𝐫𝐢𝐜𝐚𝐢𝐧, 𝐩𝐞𝐧𝐬𝐞́ 𝐩𝐨𝐮𝐫 𝐚𝐥𝐥𝐢𝐞𝐫 𝐜𝐨𝐧𝐟𝐨𝐫𝐭, 𝐬𝐭𝐲𝐥𝐞 𝐞𝐭 𝐢𝐝𝐞𝐧𝐭𝐢𝐭𝐞́. 𝐂𝐨𝐧𝐟𝐞𝐜𝐭𝐢𝐨𝐧𝐧𝐞́ 𝐚𝐯𝐞𝐜 𝐝𝐞𝐬 𝐦𝐚𝐭𝐢𝐞̀𝐫𝐞𝐬 𝐝𝐞 𝐪𝐮𝐚𝐥𝐢𝐭𝐞́, 𝐜𝐞 𝐦𝐨𝐝𝐞̀𝐥𝐞 𝐩𝐫",
    "categoryId": "cat_jerseys",
    "categoryName": "Jersey",
    "sku": "MRZ-JRS-05",
    "images": [
      "/assets/shopify/products/cote-d-ivoire-jersey__0.jpg",
      "/assets/shopify/products/cote-d-ivoire-jersey__1.png",
      "/assets/shopify/products/cote-d-ivoire-jersey__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 35000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 1,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  }
];

// 17 Real Bikini Collection Products (from Shopify)
export const INITIAL_BIKINI_PRODUCTS: SeedProductInput[] = [
  {
    "id": "prod_mireza_bkn_01",
    "name": "Brésil bikini",
    "slug": "bresil-bikini",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-01",
    "images": [
      "/assets/shopify/products/bresil-bikini__0.jpg",
      "/assets/shopify/products/bresil-bikini__1.jpg",
      "/assets/shopify/products/bresil-bikini__2.jpg"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": true,
    "newDropOrder": 1,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_02",
    "name": "BARBADOS BIKINI TOP",
    "slug": "barbados-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-02",
    "images": [
      "/assets/shopify/products/barbados-bikini-top__0.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 10500,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 2,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_03",
    "name": "Saint Lucia BIKINI FULL SET",
    "slug": "bahamas-bikini-top-1",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-03",
    "images": [
      "/assets/shopify/products/bahamas-bikini-top-1__0.png",
      "/assets/shopify/products/bahamas-bikini-top-1__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": true,
    "newDropOrder": 5,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_04",
    "name": "DOMINICAN REPUBLIC\nBIKINI FULL SET",
    "slug": "dominican-republic-bikini-short",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-04",
    "images": [
      "/assets/shopify/products/dominican-republic-bikini-short__0.png",
      "/assets/shopify/products/dominican-republic-bikini-short__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 3,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_05",
    "name": "BARBADOS BIKINI SHORT",
    "slug": "barbados-bikini-short",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-05",
    "images": [
      "/assets/shopify/products/barbados-bikini-short__0.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 10500,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 4,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_06",
    "name": "CUBA BIKINI TOP",
    "slug": "cuba-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-06",
    "images": [
      "/assets/shopify/products/cuba-bikini-top__0.png",
      "/assets/shopify/products/cuba-bikini-top__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 5,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_07",
    "name": "BAHAMAS BIKINI FULL SET",
    "slug": "bahamas-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-07",
    "images": [
      "/assets/shopify/products/bahamas-bikini-top__0.png",
      "/assets/shopify/products/bahamas-bikini-top__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 6,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_08",
    "name": "MARTINIQUE BIKINI FULL SET",
    "slug": "martinique-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-08",
    "images": [
      "/assets/shopify/products/martinique-bikini-top__0.png",
      "/assets/shopify/products/martinique-bikini-top__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 7,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_09",
    "name": "TRINIDAD BIKINI FULL SET",
    "slug": "trinidad-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-09",
    "images": [
      "/assets/shopify/products/trinidad-bikini-top__0.png",
      "/assets/shopify/products/trinidad-bikini-top__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 8,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_10",
    "name": "GUADELOUPE BIKINI FULL SET",
    "slug": "guadeloupe-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-10",
    "images": [
      "/assets/shopify/products/guadeloupe-bikini-top__0.png",
      "/assets/shopify/products/guadeloupe-bikini-top__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 9,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_11",
    "name": "Guyane BIKINI FULL SET",
    "slug": "guyane-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-11",
    "images": [
      "/assets/shopify/products/guyane-bikini-top__0.png",
      "/assets/shopify/products/guyane-bikini-top__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 10,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_12",
    "name": "JAMAICA BIKINI FULL SET",
    "slug": "jamaica-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-12",
    "images": [
      "/assets/shopify/products/jamaica-bikini-top__0.png",
      "/assets/shopify/products/jamaica-bikini-top__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 11,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_13",
    "name": "HAITI BIKINI FULL SET",
    "slug": "haiti-bikini-top",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-13",
    "images": [
      "/assets/shopify/products/haiti-bikini-top__0.png",
      "/assets/shopify/products/haiti-bikini-top__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "regularPriceXof": 21000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 12,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8
    }
  },
  {
    "id": "prod_mireza_bkn_14",
    "name": "bikini brazil noir blanc",
    "slug": "complet-bikini-brazil-vert-bleu-copie-copie-copie",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-14",
    "images": [
      "/assets/shopify/products/complet-bikini-brazil-vert-bleu-copie-copie-copie__0.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 25500,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 13,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_15",
    "name": "bikini brazil bleu jaune",
    "slug": "complet-bikini-brazil-vert-bleu-copie-copie",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-15",
    "images": [
      "/assets/shopify/products/complet-bikini-brazil-vert-bleu-copie-copie__0.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 25500,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 14,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_16",
    "name": "Complet bikini brazil blanc bleu",
    "slug": "complet-bikini-brazil-vert-bleu-copie",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-16",
    "images": [
      "/assets/shopify/products/complet-bikini-brazil-vert-bleu-copie__0.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 25500,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 15,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_bkn_17",
    "name": "Complet bikini brazil vert bleu",
    "slug": "complet-bikini-brazil-vert-bleu",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_swimwear",
    "categoryName": "Bikini",
    "sku": "MRZ-BKN-17",
    "images": [
      "/assets/shopify/products/complet-bikini-brazil-vert-bleu__0.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 25500,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 16,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  }
];

// 13 Real Set Collection Products (from Shopify)
export const INITIAL_SET_PRODUCTS: SeedProductInput[] = [
  {
    "id": "prod_mireza_set_01",
    "name": "CÔTE D’IVOIRE FULL SET",
    "slug": "cote-d-ivoire-short",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-01",
    "images": [
      "/assets/shopify/products/cote-d-ivoire-short__0.png",
      "/assets/shopify/products/cote-d-ivoire-short__1.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": true,
    "newDropOrder": 3,
    "isFeatured": true,
    "featuredOrder": 21,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_02",
    "name": "GUYANE FULL SET",
    "slug": "cuba-t-shirt-copie",
    "description": "THE SET Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-02",
    "images": [
      "/assets/shopify/products/cuba-t-shirt-copie__0.png",
      "/assets/shopify/products/cuba-t-shirt-copie__1.png",
      "/assets/shopify/products/cuba-t-shirt-copie__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": true,
    "newDropOrder": 6,
    "isFeatured": true,
    "featuredOrder": 22,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_03",
    "name": "Bahamas FULL SET",
    "slug": "t-shirt-bahamas",
    "description": "THE SET Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-03",
    "images": [
      "/assets/shopify/products/t-shirt-bahamas__0.png",
      "/assets/shopify/products/t-shirt-bahamas__1.png",
      "/assets/shopify/products/t-shirt-bahamas__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 23,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_04",
    "name": "Barbados FULL SET",
    "slug": "bahamas-t-shirt-copie-copie",
    "description": "THE SET Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-04",
    "images": [
      "/assets/shopify/products/bahamas-t-shirt-copie-copie__0.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-copie__1.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-copie__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": true,
    "featuredOrder": 24,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_05",
    "name": "Cuba FULL SET",
    "slug": "bahamas-t-shirt-copie-copie-3",
    "description": "THE SET Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-05",
    "images": [
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-3__0.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-3__1.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-3__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_06",
    "name": "PUERTO RICO FULL SET",
    "slug": "puerto-rico-t-shirt",
    "description": "The set Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-06",
    "images": [
      "/assets/shopify/products/puerto-rico-t-shirt__0.png",
      "/assets/shopify/products/puerto-rico-t-shirt__1.png",
      "/assets/shopify/products/puerto-rico-t-shirt__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_07",
    "name": "Guadeloupe FULL SET",
    "slug": "bahamas-t-shirt-copie",
    "description": "The Set Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-07",
    "images": [
      "/assets/shopify/products/bahamas-t-shirt-copie__0.png",
      "/assets/shopify/products/bahamas-t-shirt-copie__1.png",
      "/assets/shopify/products/bahamas-t-shirt-copie__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_08",
    "name": "Martinique FULL SET",
    "slug": "bahamas-t-shirt-copie-copie-2",
    "description": "The set Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-08",
    "images": [
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-2__0.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-2__1.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-2__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_09",
    "name": "Saint Lucia FULL SET",
    "slug": "bahamas-t-shirt-copie-1",
    "description": "The set Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-09",
    "images": [
      "/assets/shopify/products/bahamas-t-shirt-copie-1__0.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-1__1.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-1__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_10",
    "name": "Haïti FULL SET",
    "slug": "bikini-jamaica-copie-7",
    "description": "Évadez-vous avec le Bikini Mireza. Préparez votre prochaine escapade avec une coupe iconique aux couleurs de votre île préférée. Coupe Ajustable : Design stretch qui sublime toutes les silhouettes. Couleurs Vibrantes : Impression haute définition résistante au sel et au soleil. Identité : Portez la fierté de vos racine",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-10",
    "images": [
      "/assets/shopify/products/bikini-jamaica-copie-7__0.png",
      "/assets/shopify/products/bikini-jamaica-copie-7__1.png",
      "/assets/shopify/products/bikini-jamaica-copie-7__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_11",
    "name": "Dominican Republic FULL SET",
    "slug": "bahamas-t-shirt-copie-copie-1",
    "description": "THE SET Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-11",
    "images": [
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-1__0.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-1__1.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-copie-1__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_12",
    "name": "JAMAICA FULL SET",
    "slug": "bahamas-t-shirt-copie-2",
    "description": "THE SET Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-12",
    "images": [
      "/assets/shopify/products/bahamas-t-shirt-copie-2__0.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-2__1.png",
      "/assets/shopify/products/bahamas-t-shirt-copie-2__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  },
  {
    "id": "prod_mireza_set_13",
    "name": "Trinidad FULL SET",
    "slug": "cuba-t-shirt-copie-copie",
    "description": "Le T-shirt Essentiel Mireza. Un classique indémodable. Portez votre culture au quotidien avec un coton de haute qualité et un design inspiré de votre héritage.",
    "categoryId": "cat_set",
    "categoryName": "Set",
    "sku": "MRZ-SET-13",
    "images": [
      "/assets/shopify/products/cuba-t-shirt-copie-copie__0.png",
      "/assets/shopify/products/cuba-t-shirt-copie-copie__1.png",
      "/assets/shopify/products/cuba-t-shirt-copie-copie__2.png"
    ],
    "colors": [
      {
        "name": "Edition 01",
        "hex": "#000000"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "regularPriceXof": 30000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": false,
    "preorderEstimateDate": null,
    "stockMatrix": {
      "Edition 01-XS": 8,
      "Edition 01-S": 8,
      "Edition 01-M": 8,
      "Edition 01-L": 8,
      "Edition 01-XL": 8
    }
  }
];

// Accessories: Exclusively Casquettes & Tapis
export const INITIAL_ACCESSORIES_PRODUCTS: SeedProductInput[] = [
  {
    "id": "prod_mireza_cap_01",
    "name": "Casquette MIREZA Signature Multi-Couleurs",
    "slug": "casquette-mireza-multi-couleurs",
    "description": "Casquette structurée en sergé de coton brodée MIREZA, déclinée en 4 coloris signature : Noir/Rose, Émeraude/Or, Crème/Corail et Rose Pastel.",
    "categoryId": "cat_accessories",
    "categoryName": "Accessories",
    "sku": "MRZ-CAP-01",
    "images": [
      "/assets/mireza/cap_noir_rose.jpg",
      "/assets/mireza/cap_emeraude_or.jpg",
      "/assets/mireza/cap_creme_corail.jpg",
      "/assets/mireza/cap_rose_pastel.jpg"
    ],
    "colors": [
      {
        "name": "Noir / Rose",
        "hex": "#000000"
      },
      {
        "name": "Émeraude / Or",
        "hex": "#0E6B47"
      },
      {
        "name": "Crème / Corail",
        "hex": "#F5EFE4"
      },
      {
        "name": "Rose Pastel",
        "hex": "#E9B9C8"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "regularPriceXof": 15000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": true,
    "preorderEstimateDate": "Drop 02 — Bientôt disponible",
    "stockMatrix": {
      "Noir / Rose-One Size": 0,
      "Émeraude / Or-One Size": 0,
      "Crème / Corail-One Size": 0,
      "Rose Pastel-One Size": 0
    }
  },
  {
    "id": "prod_mireza_cap_02",
    "name": "Casquette MIREZA Émeraude 19",
    "slug": "casquette-mireza-emeraude-19",
    "description": "Casquette coton vert émeraude broderie jaune or MIREZA 19, boucle laiton réglable.",
    "categoryId": "cat_accessories",
    "categoryName": "Accessories",
    "sku": "MRZ-CAP-02",
    "images": [
      "/assets/mireza/cap_emeraude_or.jpg"
    ],
    "colors": [
      {
        "name": "Émeraude / Or",
        "hex": "#0E6B47"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "regularPriceXof": 15000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": true,
    "preorderEstimateDate": "Drop 02 — Bientôt disponible",
    "stockMatrix": {
      "Émeraude / Or-One Size": 0
    }
  },
  {
    "id": "prod_mireza_cap_03",
    "name": "Casquette MIREZA Crème Crest",
    "slug": "casquette-mireza-creme-crest",
    "description": "Casquette coton ivoire avec blason brodé palmiers et lettrage MIREZA carmin et marine.",
    "categoryId": "cat_accessories",
    "categoryName": "Accessories",
    "sku": "MRZ-CAP-03",
    "images": [
      "/assets/mireza/cap_creme_corail.jpg"
    ],
    "colors": [
      {
        "name": "Crème / Corail",
        "hex": "#F5EFE4"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "regularPriceXof": 15000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": true,
    "preorderEstimateDate": "Drop 02 — Bientôt disponible",
    "stockMatrix": {
      "Crème / Corail-One Size": 0
    }
  },
  {
    "id": "prod_mireza_cap_04",
    "name": "Casquette MIREZA Rose Blush",
    "slug": "casquette-mireza-rose-blush",
    "description": "Casquette rose poudré signature avec broderie cursive noire MIREZA.",
    "categoryId": "cat_accessories",
    "categoryName": "Accessories",
    "sku": "MRZ-CAP-04",
    "images": [
      "/assets/mireza/cap_rose_pastel.jpg"
    ],
    "colors": [
      {
        "name": "Rose Pastel",
        "hex": "#E9B9C8"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "regularPriceXof": 15000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": true,
    "preorderEstimateDate": "Drop 02 — Bientôt disponible",
    "stockMatrix": {
      "Rose Pastel-One Size": 0
    }
  },
  {
    "id": "prod_mireza_tap_01",
    "name": "Tapis MIREZA Atelier Tufté",
    "slug": "tapis-mireza-atelier-tufte",
    "description": "Tapis tufté épais en laine douce écru et bordure géométrique noire frangée avec signature centrale MIREZA rose poudré.",
    "categoryId": "cat_accessories",
    "categoryName": "Accessories",
    "sku": "MRZ-TAP-01",
    "images": [
      "/assets/mireza/tapis_tufted_atelier.jpg"
    ],
    "colors": [
      {
        "name": "Crème / Noir",
        "hex": "#FFFFFF"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "regularPriceXof": 38000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": true,
    "preorderEstimateDate": "Drop 02 — Bientôt disponible",
    "stockMatrix": {
      "Crème / Noir-One Size": 0
    }
  },
  {
    "id": "prod_mireza_tap_02",
    "name": "Tapis Rond MIREZA Caribbean",
    "slug": "tapis-rond-mireza-caribbean",
    "description": "Tapis circulaire tufté vert émeraude et jaune soleil orné de l’écusson MIREZA Caribbean.",
    "categoryId": "cat_accessories",
    "categoryName": "Accessories",
    "sku": "MRZ-TAP-02",
    "images": [
      "/assets/mireza/tapis_caribbean_rond.jpg"
    ],
    "colors": [
      {
        "name": "Émeraude / Or",
        "hex": "#0E6B47"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "regularPriceXof": 38000,
    "promoPriceXof": null,
    "lowStockThreshold": 4,
    "isNewDrop": false,
    "newDropOrder": 0,
    "isFeatured": false,
    "featuredOrder": 0,
    "isPreorder": true,
    "preorderEstimateDate": "Drop 02 — Bientôt disponible",
    "stockMatrix": {
      "Émeraude / Or-One Size": 0
    }
  }
];

export const ALL_SEED_PRODUCTS: SeedProductInput[] = [
  ...INITIAL_JERSEY_PRODUCTS,
  ...INITIAL_BIKINI_PRODUCTS,
  ...INITIAL_SET_PRODUCTS,
  ...INITIAL_ACCESSORIES_PRODUCTS,
];

export const OBSOLETE_CATEGORY_IDS: string[] = [
  'cat_jewelry',
  'cat_clothing',
  'cat_sweatwear',
];

export const LEGACY_PLACEHOLDER_PRODUCT_IDS: string[] = [
  'prod_mireza_flipflops',
  'prod_mireza_cap',
  'prod_mireza_briefs',
  'prod_mireza_top',
  'prod_mireza_bustier',
  'prod_mireza_bra',
  'prod_mireza_cuff',
  'prod_mireza_hoops',
  'prod_mireza_jersey_mesh',
  'prod_mireza_jersey_crop',
  'prod_mireza_swim_onepiece',
  'prod_mireza_swim_bikini',
  'prod_mireza_legging',
  'prod_mireza_dress',
  'prod_mireza_bag',
  'prod_mireza_jwl_cowrie',
  'prod_mireza_clg_ringer',
  'prod_mireza_acc_beachset',
  'prod_mireza_swt_01',
  'prod_mireza_swt_02',
  'prod_mireza_swt_03',
];
