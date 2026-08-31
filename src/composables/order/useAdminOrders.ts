import { ref } from 'vue';
import { Order, OrderStatus } from '../../models/order.js';
import { mapOrder } from '../../utils/mapOrder.js';
import { API_BASE } from './orderBaseApi.js';
import { authFetchJson, authPatchJson, authDelete } from '../../utils/apiAuthHelpers.js';

export function useAdminOrders() {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async (statusFilter?: OrderStatus) => {
    loading.value = true;
    error.value = null;

    try {
      const url = statusFilter
        ? `${API_BASE}get_orders/?status=${statusFilter}`
        : `${API_BASE}get_orders/`;

      const data = await authFetchJson(url);
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
      const data = await authFetchJson(API_BASE + `get_order/${orderId}/`);
      return mapOrder(data);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const updateStatus = async (orderId: number, status: OrderStatus) => {
    error.value = null;
    try {
      const data = await authPatchJson(API_BASE + `update_order_status/${orderId}/`, { status });
      const updated = mapOrder(data);
      const index = orders.value.findIndex((o: Order) => o.id === orderId);
      if (index !== -1) orders.value[index] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const removeOrder = async (orderId: number) => {
    error.value = null;
    try {
      await authDelete(API_BASE + `delete_order/${orderId}/`);
      orders.value = orders.value.filter((o: Order) => o.id !== orderId);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  return { orders, loading, error, load, loadOne, updateStatus, removeOrder };
}