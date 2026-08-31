<!-- pages/admin/AdminOrders.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ORDER_STATUS_LABELS, OrderStatus } from '../../models/order.js';
import { useAdminOrders } from '../../composables/order/useAdminOrders.js';
import HeaderAdmin from '../components/HeaderAdmin.vue';

const { orders, loading, error, load, updateStatus, removeOrder } = useAdminOrders();

const statusFilter = ref<OrderStatus | ''>('');

const applyFilter = () => {
  load(statusFilter.value || undefined);
};

const handleStatusChange = async (orderId: number, event: Event) => {
  const newStatus = (event.target as HTMLSelectElement).value as OrderStatus;
  await updateStatus(orderId, newStatus);
};

onMounted(() => load());
</script>

<template>
  <div>
    <HeaderAdmin />
    <h2>Заказы</h2>

    <label>
      Фильтр по статусу:
      <select v-model="statusFilter" @change="applyFilter">
        <option value="">Все</option>
        <option v-for="(label, value) in ORDER_STATUS_LABELS" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </label>

    <p v-if="loading">Загрузка...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="!loading && orders.length">
      <thead>
        <tr>
          <th>№</th>
          <th>Имя</th>
          <th>Телефон</th>
          <th>Оплата</th>
          <th>Товары</th>
          <th>Сумма</th>
          <th>Статус</th>
          <th>Дата</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.name }}</td>
          <td>{{ order.phone }}</td>
          <td>{{ order.paymentMethod === 'cash' ? 'Наличные' : 'Карта' }}</td>
          <td>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.product.name }} × {{ item.quantity }} ({{ item.priceAtOrder }} BYN)
              </li>
            </ul>
          </td>
          <td>
            {{ order.items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0) }} BYN
          </td>
          <td>
            <select :value="order.status" @change="handleStatusChange(order.id, $event)">
              <option v-for="(label, value) in ORDER_STATUS_LABELS" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </td>
          <td>{{ new Date(order.createdAt).toLocaleString('ru-RU') }}</td>
          <td><button @click="removeOrder(order.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!loading">Заказов нет.</p>
  </div>
</template>