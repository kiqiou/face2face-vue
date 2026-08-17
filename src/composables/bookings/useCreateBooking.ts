import { ref } from 'vue';
import { API_BASE } from './bookingBaseApi.js';
import { authFetch } from '../authFetch.js';

export function useCreateBooking() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);
  const booking = ref<any>(null);

  const createBooking = async (
    procedureIds: number[],
    workDayId: number,
    startTime: string
  ) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await authFetch(API_BASE + 'create_booking/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          procedure_ids: procedureIds,
          work_day_id: workDayId,
          start_time: startTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания бронирования');
      }

      booking.value = data;
      success.value = true;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { createBooking, loading, error, success, booking };
}
