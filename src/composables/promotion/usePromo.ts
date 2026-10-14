// composables/usePromo.ts
import { ref } from 'vue';
import { PROMOTION_API_BASE } from './promotionBaseApi.js';
import { MyDiscount, PromoCheckResult } from '../../models/discount.js';
import { authService } from '../../utils/auth.js';
import { authFetch } from '../../utils/authFetch.js';
import { mapMyDiscount, mapPromoCheckResult } from '../../utils/mapDiscount.js';


export function usePromo() {
  const myDiscount = ref<MyDiscount | null>(null);
  const promoResult = ref<PromoCheckResult | null>(null);
  const isChecking = ref(false);

  const loadMyDiscount = async () => {
    const res = await authFetch(PROMOTION_API_BASE + 'my-discount/', {
    });
    if (res.ok) {
      myDiscount.value = mapMyDiscount(await res.json());
    }
  };

  const checkPromoCode = async (code: string) => {
    isChecking.value = true;
    try {
      const res = await authFetch(PROMOTION_API_BASE + 'check-promo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      promoResult.value = mapPromoCheckResult(data);
      return promoResult.value;
    } finally {
      isChecking.value = false;
    }
  };

  return { myDiscount, promoResult, isChecking, loadMyDiscount, checkPromoCode };
}