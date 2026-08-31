<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useManufacturers } from '../../composables/product/manufacturer/useManufacturers.js';
import HeaderAdmin from '../components/HeaderAdmin.vue';

const { manufacturers, loading, error, load, add, update, remove } = useManufacturers();

const newName = ref('');
const editingId = ref<number | null>(null);
const editingName = ref('');

const handleAdd = async () => {
  if (!newName.value.trim()) return;
  await add(newName.value.trim());
  newName.value = '';
};

const startEdit = (id: number, name: string) => {
  editingId.value = id;
  editingName.value = name;
};

const cancelEdit = () => {
  editingId.value = null;
  editingName.value = '';
};

const saveEdit = async () => {
  if (editingId.value === null || !editingName.value.trim()) return;
  await update(editingId.value, editingName.value.trim());
  cancelEdit();
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
      <p class="mb-2 text-xs uppercase tracking-[0.2em] text-ink-muted">Админка</p>
      <h1 class="mb-8 font-display text-3xl font-medium text-ink">Производители</h1>

      <form @submit.prevent="handleAdd" class="mb-8 flex gap-3">
        <input
          v-model="newName"
          placeholder="Название производителя"
          class="flex-1 border border-line bg-white px-3 py-2 text-sm text-ink focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/30"
        />
        <button
          type="submit"
          class="bg-moss px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-moss-dark"
        >
          Добавить
        </button>
      </form>

      <p v-if="loading" class="text-sm text-ink-muted">Загрузка...</p>
      <p v-if="error" class="text-sm text-clay">{{ error }}</p>

      <ul class="divide-y divide-line border border-line">
        <li
          v-for="m in manufacturers"
          :key="m.id"
          class="flex items-center justify-between gap-3 px-4 py-3"
        >
          <template v-if="editingId === m.id">
            <input
              v-model="editingName"
              class="flex-1 border border-line px-2 py-1 text-sm focus:border-moss focus:outline-none"
              @keyup.enter="saveEdit"
            />
            <div class="flex gap-2 text-xs uppercase tracking-wide">
              <button @click="saveEdit" class="text-moss hover:text-moss-dark">Сохранить</button>
              <button @click="cancelEdit" class="text-ink-muted hover:text-ink">Отмена</button>
            </div>
          </template>
          <template v-else>
            <span class="text-sm text-ink">{{ m.name }}</span>
            <div class="flex gap-3 text-xs uppercase tracking-wide">
              <button @click="startEdit(m.id, m.name)" class="text-ink-muted hover:text-moss">Изменить</button>
              <button @click="handleRemove(m.id)" class="text-clay hover:text-ink">Удалить</button>
            </div>
          </template>
        </li>
      </ul>

      <p v-if="!loading && manufacturers.length === 0" class="mt-6 text-center text-sm italic text-ink-muted">
        Производителей пока нет.
      </p>
    </div>
  </div>
</template>