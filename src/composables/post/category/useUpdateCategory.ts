import { ref } from 'vue';
import { API_BASE } from './categoryBaseApi.js';
import { authFetch } from '../../authFetch.js';

export function useUpdateCategory() {
  const loading = ref(false);
  const errorUpdate = ref<string | null>(null);
  const successUpdate = ref(false);

  const updateCategory = async (
    categoryId: number,
    payload: {
      name?: string;
    }
  ) => {
    loading.value = true;
    errorUpdate.value = null;
    successUpdate.value = false;

    try {
      const response = await authFetch(
        API_BASE + `update_category/${categoryId}/`,
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

  return { updateCategory, loading, errorUpdate, successUpdate };
}
