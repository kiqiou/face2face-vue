import { ref } from 'vue';
import { apiGet } from '../apiGet.js';
import { API_BASE } from '../baseApi.js';

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
