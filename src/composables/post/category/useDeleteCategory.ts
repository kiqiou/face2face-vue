import { ref } from 'vue';
import { API_BASE } from './categoryBaseApi.js';
import { authFetch } from '../../authFetch.js';

export function useDeleteCategory() {
  const loading = ref(false);
  const errorDelete = ref<string | null>(null);
  const successDelete = ref(false);

  const deleteCategory = async (categoryId: number) => {
    loading.value = true;
    errorDelete.value = null;
    successDelete.value = false;

    try {
      const response = await authFetch(
        API_BASE + `delete_category/${categoryId}/`,
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

  return { deleteCategory, loading, errorDelete, successDelete };
}
