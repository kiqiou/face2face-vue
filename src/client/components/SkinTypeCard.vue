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

const skinTypeId = computed(() =>
  skinKey.value ? skinTypes.value.find((s) => s.name === TYPE_NAMES[skinKey.value!])?.id : undefined
);

const showProducts = () => {
  router.push({
    path: '/products',
    query: skinTypeId.value ? { skin_type: String(skinTypeId.value) } : {},
  });
};
</script>

<template>
  <div class="w-full max-w-3xl mx-auto mt-12 rounded-2xl border border-[#E5A663]/20 bg-white/90 p-6">
    <p class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#E5A663]">Тип кожи</p>

    <template v-if="skinKey">
      <h3 class="text-2xl font-black text-slate-800">{{ TYPE_NAMES[skinKey] }}</h3>
      <p class="mt-1 text-sm text-black/60">{{ TYPE_INFO[skinKey].text }}</p>
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <button
            @click="showProducts"
            class="rounded-full bg-[#E5A663] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white"
            >
            Подборка для меня
            </button>
        <button @click="open = true" class="text-sm font-semibold text-[#E5A663] hover:underline">
          Пройти тест заново
        </button>
      </div>
    </template>

    <template v-else>
      <p class="mb-3 text-sm text-black/60">Пройдите тест из 5 вопросов, и мы подберём уход.</p>
      <button
        @click="open = true"
        class="rounded-full bg-[#E5A663] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white"
      >
        Пройти тест
      </button>
    </template>

    <SkinQuizModal v-if="open" @close="open = false" />
  </div>
</template>