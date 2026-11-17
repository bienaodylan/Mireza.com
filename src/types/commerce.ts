export type ProductStatus = 'published' | 'draft' | 'archived';

export type AvailabilityBadge =
  | 'IN STOCK'
  | 'LOW STOCK'
  | 'SOLD OUT'
  | 'PRE-ORDER'
  | 'NEW'
  | 'SALE';

export type PaymentMethod =
  | 'wave'
  | 'orange_money'
  | 'mobile_money'
  | 'visa'
  | 'mastercard';

export type PaymentStatus =
  | 'pending'
  | 'awaiting_verification'
  | 'paid'
  | 'failed'
  | 'refunded';

export type FulfillmentStatus =
  | 'unfulfilled'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  sku: string;
  externalShopifyHandle?: string | null;
  images: string[];
  colors: string[];
  sizes: string[];
  regularPriceXof: number;
  promoPriceXof?: number | null;
  lowStockThreshold: number;
  status: ProductStatus;
  isNewDrop: boolean;
  newDropOrder: number;
  isFeatured: boolean;
  featuredOrder: number;
  isPreorder: boolean;
  preorderLimit?: number | null;
  preorderEstimateDate?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color: string;
  colorHex: string;
  size: string;
  priceXof: number;
  compareAtPriceXof?: number | null;
  stockQty: number;
  reservedQty: number;
  lowStockThreshold: number;
  weightGrams?: number | null;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface InventoryMovement {
  id: string;
  variantId: string;
  productId: string;
  sku: string;
  type: 'addition' | 'reduction' | 'correction' | 'reservation' | 'release' | 'sale' | 'import';
  deltaQty: number;
  previousQty: number;
  newQty: number;
  reason: string;
  referenceId?: string | null;
  actorEmail: string;
  createdAt?: any;
}

export interface InventoryReservation {
  id: string;
  variantId: string;
  productId: string;
  orderId: string;
  qty: number;
  status: 'active' | 'consumed' | 'released' | 'expired';
  expiresAt: string;
  createdAt?: any;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  unitPriceXof: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  shippingFeeXof: number;
  promoCode?: string | null;
  discountXof: number;
  subtotalXof: number;
  totalXof: number;
  currency: 'XOF';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  trackingNumber?: string | null;
  notes?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber?: string;
  userId?: string | null;
  provider: PaymentMethod;
  amountXof: number;
  currency: 'XOF';
  status: PaymentStatus;
  providerReference?: string;
  webhookVerified: boolean;
  idempotencyKey: string;
  missingConfiguration?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface RefundRecord {
  id: string;
  orderId: string;
  amountXof: number;
  reason: string;
  status: 'pending' | 'processed' | 'failed';
  createdBy: string;
  createdAt?: any;
}

export interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderXof: number;
  maxUses: number;
  usedCount: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  tag: string;
}

export type HomepageSectionKey =
  | 'hero'
  | 'brand_intro'
  | 'new_drop'
  | 'next_drop'
  | 'categories'
  | 'featured'
  | 'mireza_world'
  | 'newsletter';

export interface StorefrontConfig {
  heroImageUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaLabel?: string;
  brandIntroTitle: string;
  brandIntroBody: string;
  brandIntroImageUrl: string;
  sectionOrder: HomepageSectionKey[];
  galleryItems: GalleryItem[];
  newsletterTitle: string;
  newsletterBody: string;
  campaignBannerText?: string;
  campaignBannerEnabled?: boolean;
  standardShippingXof: number;
  expressShippingXof: number;
  freeShippingThresholdXof: number;
  supportEmail?: string;
  supportPhone?: string;
  updatedAt?: any;
}

export interface CartItem {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  sku: string;
  color: string;
  colorHex: string;
  size: string;
  unitPriceXof: number;
  quantity: number;
  imageUrl: string;
  isPreorder?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName?: string;
  phone?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface CustomerAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
  createdAt?: any;
}

export interface ImportJob {
  id: string;
  filename: string;
  format: 'shopify' | 'mireza';
  mode: 'create_only' | 'update_only' | 'upsert' | 'skip_existing';
  totalRows: number;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  actorEmail: string;
  createdAt?: any;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt?: any;
}

export interface PaymentProviderStatus {
  id: PaymentMethod;
  name: string;
  region: string;
  configured: boolean;
  missingEnvVars: string[];
  webhookPath: string;
}
