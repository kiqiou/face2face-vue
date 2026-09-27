<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts } from '../../composables/product/useProducts.js';
import { useManufacturers } from '../../composables/product/manufacturer/useManufacturers.js';
import { usePurposes } from '../../composables/product/purposes/usePurposes.js';
import { useCollections } from '../../composables/product/collection/useCollections.js';
import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
import ProductCard from '../components/ProductCard.vue';
import { useProductsCartStore } from '../../stores/productsCart.js';
import { Product } from '../../models/product.js';

const router = useRouter();

const { products, loading, error, load } = useProducts();
const { manufacturers, load: loadManufacturers } = useManufacturers();
const { purposes, load: loadPurposes } = usePurposes();
const { collections, load: loadCollections } = useCollections();
const { skinTypes, load: loadSkinTypes } = useSkinTypes();

const productsCartStore = useProductsCartStore();

// теперь массивы вместо одиночных значений
const selectedManufacturers = ref<number[]>([]);
const selectedPurposes = ref<number[]>([]);
const selectedCollections = ref<number[]>([]);
const selectedSkinTypes = ref<number[]>([]);
const ordering = ref<'price_amount' | '-price_amount' | ''>('');
const onlyInStock = ref(false);

const applyFilters = () => {
  load({
    manufacturer: selectedManufacturers.value.length ? selectedManufacturers.value : undefined,
    purpose: selectedPurposes.value.length ? selectedPurposes.value : undefined,
    collection: selectedCollections.value.length ? selectedCollections.value : undefined,
    skinType: selectedSkinTypes.value.length ? selectedSkinTypes.value : undefined,
    ordering: ordering.value || undefined,
    inStock: onlyInStock.value ? true : undefined,
  });
};

const resetFilters = () => {
  selectedManufacturers.value = [];
  selectedPurposes.value = [];
  selectedCollections.value = [];
  selectedSkinTypes.value = [];
  ordering.value = '';
  onlyInStock.value = false;
  load();
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
  load();
  loadManufacturers();
  loadPurposes();
  loadCollections();
  loadSkinTypes();
});
</script>

<template>
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
      <div class="mb-10 border-b border-line"></div>

      <div class="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <!-- Filters -->
        <aside
          class="flex-shrink-0 space-y-6 divide-y divide-line lg:sticky lg:top-8 lg:w-64 lg:self-start"
        >
          <div>
            <label
              class="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
            >
              Производитель
            </label>
            <div class="space-y-1.5">
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

          <div class="pt-6">
            <label
              class="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
            >
              Назначение
            </label>
            <div class="space-y-1.5">
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

          <div class="pt-6">
            <label
              class="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
            >
              Подборка
            </label>
            <div class="space-y-1.5">
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

          <div class="pt-6">
            <label
              class="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
            >
              Тип кожи
            </label>
            <div class="space-y-1.5">
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

          <div class="pt-6">
            <label
              class="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted"
            >
              Сортировка по цене
            </label>
            <select
              v-model="ordering"
              @change="applyFilters"
              class="w-full border border-line bg-paper px-3 py-2 text-sm text-ink transition-colors focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/30"
            >
              <option value="">По умолчанию</option>
              <option value="price_amount">Сначала дешевле</option>
              <option value="-price_amount">Сначала дороже</option>
            </select>
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
            <span class="text-[11px] uppercase tracking-[0.15em] text-ink-muted">
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
        </section>
      </div>
    </div>
  </div>
</template>