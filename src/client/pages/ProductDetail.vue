<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProduct } from '../../composables/product/useProduct.js';

const route = useRoute();
const router = useRouter();

const { product, loading, error, load } = useProduct();

const activeIndex = ref(0);

// галерея = media, если есть; иначе фолбэк на legacy imageUrl одним слайдом
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
</script>

<template>
  <div class="min-h-screen bg-paper font-body text-ink">
    <div class="mx-auto max-w-5xl px-4 py-10 lg:py-16">
      <button
        @click="router.back()"
        class="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-moss"
      >
        <span aria-hidden="true">←</span> Назад к каталогу
      </button>

      <p v-if="loading" class="py-20 text-center text-sm text-ink-muted">Загрузка...</p>
      <p v-if="error" class="py-20 text-center text-sm text-clay">{{ error }}</p>

      <div v-if="product" class="grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:gap-16">
      <div>
        <!-- основной просмотр -->
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
          <h1 class="mb-6 font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
            {{ product.name }}
          </h1>

          <div class="mb-6 flex items-baseline gap-3 border-b border-line pb-6">
            <span class="font-display text-2xl text-moss">
              {{ product.priceAmount }} {{ product.priceCurrency }}
            </span>
            <span v-if="product.priceUsd" class="text-sm text-ink-muted">
              (~{{ product.priceUsd }} USD)
            </span>
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

          <div v-if="product.skinTypes.length" class="mb-6">
            <h3 class="mb-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">
              Подходит для типа кожи
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="st in product.skinTypes"
                :key="st.id"
                class="inline-block rounded-full bg-petal-soft px-3 py-1 text-xs text-ink"
              >
                {{ st.name }}
              </span>
            </div>
          </div>

          <div v-if="product.purposes.length" class="mb-6">
            <h3 class="mb-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Назначение</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="p in product.purposes"
                :key="p.id"
                class="inline-block rounded-full bg-moss-soft px-3 py-1 text-xs text-ink"
              >
                {{ p.name }}
              </span>
            </div>
          </div>

          <div v-if="product.collections.length">
            <h3 class="mb-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Подборки</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="c in product.collections"
                :key="c.id"
                class="inline-block rounded-full border border-line px-3 py-1 text-xs text-ink-muted"
              >
                {{ c.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>