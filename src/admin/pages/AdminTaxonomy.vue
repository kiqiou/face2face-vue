<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
import { usePurposes } from '../../composables/product/purposes/usePurposes.js';
import { useCollections } from '../../composables/product/collection/useCollections.js';
import HeaderAdmin from '../../admin/components/HeaderAdmin.vue';

type Tab = 'skinTypes' | 'purposes' | 'collections';

const activeTab = ref<Tab>('skinTypes');

const skinTypesApi = useSkinTypes();
const purposesApi = usePurposes();
const collectionsApi = useCollections();

const newName = ref('');
const editingId = ref<number | null>(null);
const editingName = ref('');

const currentItems = computed(() => {
  if (activeTab.value === 'skinTypes') return skinTypesApi.skinTypes.value;
  if (activeTab.value === 'purposes') return purposesApi.purposes.value;
  return collectionsApi.collections.value;
});

const currentLoading = computed(() => {
  if (activeTab.value === 'skinTypes') return skinTypesApi.loading.value;
  if (activeTab.value === 'purposes') return purposesApi.loading.value;
  return collectionsApi.loading.value;
});

const tabLabels: Record<Tab, string> = {
  skinTypes: 'Типы кожи',
  purposes: 'Назначение',
  collections: 'Подборки',
};

const handleAdd = async () => {
  if (!newName.value.trim()) return;
  const name = newName.value.trim();

  if (activeTab.value === 'skinTypes') await skinTypesApi.add(name);
  if (activeTab.value === 'purposes') await purposesApi.add(name);
  if (activeTab.value === 'collections') await collectionsApi.add(name);

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
  const name = editingName.value.trim();

  if (activeTab.value === 'skinTypes') await skinTypesApi.update(editingId.value, name);
  if (activeTab.value === 'purposes') await purposesApi.update(editingId.value, name);
  if (activeTab.value === 'collections') {
    const existing = collectionsApi.collections.value.find((c) => c.id === editingId.value);
    await collectionsApi.update(editingId.value, name, existing?.isActive ?? true);
  }

  cancelEdit();
};

const handleRemove = async (id: number) => {
  if (!confirm('Удалить запись?')) return;

  if (activeTab.value === 'skinTypes') await skinTypesApi.remove(id);
  if (activeTab.value === 'purposes') await purposesApi.remove(id);
  if (activeTab.value === 'collections') await collectionsApi.remove(id);
};

onMounted(() => {
  skinTypesApi.load();
  purposesApi.load();
  collectionsApi.load();
});
</script>

<template>
  <div class="min-h-screen bg-paper px-4 py-10 font-body text-ink">
    <div class="mx-auto max-w-2xl">
        <HeaderAdmin />
      <p class="mb-2 text-xs uppercase tracking-[0.2em] text-ink-muted">Админка</p>
      <h1 class="mb-8 font-display text-3xl font-medium text-ink">Категории товаров</h1>

      <div class="mb-8 flex gap-1 border-b border-line">
        <button
          v-for="(label, tab) in tabLabels"
          :key="tab"
          @click="activeTab = tab as Tab; cancelEdit()"
          :class="[
            'px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors',
            activeTab === tab
              ? 'border-b-2 border-moss text-moss'
              : 'text-ink-muted hover:text-ink',
          ]"
        >
          {{ label }}
        </button>
      </div>

      <form @submit.prevent="handleAdd" class="mb-8 flex gap-3">
        <input
          v-model="newName"
          placeholder="Название"
          class="flex-1 border border-line bg-white px-3 py-2 text-sm text-ink focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/30"
        />
        <button
          type="submit"
          class="bg-moss px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-moss-dark"
        >
          Добавить
        </button>
      </form>

      <p v-if="currentLoading" class="text-sm text-ink-muted">Загрузка...</p>

      <ul class="divide-y divide-line border border-line">
        <li
          v-for="item in currentItems"
          :key="item.id"
          class="flex items-center justify-between gap-3 px-4 py-3"
        >
          <template v-if="editingId === item.id">
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
            <span class="text-sm text-ink">{{ item.name }}</span>
            <div class="flex gap-3 text-xs uppercase tracking-wide">
              <button @click="startEdit(item.id, item.name)" class="text-ink-muted hover:text-moss">Изменить</button>
              <button @click="handleRemove(item.id)" class="text-clay hover:text-ink">Удалить</button>
            </div>
          </template>
        </li>
      </ul>

      <p v-if="!currentLoading && currentItems.length === 0" class="mt-6 text-center text-sm italic text-ink-muted">
        Записей пока нет.
      </p>
    </div>
  </div>
</template>