import { ref } from 'vue';
import { API_BASE } from './bookingBaseApi.js';
import { authFetch } from '../../authFetch.js';

export function useCancelBooking() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  const cancel = async (bookingId: number) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await authFetch(
        API_BASE + `cancel_booking/${bookingId}/`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка отмены');
      }

      success.value = true;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { cancel, loading, error, success };
}
