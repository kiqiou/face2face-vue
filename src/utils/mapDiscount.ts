import { MyDiscount, PromoCheckResult } from '../models/discount.js';

export function mapMyDiscount(data: any): MyDiscount {
  return new MyDiscount(
    Number(data.total_spent),
    data.current_discount_percent,
    data.next_tier_threshold !== null ? Number(data.next_tier_threshold) : null,
    data.next_tier_discount_percent
  );
}

export function mapPromoCheckResult(data: any): PromoCheckResult {
  return new PromoCheckResult(
    data.valid ?? false,
    data.discount_percent ?? 0,
    data.code ?? '',
    data.error ?? null
  );
}