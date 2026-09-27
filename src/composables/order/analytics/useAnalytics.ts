import { ref } from 'vue';
import { authFetch } from '../../../utils/authFetch.js';
import { API_BASE } from '../orderBaseApi.js';

interface DailyStat {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
}

interface TopProduct {
  id: number;
  name: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
}

interface StatusCount {
  status: string;
  count: number;
}

interface AnalyticsData {
  summary: {
    revenue: number;
    cost: number;
    profit: number;
    margin_percent: number;
    orders_count: number;
    items_sold: number;
    avg_order_value: number;
  };
  daily: DailyStat[];
  top_products: TopProduct[];
  status_breakdown: StatusCount[];
}

interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  excludeCancelled?: boolean;
}

export function useAnalytics() {
  const data = ref<AnalyticsData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async (filters: AnalyticsFilters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.set('date_from', filters.dateFrom);
      if (filters.dateTo) params.set('date_to', filters.dateTo);
      if (filters.excludeCancelled !== undefined) {
        params.set('exclude_cancelled', String(filters.excludeCancelled));
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      
      // 1. Получаем сырой Response от твоего authFetch
      const response = await authFetch(API_BASE + 'analytics/' + query);

      // 2. Проверяем, успешный ли статус (200-299), так как authFetch не кидает ошибку на 4xx/5xx
      if (!response.ok) {
        // Пробуем достать текст ошибки из бэкенда, если он там есть
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message ?? `Ошибка сервера: ${response.status}`);
      }

      // 3. Парсим JSON и приводим к нужному интерфейсу AnalyticsData
      data.value = await response.json() as AnalyticsData;
      
    } catch (err: any) {
      error.value = err.message ?? 'Не удалось загрузить аналитику';
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, error, load };
}
