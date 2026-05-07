import { ref } from 'vue';
import { API_BASE } from './procedureBaseApi.js';
import { authFetch } from '../../authFetch.js';

export function useCreateProcedure() {
  const loading = ref(false);
  const errorCreate = ref<string | null>(null);
  const successCreate = ref(false);

  const createProcedure = async (
    name: string,
    price: number,
    duration: string
  ) => {
    loading.value = true;
    errorCreate.value = null;
    successCreate.value = false;

    try {
      const response = await authFetch(API_BASE + 'add_procedure/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price,
          duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания');
      }

      successCreate.value = true;
      return data.id;
    } catch (err: any) {
      errorCreate.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { createProcedure, loading, errorCreate, successCreate };
}
