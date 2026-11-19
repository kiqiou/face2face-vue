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
    class="fixed bottom-6 left-6 z-40 w-72 rounded-2xl border border-[#E5A663]/30 bg-white p-5 shadow-xl shadow-[#E5A663]/20"
  >
    <p class="mb-1 font-semibold text-stone-800">Подберём уход для вас</p>
    <p class="mb-4 text-sm text-stone-600">
      Пройдите тест на тип кожи — всего
      5 вопросов.
    </p>
    <div class="flex items-center gap-4">
      <button
        @click="prompt = false; open = true"
        class="rounded-full bg-[#E5A663] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white"
      >
        Пройти
      </button>
      <button @click="dismiss" class="text-xs uppercase tracking-wide text-black/40 hover:underline">
        Не сейчас
      </button>
    </div>
  </div>

  <SkinQuizModal v-if="open" @close="open = false" />
</template>