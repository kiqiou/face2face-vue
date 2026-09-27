import { ref } from 'vue';
import { Manufacturer } from '../../../models/manufacturer.js';
import { API_BASE } from '../productBaseApi.js';
import { authPostJson, authPatchJson, authDelete } from '../../../utils/apiAuthHelpers.js';
import { apiGet } from '../../../utils/apiGet.js';

export function useManufacturers() {
  const manufacturers = ref<Manufacturer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await apiGet(API_BASE + 'get_manufacturers/');
      manufacturers.value = data.map((item: any) => new Manufacturer(item.id, item.name));
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const add = async (name: string, address: string, country: string) => {
    error.value = null;
    try {
      const data = await authPostJson(API_BASE + 'add_manufacturer/', { name, address, country });
      const manufacturer = new Manufacturer(data.id, data.name, data.address, data.country);
      manufacturers.value.push(manufacturer);
      return manufacturer;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const update = async (id: number, name: string, address: string, country: string) => {
    error.value = null;
    try {
      const data = await authPatchJson(API_BASE + `update_manufacturer/${id}/`, { name, address, country });
      const updated = new Manufacturer(data.id, data.name, data.address, data.country);
      const index = manufacturers.value.findIndex((m: Manufacturer) => m.id === id);
      if (index !== -1) manufacturers.value[index] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const remove = async (id: number) => {
    error.value = null;
    try {
      await authDelete(API_BASE + `delete_manufacturer/${id}/`);
      manufacturers.value = manufacturers.value.filter((m: Manufacturer) => m.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  return { manufacturers, loading, error, load, add, update, remove };
}