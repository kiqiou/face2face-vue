import { ref } from 'vue';
import { WorkDay } from '../../models/workday.js';
import { API_BASE } from '../bookings/bookingBaseApi.js';
import { apiGet } from '../../utils/apiGet.js';

export function useWorkDaysByCosmetologist() {
  const workDays = ref<WorkDay[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadWorkDayByCosmetologist = async (cosmetologistId: number) => {
    loading.value = true;

    try {
      const data = await apiGet(
        `${API_BASE}get_work_days_by_cosmetologist/${cosmetologistId}/`
      );

      workDays.value = data.map(
        (item: any) =>
          new WorkDay(
            item.id,
            item.cosmetologist,
            new Date(item.date),
            item.start_time,
            item.end_time,
            item.is_working
          )
      );
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { workDays, loading, error, loadWorkDayByCosmetologist };
}
