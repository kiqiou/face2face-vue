<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from '../../composables/product/useProducts.js';
import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
import { usePurposes } from '../../composables/product/purposes/usePurposes.js';
import { useProductsCartStore } from '../../stores/productsCart.js';
import { CONCERN_NAMES, skinConcerns, skinKey, TYPE_NAMES } from '../../composables/quiz/skinQuiz.js';
import ProductCard from './ProductCard.vue';
import SkinQuizModal from './SkinQuizModal.vue';

const route = useRoute();
const router = useRouter();
const cart = useProductsCartStore();

// отдельный экземпляр: каталог и его фильтры не затрагиваются
const { products, loading, load } = useProducts();
const { skinTypes, load: loadTypes } = useSkinTypes();
const { purposes, load: loadPurposes } = usePurposes();
const open = ref(false);

const typeId = computed(() =>
  skinKey.value ? skinTypes.value.find((s) => s.name === TYPE_NAMES[skinKey.value!])?.id : undefined
);
const purposeIds = computed(() =>
  skinConcerns.value
    .map((k) => purposes.value.find((p) => p.name === CONCERN_NAMES[k])?.id)
    .filter(Boolean) as number[]
);

const fetchPicks = async () => {
  if (!typeId.value || !purposes.value.length) return;
  await load({
    skinType: [typeId.value],
    purpose: purposeIds.value.length ? purposeIds.value : undefined,
    inStock: true,
    pageSize: 8,
  });
  // если по проблемам ничего не нашлось, показываем просто по типу кожи
  if (purposeIds.value.length && !products.value.length) {
    await load({ skinType: [typeId.value], inStock: true, pageSize: 8 });
  }
};

watch([typeId, purposeIds], fetchPicks);

const subtitle = computed(() => {
  if (!skinKey.value) return '';
  const parts = [`${TYPE_NAMES[skinKey.value]} кожа`, ...skinConcerns.value.map((k) => CONCERN_NAMES[k].toLowerCase())];
  return parts.join(' · ');
});

onMounted(async () => {
  await Promise.all([loadTypes(), loadPurposes()]);
  await fetchPicks();
  if (route.hash === '#for-you') {
    await nextTick();
    document.getElementById('for-you')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

const scrollRef = ref<HTMLElement | null>(null);

const scrollBy = (direction: 'left' | 'right') => {
  if (!scrollRef.value) return;
  const amount = scrollRef.value.clientWidth * 0.8;
  scrollRef.value.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
};

const canScroll = computed(() => products.value.length > 2);
</script>

<template>
  <section v-if="skinKey" id="for-you" class="mb-12 scroll-mt-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <!-- Декоративная иконка (без изменений) -->
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E5C5A7] bg-[#F9EBDD] text-[#A87959] shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 14.5C10.2 12.9 7.5 11.2 7.5 8.8C7.5 6.5 10.4 5.7 12 8C13.6 5.7 16.5 6.5 16.5 8.8C16.5 11.2 13.8 12.9 12 14.5Z" />
            <path d="M3.5 13.5C5.5 13.2 7 14.5 8.2 15.5L10.2 17.1C11.2 17.9 12.8 17.9 13.8 17.1L19.8 12.8C20.5 12.3 21.4 12.5 21.5 13.3C21.6 13.8 21.3 14.2 20.9 14.6L15 19C13.3 20.3 10.8 20.4 9 19.2L5.5 16.8L3.5 16.5Z" />
          </svg>
        </div>

        <div>
          <p class="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B17C53]">
            Ваш персональный подбор
          </p>
          <h2 class="text-2xl font-black text-stone-800 sm:text-3xl">Рекомендации для вас</h2>
          <p class="mt-1 text-sm text-black/55">{{ subtitle }}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button
          @click="open = true"
          class="text-xs uppercase tracking-wide text-[#B17C53] underline underline-offset-4 transition-transform hover:scale-105"
        >
          Пройти тест заново
        </button>

        <div v-if="canScroll" class="flex gap-2">
          <button type="button" @click="scrollBy('left')" aria-label="Назад"
            class="flex h-8 w-8 items-center justify-center border border-line text-ink-muted transition hover:border-moss hover:text-ink">←</button>
          <button type="button" @click="scrollBy('right')" aria-label="Вперёд"
            class="flex h-8 w-8 items-center justify-center border border-line text-ink-muted transition hover:border-moss hover:text-ink">→</button>
        </div>
      </div>
    </div>

    <!-- загрузка: те же размеры, что у карточек -->
    <div v-if="loading" class="flex gap-3 overflow-hidden sm:gap-5">
      <div v-for="n in 4" :key="n" class="h-90 w-50 shrink-0 animate-pulse rounded-2xl bg-white/60 sm:w-65" />
    </div>

    <div
      v-else-if="products.length"
      ref="scrollRef"
      class="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-2 sm:gap-5"
    >
      <div v-for="p in products" :key="p.id" class="w-50 shrink-0 cursor-pointer sm:w-65">
        <ProductCard
          :product="p"
          :show-button="true"
          @click="cart.addProduct(p)"
          @open-details="router.push(`/products/${p.id}`)"
        />
      </div>
    </div>

    <p v-else class="py-6 text-center text-sm text-black/50">Пока нет подходящих товаров в наличии.</p>

    <SkinQuizModal v-if="open" @close="open = false" />
  </section>
</template>

<style scoped>
.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>