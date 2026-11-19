<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
import { calcResult, QUESTIONS, saveSkinProfile, TYPE_INFO, TYPE_NAMES, TypeKey } from '../../composables/quiz/skinQuiz.js';


const emit = defineEmits<{ (e: 'close'): void }>();
const router = useRouter();
const { skinTypes, load } = useSkinTypes();
onMounted(load);

const step = ref(0);
const answers = ref<number[]>([]);
const result = ref<TypeKey | null>(null);
const q = computed(() => QUESTIONS[step.value]);
const skinTypeId = computed(() => skinTypes.value.find((s) => s.name === TYPE_NAMES[result.value!])?.id);

const pick = async (i: number) => {
  answers.value[step.value] = i;
  if (step.value < QUESTIONS.length - 1) { step.value++; return; }
  result.value = calcResult(answers.value);
  await saveSkinProfile(result.value, skinTypeId.value);
};
const back = () => step.value > 0 && step.value--;
const showProducts = () => {
  emit('close');
  router.push({ path: '/products', query: skinTypeId.value ? { skin_type: String(skinTypeId.value) } : {} });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:px-4" @click.self="emit('close')">
    <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl">
      <template v-if="!result">
        <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Вопрос {{ step + 1 }} из {{ QUESTIONS.length }}</p>
        <div class="mb-5 h-1 bg-line"><div class="h-1 bg-moss transition-all" :style="{ width: ((step + 1) / QUESTIONS.length) * 100 + '%' }" /></div>
        <h2 class="mb-5 font-display text-xl text-ink">{{ q.text }}</h2>
        <div class="space-y-2">
          <button v-for="(o, i) in q.options" :key="i" @click="pick(i)"
            class="w-full border border-line px-4 py-3 text-left text-sm transition-colors hover:border-moss"
            :class="answers[step] === i ? 'border-moss bg-moss/10' : ''">{{ o.label }}</button>
        </div>
        <div class="mt-5 flex justify-between text-xs uppercase tracking-wide">
          <button @click="back" :disabled="step === 0" class="text-ink-muted disabled:opacity-30">← Назад</button>
          <button @click="emit('close')" class="text-ink-muted">Закрыть</button>
        </div>
      </template>

      <template v-else>
        <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Ваш результат</p>
        <h2 class="mb-3 font-display text-2xl text-ink">{{ TYPE_NAMES[result] }} кожа</h2>
        <p class="mb-4 text-sm text-ink/90">{{ TYPE_INFO[result].text }}</p>
        <ul class="mb-5 list-disc space-y-1 pl-5 text-sm text-ink/90">
          <li v-for="t in TYPE_INFO[result].tips" :key="t">{{ t }}</li>
        </ul>
        <button @click="showProducts" class="w-full bg-moss px-5 py-3 text-sm uppercase tracking-wide text-black/70 hover:bg-moss-dark">Показать подборку</button>
        <p class="mt-4 text-[11px] leading-relaxed text-ink-muted">
          Тест ориентировочный и не заменяет консультацию косметолога или дерматолога. При проблемах с кожей обратитесь к специалисту.
        </p>
      </template>
    </div>
  </div>
</template>