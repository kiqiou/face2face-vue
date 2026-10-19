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
  import { useRoute, useRouter } from 'vue-router';
  import AppPagination from '../../client/components/AppPagination.vue';

  const search = ref('');
  const page = ref(1);
  const PAGE_SIZE = 12;

  const filters = reactive({
    manufacturer: 0,
    skinType: 0,
    purpose: 0,
    collection: 0,
    inStock: '' as '' | 'true' | 'false', 
    onSale: false,
    ordering: '' as '' | 'price_amount' | '-price_amount',
  });


  const { products, totalCount, loading, error, load, add, update, remove } = useProducts();
  const { manufacturers, load: loadManufacturers } = useManufacturers();
  const { skinTypes, load: loadSkinTypes } = useSkinTypes();
  const { purposes, load: loadPurposes } = usePurposes();
  const { collections, load: loadCollections } = useCollections();

  const router = useRouter();

  const isModalOpen = ref(false);
  const editingProduct = ref<Product | null>(null);
  const submitting = ref(false);
  const formError = ref<string | null>(null);

  const fetchProducts = () =>
    load(
      {
        manufacturer: filters.manufacturer || undefined,
        skinType: filters.skinType || undefined,
        purpose: filters.purpose || undefined,
        collection: filters.collection || undefined,
        inStock: filters.inStock === '' ? undefined : filters.inStock === 'true',
        onSale: filters.onSale || undefined,
        ordering: filters.ordering || undefined,
        search: search.value || undefined,
        page: page.value,
        pageSize: PAGE_SIZE,
      },
      true // withAuth, чтобы пришёл ProductAdminSerializer
    );

  const applyFilters = () => {
    page.value = 1;
    fetchProducts();
  };

  let searchTimer: ReturnType<typeof setTimeout>;
  const onSearchInput = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 350);
  };

  const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)));

  const goToPage = (p: number) => {
    page.value = p;
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = computed(
    () =>
      (search.value ? 1 : 0) +
      [filters.manufacturer, filters.skinType, filters.purpose, filters.collection].filter(Boolean).length +
      (filters.inStock !== '' ? 1 : 0) +
      (filters.onSale ? 1 : 0)
  );

  const resetFilters = () => {
    Object.assign(filters, {
      manufacturer: 0, skinType: 0, purpose: 0, collection: 0,
      inStock: '', onSale: false, ordering: '',
    });
    search.value = '';
    applyFilters();
  };

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
    netAmount: null as number | null,
    netAmountUnit: '' as 'ml' | 'l' | 'g' | 'kg' | 'pcs' | '',
    ingredients: '',
    shelfLifeMonths: null as number | null,
    storageConditions: '',
    precautions: '',
    usageInstructions: '',
    isForChildren: false,
    colorShade: '',
    fluorideContent: '',
    batchNumber: '',
    conformityDocumentNumber: '',
    conformityDocumentValidUntil: '' as string | null,
    costPrice: null as number | null,
    salePrice: null as number | null,
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
      form.netAmount = null;
      form.netAmountUnit = '';
      form.ingredients = '';
      form.shelfLifeMonths = null;
      form.storageConditions = '';
      form.precautions = '';
      form.usageInstructions = '';
      form.isForChildren = false;
      form.colorShade = '';
      form.fluorideContent = '';
      form.batchNumber = '';
      form.conformityDocumentNumber = '';
      form.conformityDocumentValidUntil = '';
      form.costPrice = null;
      form.salePrice = null;
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
      form.netAmount = product.netAmount;
      form.netAmountUnit = product.netAmountUnit;
      form.ingredients = product.ingredients;
      form.shelfLifeMonths = product.shelfLifeMonths;
      form.storageConditions = product.storageConditions;
      form.precautions = product.precautions;
      form.usageInstructions = product.usageInstructions;
      form.isForChildren = product.isForChildren;
      form.colorShade = product.colorShade;
      form.fluorideContent = product.fluorideContent;
      form.batchNumber = product.batchNumber;
      form.conformityDocumentNumber = product.conformityDocumentNumber;
      form.conformityDocumentValidUntil = product.conformityDocumentValidUntil;
      form.costPrice = product.costPrice;
      form.salePrice = product.salePrice;

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
        await fetchProducts();
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
    if (products.value.length === 0 && page.value > 1) page.value--;
    await fetchProducts();
  };

  const goToProduct = (id: number) => {
    router.push(`admin/products/${id}`);
  };

  onMounted(() => {
    fetchProducts();
    loadManufacturers();
    loadSkinTypes();
    loadPurposes();
    loadCollections();
  });
</script>

<template>
  <div class="min-h-screen bg-paper px-4 font-body text-ink">
    <HeaderAdmin />
    <div class="mx-auto max-w-6xl">
      <div
        class="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <h1 class="font-display text-2xl font-medium text-ink sm:text-3xl">
          Товары
        </h1>

        <button
          @click="openAddModal"
          class="w-full bg-black px-5 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-moss-dark sm:w-auto sm:py-2"
        >
          + Добавить товар
        </button>
      </div>

      <div class="mb-6 space-y-3 border border-line bg-white p-4">
        <input
          v-model="search"
          @input="onSearchInput"
          type="search"
          placeholder="Поиск: название, описание, производитель, № партии, № документа"
          class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
        />

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select v-model.number="filters.manufacturer" @change="applyFilters"
            class="border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none">
            <option :value="0">Все производители</option>
            <option v-for="m in manufacturers" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>

          <select v-model.number="filters.skinType" @change="applyFilters"
            class="border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none">
            <option :value="0">Любой тип кожи</option>
            <option v-for="s in skinTypes" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>

          <select v-model.number="filters.purpose" @change="applyFilters"
            class="border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none">
            <option :value="0">Любое назначение</option>
            <option v-for="p in purposes" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>

          <select v-model.number="filters.collection" @change="applyFilters"
            class="border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none">
            <option :value="0">Любая подборка</option>
            <option v-for="c in collections" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
          <select v-model="filters.inStock" @change="applyFilters"
            class="border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none">
            <option value="">Наличие: все</option>
            <option value="true">В наличии</option>
            <option value="false">Нет в наличии</option>
          </select>

          <select v-model="filters.ordering" @change="applyFilters"
            class="border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none">
            <option value="">Сортировка: новые</option>
            <option value="price_amount">Сначала дешевле</option>
            <option value="-price_amount">Сначала дороже</option>
          </select>

          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="filters.onSale" @change="applyFilters"
              class="h-4 w-4 border-line text-moss" />
            Только акционные
          </label>

          <div class="ml-auto flex items-center gap-4 text-[11px] uppercase tracking-[0.15em]">
            <span class="text-ink-muted">Найдено: {{ totalCount }} · Фильтров: {{ activeFiltersCount }}</span>
            <button @click="resetFilters" class="text-clay underline underline-offset-4 hover:text-ink">
              Сбросить
            </button>
          </div>
        </div>
      </div>

      <p v-if="loading" class="text-sm text-ink-muted">Загрузка...</p>
      <p v-if="error" class="text-sm text-clay">{{ error }}</p>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in products"
          :key="product.id"
          class="flex flex-col border border-line bg-white p-4"
        >
          <div
            class="mb-3 aspect-square overflow-hidden bg-petal-soft/40"
            @click="() => goToProduct(product.id)"
          >
            <img
              v-if="coverImage(product)"
              :src="coverImage(product)"
              :alt="product.name"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-ink-muted"
            >
              Нет фото
            </div>
          </div>

          <h3 class="mb-1 break-words font-display text-lg text-ink">
            {{ product.name }}
          </h3>

          <p
            class="mb-2 break-words text-xs uppercase tracking-widest text-ink-muted"
          >
            {{ product.manufacturer.name }}
          </p>

          <p class="mb-3 text-sm font-medium text-ink">
            {{ product.priceAmount }} {{ product.priceCurrency }}
          </p>

          <span
            v-if="!product.inStock"
            class="mb-3 inline-block w-fit rounded-full border border-clay/40 px-2 py-0.5 text-[11px] uppercase tracking-widest text-clay"
          >
            Нет в наличии
          </span>

          <div class="mt-auto flex gap-4 text-xs uppercase tracking-wide">
            <button
              @click="openEditModal(product)"
              class="text-ink-muted hover:text-moss"
            >
              Изменить
            </button>
            <button
              @click="handleRemove(product.id)"
              class="text-clay hover:text-ink"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <AppPagination :page="page" :total-pages="totalPages" @change="goToPage" />

      <p v-if="!loading && products.length === 0"
        class="mt-10 text-center text-sm italic text-ink-muted">
        {{ activeFiltersCount ? 'Ничего не найдено.' : 'Товаров пока нет.' }}
      </p>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:px-4"
      @click.self="closeModal"
    >
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl lg:max-w-5xl lg:p-8">
        <h2 class="mb-6 font-display text-xl font-medium text-ink">
          {{ editingProduct ? 'Редактировать товар' : 'Новый товар' }}
        </h2>

        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-2">
              <!-- ЛЕВАЯ КОЛОНКА: основное -->
              <div class="space-y-4">
                          <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                >Название</label
              >
              <input
                v-model="form.name"
                required
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>

            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                >Описание</label
              >
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              ></textarea>
            </div>
              <!-- Цены: вместо grid sm:grid-cols-3 и отдельного блока «Валюта» -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label
                    class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                    >Цена</label
                  >
                  <input
                    v-model.number="form.priceAmount"
                    type="number"
                    step="0.01"
                    required
                    class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                  >
                    Акционная цена
                    <span class="normal-case text-ink-muted/60"
                      >(необязательно)</span
                    >
                  </label>
                  <input
                    v-model.number="form.salePrice"
                    type="number"
                    step="0.01"
                    placeholder="меньше обычной цены"
                    class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
                    :class="{
                      'border-clay':
                        form.salePrice !== null &&
                        form.salePrice >= form.priceAmount,
                    }"
                  />
                  <p
                    v-if="
                      form.salePrice !== null && form.salePrice >= form.priceAmount
                    "
                    class="mt-1 text-[11px] text-clay"
                  >
                    Должна быть меньше обычной цены
                  </p>
                </div>

                <div>
                  <label
                    class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                    >Себестоимость</label
                  >
                  <input
                    v-model.number="form.costPrice"
                    type="number"
                    step="0.01"
                    required
                    class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                  >Валюта</label
                >
                <select
                  v-model="form.priceCurrency"
                  class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
                >
                  <option value="BYN">BYN</option>
                  <option value="USD">USD</option>
                </select>
        
              </div>

              <div>
                <label
                  class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                >
                  Производитель
                </label>

                <select
                  v-model="form.manufacturerId"
                  class="w-full border border-line bg-white px-3 py-2 text-sm text-ink focus:border-moss focus:outline-none"
                >
                  <option :value="null" disabled hidden>
                    Выберите производителя
                  </option>
                  <option v-for="m in manufacturers" :key="m.id" :value="m.id">
                    {{ m.name }}
                  </option>
                </select>
              </div>

              <div>
                <label
                  class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                  >Тип кожи</label
                >
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="st in skinTypes"
                    :key="st.id"
                    class="cursor-pointer select-none border px-3 py-1 text-xs uppercase tracking-wide transition-colors"
                    :class="
                      form.skinTypeIds.includes(st.id)
                        ? 'border-moss bg-moss/10 bg-green-200 text-moss-dark'
                        : 'border-line text-ink-muted'
                    "
                  >
                    <input
                      type="checkbox"
                      :value="st.id"
                      v-model="form.skinTypeIds"
                      class="hidden"
                    />
                    {{ st.name }}
                  </label>
                </div>
              </div>

              <div>
                <label
                  class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                  >Назначение</label
                >
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="p in purposes"
                    :key="p.id"
                    class="cursor-pointer select-none border px-3 py-1 text-xs uppercase tracking-wide transition-colors"
                    :class="
                      form.purposeIds.includes(p.id)
                        ? 'border-moss bg-moss/10 bg-green-200 text-moss-dark'
                        : 'border-line text-ink-muted'
                    "
                  >
                    <input
                      type="checkbox"
                      :value="p.id"
                      v-model="form.purposeIds"
                      class="hidden"
                    />
                    {{ p.name }}
                  </label>
                </div>
              </div>

              <div>
                <label
                  class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                  >Подборки</label
                >
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="c in collections"
                    :key="c.id"
                    class="cursor-pointer select-none border px-3 py-1 text-xs uppercase tracking-wide transition-colors"
                    :class="
                      form.collectionIds.includes(c.id)
                        ? 'border-moss bg-moss/10 bg-green-200 text-moss-dark'
                        : 'border-line text-ink-muted'
                    "
                  >
                    <input
                      type="checkbox"
                      :value="c.id"
                      v-model="form.collectionIds"
                      class="hidden"
                    />
                    {{ c.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- ПРАВАЯ КОЛОНКА: медиа и характеристики -->
            <div class="space-y-4">
              <div>
            <label
              class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >Фото / видео</label
            >

            <div v-if="existingMedia.length" class="mb-3 flex flex-wrap gap-2">
              <div
                v-for="m in existingMedia"
                :key="m.id"
                class="relative h-20 w-20 overflow-hidden border border-line"
              >
                <video
                  v-if="m.mediaType === 'video'"
                  :src="m.url"
                  class="h-full w-full object-cover"
                  muted
                />
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

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              @change="handleFilesChange"
              class="text-sm"
            />

            <div
              v-if="newMediaPreviews.length"
              class="mt-2 flex flex-wrap gap-2"
            >
              <div
                v-for="(p, idx) in newMediaPreviews"
                :key="idx"
                class="relative h-20 w-20 overflow-hidden border border-line"
              >
                <video
                  v-if="p.type === 'video'"
                  :src="p.url"
                  class="h-full w-full object-cover"
                  muted
                />
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

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >
                Номинальное количество
              </label>
              <input
                v-model.number="form.netAmount"
                type="number"
                step="0.01"
                placeholder="например, 50"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                >Ед. измерения</label
              >
              <select
                v-model="form.netAmountUnit"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              >
                <option value="">—</option>
                <option value="ml">мл</option>
                <option value="l">л</option>
                <option value="g">г</option>
                <option value="kg">кг</option>
                <option value="pcs">шт</option>
              </select>
            </div>
          </div>

          <!-- Состав -->
          <div>
            <label
              class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
            >
              Состав (INCI, по убыванию доли)
            </label>
            <textarea
              v-model="form.ingredients"
              rows="3"
              placeholder="Aqua, Glycerin, ..."
              class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
            ></textarea>
          </div>

          <!-- Срок годности и партия -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >
                Срок годности (мес.)
              </label>
              <input
                v-model.number="form.shelfLifeMonths"
                type="number"
                min="1"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                >Номер партии</label
              >
              <input
                v-model="form.batchNumber"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>
          </div>

          <!-- Условия хранения / меры предосторожности / способ применения -->
          <div>
            <label
              class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
            >
              Условия хранения (если отличаются от стандартных)
            </label>
            <textarea
              v-model="form.storageConditions"
              rows="2"
              class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label
              class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >Меры предосторожности</label
            >
            <textarea
              v-model="form.precautions"
              rows="2"
              class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label
              class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >Способ применения</label
            >
            <textarea
              v-model="form.usageInstructions"
              rows="2"
              class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
            ></textarea>
          </div>

          <!-- Тон / фторид / для детей -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >
                Цвет/тон (декоративная косметика)
              </label>
              <input
                v-model="form.colorShade"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >
                Доля фторида (гигиена полости рта)
              </label>
              <input
                v-model="form.fluorideContent"
                placeholder="например, 1450 ppm"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="is-for-children"
              type="checkbox"
              v-model="form.isForChildren"
              class="h-4 w-4 border-line text-moss"
            />
            <label for="is-for-children" class="text-sm text-ink"
              >Детская косметика</label
            >
          </div>

          <!-- Документ соответствия -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >
                № декларации/регистрации ТР ТС 009/2011
              </label>
              <input
                v-model="form.conformityDocumentNumber"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                >Действует до</label
              >
              <input
                v-model="form.conformityDocumentValidUntil"
                type="date"
                class="w-full border border-line bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="in-stock"
              type="checkbox"
              v-model="form.inStock"
              class="h-4 w-4 border-line text-moss"
            />
            <label for="in-stock" class="text-sm text-ink">В наличии</label>
          </div>
            </div>
          </div>

          <!-- Ошибка и кнопки на всю ширину под обеими колонками -->
          <p v-if="formError" class="text-sm text-clay">{{ formError }}</p>

          <div
            class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"
          >
            <button
              type="button"
              @click="closeModal"
              class="w-full border border-line px-4 py-3 text-sm text-ink-muted transition hover:text-ink sm:w-auto sm:border-0 sm:py-2"
            >
              Отмена
            </button>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-moss px-5 py-3 text-sm font-medium uppercase tracking-wide text-black/70 transition-colors hover:bg-moss-dark disabled:opacity-50 sm:w-auto sm:py-2"
            >
              {{ submitting ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
