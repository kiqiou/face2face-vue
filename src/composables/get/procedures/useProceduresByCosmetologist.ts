import { ref } from 'vue';
import { apiGet } from '../apiGet.js';
import { API_BASE } from '../baseApi.js';
import { Procedure } from '../../../models/procedure.js';

export function useProceduresByCosmetologist() {
  const procedures = ref<Procedure[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadProceduresByCosmetologist = async (cosmetologistId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(
        `${API_BASE}get_procedures_by_cosmetologist/${cosmetologistId}/`
      );

      procedures.value = data.map(
        (item: any) =>
          new Procedure(
            item.id,
            item.name,
            item.price,
            item.duration,
            item.description,
            item.cosmetologist
          )
      );
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { procedures, loading, error, loadProceduresByCosmetologist };
}
