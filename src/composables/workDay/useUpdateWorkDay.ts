import { ref } from 'vue';
import { WORKDAY_API_BASE } from './workDayBaseApi.js';
import { authFetch } from '../authFetch.js';

export function useUpdateWorkDay() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  const updateWorkDay = async (
    workDayId: number,
    payload: {
      date?: string;
      start_time?: string;
      end_time?: string;
    }
  ) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await authFetch(
        WORKDAY_API_BASE + `update_work_day/${workDayId}/`,
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

  return { updateWorkDay, loading, error, success };
}
