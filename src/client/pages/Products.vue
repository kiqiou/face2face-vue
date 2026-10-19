<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProducts } from '../../composables/product/useProducts.js';
  import { useManufacturers } from '../../composables/product/manufacturer/useManufacturers.js';
  import { usePurposes } from '../../composables/product/purposes/usePurposes.js';
  import { useCollections } from '../../composables/product/collection/useCollections.js';
  import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
  import ProductCard from '../components/ProductCard.vue';
  import PromoBanner from '../components/PromoBanner.vue';
  import { useProductsCartStore } from '../../stores/productsCart.js';
  import { Product } from '../../models/product.js';
  import PromoCarousel from '../components/PromoCarousel.vue';
  import AppPagination from '../components/AppPagination.vue';

  const router = useRouter();

  const { products, totalCount, loading, error, load } = useProducts();
  const { products: promoProducts, load: loadPromo } = useProducts();
  const { manufacturers, load: loadManufacturers } = useManufacturers();
  const { purposes, load: loadPurposes } = usePurposes();
  const { collections, load: loadCollections } = useCollections();
  const { skinTypes, load: loadSkinTypes } = useSkinTypes();

  const productsCartStore = useProductsCartStore();

  const selectedManufacturers = ref<number[]>([]);
  const selectedPurposes = ref<number[]>([]);
  const selectedCollections = ref<number[]>([]);
  const selectedSkinTypes = ref<number[]>([]);
  const ordering = ref<'price_amount' | '-price_amount' | ''>('');
  const onlyInStock = ref(false);

  const search = ref('');
  const page = ref(1);
  const PAGE_SIZE = 12;

  const fetchProducts = () => {
    load({
      manufacturer: selectedManufacturers.value.length ? selectedManufacturers.value : undefined,
      purpose: selectedPurposes.value.length ? selectedPurposes.value : undefined,
      collection: selectedCollections.value.length ? selectedCollections.value : undefined,
      skinType: selectedSkinTypes.value.length ? selectedSkinTypes.value : undefined,
      ordering: ordering.value || undefined,
      inStock: onlyInStock.value ? true : undefined,
      search: search.value || undefined,
      page: page.value,
      pageSize: PAGE_SIZE,
    });
  };

  const openSections = ref({
    skinType: true,
    manufacturer: false,
    purpose: false,
    collection: false,
  });

  const toggleSection = (key: keyof typeof openSections.value) => {
    openSections.value[key] = !openSections.value[key];
  };

  const applyFilters = () => {
    page.value = 1;
    fetchProducts();
  };

  let searchTimer: ReturnType<typeof setTimeout>;

  const onSearchInput = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 350);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages.value || p === page.value) return;
    page.value = p;
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)));

  const visiblePages = computed<(number | '…')[]>(() => {
    const total = totalPages.value;
    const cur = page.value;
    const pages: (number | '…')[] = [];
    const add = (n: number | '…') => pages.push(n);

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - cur) <= 1) {
        add(i);
      } else if (pages[pages.length - 1] !== '…') {
        add('…');
      }
    }
    return pages;
  });


  const resetFilters = () => {
    selectedManufacturers.value = [];
    selectedPurposes.value = [];
    selectedCollections.value = [];
    selectedSkinTypes.value = [];
    ordering.value = '';
    onlyInStock.value = false;
    search.value = '';
    page.value = 1;
    fetchProducts();
  };

  const addToCart = (product: Product) => {
    productsCartStore.addProduct(product);
  };

  const hasProducts = computed(
    () => !loading.value && products.value.length > 0
  );

  const goToProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  const activeFiltersCount = computed(
    () =>
      selectedManufacturers.value.length +
      selectedPurposes.value.length +
      selectedCollections.value.length +
      selectedSkinTypes.value.length +
      (onlyInStock.value ? 1 : 0)
  );

  onMounted(() => {
    fetchProducts();
    loadPromo({ onSale: true, pageSize: 10 });
    loadPromo();
    loadManufacturers();
    loadPurposes();
    loadCollections();
    loadSkinTypes();
  });
</script>

<template>
  <section class="mb-12 min-w-0 max-w-full">
    <div class="min-h-screen bg-paper font-body text-ink">
      <div class="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <p class="mb-3 text-xs uppercase tracking-[0.2em] text-ink-muted">
          Каталог
        </p>
        <h1
          class="mb-8 font-display text-4xl font-medium leading-tight text-ink md:text-5xl"
        >
          Товары
        </h1>

        <!-- Баннер -->
        <PromoBanner class="mb-10" />

        <PromoCarousel
          :products="promoProducts"
          @add-to-cart="addToCart"
          @open-details="goToProduct"
        />

        <div class="mb-10 border-b border-line"></div>

        <div class="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <!-- Filters -->
          <aside
            class="flex-shrink-0 space-y-0 divide-y divide-line lg:sticky lg:top-8 lg:w-64 lg:self-start"
          >
            <!-- Тип кожи — первый, открыт по умолчанию -->
            <div class="pb-6">
              <button
                type="button"
                @click="toggleSection('skinType')"
                class="mb-2 flex w-full items-center justify-between text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
              >
                Тип кожи
                <span
                  class="transition-transform"
                  :class="{ 'rotate-180': openSections.skinType }"
                  >▾</span
                >
              </button>
              <div v-show="openSections.skinType" class="space-y-1.5">
                <label
                  v-for="st in skinTypes"
                  :key="st.id"
                  class="flex items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    :value="st.id"
                    v-model="selectedSkinTypes"
                    @change="applyFilters"
                    class="h-4 w-4 border-line text-moss focus:ring-moss/30"
                  />
                  {{ st.name }}
                </label>
              </div>
            </div>

            <div class="pt-6 pb-6">
              <button
                type="button"
                @click="toggleSection('manufacturer')"
                class="mb-2 flex w-full items-center justify-between text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
              >
                Производитель
                <span
                  class="transition-transform"
                  :class="{ 'rotate-180': openSections.manufacturer }"
                  >▾</span
                >
              </button>
              <div v-show="openSections.manufacturer" class="space-y-1.5">
                <label
                  v-for="m in manufacturers"
                  :key="m.id"
                  class="flex items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    :value="m.id"
                    v-model="selectedManufacturers"
                    @change="applyFilters"
                    class="h-4 w-4 border-line text-moss focus:ring-moss/30"
                  />
                  {{ m.name }}
                </label>
              </div>
            </div>

            <div class="pt-6 pb-6">
              <button
                type="button"
                @click="toggleSection('purpose')"
                class="mb-2 flex w-full items-center justify-between text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
              >
                Назначение
                <span
                  class="transition-transform"
                  :class="{ 'rotate-180': openSections.purpose }"
                  >▾</span
                >
              </button>
              <div v-show="openSections.purpose" class="space-y-1.5">
                <label
                  v-for="p in purposes"
                  :key="p.id"
                  class="flex items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    :value="p.id"
                    v-model="selectedPurposes"
                    @change="applyFilters"
                    class="h-4 w-4 border-line text-moss focus:ring-moss/30"
                  />
                  {{ p.name }}
                </label>
              </div>
            </div>

            <div class="pt-6 pb-6">
              <button
                type="button"
                @click="toggleSection('collection')"
                class="mb-2 flex w-full items-center justify-between text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
              >
                Подборка
                <span
                  class="transition-transform"
                  :class="{ 'rotate-180': openSections.collection }"
                  >▾</span
                >
              </button>
              <div v-show="openSections.collection" class="space-y-1.5">
                <label
                  v-for="c in collections"
                  :key="c.id"
                  class="flex items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    :value="c.id"
                    v-model="selectedCollections"
                    @change="applyFilters"
                    class="h-4 w-4 border-line text-moss focus:ring-moss/30"
                  />
                  {{ c.name }}
                </label>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-6">
              <input
                id="in-stock"
                type="checkbox"
                v-model="onlyInStock"
                @change="applyFilters"
                class="h-4 w-4 border-line text-moss focus:ring-moss/30"
              />
              <label for="in-stock" class="text-sm text-ink"
                >Только в наличии</label
              >
            </div>

            <div class="flex items-center justify-between pt-6">
              <span
                class="text-[11px] uppercase tracking-[0.15em] text-ink-muted"
              >
                Активно: {{ activeFiltersCount }}
              </span>
              <button
                @click="resetFilters"
                class="text-[11px] uppercase tracking-[0.15em] text-clay underline decoration-clay/40 underline-offset-4 transition-colors hover:text-ink"
              >
                Сбросить фильтры
              </button>
            </div>
          </aside>

          <!-- Catalog -->
          <section class="flex-1">
            <!-- Панель сортировки над товарами, справа -->
            <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div class="flex-1 max-w-md">
                  <input
                    v-model="search"
                    @input="onSearchInput"
                    type="search"
                    placeholder="Поиск по названию, описанию, производителю"
                    class="w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/30"
                  />
                  <span class="mt-2 block text-sm text-ink-muted">{{ totalCount }} товаров</span>
                </div>

              <div class="flex flex-col gap-2 justify-center">
                <p>Сортировать по цене:</p>
                <select
                  v-model="ordering"
                  @change="applyFilters"
                  class="border border-line bg-paper px-3 py-2 text-sm text-ink transition-colors focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/30"
                >
                  <option value="">По умолчанию</option>
                  <option value="price_amount">Сначала дешевле</option>
                  <option value="-price_amount">Сначала дороже</option>
                </select>
              </div>
            </div>

            <p v-if="loading" class="py-20 text-center text-sm text-ink-muted">
              Загрузка...
            </p>
            <p v-if="error" class="py-20 text-center text-sm text-clay">
              {{ error }}
            </p>
            <p
              v-if="!loading && !error && products.length === 0"
              class="py-20 text-center font-display text-lg italic text-ink-muted"
            >
              Товары не найдены.
            </p>

            <div
              v-if="hasProducts"
              class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div
                v-for="product in products"
                :key="product.id"
                class="group h-full cursor-pointer"
              >
                <ProductCard
                  :product="product"
                  :show-button="true"
                  @click="addToCart(product)"
                  @open-details="goToProduct(product.id)"
                />
              </div>
            </div>
            <AppPagination :page="page" :total-pages="totalPages" @change="goToPage" />
          </section>
        </div>
      </div>
    </div>
  </section>
</template>
