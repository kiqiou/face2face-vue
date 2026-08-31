import { ref } from 'vue';
import { WORKDAY_API_BASE } from './workDayBaseApi.js';
import { authFetch } from '../../utils/authFetch.js';


export function useDeleteWorkDay() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  const deleteWorkDay = async (workDayId: number) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await authFetch(
        WORKDAY_API_BASE + `delete_work_day/${workDayId}/`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка удаления');
      }

      success.value = true;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { deleteWorkDay, loading, error, success };
}
