<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts } from '../../composables/product/useProducts.js';
import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
import ProductCard from './ProductCard.vue';
import SkinQuizModal from './SkinQuizModal.vue';
import { skinKey, TYPE_NAMES } from '../../composables/quiz/skinQuiz.js';

const router = useRouter();
const { products, load } = useProducts();
const { skinTypes, load: loadTypes } = useSkinTypes();
const open = ref(false);

const typeId = computed(() =>
  skinKey.value ? skinTypes.value.find((s) => s.name === TYPE_NAMES[skinKey.value!])?.id : undefined
);

watch(typeId, (id) => id && load({ skinType: id, inStock: true, pageSize: 4 }), { immediate: true });
onMounted(loadTypes);
</script>

<template>
  <section class="mb-10">
    <!-- тест не пройден: компактная плашка -->
    <div
      v-if="!skinKey"
      class="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#E5A663]/30 bg-[#FFFBF3] p-5 sm:flex-row"
    >
      <div>
        <p class="font-semibold text-stone-800">Подберём уход по типу кожи</p>
        <p class="text-sm text-stone-600">5 вопросов, около минуты. Покажем товары именно для вас.</p>
      </div>
      <button
        @click="open = true"
        class="shrink-0 rounded-full bg-[#E5A663] px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white"
      >
        Пройти тест
      </button>
    </div>

    <!-- тест пройден: рекомендации -->
    <div v-else>
      <div class="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 class="text-xl font-black text-stone-800">
          Рекомендации для вас
          <span class="text-sm font-normal text-black/50">· {{ TYPE_NAMES[skinKey] }} кожа</span>
        </h3>
        <button @click="open = true" class="text-xs uppercase tracking-wide text-[#E5A663] underline underline-offset-4">
          Пройти заново
        </button>
      </div>

      <div v-if="products.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :product="p"
          :show-button="false"
          @open-details="router.push(`/products/${p.id}`)"
        />
      </div>
    </div>

    <SkinQuizModal v-if="open" @close="open = false" />
  </section>
</template>