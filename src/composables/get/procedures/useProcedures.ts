import { ref } from 'vue';
import { Procedure } from '../../../models/procedure.js';
import { apiGet } from '../apiGet.js';
import { API_BASE } from '../baseApi.js';
import { Cosmetologist } from '../../../models/cosmetologist.js';
import { User } from '../../../models/user.js';
import { Category } from '../../../models/category.js';

export function useProcedures() {
  const procedures = ref<Procedure[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(API_BASE + 'get_procedures/');

      procedures.value = data.map((item: any) => {
        const cosmetolog = item.cosmetologist;

        const cosmetologist = new Cosmetologist(
          cosmetolog.id,
          new User(
            cosmetolog.user.id,
            cosmetolog.user.username,
            cosmetolog.user.phone,
            cosmetolog.user.role
          ),
          cosmetolog.bio,
          cosmetolog.specializations,
          cosmetolog.avatar_url
        );

        const category = new Category(item.category.id, item.category.name);

        return new Procedure(
          item.id,
          item.name,
          item.price,
          item.duration,
          item.description,
          item.isSale,
          category,
          cosmetologist
        );
      });
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    procedures,
    loading,
    error,
    load,
  };
}
