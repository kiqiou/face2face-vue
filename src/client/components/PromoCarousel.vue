<script setup lang="ts">
import { ref, computed } from 'vue';
import ProductCard from './ProductCard.vue';
import type { Product } from '../../models/product.js';

const props = defineProps<{
  products: Product[];
}>();

const emit = defineEmits<{
  addToCart: [product: Product];
  openDetails: [id: number];
}>();

const scrollRef = ref<HTMLElement | null>(null);

const scrollBy = (direction: 'left' | 'right') => {
  if (!scrollRef.value) return;
  const amount = scrollRef.value.clientWidth * 0.8;
  scrollRef.value.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
};

const canScroll = computed(() => props.products.length > 2);
</script>

<template>
  <section v-if="products.length" class="mb-12">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="bg-clay px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-white">
          Акция
        </span>
        <h2 class="font-display text-lg text-ink">Сейчас по акции</h2>
      </div>

      <div v-if="canScroll" class="flex gap-2">
        <button
          type="button"
          @click="scrollBy('left')"
          class="flex h-8 w-8 items-center justify-center border border-line text-ink-muted transition hover:border-moss hover:text-ink"
          aria-label="Назад"
        >
          ←
        </button>
        <button
          type="button"
          @click="scrollBy('right')"
          class="flex h-8 w-8 items-center justify-center border border-line text-ink-muted transition hover:border-moss hover:text-ink"
          aria-label="Вперёд"
        >
          →
        </button>
      </div>
    </div>

    <div
      ref="scrollRef"
      class="flex gap-5 overflow-x-auto pb-2 scroll-smooth"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="w-[240px] flex-shrink-0 cursor-pointer sm:w-[260px]"
      >
        <ProductCard
          :product="product"
          :show-button="true"
          @click="emit('addToCart', product)"
          @open-details="emit('openDetails', product.id)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* скрываем скроллбар в Chrome/Safari, оставляя сам скролл рабочим */
section div[ref] ::-webkit-scrollbar {
  display: none;
}
div.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>