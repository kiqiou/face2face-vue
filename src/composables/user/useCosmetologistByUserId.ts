import { ref } from 'vue';
import { apiGet } from '../../utils/apiGet.js';
import { API_BASE } from './cosmetologistBaseApi.js';
import { Cosmetologist } from '../../models/cosmetologist.js';

export function useCosmetologistByUserId() {
  const cosmetologist = ref<Cosmetologist>();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadCosmetologistByUserId = async (userId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(
        API_BASE + `get_cosmetologist_by_user_id/${userId}`
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
    loadCosmetologistByUserId,
  };
}
