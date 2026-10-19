import { ref } from 'vue';
import { authService } from '../../utils/auth.js';
import { BASE_API } from '../baseApi.js';

export function useUpdateUserName() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const updateName = async (newName: string) => {
    loading.value = true;
    error.value = null;

    try {
      const token = authService.getAccessToken(); // поправьте под реальный метод authService

      const response = await fetch(`${BASE_API}api/users/update-name/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newName }),
      });

      const data = await response.json();

      if (!response.ok) {
        error.value = data.error || 'Не удалось изменить имя';
        return null;
      }

      authService.updateUser(data.user); // поправьте под реальный метод, если он так называется
      return data.user;
    } catch (e) {
      error.value = 'Ошибка сети';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { updateName, loading, error };
}