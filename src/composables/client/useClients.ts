// composables/admin/useClients.ts
import { ref } from 'vue';
import { authService } from '../../utils/auth.js';
import { Client } from '../../models/client.js';
import { CLIENT_API_BASE } from './clientBaseApi.js';
import { mapClient } from '../../utils/mapClient.js';
import { authFetch } from '../../utils/authFetch.js';

export function useClients() {
  const clients = ref<Client[]>([]);
  const loading = ref(false);

  const error = ref<string | null>(null);

const loadClients = async (search = '') => {
  loading.value = true;
  error.value = null;
  try {
    const res = await authFetch(CLIENT_API_BASE + `clients/?search=${encodeURIComponent(search)}`, {
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ошибка ${res.status}: ${text}`);
    }

    const data = await res.json();
    clients.value = data.map(mapClient);
  } catch (e) {
    console.error('loadClients failed:', e);
    error.value = e instanceof Error ? e.message : 'Не удалось загрузить клиентов';
  } finally {
    loading.value = false;
  }
};

  const setDiscount = async (userId: number, value: number | null) => {
    const res = await authFetch(CLIENT_API_BASE + `clients/${userId}/discount/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manual_discount_percent: value }),
    });
    if (!res.ok) throw new Error('Не удалось сохранить скидку');

    const updated = await res.json();
    const client = clients.value.find((c) => c.id === userId);
    if (client) {
      client.manualDiscountPercent = updated.manual_discount_percent;
      client.currentDiscountPercent = updated.current_discount_percent;
    }
  };

  return { clients, loading, loadClients, setDiscount };
}