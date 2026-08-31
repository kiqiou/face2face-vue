<template>
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
    <span
      v-if="product.inStock"
      class="absolute right-2 top-2 h-2 w-2 rounded-full bg-moss"
      aria-hidden="true"
    ></span>
  </div>

  <h3
    class="mb-1 font-display text-lg leading-snug text-ink transition-colors group-hover:text-moss"
  >
    {{ product.name }}
  </h3>
  <p class="mb-2 text-xs uppercase tracking-widest text-ink-muted">
    {{ product.manufacturer.name }}
  </p>

  <div class="flex items-baseline gap-2">
    <span class="text-base font-medium text-ink">
      {{ product.priceAmount }} {{ product.priceCurrency }}
    </span>
    <span v-if="product.priceUsd" class="text-xs text-ink-muted">
      (~{{ product.priceUsd }} USD)
    </span>
  </div>

  <GradientButton v-if="showButton" button-name="В Корзину"   @click="$emit('click', product)"/>
  <span
    v-if="!product.inStock"
    class="mt-2 inline-block rounded-full border border-clay/40 px-2 py-0.5 text-[11px] uppercase tracking-widest text-clay"
  >
    Нет в наличии
  </span>
</template>

<script setup lang="ts">
  import GradientButton from '../../components/ui/GradientButton.vue';
  import { Product } from '../../models/product.js';

  const coverImage = (product: Product) => product.media[0]?.url || product.imageUrl || '';

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
    (e: 'click', product: any): void;
    (e: 'open-details', product: any): void;
  }>();
</script>
