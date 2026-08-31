import { ref } from 'vue';
import { API_BASE } from '../bookings/bookingBaseApi.js';
import { authFetch } from '../../utils/authFetch.js';

export function useFreeIntervals() {
  const freeIntervals = ref<{ start: string; end: string }[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadFreeIntervals = async (workDayId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await authFetch(
        `${API_BASE}get_free_intervals/${workDayId}/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка получения времени');
      }

      freeIntervals.value = data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    freeIntervals,
    loadFreeIntervals,
    loading,
    error,
  };
}
