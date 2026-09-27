<!-- pages/admin/AdminOrderDetail.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ORDER_STATUS_LABELS, OrderStatus, Order } from '../../models/order.js';
import { useAdminOrders } from '../../composables/order/useAdminOrders.js';
import HeaderAdmin from '../components/HeaderAdmin.vue';
import { Product } from '../../models/product.js';

const route = useRoute();
const router = useRouter();

const { loading, error, loadOne, updateStatus, removeOrder } = useAdminOrders();

const order = ref<Order | null>(null);
const statusSaving = ref(false);
const removing = ref(false);

const coverImage = (product: Product) => product.media[0]?.url || product.imageUrl || '';

const fetchOrder = async () => {
  const id = Number(route.params.id);
  if (Number.isNaN(id)) return;
  order.value = await loadOne(id);
};

const total = computed(() => {
  if (!order.value) return '0.00';
  return order.value.items
    .reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0)
    .toFixed(2);
});

const itemsCount = computed(() =>
  order.value ? order.value.items.reduce((sum, i) => sum + i.quantity, 0) : 0
);

const getStatusClass = (status: OrderStatus) => {
  const classes: Record<OrderStatus, string> = {
    new: 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500',
    done: 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500',
  };
  return classes[status] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const handleStatusChange = async (event: Event) => {
  if (!order.value) return;
  const newStatus = (event.target as HTMLSelectElement).value as OrderStatus;
  const prevStatus = order.value.status;
  statusSaving.value = true;
  try {
    order.value = await updateStatus(order.value.id, newStatus);
  } catch {
    order.value.status = prevStatus; // откат селекта при ошибке
  } finally {
    statusSaving.value = false;
  }
};

const handleRemove = async () => {
  if (!order.value) return;
  if (!confirm(`Удалить заказ #${order.value.id}?`)) return;
  removing.value = true;
  try {
    await removeOrder(order.value.id);
    router.push({ name: 'AdminOrders' });
  } catch {
    removing.value = false;
  }
};

onMounted(fetchOrder);
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
    <HeaderAdmin />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <button
        @click="router.push('/admin-orders')"
        class="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 transition-colors hover:text-moss"
      >
        <span aria-hidden="true">←</span> К списку заказов
      </button>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-moss mb-4"></div>
        <p class="text-sm text-slate-500">Загрузка заказа...</p>
      </div>

      <div v-if="error" class="p-4 mb-6 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-sm text-rose-700">
        <span>⚠️ {{ error }}</span>
      </div>

      <template v-if="!loading && order">
        <!-- ===== HIGHLIGHTS HEADER ===== -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm mb-6 overflow-hidden">
          <div class="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-slate-400">Заказ</p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900">#{{ order.id }}</h1>
            </div>

            <div class="flex items-center gap-3">
              <select
                :value="order.status"
                @change="handleStatusChange"
                :disabled="statusSaving"
                class="rounded-md border px-3 py-1.5 text-xs font-medium shadow-sm transition focus:outline-none focus:ring-2 disabled:opacity-50"
                :class="getStatusClass(order.status)"
              >
                <option v-for="(label, value) in ORDER_STATUS_LABELS" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
              <button
                @click="handleRemove"
                :disabled="removing"
                class="text-xs font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg transition disabled:opacity-50"
              >
                {{ removing ? 'Удаление...' : 'Удалить заказ' }}
              </button>
            </div>
          </div>

          <!-- строка ключевых полей -->
          <div class="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
            <div class="px-6 py-4">
              <p class="text-[11px] uppercase tracking-widest text-slate-400 mb-1">Клиент</p>
              <p class="text-sm font-semibold text-slate-900">{{ order.user?.username ?? '—' }}</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ order.user?.phone ?? '' }}</p>
            </div>
            <div class="px-6 py-4">
              <p class="text-[11px] uppercase tracking-widest text-slate-400 mb-1">Оплата</p>
              <p class="text-sm font-semibold text-slate-900">
                {{ order.paymentMethod === 'cash' ? '💵 Наличные' : '💳 Карта' }}
              </p>
            </div>
            <div class="px-6 py-4">
              <p class="text-[11px] uppercase tracking-widest text-slate-400 mb-1">Сумма</p>
              <p class="text-sm font-semibold text-slate-900">{{ total }} BYN</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ itemsCount }} тов.</p>
            </div>
            <div class="px-6 py-4">
              <p class="text-[11px] uppercase tracking-widest text-slate-400 mb-1">Дата</p>
              <p class="text-sm font-semibold text-slate-900">
                {{ new Date(order.createdAt).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }) }}
              </p>
            </div>
          </div>
        </div>

        <!-- ===== BODY: список товаров + сайдбар ===== -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- позиции заказа -->
          <div class="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100">
              <h2 class="text-sm font-semibold text-slate-900">Товары в заказе</h2>
            </div>
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th class="py-3 px-6">Товар</th>
                  <th class="py-3 px-6 text-center">Кол-во</th>
                  <th class="py-3 px-6 text-right">Цена</th>
                  <th class="py-3 px-6 text-right">Сумма</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="item in order.items" :key="item.id" class="hover:bg-slate-50/50">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 shrink-0 overflow-hidden rounded bg-petal-soft/40">
                          <img
                            v-if="coverImage(item.product)"
                            :src="coverImage(item.product)"
                            :alt="item.product.name"
                            class="h-full w-full object-cover"
                          />
                      </div>
                      <span class="font-medium text-slate-900">{{ item.product.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <span class="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">{{ item.quantity }}</span>
                  </td>
                  <td class="py-4 px-6 text-right text-slate-600">{{ item.priceAtOrder }} BYN</td>
                  <td class="py-4 px-6 text-right font-semibold text-slate-900">
                    {{ (item.priceAtOrder * item.quantity).toFixed(2) }} BYN
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="border-t border-slate-100 bg-slate-50/70">
                  <td colspan="3" class="py-3 px-6 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Итого
                  </td>
                  <td class="py-3 px-6 text-right font-bold text-slate-900">{{ total }} BYN</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- сайдбар: комментарий -->
          <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6 h-fit">
            <div>
              <h2 class="text-sm font-semibold text-slate-900 mb-2">Комментарий клиента</h2>
              <p v-if="order.comment" class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {{ order.comment }}
              </p>
              <p v-else class="text-sm text-slate-400 italic">Комментария нет</p>
            </div>

            <div class="border-t border-slate-100 pt-4">
              <h2 class="text-sm font-semibold text-slate-900 mb-2">Контакты клиента</h2>
              <dl class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <dt class="text-slate-500">Логин</dt>
                  <dd class="font-medium text-slate-900">{{ order.user?.username ?? '—' }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-slate-500">Телефон</dt>
                  <dd class="font-medium text-slate-900">{{ order.user?.phone ?? '—' }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>