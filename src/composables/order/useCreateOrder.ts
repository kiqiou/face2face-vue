import { ref } from 'vue';
import { API_BASE } from './orderBaseApi.js';
import { User } from '../../models/user.js';
import { authFetch } from '../../utils/authFetch.js';

interface CartLine {
  productId: number;
  quantity: number;
}

interface CreateOrderPayload {
  user: User;
  paymentMethod: 'cash' | 'card';
  comment: string;
  items: CartLine[];
}

export function useCreateOrder() {
  const submitting = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  const submit = async (payload: CreateOrderPayload) => {
    submitting.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await authFetch(API_BASE + 'create_order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: payload.user,
          payment_method: payload.paymentMethod,
          comment: payload.comment,
          items: payload.items.map((i) => ({ product: i.productId, quantity: i.quantity })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || 'Не удалось оформить заказ');
      }

      const data = await response.json();
      success.value = true;
      return data;
    } catch (err: any) {
      error.value = err.message || 'Ошибка при оформлении заказа';
      throw err;
    } finally {
      submitting.value = false;
    }
  };

  return { submitting, error, success, submit };
}