import { ref } from 'vue';
import { API_BASE } from './cosmetologistBaseApi.js';
import { Cosmetologist } from '../../models/cosmetologist.js';
import { apiGet } from '../../utils/apiGet.js';

export function useCosmetologists() {
  const cosmetologists = ref<Cosmetologist[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadCosmetologists = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(API_BASE + 'get_cosmetologists/');

      cosmetologists.value = data.map(
        (item: any) =>
          new Cosmetologist(
            item.id,
            item.user,
            item.bio,
            item.specialization,
            item.avatar_url
          )
      );
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    cosmetologists,
    loading,
    error,
    loadCosmetologists,
  };
}
