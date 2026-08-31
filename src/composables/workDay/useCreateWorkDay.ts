import { ref } from 'vue';
import { WORKDAY_API_BASE } from '../workDay/workDayBaseApi.js';
import { authFetch } from '../../utils/authFetch.js';

export function useCreateWorkDay() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  const create = async (date: string, startTime: string, endTime: string) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await authFetch(WORKDAY_API_BASE + 'create_work_day/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания');
      }

      success.value = true;
      return data.id;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { create, loading, error, success };
}
