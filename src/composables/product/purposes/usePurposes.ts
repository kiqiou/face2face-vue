import { ref } from 'vue';
import { ProductPurpose } from '../../../models/productPurpose.js';
import { API_BASE } from '../productBaseApi.js';
import { authDelete, authPatchJson, authPostJson } from '../../../utils/apiAuthHelpers.js';
import { apiGet } from '../../../utils/apiGet.js';

export function usePurposes() {
  const purposes = ref<ProductPurpose[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(API_BASE + 'get_purposes/');
      purposes.value = data.map((item: any) => new ProductPurpose(item.id, item.name));
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const add = async (name: string) => {
    error.value = null;
    try {
      const data = await authPostJson(API_BASE + 'add_purpose/', { name });
      const purpose = new ProductPurpose(data.id, data.name);
      purposes.value.push(purpose);
      return purpose;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

const update = async (id: number, name: string ) => {
    error.value = null;
    try {
      const data = await authPatchJson(API_BASE + `update_purpose/${id}/`, { name });
      const updated = new ProductPurpose(data.id, data.name);
      const index = purposes.value.findIndex((p: ProductPurpose) => p.id === id);
      if (index !== -1) purposes.value[index] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const remove = async (id: number) => {
    error.value = null;
    try {
      await authDelete(API_BASE + `delete_purpose/${id}/`);
      purposes.value = purposes.value.filter((p: ProductPurpose) => p.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  return { purposes, loading, error, load, add, update, remove };
}