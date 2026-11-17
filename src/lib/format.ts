import { Product, ProductVariant, AvailabilityBadge } from '../types/commerce';

export function formatXOF(amount: number): string {
  const safe = Math.round(Number.isFinite(amount) ? amount : 0);
  return `${new Intl.NumberFormat('fr-FR').format(safe)} XOF`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function sanitizeId(input: string): string {
  const cleaned = input.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  return cleaned || `id_${Date.now()}`;
}

export function getAvailableStock(variant: ProductVariant): number {
  return Math.max(0, (variant.stockQty || 0) - (variant.reservedQty || 0));
}

export function getProductTotalAvailable(variants: ProductVariant[]): number {
  return variants.reduce((sum, v) => sum + (v.isActive ? getAvailableStock(v) : 0), 0);
}

export function getProductAvailability(
  product: Product,
  variants: ProductVariant[]
): {
  primaryState: AvailabilityBadge;
  isSoldOut: boolean;
  totalAvailable: number;
  isOnSale: boolean;
} {
  const activeVariants = variants.filter((v) => v.isActive);
  const totalAvailable = getProductTotalAvailable(activeVariants);
  const isOnSale =
    typeof product.promoPriceXof === 'number' &&
    product.promoPriceXof > 0 &&
    product.promoPriceXof < product.regularPriceXof;

  if (product.isPreorder && totalAvailable === 0) {
    return { primaryState: 'PRE-ORDER', isSoldOut: false, totalAvailable: 0, isOnSale };
  }

  if (activeVariants.length === 0 || totalAvailable <= 0) {
    return { primaryState: 'SOLD OUT', isSoldOut: true, totalAvailable: 0, isOnSale };
  }

  const threshold = product.lowStockThreshold ?? 5;
  if (totalAvailable <= threshold) {
    return { primaryState: 'LOW STOCK', isSoldOut: false, totalAvailable, isOnSale };
  }

  if (isOnSale) {
    return { primaryState: 'SALE', isSoldOut: false, totalAvailable, isOnSale };
  }

  if (product.isNewDrop) {
    return { primaryState: 'NEW', isSoldOut: false, totalAvailable, isOnSale };
  }

  return { primaryState: 'IN STOCK', isSoldOut: false, totalAvailable, isOnSale };
}

export function getColorHex(colorName: string): string {
  const lower = colorName.toLowerCase().trim();
  if (lower.includes('émeraude') || lower.includes('emeraude') || lower.includes('emerald')) {
    return '#0E6B47';
  }
  if (lower.includes('tropical') || lower.includes('vert')) {
    return '#22944E';
  }
  if (lower.includes('fuchsia')) {
    return '#D6407E';
  }
  if (lower.includes('rose') || lower.includes('pink') || lower.includes('blush')) {
    return lower.includes('noir') ? '#1A1A1A' : '#E9B9C8';
  }
  if (lower.includes('bordeaux')) {
    return '#76182A';
  }
  if (lower.includes('corail') || lower.includes('rouge') || lower.includes('red')) {
    return '#D62D3A';
  }
  if (lower.includes('orange')) {
    return '#E86A18';
  }
  if (lower.includes('jaune') || lower.includes('yellow')) {
    return '#F0CC24';
  }
  if (lower.includes('or') || lower.includes('gold')) {
    return '#CCA230';
  }
  if (lower.includes('turquoise')) {
    return '#12A8B8';
  }
  if (lower.includes('marine') || lower.includes('navy')) {
    return '#14264C';
  }
  if (lower.includes('caraïbe') || lower.includes('caraibe') || lower.includes('royal') || lower.includes('bleu') || lower.includes('blue')) {
    return '#0095D9';
  }
  if (lower.includes('violet') || lower.includes('purple')) {
    return '#6A3694';
  }
  if (lower.includes('marron') || lower.includes('chocolat') || lower.includes('brown')) {
    return '#6C422A';
  }
  if (lower.includes('gris') || lower.includes('grey') || lower.includes('gray')) {
    return '#9EA2A8';
  }
  if (lower.includes('charcoal')) {
    return '#2E2E2E';
  }
  if (
    lower.includes('white') ||
    lower.includes('blanc') ||
    lower.includes('ivory') ||
    lower.includes('écru') ||
    lower.includes('ecru') ||
    lower.includes('crème') ||
    lower.includes('creme') ||
    lower.includes('taupe') ||
    lower.includes('stone') ||
    lower.includes('sand')
  ) {
    return '#F7F3EA';
  }
  return '#121212';
}

export function formatTimestamp(ts: any): string {
  if (!ts) return '—';
  const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
