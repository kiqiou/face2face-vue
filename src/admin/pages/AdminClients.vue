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

    <div class="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-black text-slate-800">Клиенты</h1>

      <input
        v-model="search"
        @input="onSearchInput"
        type="text"
        placeholder="Поиск по имени или телефону"
        class="w-full rounded-xl border border-black/10 px-4 py-2.5 outline-none transition focus:border-[#E5A663] sm:w-72"
      />
    </div>

    <div v-if="loading" class="text-center py-10 text-black/50">Загружаем клиентов...</div>

   <template v-else>
    <div class="mx-auto hidden w-full max-w-5xl overflow-hidden rounded-2xl border border-black/5 bg-white md:block">
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

      </div>

      <div class="mx-auto w-full max-w-5xl space-y-3 md:hidden">
        <div
          v-for="client in clients"
          :key="client.id"
          class="rounded-2xl border border-black/5 bg-white p-4"
        >
          <div class="mb-3 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="break-words font-medium text-slate-800">
                {{ client.username }}
              </h3>
              <p class="mt-0.5 break-words text-sm text-black/60">
                {{ client.phone }}
              </p>
            </div>

            <div class="shrink-0 text-right">
              <p class="text-[10px] uppercase tracking-wider text-black/40">Скидка</p>
              <p
                class="text-sm font-semibold"
                :class="client.manualDiscountPercent !== null ? 'text-[#E5A663]' : 'text-black/70'"
              >
                {{ client.currentDiscountPercent }}%
              </p>
              <p v-if="client.manualDiscountPercent !== null" class="text-[10px] text-black/40">
                вручную
              </p>
            </div>
          </div>

          <div class="mb-3 grid grid-cols-2 gap-2 rounded-xl bg-black/[0.03] p-3">
            <div>
              <p class="text-[10px] uppercase tracking-wider text-black/40">Заказов</p>
              <p class="mt-0.5 text-sm font-medium text-slate-800">
                {{ client.ordersCount }}
              </p>
            </div>

            <div class="text-right">
              <p class="text-[10px] uppercase tracking-wider text-black/40">Сумма покупок</p>
              <p class="mt-0.5 text-sm font-semibold text-slate-800">
                {{ client.totalSpent }} BYN
              </p>
            </div>
          </div>

          <!-- Редактирование скидки -->
          <div v-if="editingId === client.id" class="mb-3 flex items-center gap-2">
            <input
              v-model.number="editValue"
              type="number"
              min="0"
              max="100"
              class="w-20 rounded-lg border border-black/10 px-3 py-2 text-right outline-none focus:border-[#E5A663]"
            />
            <span class="text-sm text-black/60">%</span>
          </div>

          <!-- Кнопки -->
          <div class="grid grid-cols-2 gap-2">
            <template v-if="editingId === client.id">
              <button
                class="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
                @click="saveDiscount(client.id)"
              >
                Сохранить
              </button>

              <button
                class="rounded-xl bg-black/[0.04] px-3 py-2.5 text-sm font-medium text-black/50 transition hover:bg-black/[0.07]"
                @click="editingId = null"
              >
                Отмена
              </button>
            </template>

            <template v-else>
              <button
                class="rounded-xl bg-[#E5A663]/15 px-3 py-2.5 text-sm font-semibold text-[#B97F3C] transition hover:bg-[#E5A663]/25"
                @click="startEdit(client)"
              >
                Изменить
              </button>

              <button
                v-if="client.manualDiscountPercent !== null"
                class="rounded-xl bg-black/[0.04] px-3 py-2.5 text-sm font-medium text-black/50 transition hover:bg-black/[0.07]"
                @click="resetDiscount(client.id)"
              >
                Сбросить
              </button>
            </template>
          </div>
        </div>
        </div>

   </template> 
  
        <div v-if="clients.length === 0" class="rounded-2xl border border-black/5 bg-white py-10 text-center text-black/40">
          Клиенты не найдены
        </div>
      </div>

</template>