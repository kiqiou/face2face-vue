import { ref } from 'vue';
import { Collection } from '../../../models/collection.js';
import { API_BASE } from '../productBaseApi.js';
import { apiGet } from '../../../utils/apiGet.js';
import { authDelete, authPatchJson, authPostJson } from '../../../utils/apiAuthHelpers.js';

export function useCollections() {
  const collections = ref<Collection[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(API_BASE + 'get_collections/');
      collections.value = data.map((item: any) => new Collection(item.id, item.name, item.is_active));
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const add = async (name: string) => {
    error.value = null;
    try {
      const data = await authPostJson(API_BASE + 'add_collection/', { name });
      const collection = new Collection(data.id, data.name, data.is_active);
      collections.value.push(collection);
      return collection;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

const update = async (id: number, name: string, isActive: boolean) => {
    error.value = null;
    try {
      const data = await authPatchJson(API_BASE + `update_collection/${id}/`, { name, is_active: isActive });
      const updated = new Collection(data.id, data.name, data.is_active);
      const index = collections.value.findIndex((c: Collection) => c.id === id);
      if (index !== -1) collections.value[index] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const remove = async (id: number) => {
    error.value = null;
    try {
      await authDelete(API_BASE + `delete_collection/${id}/`);
      collections.value = collections.value.filter((c: Collection) => c.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  return { collections, loading, error, load, add, update, remove };
}