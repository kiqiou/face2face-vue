<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue';
import HeaderAdmin from '../../admin/components/HeaderAdmin.vue';
import { useAnalytics } from '../../composables/order/analytics/useAnalytics.js';

const { data, loading, error, load } = useAnalytics();

const filters = reactive({
  dateFrom: '',
  dateTo: '',
  excludeCancelled: true,
});

const applyFilters = () => {
  load({
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
    excludeCancelled: filters.excludeCancelled,
  });
};

const resetFilters = () => {
  filters.dateFrom = '';
  filters.dateTo = '';
  filters.excludeCancelled = true;
  load();
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const maxDailyRevenue = computed(() => {
  if (!data.value?.daily.length) return 0;
  return Math.max(...data.value.daily.map((d) => d.revenue), 1);
});

const statusLabels: Record<string, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  done: 'Выполнен',
  cancelled: 'Отменён',
};

onMounted(() => {
  load();
});
</script>

<template>
  <div class="min-h-screen bg-paper px-4 py-10 font-body text-ink">
    <div class="mx-auto max-w-6xl">
      <HeaderAdmin />

      <div class="mb-8">
        <p class="mb-2 text-xs uppercase tracking-[0.2em] text-ink-muted">Админка</p>
        <h1 class="font-display text-3xl font-medium text-ink">Аналитика продаж</h1>
      </div>

      <!-- Фильтры -->
      <form @submit.prevent="applyFilters" class="mb-10 flex flex-wrap items-end gap-4 border border-line bg-white p-4">
        <div>
          <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">С даты</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="border border-line px-3 py-2 text-sm focus:border-moss focus:outline-none"
          />
        </div>
        <div>
          <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">По дату</label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="border border-line px-3 py-2 text-sm focus:border-moss focus:outline-none"
          />
        </div>
        <label class="flex items-center gap-2 pb-2 text-sm text-ink">
          <input type="checkbox" v-model="filters.excludeCancelled" class="h-4 w-4 border-line text-moss" />
          Не учитывать отменённые
        </label>
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-moss px-5 py-2 text-sm font-medium uppercase tracking-wide text-black/70 hover:bg-moss-dark"
          >
            Применить
          </button>
          <button type="button" @click="resetFilters" class="px-4 py-2 text-sm text-ink-muted hover:text-ink">
            Сбросить
          </button>
        </div>
      </form>

      <p v-if="loading" class="text-sm text-ink-muted">Загрузка...</p>
      <p v-if="error" class="text-sm text-clay">{{ error }}</p>

      <template v-if="data">
        <!-- Сводка -->
        <div class="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div class="border border-line bg-white p-5">
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Выручка</p>
            <p class="font-display text-2xl text-ink">{{ formatMoney(data.summary.revenue) }} BYN</p>
          </div>
          <div class="border border-line bg-white p-5">
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Себестоимость</p>
            <p class="font-display text-2xl text-ink">{{ formatMoney(data.summary.cost) }} BYN</p>
          </div>
          <div class="border border-line bg-white p-5">
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Прибыль</p>
            <p class="font-display text-2xl text-moss">{{ formatMoney(data.summary.profit) }} BYN</p>
          </div>
          <div class="border border-line bg-white p-5">
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Маржа</p>
            <p class="font-display text-2xl text-ink">{{ data.summary.margin_percent }}%</p>
          </div>
          <div class="border border-line bg-white p-5">
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Заказов</p>
            <p class="font-display text-2xl text-ink">{{ data.summary.orders_count }}</p>
          </div>
          <div class="border border-line bg-white p-5">
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Товаров продано</p>
            <p class="font-display text-2xl text-ink">{{ data.summary.items_sold }}</p>
          </div>
          <div class="border border-line bg-white p-5">
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Средний чек</p>
            <p class="font-display text-2xl text-ink">{{ formatMoney(data.summary.avg_order_value) }} BYN</p>
          </div>
        </div>

        <!-- Выручка по дням -->
        <div v-if="data.daily.length" class="mb-10">
          <h2 class="mb-4 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Выручка по дням</h2>
          <div class="flex items-end gap-1 border border-line bg-white p-4" style="height: 180px">
            <div
              v-for="day in data.daily"
              :key="day.date"
              class="group relative flex-1"
              :style="{ height: `${(day.revenue / maxDailyRevenue) * 100}%` }"
            >
              <div class="h-full w-full rounded-t bg-moss/70 transition-colors group-hover:bg-moss"></div>
              <div
                class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                {{ day.date }}: {{ formatMoney(day.revenue) }} BYN
              </div>
            </div>
          </div>
        </div>

        <!-- Топ товаров -->
        <div v-if="data.top_products.length" class="mb-10">
          <h2 class="mb-4 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Топ товаров по выручке</h2>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="border-b border-line text-left text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                <th class="py-2 pr-4">Товар</th>
                <th class="py-2 pr-4 text-right">Кол-во</th>
                <th class="py-2 pr-4 text-right">Выручка</th>
                <th class="py-2 pr-4 text-right">Себестоимость</th>
                <th class="py-2 text-right">Прибыль</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in data.top_products" :key="p.id" class="border-b border-line">
                <td class="py-2 pr-4 text-ink">{{ p.name }}</td>
                <td class="py-2 pr-4 text-right text-ink-muted">{{ p.quantity }}</td>
                <td class="py-2 pr-4 text-right text-ink">{{ formatMoney(p.revenue) }}</td>
                <td class="py-2 pr-4 text-right text-ink-muted">{{ formatMoney(p.cost) }}</td>
                <td class="py-2 text-right font-medium text-moss">{{ formatMoney(p.profit) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Заказы по статусам -->
        <div v-if="data.status_breakdown.length">
          <h2 class="mb-4 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Заказы по статусам</h2>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="s in data.status_breakdown"
              :key="s.status"
              class="rounded-full border border-line px-4 py-1.5 text-sm text-ink"
            >
              {{ statusLabels[s.status] ?? s.status }}: <span class="font-semibold">{{ s.count }}</span>
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>