import { ref } from 'vue';
import { SkinType } from '../../../models/skinType.js';
import { API_BASE } from '../productBaseApi.js';
import { authDelete, authPatchJson, authPostJson } from '../../../utils/apiAuthHelpers.js';
import { apiGet } from '../../../utils/apiGet.js';

export function useSkinTypes() {
  const skinTypes = ref<SkinType[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(API_BASE + 'get_skin_types/');
      skinTypes.value = data.map((item: any) => new SkinType(item.id, item.name, item.description));
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const add = async (name: string, description: string = '') => {
    error.value = null;
    try {
      const data = await authPostJson(API_BASE + 'add_skin_type/', { name, description });
      const skinType = new SkinType(data.id, data.name, data.description);
      skinTypes.value.push(skinType);
      return skinType;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  
  const update = async (id: number, name: string, description: string = '') => {
    error.value = null;
    try {
      const data = await authPatchJson(API_BASE + `update_skin_type/${id}/`, { name, description });
      const updated = new SkinType(data.id, data.name, data.description);
      const index = skinTypes.value.findIndex((s: SkinType) => s.id === id);
      if (index !== -1) skinTypes.value[index] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const remove = async (id: number) => {
    error.value = null;
    try {
      await authDelete(API_BASE + `delete_skin_type/${id}/`);
      skinTypes.value = skinTypes.value.filter((s: SkinType) => s.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  return { skinTypes, loading, error, load, add, update, remove };
}