<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useManufacturers } from '../../composables/product/manufacturer/useManufacturers.js';
import HeaderAdmin from '../components/HeaderAdmin.vue';
import { Manufacturer } from '../../models/manufacturer.js';

const { manufacturers, loading, error, load, add, update, remove } = useManufacturers();

const isModalOpen = ref(false);
const editingManufacturer = ref<Manufacturer | null>(null);
const submitting = ref(false);
const formError = ref<string | null>(null);

const form = reactive({
  name: '',
  address: '',
  country: '',
});

const resetForm = () => {
    form.name = '';
    form.address = '';
    form.country = '';
    formError.value = null;
  };

const openAddModal = () => {
    editingManufacturer.value = null;
    resetForm();
    isModalOpen.value = true;
  };


  const openEditModal = (manufacturer: Manufacturer) => {
    editingManufacturer.value = manufacturer;
    form.name = manufacturer.name;
    form.address = manufacturer.address;
    form.country = manufacturer.country;
    formError.value = null;
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const handleSubmit = async () => {
    submitting.value = true;
    formError.value = null;


    try {
      if (editingManufacturer.value) {
        await update(editingManufacturer.value.id, form.name, form.address, form.country);
      } else {
        await add(form.name, form.address, form.country);
      }
      closeModal();
    } catch (err: any) {
      formError.value = err.message ?? 'Не удалось сохранить товар';
    } finally {
      submitting.value = false;
    }
  };


const handleRemove = async (id: number) => {
  if (!confirm('Удалить производителя?')) return;
  try {
    await remove(id);
  } catch {
    alert('Не удалось удалить: возможно, у производителя есть товары.');
  }
};

onMounted(load);
</script>

<template>
  <div class="min-h-screen bg-paper px-4 py-10 font-body text-ink">
    <div class="mx-auto max-w-2xl">
        <HeaderAdmin />
      <h1 class="mb-8 font-display text-3xl font-medium text-ink">Производители</h1>

      <form @submit.prevent="openAddModal" class="mb-8 flex gap-3">
        <button
          type="submit"
          class="bg-black px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-moss-dark"
        >
          Добавить
        </button>
      </form>

      <p v-if="loading" class="text-sm text-ink-muted">Загрузка...</p>
      <p v-if="error" class="text-sm text-clay">{{ error }}</p>

      <ul class="divide-y divide-line border border-line">
        <li
          v-for="manufacturer in manufacturers"
          :key="manufacturer.id"
          class="flex items-center justify-between gap-3 px-4 py-3"
        >
            <span class="text-sm text-ink">{{ manufacturer.name }}</span>
            <div class="flex gap-3 text-xs uppercase tracking-wide">
              <button @click="openEditModal(manufacturer)" class="text-ink-muted hover:text-moss">Изменить</button>
              <button @click="handleRemove(manufacturer.id)" class="text-clay hover:text-ink">Удалить</button>
            </div>
        </li>
      </ul>

      <p v-if="!loading && manufacturers.length === 0" class="mt-6 text-center text-sm italic text-ink-muted">
        Производителей пока нет.
      </p>
    </div>
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      @click.self="closeModal"
    >
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl">
        <h2 class="mb-6 font-display text-xl font-medium text-ink">
          {{ editingManufacturer ? 'Редактировать производителя' : 'Новый производитель' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Название</label>
            <input
              v-model="form.name"
              required
              class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
            />
          </div>

          <div>
            <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Адрес</label>
            <textarea
              v-model="form.address"
              rows="1"
              class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Страна</label>
            <textarea
              v-model="form.country"
              rows="1"
              class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
            ></textarea>
          </div>

          <p v-if="formError" class="text-sm text-clay">{{ formError }}</p>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm text-ink-muted hover:text-ink">
              Отмена
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="bg-moss px-5 py-2 text-sm font-medium uppercase tracking-wide text-black/70 transition-colors hover:bg-moss-dark disabled:opacity-50"
            >
              {{ submitting ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>