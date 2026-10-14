<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useClients } from '../../composables/client/useClients.js';
import HeaderAdmin from '../components/HeaderAdmin.vue';

const { clients, loading, loadClients, setDiscount } = useClients();
const toast = useToast();

const search = ref('');
const editingId = ref<number | null>(null);
const editValue = ref<number | null>(null);

onMounted(() => loadClients());

let searchTimer: ReturnType<typeof setTimeout>;
const onSearchInput = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadClients(search.value), 400);
};

const startEdit = (client: (typeof clients.value)[number]) => {
  editingId.value = client.id;
  editValue.value = client.manualDiscountPercent;
};

const saveDiscount = async (userId: number) => {
  try {
    await setDiscount(userId, editValue.value);
    toast.success('Скидка сохранена');
    editingId.value = null;
  } catch {
    toast.error('Не удалось сохранить скидку');
  }
};

const resetDiscount = async (userId: number) => {
  try {
    await setDiscount(userId, null);
    toast.success('Скидка сброшена на автоматическую');
    editingId.value = null;
  } catch {
    toast.error('Не удалось сбросить скидку');
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 px-6">
    <HeaderAdmin />

    <div class="flex items-center justify-between w-full max-w-5xl mx-auto">
      <h1 class="text-2xl font-black text-slate-800">Клиенты</h1>
      <input
        v-model="search"
        @input="onSearchInput"
        type="text"
        placeholder="Поиск по имени или телефону"
        class="rounded-xl border border-black/10 px-4 py-2 w-72 outline-none focus:border-[#E5A663]"
      />
    </div>

    <div v-if="loading" class="text-center py-10 text-black/50">Загружаем клиентов...</div>

    <div v-else class="bg-white rounded-2xl overflow-hidden border border-black/5 max-w-5xl mx-auto w-full">
      <table class="w-full text-sm">
        <thead class="bg-black/[0.03] text-black/50">
          <tr>
            <th class="text-left px-4 py-3">Имя</th>
            <th class="text-left px-4 py-3">Телефон</th>
            <th class="text-right px-4 py-3">Заказов</th>
            <th class="text-right px-4 py-3">Сумма покупок</th>
            <th class="text-right px-4 py-3">Скидка</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id" class="border-t border-black/5">
            <td class="px-4 py-3 font-medium">{{ client.username }}</td>
            <td class="px-4 py-3 text-black/60">{{ client.phone }}</td>
            <td class="px-4 py-3 text-right">{{ client.ordersCount }}</td>
            <td class="px-4 py-3 text-right font-semibold">{{ client.totalSpent }} BYN</td>

            <td class="px-4 py-3 text-right">
              <div v-if="editingId === client.id" class="flex items-center justify-end gap-2">
                <input
                  v-model.number="editValue"
                  type="number"
                  min="0"
                  max="100"
                  class="w-16 rounded-lg border border-black/10 px-2 py-1 text-right"
                />
                <span>%</span>
              </div>
              <div v-else class="flex items-center justify-end gap-1">
                <span :class="client.manualDiscountPercent !== null ? 'text-[#E5A663] font-semibold' : 'text-black/70'">
                  {{ client.currentDiscountPercent }}%
                </span>
                <span v-if="client.manualDiscountPercent !== null" class="text-xs text-black/40">(вручную)</span>
              </div>
            </td>

            <td class="px-4 py-3 text-right whitespace-nowrap">
              <template v-if="editingId === client.id">
                <button class="text-emerald-600 font-semibold text-sm mr-3" @click="saveDiscount(client.id)">
                  Сохранить
                </button>
                <button class="text-black/40 text-sm" @click="editingId = null">Отмена</button>
              </template>
              <template v-else>
                <button class="text-[#E5A663] font-semibold text-sm mr-3" @click="startEdit(client)">
                  Изменить
                </button>
                <button
                  v-if="client.manualDiscountPercent !== null"
                  class="text-black/40 text-sm"
                  @click="resetDiscount(client.id)"
                >
                  Сбросить
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="clients.length === 0" class="text-center py-10 text-black/40">
        Клиенты не найдены
      </div>
    </div>
  </div>
</template>