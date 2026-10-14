<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import HeaderAdmin from '../components/HeaderAdmin.vue';
import { useToast } from 'vue-toastification';
import { usePromoCodesAdmin } from '../../composables/promotion/usePromoCodesAdmin.js';

const { promoCodes, loading, error, load, create, toggleActive, remove } = usePromoCodesAdmin();
const toast = useToast();

const showForm = ref(false);
const creating = ref(false);

const form = reactive({
  code: '',
  discountPercent: 10,
  isFirstOrderOnly: false,
  validUntil: '',
  usageLimit: null as number | null,
});

const resetForm = () => {
  form.code = '';
  form.discountPercent = 10;
  form.isFirstOrderOnly = false;
  form.validUntil = '';
  form.usageLimit = null;
};

const handleCreate = async () => {
  if (!form.code.trim()) return;
  creating.value = true;
  try {
    await create({
      code: form.code.trim(),
      discountPercent: form.discountPercent,
      isFirstOrderOnly: form.isFirstOrderOnly,
      validUntil: form.validUntil || null,
      usageLimit: form.usageLimit,
    });
    toast.success('Промокод создан');
    resetForm();
    showForm.value = false;
  } catch (e: any) {
    toast.error(e.message);
  } finally {
    creating.value = false;
  }
};

const handleToggle = async (promo: any) => {
  try {
    await toggleActive(promo);
    toast.success(promo.isActive ? 'Промокод активирован' : 'Промокод деактивирован');
  } catch (e: any) {
    toast.error(e.message);
  }
};

const handleRemove = async (id: number) => {
  if (!confirm('Удалить промокод?')) return;
  try {
    await remove(id);
    toast.success('Промокод удалён');
  } catch (e: any) {
    toast.error(e.message);
  }
};

onMounted(() => load());
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
    <HeaderAdmin />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Промокоды</h2>
          <p class="mt-1 text-sm text-slate-500">Создание и управление промокодами на скидку</p>
        </div>
        <button
          @click="showForm = !showForm"
          class="bg-moss text-black/70 font-medium text-sm px-4 py-2 rounded-lg hover:bg-moss-dark transition"
        >
          {{ showForm ? 'Отмена' : '+ Новый промокод' }}
        </button>
      </div>

      <!-- Форма создания -->
      <form
        v-if="showForm"
        @submit.prevent="handleCreate"
        class="mb-8 bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-wrap gap-4 items-end"
      >
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Код</label>
          <input
            v-model="form.code"
            type="text"
            placeholder="WELCOME10"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm w-40 focus:border-moss focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Скидка, %</label>
          <input
            v-model.number="form.discountPercent"
            type="number"
            min="1"
            max="100"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm w-24 focus:border-moss focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Действует до</label>
          <input
            v-model="form.validUntil"
            type="date"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-moss focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Лимит использований</label>
          <input
            v-model.number="form.usageLimit"
            type="number"
            min="1"
            placeholder="∞"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm w-28 focus:border-moss focus:outline-none"
          />
        </div>

        <label class="flex items-center gap-2 text-sm text-slate-700 pb-2">
          <input type="checkbox" v-model="form.isFirstOrderOnly" class="h-4 w-4" />
          Только на первый заказ
        </label>

        <button
          type="submit"
          :disabled="creating"
          class="bg-moss text-black/70 font-medium text-sm px-5 py-2 rounded-lg hover:bg-moss-dark transition disabled:opacity-50"
        >
          {{ creating ? 'Создаём...' : 'Создать' }}
        </button>
      </form>

      <p v-if="loading" class="text-sm text-slate-500">Загрузка...</p>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

      <div v-if="!loading && promoCodes.length" class="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-sm">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th class="py-3 px-6">Код</th>
              <th class="py-3 px-6">Скидка</th>
              <th class="py-3 px-6">Условие</th>
              <th class="py-3 px-6">Использовано</th>
              <th class="py-3 px-6">До</th>
              <th class="py-3 px-6">Статус</th>
              <th class="py-3 px-6 text-right">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="promo in promoCodes" :key="promo.id" class="hover:bg-slate-50/50">
              <td class="py-3 px-6 font-mono font-semibold text-slate-900">{{ promo.code }}</td>
              <td class="py-3 px-6">{{ promo.discountPercent }}%</td>
              <td class="py-3 px-6 text-slate-500">
                {{ promo.isFirstOrderOnly ? 'Первый заказ' : 'Любой заказ' }}
              </td>
              <td class="py-3 px-6">
                {{ promo.usedCount }}{{ promo.usageLimit ? ` / ${promo.usageLimit}` : '' }}
              </td>
              <td class="py-3 px-6 text-slate-500">
                {{ promo.validUntil ? new Date(promo.validUntil).toLocaleDateString('ru-RU') : '—' }}
              </td>
              <td class="py-3 px-6">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="promo.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                >
                  {{ promo.isActive ? 'Активен' : 'Выключен' }}
                </span>
              </td>
              <td class="py-3 px-6 text-right whitespace-nowrap">
                <button
                  @click="handleToggle(promo)"
                  class="text-xs font-medium text-moss-700 hover:text-moss-900 bg-moss-50 hover:bg-moss-100 px-2.5 py-1.5 rounded-lg mr-2"
                >
                  {{ promo.isActive ? 'Выключить' : 'Включить' }}
                </button>
                <button
                  @click="handleRemove(promo.id)"
                  class="text-xs font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg"
                >
                  Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loading" class="text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm">
        <span class="text-3xl">🏷️</span>
        <h3 class="mt-4 text-sm font-semibold text-slate-900">Промокодов пока нет</h3>
      </div>
    </div>
  </div>
</template>