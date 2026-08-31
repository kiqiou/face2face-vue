import { ref } from 'vue';

import { Booking } from '../../models/booking.js';
import { API_BASE } from './bookingBaseApi.js';
import { authFetch } from '../../utils/authFetch.js';

export function useUserBookings() {
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;

    try {
      const response = await authFetch(`${API_BASE}get_user_bookings/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка получения записей пользователя');
      }

      bookings.value = data.map(
        (item: any) =>
          new Booking(
            item.id,
            item.user,
            item.cosmetologist,
            new Date(item.date),
            item.start_time,
            item.end_time,
            item.procedures,
            item.duration,
            item.price,
            item.status
          )
      );
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { bookings, loading, error, load };
}
