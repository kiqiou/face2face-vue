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
  return Math.max(...data.value.daily.map((d) => Math.max(d.revenue, 0)), 1);
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
  <div class="min-h-screen bg-paper px-4 font-body text-ink">
     <HeaderAdmin />
    <div class="mx-auto max-w-6xl">

      <div class="mb-8">
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
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Без скидок было бы</p>
            <p class="font-display text-2xl text-ink-muted">{{ formatMoney(data.summary.gross_revenue) }} BYN</p>
          </div>

          <div class="border border-line bg-white p-5">
            <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Отдано скидками</p>
            <p class="font-display text-2xl text-clay">−{{ formatMoney(data.summary.total_discount) }} BYN</p>
            <p v-if="data.summary.gross_revenue" class="mt-1 text-xs text-ink-muted">
              {{ ((data.summary.total_discount / data.summary.gross_revenue) * 100).toFixed(1) }}% от валовой выручки
            </p>
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

        <!-- Топ товаров -->
        <div v-if="data.top_products.length" class="mb-10">
          <h2 class="mb-4 text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            Топ товаров по выручке
          </h2>

          <!-- Мобильные карточки -->
          <div class="space-y-3 md:hidden">
            <div
              v-for="p in data.top_products"
              :key="p.id"
              class="rounded-xl border border-line bg-white p-4"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <h3 class="break-words text-sm font-medium text-ink">
                  {{ p.name }}
                </h3>

                <div class="shrink-0 text-right">
                  <p class="text-[10px] uppercase tracking-wider text-ink-muted">
                    Прибыль
                  </p>
                  <p class="text-sm font-semibold text-moss">
                    {{ formatMoney(p.profit) }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 rounded-lg bg-petal-soft/30 p-3 text-center">
                <div>
                  <p class="text-[10px] uppercase tracking-wider text-ink-muted">Кол-во</p>
                  <p class="mt-0.5 text-sm text-ink">{{ p.quantity }}</p>
                </div>

                <div>
                  <p class="text-[10px] uppercase tracking-wider text-ink-muted">Выручка</p>
                  <p class="mt-0.5 text-sm text-ink">{{ formatMoney(p.revenue) }}</p>
                </div>

                <div>
                  <p class="text-[10px] uppercase tracking-wider text-ink-muted">Себест.</p>
                  <p class="mt-0.5 text-sm text-ink-muted">{{ formatMoney(p.cost) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Таблица для планшета и десктопа -->
          <div class="hidden overflow-x-auto md:block">
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
                  <td class="break-words py-2 pr-4 text-ink">{{ p.name }}</td>
                  <td class="py-2 pr-4 text-right text-ink-muted">{{ p.quantity }}</td>
                  <td class="py-2 pr-4 text-right text-ink">{{ formatMoney(p.revenue) }}</td>
                  <td class="py-2 pr-4 text-right text-ink-muted">{{ formatMoney(p.cost) }}</td>
                  <td class="py-2 text-right font-medium text-moss">{{ formatMoney(p.profit) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>