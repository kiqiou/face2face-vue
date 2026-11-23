<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SkinQuizModal from './SkinQuizModal.vue';
import { skinKey } from '../../composables/quiz/skinQuiz.js';

const open = ref(false);
const prompt = ref(false);

onMounted(() => {
  const until = Number(localStorage.getItem('skinQuizDismissUntil') || 0);
  if (!skinKey.value && Date.now() > until) {
    setTimeout(() => (prompt.value = true), 5000);
  }
});

const dismiss = () => {
  prompt.value = false;
  localStorage.setItem('skinQuizDismissUntil', String(Date.now() + 30 * 864e5)); // 30 дней
};
</script>

<template>
  <div
    v-if="prompt && !skinKey"
    class="fixed bottom-6 left-6 z-40 w-72 rounded-3xl border border-line bg-cream p-5 shadow-[0_25px_60px_-25px_rgba(201,139,94,0.6)]"
  >
    <span class="mb-3 inline-block rounded-full bg-peach px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-ink">
      Тест
    </span>
    <p class="mb-1 font-semibold text-ink">Подберём уход для вас</p>
    <p class="mb-4 text-sm text-ink-muted">
      Пройдите тест на тип кожи — всего 5 вопросов.
    </p>
    <div class="flex items-center gap-4">
      <button
        @click="prompt = false; open = true"
        class="rounded-full bg-caramel px-5 py-2 text-xs font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
      >
        Пройти
      </button>
      <button @click="dismiss" class="text-xs tracking-wide text-ink-muted transition-colors hover:text-ink">
        Не сейчас
      </button>
    </div>
  </div>

  <SkinQuizModal v-if="open" @close="open = false" />
</template>