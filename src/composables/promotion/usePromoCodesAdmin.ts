// composables/promotions/usePromoCodesAdmin.ts
import { ref } from 'vue';
import { authFetch } from '../../utils/authFetch.js';
import { PromoCodeAdmin } from '../../models/promoCode.js';
import { PROMOTION_API_BASE } from './promotionBaseApi.js';
import { mapPromoCodeAdmin } from '../../utils/mapPromoCodeAdmin.js';


export function usePromoCodesAdmin() {
  const promoCodes = ref<PromoCodeAdmin[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await authFetch(PROMOTION_API_BASE + 'promo-codes/');
      if (!res.ok) throw new Error('Не удалось загрузить промокоды');
      const data = await res.json();
      promoCodes.value = data.map(mapPromoCodeAdmin);
    } catch (e: any) {
      error.value = e.message ?? 'Ошибка загрузки';
    } finally {
      loading.value = false;
    }
  };

  const create = async (payload: Partial<{
    code: string; discountPercent: number; isFirstOrderOnly: boolean;
    validUntil: string | null; usageLimit: number | null;
  }>) => {
    const res = await authFetch(PROMOTION_API_BASE + 'promo-codes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: payload.code,
        discount_percent: payload.discountPercent,
        is_first_order_only: payload.isFirstOrderOnly ?? false,
        valid_until: payload.validUntil || null,
        usage_limit: payload.usageLimit || null,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(Object.values(err).flat().join(', ') || 'Не удалось создать промокод');
    }
    const created = mapPromoCodeAdmin(await res.json());
    promoCodes.value.unshift(created);
    return created;
  };

  const toggleActive = async (promo: PromoCodeAdmin) => {
    const res = await authFetch(PROMOTION_API_BASE + `promo-codes/${promo.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !promo.isActive }),
    });
    if (!res.ok) throw new Error('Не удалось обновить промокод');
    promo.isActive = !promo.isActive;
  };

  const remove = async (id: number) => {
    const res = await authFetch(PROMOTION_API_BASE + `promo-codes/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Не удалось удалить промокод');
    promoCodes.value = promoCodes.value.filter((p) => p.id !== id);
  };

  return { promoCodes, loading, error, load, create, toggleActive, remove };
}