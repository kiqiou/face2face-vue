<!-- pages/admin/AdminOrders.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ORDER_STATUS_LABELS, OrderStatus } from '../../models/order.js';
import { useAdminOrders } from '../../composables/order/useAdminOrders.js';
import HeaderAdmin from '../components/HeaderAdmin.vue';
import { useRouter } from 'vue-router';

const { orders, loading, error, load, updateStatus, removeOrder } = useAdminOrders();
const statusFilter = ref<OrderStatus | ''>('');

const router = useRouter();

const applyFilter = () => {
  load(statusFilter.value || undefined);
};

const handleStatusChange = async (orderId: number, event: Event) => {
  const newStatus = (event.target as HTMLSelectElement).value as OrderStatus;
  await updateStatus(orderId, newStatus);
};

const getStatusClass = (status: OrderStatus) => {
  const classes: Record<OrderStatus, string> = {
    new: 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500',
    done: 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500',
  };
  return classes[status] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const calculateTotal = (items: any[]) => {
  return items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0).toFixed(2);
};

const openOrderDetails = (orderId: number) => {
  router.push(`/admin/orders/${orderId}`);
};

onMounted(() => load());
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
    <HeaderAdmin />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <!-- Заголовок и фильтры -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Заказы</h2>
          <p class="mt-1 text-sm text-slate-500">Управление заказами и изменение статусов</p>
        </div>

        <div class="flex items-center gap-3">
          <label for="status-filter" class="text-sm font-medium text-slate-600 shrink-0">
            Фильтр:
          </label>
          <select 
            id="status-filter" 
            v-model="statusFilter" 
            @change="applyFilter"
            class="block w-full sm:w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
          >
            <option value="">Все статусы</option>
            <option v-for="(label, value) in ORDER_STATUS_LABELS" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Состояния загрузки и ошибок -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-moss mb-4"></div>
        <p class="text-sm text-slate-500">Загрузка списка заказов...</p>
      </div>

      <div v-if="error" class="p-4 mb-6 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-sm text-rose-700">
        <span>⚠️ {{ error }}</span>
      </div>

      <!-- Главная таблица -->
      <div v-if="!loading && orders.length" class="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th class="py-4 px-6 w-16">№</th>
              <th class="py-4 px-6">Клиент</th>
              <th class="py-4 px-6">Оплата</th>
              <th class="py-4 px-6">Товары</th>
              <th class="py-4 px-6">Сумма</th>
              <th class="py-4 px-6">Статус</th>
              <th class="py-4 px-6">Дата</th>
              <th class="py-4 px-6 text-right">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="py-4 px-6 font-medium text-slate-400">#{{ order.id }}</td>
              
              <td class="py-4 px-6">
                <div class="font-semibold text-slate-900">{{ order.user.username }}</div>
                <div class="text-xs text-slate-500 mt-0.5">{{ order.user.phone }}</div>
              </td>
            
              <td class="py-4 px-6">
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                  {{ order.paymentMethod === 'cash' ? '💵 Наличные' : '💳 Карта' }}
                </span>
              </td>

              <td class="py-4 px-6 max-w-xs">
                <ul class="space-y-1 text-xs text-slate-600">
                  <li v-for="item in order.items" :key="item.id" class="line-clamp-2">
                    <span class="font-medium text-slate-900">{{ item.product.name }}</span> 
                    <span class="text-slate-400 mx-1">×</span> 
                    <span class="bg-slate-100 px-1.5 py-0.2 rounded font-mono">{{ item.quantity }}</span> 
                    <span class="text-slate-400 ml-1">({{ item.priceAtOrder }} BYN)</span>
                  </li>
                </ul>
              </td>
              
              <td class="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                {{ calculateTotal(order.items) }} BYN
              </td>
              
              <td class="py-4 px-6">
                <select 
                  :value="order.status" 
                  @change="handleStatusChange(order.id, $event)"
                  class="block w-full rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm transition focus:outline-none focus:ring-2"
                  :class="getStatusClass(order.status)"
                >
                  <option v-for="(label, value) in ORDER_STATUS_LABELS" :key="value" :value="value">
                    {{ label }}
                  </option>
                </select>
              </td>
              
              <td class="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                {{ new Date(order.createdAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) }}
              </td>
              
              <td class="py-4 px-6 text-right whitespace-nowrap">
                <button 
                  @click="removeOrder(order.id)"
                  class="text-xs font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition duration-150 ease-in-out"

                >
                  Удалить
                </button>
                <button 
                  @click="openOrderDetails(order.id)"
                  class="ml-2 text-xs font-medium text-moss-600 hover:text-moss-800 bg-moss-50 hover:bg-moss-100 px-2.5 py-1.5 rounded-lg transition duration-150 ease-in-out" 
                 >
                  Подробнее
                  </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loading" class="text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm">
        <span class="text-3xl">📦</span>
        <h3 class="mt-4 text-sm font-semibold text-slate-900">Заказов пока нет</h3>
        <p class="mt-1 text-sm text-slate-500">В этой категории или фильтре нет ни одной записи.</p>
      </div>
    </div>
  </div>
</template>
