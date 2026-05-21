import { ref } from 'vue';
import { API_BASE } from './procedureBaseApi.js';
import { authFetch } from '../../authFetch.js';

export function useUpdateProcedure() {
  const loading = ref(false);
  const errorUpdate = ref<string | null>(null);
  const successUpdate = ref(false);

  const updateProcedure = async (
    procedureId: number,
    payload: {
      name?: string;
      price?: number;
      duration?: string;
      description?: string;
    }
  ) => {
    loading.value = true;
    errorUpdate.value = null;
    successUpdate.value = false;

    try {
      const response = await authFetch(
        API_BASE + `update_procedure/${procedureId}/`,
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

      successUpdate.value = true;
      return data;
    } catch (err: any) {
      errorUpdate.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { updateProcedure, loading, errorUpdate, successUpdate };
}
