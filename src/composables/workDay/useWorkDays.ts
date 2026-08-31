import { ref } from 'vue';
import { API_BASE } from '../bookings/bookingBaseApi.js';
import { apiGet } from '../../utils/apiGet.js';

export function useWorkDays() {
  const workDays = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadWorkDays = async () => {
    loading.value = true;

    try {
      const data = await apiGet(API_BASE + 'get_all_work_days/');
      workDays.value = data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { workDays, loading, error, loadWorkDays };
}
