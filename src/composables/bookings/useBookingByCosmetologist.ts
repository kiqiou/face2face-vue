import { ref } from 'vue';
import { API_BASE } from './bookingBaseApi.js';
import { authFetch } from '../authFetch.js';
import { Booking } from '../../models/booking.js';

export function useBookingByCosmetologist() {
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadBookingByCosmetologist = async () => {
    loading.value = true;

    try {
      const response = await authFetch(
        API_BASE + 'get_cosmetologist_bookings/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка получения букингов');
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
      console.log(bookings.value);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { bookings, loading, error, loadBookingByCosmetologist };
}
