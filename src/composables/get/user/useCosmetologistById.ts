import { ref } from 'vue';
import { Cosmetologist } from '../../../models/cosmetologist.js';
import { apiGet } from '../apiGet.js';
import { API_BASE } from '../baseApi.js';

export function useCosmetologistById() {
  const cosmetologist = ref<Cosmetologist>();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadCosmetologistById = async (cosmetologistId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(
        API_BASE + `get_cosmetologist_by_id/${cosmetologistId}`
      );

      cosmetologist.value = new Cosmetologist(
        data.id,
        data.user,
        data.bio,
        data.specialization,
        data.avatar_url
      );
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    cosmetologist,
    loading,
    error,
    loadCosmetologistById,
  };
}
