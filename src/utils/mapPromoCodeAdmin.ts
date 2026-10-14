// mappers/mapPromoCodeAdmin.ts
import { PromoCodeAdmin } from '../models/promoCode.js';

export function mapPromoCodeAdmin(item: any): PromoCodeAdmin {
  return new PromoCodeAdmin({
    id: item.id,
    code: item.code,
    discountPercent: item.discount_percent,
    isFirstOrderOnly: item.is_first_order_only,
    isActive: item.is_active,
    validFrom: item.valid_from,
    validUntil: item.valid_until,
    usageLimit: item.usage_limit,
    usedCount: item.used_count,
    createdAt: item.created_at,
  });
}