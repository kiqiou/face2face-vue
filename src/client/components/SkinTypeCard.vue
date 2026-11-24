<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SkinQuizModal from './SkinQuizModal.vue';
import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
import { skinKey, TYPE_INFO, TYPE_NAMES } from '../../composables/quiz/skinQuiz.js';

const router = useRouter();
const open = ref(false);

const { skinTypes, load } = useSkinTypes();
onMounted(load);

const showProducts = () => router.push({ path: '/products', hash: '#for-you' });

</script>

<template>
  <div class="w-full rounded-4xl border border-line bg-white/70 p-6 shadow-[0_20px_50px_-30px_rgba(201,139,94,0.55)]">
    <span class="mb-3 inline-block rounded-full bg-peach px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-ink">
      Тип кожи
    </span>

    <template v-if="skinKey">
      <h3 class="font-display text-2xl font-medium text-ink">{{ TYPE_NAMES[skinKey] }}</h3>
      <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ TYPE_INFO[skinKey].text }}</p>
      <div class="mt-5 flex flex-row items-center gap-3">
        <button
          @click="showProducts"
          class="rounded-full bg-caramel px-2 py-2.5 text-xs font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
        >
          Подборка для меня
        </button>
        <button
          @click="open = true"
          class="text-sm text-ink-muted underline decoration-caramel/50 underline-offset-4 transition-colors hover:text-caramel"
        >
          Пройти тест заново
        </button>
      </div>
    </template>

    <template v-else>
      <p class="mb-4 text-sm leading-relaxed text-ink-muted">
        Пройдите тест из 5 вопросов, и мы подберём уход.
      </p>
      <button
        @click="open = true"
        class="rounded-full bg-caramel px-5 py-2.5 text-xs font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
      >
        Пройти тест
      </button>
    </template>

    <SkinQuizModal v-if="open" @close="open = false" />
  </div>
</template>