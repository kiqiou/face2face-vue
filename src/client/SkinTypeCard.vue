<script setup lang="ts">
import { ref } from 'vue';
import { skinKey } from '../composables/quiz/skinQuiz.js';
import { TYPE_NAMES } from '../composables/quiz/skinQuiz.js';
import { TYPE_INFO } from '../composables/quiz/skinQuiz.js';


const open = ref(false);
</script>

<template>
  <div class="border border-line bg-white p-5">
    <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Тип кожи</p>

    <template v-if="skinKey">
      <h3 class="font-display text-xl text-ink">{{ TYPE_NAMES[skinKey] }}</h3>
      <p class="mt-1 text-sm text-ink/90">{{ TYPE_INFO[skinKey].text }}</p>
      <div class="mt-4 flex items-center gap-4 text-xs uppercase tracking-wide">
        <router-link to="/products" class="bg-moss px-4 py-2 text-black/70">Подборка</router-link>
        <button @click="open = true" class="text-clay underline underline-offset-4">Пройти заново</button>
      </div>
    </template>

    <template v-else>
      <p class="mb-3 text-sm text-ink-muted">Тест из 5 вопросов поможет подобрать уход.</p>
      <button @click="open = true" class="bg-moss px-4 py-2 text-xs uppercase tracking-wide text-black/70">
        Пройти тест
      </button>
    </template>

    <SkinQuizModal v-if="open" @close="open = false" />
  </div>
</template>