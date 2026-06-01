import { ref } from 'vue';
import { Procedure } from '../../../models/procedure.js';
import { apiGet } from '../apiGet.js';
import { API_BASE } from '../baseApi.js';
import { Cosmetologist } from '../../../models/cosmetologist.js';
import { User } from '../../../models/user.js';
import { Category } from '../../../models/category.js';

export function useCategories() {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(API_BASE + 'get_categories/');

      categories.value = data.map((item: any) => {
        return new Category(item.id, item.name);
      });
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    loading,
    error,
    loadCategories,
  };
}
