<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { Product } from '../../models/product.js';
import { useProducts } from '../../composables/product/useProducts.js';
import { useManufacturers } from '../../composables/product/manufacturer/useManufacturers.js';
import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
import { usePurposes } from '../../composables/product/purposes/usePurposes.js';
import { useCollections } from '../../composables/product/collection/useCollections.js';
import HeaderAdmin from '../../admin/components/HeaderAdmin.vue';
import { ProductMedia } from '../../models/productMedia.js';

const { products, loading, error, load, add, update, remove } = useProducts();
const { manufacturers, load: loadManufacturers } = useManufacturers();
const { skinTypes, load: loadSkinTypes } = useSkinTypes();
const { purposes, load: loadPurposes } = usePurposes();
const { collections, load: loadCollections } = useCollections();

const isModalOpen = ref(false);
const editingProduct = ref<Product | null>(null);
const submitting = ref(false);
const formError = ref<string | null>(null);

const form = reactive({
  name: '',
  description: '',
  priceAmount: 0,
  priceCurrency: 'BYN' as 'BYN' | 'USD',
  manufacturerId: 0,
  skinTypeIds: [] as number[],
  purposeIds: [] as number[],
  collectionIds: [] as number[],
  inStock: true,
});

const newFiles = ref<File[]>([]);
const existingMedia = ref<ProductMedia[]>([]);
const mediaIdsToDelete = ref<number[]>([]);

const newMediaPreviews = computed(() =>
  newFiles.value.map((file) => ({
    url: URL.createObjectURL(file),
    type: file.type.startsWith('video') ? 'video' : 'image',
  }))
);

const coverImage = (product: Product) => product.media[0]?.url || product.imageUrl || '';

const resetForm = () => {
  form.name = '';
  form.description = '';
  form.priceAmount = 0;
  form.priceCurrency = 'BYN';
  form.manufacturerId = manufacturers.value[0]?.id ?? 0;
  form.skinTypeIds = [];
  form.purposeIds = [];
  form.collectionIds = [];
  form.inStock = true;
  newFiles.value = [];
  existingMedia.value = [];
  mediaIdsToDelete.value = [];
  formError.value = null;
};

const openAddModal = () => {
  editingProduct.value = null;
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (product: Product) => {
  editingProduct.value = product;
  form.name = product.name;
  form.description = product.description;
  form.priceAmount = product.priceAmount;
  form.priceCurrency = product.priceCurrency;
  form.manufacturerId = product.manufacturer.id;
  form.skinTypeIds = product.skinTypes.map((s) => s.id);
  form.purposeIds = product.purposes.map((p) => p.id);
  form.collectionIds = product.collections.map((c) => c.id);
  form.inStock = product.inStock;
  newFiles.value = [];
  existingMedia.value = [...product.media];
  mediaIdsToDelete.value = [];
  formError.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleFilesChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);
  newFiles.value.push(...files);
  target.value = ''; 
};

const removeNewFile = (idx: number) => {
  newFiles.value.splice(idx, 1);
};

const removeExistingMedia = (id: number) => {
  mediaIdsToDelete.value.push(id);
  existingMedia.value = existingMedia.value.filter((m) => m.id !== id);
};


const handleSubmit = async () => {
  submitting.value = true;
  formError.value = null;

  const payload = {
    ...form,
    media: newFiles.value,
    mediaIdsToDelete: mediaIdsToDelete.value,
  };

  try {
    if (editingProduct.value) {
      await update(editingProduct.value.id, payload);
    } else {
      await add(payload);
    }
    closeModal();
  } catch (err: any) {
    formError.value = err.message ?? 'Не удалось сохранить товар';
  } finally {
    submitting.value = false;
  }
};

const handleRemove = async (id: number) => {
  if (!confirm('Удалить товар?')) return;
  await remove(id);
};

onMounted(() => {
  load();
  loadManufacturers();
  loadSkinTypes();
  loadPurposes();
  loadCollections();
});
</script>

<template>
  <div class="min-h-screen bg-paper px-4 py-10 font-body text-ink">
    <div class="mx-auto max-w-6xl">
        <HeaderAdmin />
      <div class="mb-8 flex items-center justify-between">
        <div>
          <p class="mb-2 text-xs uppercase tracking-[0.2em] text-ink-muted">Админка</p>
          <h1 class="font-display text-3xl font-medium text-ink">Товары</h1>
        </div>
        <button
          @click="openAddModal"
          class="bg-black px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-moss-dark"
        >
          + Добавить товар
        </button>
      </div>

      <p v-if="loading" class="text-sm text-ink-muted">Загрузка...</p>
      <p v-if="error" class="text-sm text-clay">{{ error }}</p>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in products"
          :key="product.id"
          class="border border-line bg-white p-4"
        >
          <div class="mb-3 aspect-square overflow-hidden bg-petal-soft/40">
            <img
              v-if="coverImage(product)"
              :src="coverImage(product)"
              :alt="product.name"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-ink-muted">
              Нет фото
            </div>
          </div>

          <h3 class="mb-1 font-display text-lg text-ink">{{ product.name }}</h3>
          <p class="mb-2 text-xs uppercase tracking-widest text-ink-muted">
            {{ product.manufacturer.name }}
          </p>
          <p class="mb-3 text-sm font-medium text-ink">
            {{ product.priceAmount }} {{ product.priceCurrency }}
          </p>

          <span
            v-if="!product.inStock"
            class="mb-3 inline-block rounded-full border border-clay/40 px-2 py-0.5 text-[11px] uppercase tracking-widest text-clay"
          >
            Нет в наличии
          </span>

          <div class="flex gap-4 text-xs uppercase tracking-wide">
            <button @click="openEditModal(product)" class="text-ink-muted hover:text-moss">Изменить</button>
            <button @click="handleRemove(product.id)" class="text-clay hover:text-ink">Удалить</button>
          </div>
        </div>
      </div>

      <p v-if="!loading && products.length === 0" class="mt-10 text-center text-sm italic text-ink-muted">
        Товаров пока нет.
      </p>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      @click.self="closeModal"
    >
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl">
        <h2 class="mb-6 font-display text-xl font-medium text-ink">
          {{ editingProduct ? 'Редактировать товар' : 'Новый товар' }}
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
            <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Описание</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Цена</label>
              <input
                v-model.number="form.priceAmount"
                type="number"
                step="0.01"
                required
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Валюта</label>
              <select
                v-model="form.priceCurrency"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              >
                <option value="BYN">BYN</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

        <div>
        <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Тип кожи</label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="st in skinTypes"
            :key="st.id"
            class="cursor-pointer select-none border px-3 py-1 text-xs uppercase tracking-wide transition-colors"
            :class="form.skinTypeIds.includes(st.id) ? 'border-moss bg-moss/10 text-moss-dark' : 'border-line text-ink-muted'"
          >
            <input type="checkbox" :value="st.id" v-model="form.skinTypeIds" class="hidden" />
            {{ st.name }}
          </label>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Назначение</label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="p in purposes"
            :key="p.id"
            class="cursor-pointer select-none border px-3 py-1 text-xs uppercase tracking-wide transition-colors"
            :class="form.purposeIds.includes(p.id) ? 'border-moss bg-moss/10 text-moss-dark' : 'border-line text-ink-muted'"
          >
            <input type="checkbox" :value="p.id" v-model="form.purposeIds" class="hidden" />
            {{ p.name }}
          </label>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Подборки</label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="c in collections"
            :key="c.id"
            class="cursor-pointer select-none border px-3 py-1 text-xs uppercase tracking-wide transition-colors"
            :class="form.collectionIds.includes(c.id) ? 'border-moss bg-moss/10 text-moss-dark' : 'border-line text-ink-muted'"
          >
            <input type="checkbox" :value="c.id" v-model="form.collectionIds" class="hidden" />
            {{ c.name }}
          </label>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted">Фото / видео</label>

        <div v-if="existingMedia.length" class="mb-3 flex flex-wrap gap-2">
          <div v-for="m in existingMedia" :key="m.id" class="relative h-20 w-20 overflow-hidden border border-line">
            <video v-if="m.mediaType === 'video'" :src="m.url" class="h-full w-full object-cover" muted />
            <img v-else :src="m.url" class="h-full w-full object-cover" />
            <button
              type="button"
              @click="removeExistingMedia(m.id)"
              class="absolute right-0 top-0 bg-black/60 px-1.5 text-[11px] leading-4 text-white"
            >
              ×
            </button>
          </div>
        </div>

        <input type="file" accept="image/*,video/*" multiple @change="handleFilesChange" class="text-sm" />

        <div v-if="newMediaPreviews.length" class="mt-2 flex flex-wrap gap-2">
          <div v-for="(p, idx) in newMediaPreviews" :key="idx" class="relative h-20 w-20 overflow-hidden border border-line">
            <video v-if="p.type === 'video'" :src="p.url" class="h-full w-full object-cover" muted />
            <img v-else :src="p.url" class="h-full w-full object-cover" />
            <button
              type="button"
              @click="removeNewFile(idx)"
              class="absolute right-0 top-0 bg-black/60 px-1.5 text-[11px] leading-4 text-white"
            >
              ×
            </button>
          </div>
        </div>
      </div>

    
          <div class="flex items-center gap-2">
            <input id="in-stock" type="checkbox" v-model="form.inStock" class="h-4 w-4 border-line text-moss" />
            <label for="in-stock" class="text-sm text-ink">В наличии</label>
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