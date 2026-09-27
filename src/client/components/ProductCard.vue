<template>
  <div
    class="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white transition-all duration-300 hover:shadow-[0_20px_45px_-22px_rgba(0,0,0,0.25)]"
  >
    <!-- Изображение -->
    <div
      class="relative aspect-[4/5] cursor-pointer overflow-hidden bg-petal-soft/40"
      @click="$emit('open-details', product)"
    >
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="product.name"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        :class="{ 'opacity-60 grayscale': !product.inStock }"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-ink-muted"
      >
        Нет фото
      </div>

      <!-- Затемнение при наведении -->
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <!-- Статус наличия -->
      <div
        v-if="!product.inStock"
        class="absolute inset-0 flex items-center justify-center bg-paper/60 backdrop-blur-[2px]"
      >
        <span
          class="rounded-full border border-clay/30 bg-white/90 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-clay"
        >
          Нет в наличии
        </span>
      </div>
      <span
        v-else
        class="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-moss shadow-sm backdrop-blur-sm"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
        В наличии
      </span>

      <!-- Быстрое добавление поверх фото (десктоп, при наведении) -->
      <button
        v-if="showButton && product.inStock"
        @click.stop="emit('click', product)"
        aria-label="Добавить в корзину"
        class="absolute bottom-3.5 right-3.5 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-md transition-all duration-300 hover:bg-ink hover:text-paper group-hover:opacity-100 md:flex translate-y-2 group-hover:translate-y-0"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>

    <!-- Контент -->
    <div class="flex flex-1 flex-col p-4">
      <p class="mb-1.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-ink-muted">
        {{ product.manufacturer.name }}
      </p>

      <h3
        class="mb-3 line-clamp-2 cursor-pointer font-display text-[15px] font-medium leading-snug text-ink transition-colors hover:text-moss"
        @click="$emit('open-details', product)"
      >
        {{ product.name }}
      </h3>

      <div class="mt-auto flex items-baseline gap-1.5 pt-1">
        <span class="font-display text-lg text-ink">
          {{ formattedPrice }}&nbsp;{{ product.priceCurrency }}
        </span>
        <span v-if="product.priceUsd" class="text-xs text-ink-muted">
          (~{{ product.priceUsd }} USD)
        </span>
      </div>

      <!-- Кнопка снизу (всегда видна — важна для мобильных, где нет ховера) -->
      <AddToCartButton
        v-if="showButton && product.inStock"
        class="mt-3.5"
        @click="emit('click', product)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AddToCartButton from '../../components/ui/AddToCartButton.vue';
import type { Product } from '../../models/product.js';

const props = withDefaults(
  defineProps<{
    product: Product;
    showButton?: boolean;
  }>(),
  {
    showButton: true,
  }
);

const emit = defineEmits<{
  (e: 'click', product: Product): void;
  (e: 'open-details', product: Product): void;
}>();

const coverImage = computed(
  () => props.product.media?.[0]?.url || props.product.imageUrl || ''
);

const formattedPrice = computed(() =>
  new Intl.NumberFormat('ru-RU').format(props.product.priceAmount)
);
</script>