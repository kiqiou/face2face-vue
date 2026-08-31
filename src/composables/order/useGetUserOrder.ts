import { ref } from 'vue';
import { Order } from '../../models/order.js';
import { mapOrder } from '../../utils/mapOrder.js';
import { API_BASE } from './orderBaseApi.js';
import { authFetchJson } from '../../utils/apiAuthHelpers.js';

export function useGetUserOrders() {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await authFetchJson(API_BASE + 'get_my_orders/');
      orders.value = data.map(mapOrder);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const loadOne = async (orderId: number) => {
    error.value = null;
    try {
      const data = await authFetchJson(API_BASE + `get_order_by_id/${orderId}/`);
      return mapOrder(data);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  return { orders, loading, error, loadAll, loadOne };
}