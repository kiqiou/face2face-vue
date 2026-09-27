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

// сбрасываем индекс, когда загрузился другой товар
watch(product, () => {
  activeIndex.value = 0;
});

onMounted(() => {
  const id = Number(route.params.id);
  if (!Number.isNaN(id)) {
    load(id);
  }
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
  <div class="min-h-screen bg-paper font-body text-ink">
    <div class="mx-auto max-w-5xl px-4 py-10 lg:py-16">
      <button
        @click="router.push(props.backRoute)"
        class="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-moss"
      >
        <span aria-hidden="true">←</span> Назад к каталогу
      </button>

      <p v-if="loading" class="py-20 text-center text-sm text-ink-muted">Загрузка...</p>
      <p v-if="error" class="py-20 text-center text-sm text-clay">{{ error }}</p>

      <div v-if="product">
        <div class="grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:gap-16">
          <div>
            <div class="relative aspect-[4/5] overflow-hidden bg-petal-soft/40">
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
              <div v-else class="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-ink-muted">
                Нет фото
              </div>

              <template v-if="gallery.length > 1">
                <button
                  @click="prev"
                  aria-label="Предыдущее"
                  class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 px-2 py-1 text-sm text-ink hover:bg-white"
                >
                  ←
                </button>
                <button
                  @click="next"
                  aria-label="Следующее"
                  class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 px-2 py-1 text-sm text-ink hover:bg-white"
                >
                  →
                </button>
                <span class="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 text-[11px] text-white">
                  {{ activeIndex + 1 }} / {{ gallery.length }}
                </span>
              </template>
            </div>

            <!-- миниатюры -->
            <div v-if="gallery.length > 1" class="mt-3 flex gap-2 overflow-x-auto pb-1">
              <button
                v-for="(item, idx) in gallery"
                :key="item.id"
                @click="goTo(idx)"
                class="relative h-16 w-16 shrink-0 overflow-hidden border transition-colors"
                :class="idx === activeIndex ? 'border-moss' : 'border-line'"
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

          <div>
            <p class="mb-2 text-xs uppercase tracking-[0.2em] text-ink-muted">
              {{ product.manufacturer.name }}
            </p>
            <h1 class="mb-3 font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
              {{ product.name }}
            </h1>

            <!-- бейджи: для детей / тон -->
            <div v-if="product.isForChildren || product.colorShade" class="mb-4 flex flex-wrap gap-2">
              <span
                v-if="product.isForChildren"
                class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-amber-800"
              >
                Детская косметика
              </span>
              <span
                v-if="product.colorShade"
                class="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-wide text-ink-muted"
              >
                Тон: {{ product.colorShade }}
              </span>
            </div>

            <div class="mb-6 border-b border-line pb-6">
              <div class="mb-1 flex items-baseline gap-3">
                <span class="font-display text-2xl text-moss">
                  {{ product.priceAmount }} {{ product.priceCurrency }}
                </span>
                <span v-if="product.priceUsd" class="text-sm text-ink-muted">
                  (~{{ product.priceUsd }} USD)
                </span>
              </div>

              <p v-if="formattedNetAmount" class="mb-4 text-sm text-ink-muted">
                {{ formattedNetAmount }}
              </p>
              <div v-else class="mb-4"></div>

              <button
                @click="addToCart"
                :disabled="!product.inStock"
                class="w-full rounded-none border border-moss bg-moss px-6 py-3 text-sm uppercase tracking-[0.15em] text-black/80 transition-colors hover:bg-moss/90 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-ink-muted sm:w-auto"
              >
                {{ !product.inStock ? 'Нет в наличии' : justAdded ? 'Добавлено ✓' : 'В корзину' }}
              </button>
            </div>

            <span
              v-if="!product.inStock"
              class="mb-6 inline-block rounded-full border border-clay/40 px-3 py-1 text-[11px] uppercase tracking-widest text-clay"
            >
              Нет в наличии
            </span>

            <div v-if="product.description" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Описание</h3>
              <p class="text-sm leading-relaxed text-ink/90">{{ product.description }}</p>
            </div>

            <div v-if="product.usageInstructions" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Способ применения</h3>
              <p class="text-sm leading-relaxed text-ink/90">{{ product.usageInstructions }}</p>
            </div>

            <!-- Тип кожи — розовый акцент -->
            <div v-if="product.skinTypes.length" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">
                Подходит для типа кожи
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="st in product.skinTypes"
                  :key="st.id"
                  class="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800"
                >
                  {{ st.name }}
                </span>
              </div>
            </div>

            <!-- Назначение — зелёный акцент (moss) -->
            <div v-if="product.purposes.length" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Назначение</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="p in product.purposes"
                  :key="p.id"
                  class="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800"
                >
                  {{ p.name }}
                </span>
              </div>
            </div>

            <!-- Подборки — синий/нейтральный акцент -->
            <div v-if="product.collections.length" class="mb-6">
              <h3 class="mb-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Подборки</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="c in product.collections"
                  :key="c.id"
                  class="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800"
                >
                  {{ c.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- таблица характеристик — на всю ширину контейнера -->
        <div v-if="specRows.length" class="mt-12 border-t border-line pt-10">
          <h3 class="mb-4 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Характеристики</h3>
          <table class="w-full border-collapse text-sm">
            <tbody>
              <tr
                v-for="row in specRows"
                :key="row.label"
                class="border-t border-line align-top first:border-t-0"
                :class="row.highlight ? 'bg-clay/5' : ''"
              >
                <td
                  class="w-full py-3 pr-4 align-top text-xs uppercase tracking-[0.1em] sm:w-1/4"
                  :class="row.highlight ? 'text-clay' : 'text-ink-muted'"
                >
                  {{ row.label }}
                </td>
                <td
                  class="py-3 leading-relaxed"
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