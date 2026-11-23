<template>
  <div
    class="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-[0_20px_45px_-22px_rgba(0,0,0,0.25)] sm:rounded-[22px]"
  >
    <!-- Изображение -->
    <div
      class="relative aspect-4/5 cursor-pointer overflow-hidden bg-petal-soft/40"
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
        class="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-ink-muted sm:text-xs"
      >
        Нет фото
      </div>

      <!-- Затемнение при наведении -->
      <div
        class="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <!-- Статус наличия -->
      <div
        v-if="!product.inStock"
        class="absolute inset-0 flex items-center justify-center bg-paper/60 backdrop-blur-[2px]"
      >
        <span
          class="rounded-full border border-clay/30 bg-white/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-clay sm:px-4 sm:py-1.5 sm:text-[11px] sm:tracking-[0.15em]"
        >
          Нет в наличии
        </span>
      </div>
      <span
        v-else
        class="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-moss shadow-sm backdrop-blur-sm sm:right-3.5 sm:top-3.5 sm:px-2.5"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
        <span class="hidden sm:inline">В наличии</span>
      </span>

      <!-- Быстрое добавление поверх фото (десктоп, при наведении) -->
      <button
        v-if="showButton && product.inStock"
        @click.stop="emit('click', product)"
        aria-label="Добавить в корзину"
        class="absolute bottom-3.5 right-3.5 hidden h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-md transition-all duration-300 hover:bg-ink hover:text-paper group-hover:translate-y-0 group-hover:opacity-100 md:flex"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>

    <!-- Контент -->
    <div class="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">
      <p
        class="mb-1 truncate text-[10px] font-medium uppercase tracking-widest text-ink-muted sm:mb-1.5 sm:text-[10.5px] sm:tracking-[0.14em]"
      >
        {{ product.manufacturer?.name }}
      </p>

      <h3
        class="mb-2 line-clamp-2 min-h-[2.6em] cursor-pointer wrap-break-word font-display text-[13px] font-medium leading-snug text-ink transition-colors hover:text-moss sm:mb-3 sm:min-h-[2.7em] sm:text-[15px]"
        @click="$emit('open-details', product)"
      >
        {{ product.name }}
      </h3>

      <!-- Цена -->
      <div class="mt-auto">
        <div v-if="product.isOnSale" class="flex flex-wrap items-baseline gap-x-2">
          <span class="whitespace-nowrap text-xs text-black/40 line-through sm:text-sm">
            {{ product.priceAmount }} BYN
          </span>
          <span class="whitespace-nowrap text-sm font-black text-black/80 sm:text-base">
            {{ product.effectivePrice }} BYN
          </span>
        </div>
        <div v-else class="whitespace-nowrap text-sm font-black text-black/60 sm:text-base">
          {{ product.priceAmount }} BYN
        </div>
      </div>

      <!-- Кнопка снизу (всегда видна, важна для мобильных) -->
      <button
        v-if="showButton && product.inStock"
        type="button"
        @click="emit('click', product)"
        class="mt-2.5 flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#6B4A2B]/60 px-2 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#6B4A2B] transition-colors hover:bg-[#6B4A2B] hover:text-white sm:mt-3.5 sm:px-4 sm:py-2.5 sm:text-xs"
      >
        <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
        </svg>
        <span class="sm:hidden">В корзину</span>
        <span class="hidden sm:inline">Добавить в корзину</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
</script>