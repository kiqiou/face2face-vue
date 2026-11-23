<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProduct } from '../../composables/product/useProduct.js';
import { useProductsCartStore } from '../../stores/productsCart.js';

const props = defineProps<{
  id: number;
  backRoute: string;
}>();


const route = useRoute();
const router = useRouter();

const { product, loading, error, load } = useProduct();
const cart = useProductsCartStore();

const activeIndex = ref(0);
const justAdded = ref(false);

const gallery = computed(() => {
  if (!product.value) return [];
  if (product.value.media.length) return product.value.media;
  if (product.value.imageUrl) {
    return [{ id: 0, url: product.value.imageUrl, mediaType: 'image' as const, order: 0 }];
  }
  return [];
});

const activeItem = computed(() => gallery.value[activeIndex.value] ?? null);

const goTo = (idx: number) => {
  activeIndex.value = idx;
};
const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + gallery.value.length) % gallery.value.length;
};
const next = () => {
  activeIndex.value = (activeIndex.value + 1) % gallery.value.length;
};

const addToCart = () => {
  if (!product.value || !product.value.inStock) return;
  cart.addProduct(product.value);

  justAdded.value = true;
  setTimeout(() => {
    justAdded.value = false;
  }, 1500);
};

const unitLabels: Record<string, string> = {
  ml: 'мл',
  l: 'л',
  g: 'г',
  kg: 'кг',
  pcs: 'шт',
};

const formattedNetAmount = computed(() => {
  if (!product.value || product.value.netAmount === null) return '';
  const unit = unitLabels[product.value.netAmountUnit] ?? '';
  return `${product.value.netAmount} ${unit}`.trim();
});

const formattedConformityDate = computed(() => {
  if (!product.value?.conformityDocumentValidUntil) return '';
  return new Date(product.value.conformityDocumentValidUntil).toLocaleDateString('ru-RU');
});

const specRows = computed(() => {
  if (!product.value) return [];
  const p = product.value;
  const rows: { label: string; value: string; highlight?: boolean }[] = [];

  if (p.ingredients) rows.push({ label: 'Состав', value: p.ingredients });
  if (p.fluorideContent) rows.push({ label: 'Содержание фторида', value: p.fluorideContent });
  if (p.shelfLifeMonths) rows.push({ label: 'Срок годности', value: `${p.shelfLifeMonths} мес. с даты изготовления` });
  if (p.storageConditions) rows.push({ label: 'Условия хранения', value: p.storageConditions });
  if (p.manufacturer) {
    rows.push({label: 'Производитель', value: p.manufacturer.name })
    rows.push({label: 'Адрес производителя', value: p.manufacturer.address })
    rows.push({label: 'Страна производителя', value: p.manufacturer.country })
  }
  if (p.precautions) rows.push({ label: 'Меры предосторожности', value: p.precautions, highlight: true });

  const manufacturerLines = [p.manufacturer.name, p.manufacturer.address, p.manufacturer.country]
    .filter(Boolean)
    .join(', ');
  if (p.manufacturer.address || p.manufacturer.country) {
    rows.push({ label: 'Изготовитель', value: manufacturerLines });
  }

  if (p.conformityDocumentNumber) {
    const doc = formattedConformityDate.value
      ? `№ ${p.conformityDocumentNumber}, действует до ${formattedConformityDate.value}`
      : `№ ${p.conformityDocumentNumber}`;
    rows.push({ label: 'Соответствие ТР ТС 009/2011', value: doc });
  }

  return rows;
});

const goBack = () => {
  // пришли из каталога: возвращаемся по истории, URL с ?page=… и позиция прокрутки сохранятся
  if (window.history.state?.back) router.back();
  // зашли по прямой ссылке: истории нет, ведём в каталог
  else router.push(props.backRoute);
};

// сбрасываем индекс, когда загрузился другой товар
watch(product, () => {
  activeIndex.value = 0;
});

watch(() => props.id, (newId) => {
  if (!Number.isNaN(newId)) {
    load(newId);
  }
}, { immediate: true });

watch(product, () => {
  activeIndex.value = 0;
});
</script>

<template>
  <div class="min-h-screen  font-body text-ink">
    <div class="mx-auto max-w-5xl px-4 py-10 lg:py-16">
      <button
        @click="goBack"
        class="mb-8 inline-flex items-center gap-2 rounded-full border border-caramel/50 px-5 py-2 text-xs tracking-[0.2em] uppercase text-ink transition-colors hover:bg-caramel hover:text-white"
      >
        <span aria-hidden="true">←</span> Назад
      </button>

      <p v-if="loading" class="py-20 text-center text-sm text-ink-muted">Загрузка...</p>
      <p v-if="error" class="py-20 text-center text-sm text-clay">{{ error }}</p>

      <div v-if="product">
        <div class="grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:gap-16">
          <!-- галерея -->
          <div>
            <div class="relative aspect-4/5 overflow-hidden rounded-4xl bg-peach/40 shadow-[0_20px_50px_-20px_rgba(201,139,94,0.45)]">
              <video
                v-if="activeItem && activeItem.mediaType === 'video'"
                :src="activeItem.url"
                class="h-full w-full object-cover"
                controls
                playsinline
              />
              <img
                v-else-if="activeItem"
                :src="activeItem.url"
                :alt="product?.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-ink-muted">
                Нет фото
              </div>

              <template v-if="gallery.length > 1">
                <button
                  @click="prev"
                  aria-label="Предыдущее"
                  class="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow transition-colors hover:bg-white"
                >
                  ←
                </button>
                <button
                  @click="next"
                  aria-label="Следующее"
                  class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow transition-colors hover:bg-white"
                >
                  →
                </button>
                <span class="absolute bottom-3 right-3 rounded-full bg-ink/60 px-3 py-0.5 text-[11px] text-white">
                  {{ activeIndex + 1 }} / {{ gallery.length }}
                </span>
              </template>
            </div>

            <div v-if="gallery.length > 1" class="mt-4 flex gap-2 overflow-x-auto pb-1">
              <button
                v-for="(item, idx) in gallery"
                :key="item.id"
                @click="goTo(idx)"
                class="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors"
                :class="idx === activeIndex ? 'border-caramel' : 'border-transparent opacity-70 hover:opacity-100'"
              >
                <video v-if="item.mediaType === 'video'" :src="item.url" class="h-full w-full object-cover" muted />
                <img v-else :src="item.url" class="h-full w-full object-cover" />
                <span
                  v-if="item.mediaType === 'video'"
                  class="absolute inset-0 flex items-center justify-center bg-black/20 text-xs text-white"
                >
                  ▶
                </span>
              </button>
            </div>
          </div>

          <!-- инфо -->
          <div>
            <span class="mb-4 inline-block rounded-full bg-peach px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-ink">
              {{ product.manufacturer.name }}
            </span>
            <h1 class="mb-4 text-3xl font-medium leading-tight text-ink md:text-4xl">
              {{ product.name }}
            </h1>

            <div v-if="product.isForChildren || product.colorShade" class="mb-5 flex flex-wrap gap-2">
              <span
                v-if="product.isForChildren"
                class="rounded-full bg-caramel/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-caramel-dark"
              >
                Детская косметика
              </span>
              <span
                v-if="product.colorShade"
                class="rounded-full border border-caramel/40 px-3 py-1 text-[11px] uppercase tracking-wide text-ink-muted"
              >
                Тон: {{ product.colorShade }}
              </span>
            </div>

            <div class="mb-6 border-b border-line pb-6">
              <div class="mb-1 flex items-baseline gap-3">
                <span class="text-4xl font-semibold text-caramel">
                  {{ product.priceAmount }} {{ product.priceCurrency }}
                </span>
                <span v-if="product.priceUsd" class="text-sm text-ink-muted">
                  (~{{ product.priceUsd }} USD)
                </span>
              </div>

              <p v-if="formattedNetAmount" class="mb-5 text-sm text-ink-muted">{{ formattedNetAmount }}</p>
              <div v-else class="mb-5"></div>

              <button
                @click="addToCart"
                :disabled="!product.inStock"
                class="w-full rounded-full border border-caramel bg-caramel px-8 py-3.5 text-sm font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-ink-muted disabled:shadow-none sm:w-auto"
              >
                {{ !product.inStock ? 'Нет в наличии' : justAdded ? 'Добавлено ✓' : 'В корзину →' }}
              </button>
            </div>

            <span
              v-if="!product.inStock"
              class="mb-6 inline-block rounded-full border border-clay/40 px-3 py-1 text-[11px] uppercase tracking-widest text-clay"
            >
              Нет в наличии
            </span>

            <div v-if="product.description" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.2em] text-ink-muted">Описание</h3>
              <p class="text-sm leading-relaxed text-ink/90">{{ product.description }}</p>
            </div>

            <div v-if="product.usageInstructions" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.2em] text-ink-muted">Способ применения</h3>
              <p class="text-sm leading-relaxed text-ink/90">{{ product.usageInstructions }}</p>
            </div>

            <!-- Тип кожи — персиковая плашка -->
            <div v-if="product.skinTypes.length" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.2em] text-ink-muted">Подходит для типа кожи</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="st in product.skinTypes" :key="st.id"
                  class="rounded-full bg-peach px-3.5 py-1 text-xs font-medium text-ink">
                  {{ st.name }}
                </span>
              </div>
            </div>

            <!-- Назначение — карамельная плашка -->
            <div v-if="product.purposes.length" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.2em] text-ink-muted">Назначение</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="p in product.purposes" :key="p.id"
                  class="rounded-full bg-caramel/15 px-3.5 py-1 text-xs font-medium text-caramel-dark">
                  {{ p.name }}
                </span>
              </div>
            </div>

            <!-- Подборки — контурная пилюля, как кнопка на баннере -->
            <div v-if="product.collections.length" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.2em] text-ink-muted">Подборки</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="c in product.collections" :key="c.id"
                  class="rounded-full border border-caramel/50 px-3.5 py-1 text-xs font-medium text-ink">
                  {{ c.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- характеристики -->
        <div v-if="specRows.length" class="mt-10 rounded-4xl bg-cream/80 p-6 shadow-[0_20px_50px_-30px_rgba(201,139,94,0.5)] sm:mt-14 sm:p-10">
          <h3 class="mb-4 text-[11px] uppercase tracking-[0.25em] text-ink-muted sm:mb-5">Характеристики</h3>

          <table class="block w-full border-collapse text-sm sm:table">
            <tbody class="block sm:table-row-group">
              <tr
                v-for="row in specRows"
                :key="row.label"
                class="mb-3 block rounded-2xl border border-line px-4 py-3 last:mb-0 sm:mb-0 sm:table-row sm:rounded-none sm:border-0 sm:border-t sm:px-0 sm:py-0"
                :class="row.highlight ? 'bg-clay/5' : ''"
              >
                <td
                  class="block w-full pb-1 text-[10px] font-medium uppercase tracking-widest sm:table-cell sm:w-1/4 sm:py-3 sm:pr-4 sm:pb-3 sm:text-xs"
                  :class="row.highlight ? 'text-clay' : 'text-ink-muted'"
                >
                  {{ row.label }}
                </td>
                <td
                  class="block min-w-0 text-sm leading-relaxed wrap-anywhere sm:table-cell sm:py-3"
                  :class="row.highlight ? 'text-ink/80' : 'text-ink/90'"
                >
                  {{ row.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>