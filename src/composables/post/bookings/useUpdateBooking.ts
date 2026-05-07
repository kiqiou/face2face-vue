import { ref } from 'vue';
import { authFetch } from '../../authFetch.js';
import { API_BASE } from './bookingBaseApi.js';

export function useUpdateBooking() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  const updateBooking = async (
    bookingId: number,
    payload: {
      workDayId: number;
      start_time?: string;
    }
  ) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await authFetch(
        API_BASE + `update_booking/${bookingId}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка обновления');
      }

      success.value = true;
      return data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { updateBooking, loading, error, success };
}
