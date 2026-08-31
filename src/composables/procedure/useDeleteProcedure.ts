import { ref } from 'vue';
import { API_BASE } from './procedureBaseApi.js';
import { authFetch } from '../../utils/authFetch.js';

export function useDeleteProcedure() {
  const loading = ref(false);
  const errorDelete = ref<string | null>(null);
  const successDelete = ref(false);

  const deleteProcedure = async (procedureId: number) => {
    loading.value = true;
    errorDelete.value = null;
    successDelete.value = false;

    try {
      const response = await authFetch(
        API_BASE + `delete_procedure/${procedureId}/`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка удаления');
      }

      successDelete.value = true;
    } catch (err: any) {
      errorDelete.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { deleteProcedure, loading, errorDelete, successDelete };
}
