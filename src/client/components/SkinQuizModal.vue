<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSkinTypes } from '../../composables/product/skinTypes/useSkinTypes.js';
import { usePurposes } from '../../composables/product/purposes/usePurposes.js';
import {
  calcConcerns, calcResult, CONCERN_NAMES, CONCERN_QUESTION, ConcernKey, QUESTIONS,
  saveSkinProfile, TYPE_INFO, TYPE_NAMES, TypeKey,
} from '../../composables/quiz/skinQuiz.js';

const emit = defineEmits<{ (e: 'close'): void }>();
const router = useRouter();
const { skinTypes, load } = useSkinTypes();
const { purposes, load: loadPurposes } = usePurposes();

onMounted(() => {
  load();
  loadPurposes();
  document.body.style.overflow = 'hidden'; // страница под окном не прокручивается
});
onBeforeUnmount(() => {
  document.body.style.overflow = '';
});

const TOTAL = QUESTIONS.length + 1; // +1 шаг «что беспокоит»
const step = ref(0);
const answers = ref<number[]>([]);
const picked = ref<ConcernKey[]>([]);
const result = ref<TypeKey | null>(null);
const concerns = ref<ConcernKey[]>([]);

const isConcernStep = computed(() => step.value === QUESTIONS.length);
const q = computed(() => QUESTIONS[step.value]);
const skinTypeId = computed(() =>
  result.value ? skinTypes.value.find((s) => s.name === TYPE_NAMES[result.value!])?.id : undefined
);

const pick = (i: number) => {
  answers.value[step.value] = i;
  step.value++;
};

const toggleConcern = (k: ConcernKey) => {
  picked.value = picked.value.includes(k)
    ? picked.value.filter((x) => x !== k)
    : [...picked.value, k];
};

const finish = async () => {
  result.value = calcResult(answers.value);
  concerns.value = calcConcerns(answers.value, picked.value);
  const concernIds = concerns.value
    .map((k) => purposes.value.find((p) => p.name === CONCERN_NAMES[k])?.id)
    .filter(Boolean) as number[];
  await saveSkinProfile(result.value, concerns.value, skinTypeId.value, concernIds);
};

const back = () => step.value > 0 && step.value--;

// без фильтров: просто ведём к персональному блоку
const showProducts = () => {
  emit('close');
  router.push({ path: '/products', hash: '#for-you' });
};
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-100 flex items-end justify-center bg-black/50 sm:items-center sm:px-4"
      @click.self="emit('close')"
    >
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl">
        <!-- вопросы -->
        <template v-if="!result">
          <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            Вопрос {{ step + 1 }} из {{ TOTAL }}
          </p>
          <div class="mb-5 h-1 bg-line">
            <div class="h-1 bg-moss transition-all" :style="{ width: ((step + 1) / TOTAL) * 100 + '%' }" />
          </div>

          <template v-if="!isConcernStep">
            <h2 class="mb-5 font-display text-xl text-ink">{{ q.text }}</h2>
            <div class="space-y-2">
              <button
                v-for="(o, i) in q.options"
                :key="i"
                @click="pick(i)"
                class="w-full border border-line px-4 py-3 text-left text-sm transition-colors hover:border-moss"
                :class="answers[step] === i ? 'border-moss bg-moss/10' : ''"
              >
                {{ o.label }}
              </button>
            </div>
          </template>

          <template v-else>
            <h2 class="mb-5 font-display text-xl text-ink">{{ CONCERN_QUESTION.text }}</h2>
            <div class="space-y-2">
              <button
                v-for="o in CONCERN_QUESTION.options"
                :key="o.key"
                @click="toggleConcern(o.key)"
                class="w-full border border-line px-4 py-3 text-left text-sm transition-colors hover:border-moss"
                :class="picked.includes(o.key) ? 'border-moss bg-green-100' : ''"
              >
                {{ o.label }}
              </button>
            </div>
            <button
              @click="finish"
              class="mt-4 w-full bg-moss px-5 py-3 text-sm uppercase tracking-wide text-black/70 hover:bg-moss-dark"
            >
              {{ picked.length ? 'Готово' : 'Ничего не беспокоит' }}
            </button>
          </template>

          <div class="mt-5 flex justify-between text-xs uppercase tracking-wide">
            <button @click="back" :disabled="step === 0" class="text-ink-muted disabled:opacity-30">← Назад</button>
            <button @click="emit('close')" class="text-ink-muted">Закрыть</button>
          </div>
        </template>

        <!-- результат -->
        <template v-else>
          <p class="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted">Ваш результат</p>
          <h2 class="mb-3 font-display text-2xl text-ink">{{ TYPE_NAMES[result] }} кожа</h2>
          <p class="mb-4 text-sm text-ink/90">{{ TYPE_INFO[result].text }}</p>
          <ul class="mb-4 list-disc space-y-1 pl-5 text-sm text-ink/90">
            <li v-for="t in TYPE_INFO[result].tips" :key="t">{{ t }}</li>
          </ul>
          <p v-if="concerns.length" class="mb-5 text-sm text-ink/90">
            Учтём: {{ concerns.map((k) => CONCERN_NAMES[k].toLowerCase()).join(', ') }}.
          </p>
          <button
            @click="showProducts"
            class="w-full bg-moss px-5 py-3 text-sm uppercase tracking-wide text-black/70 hover:bg-moss-dark"
          >
            Показать подборку
          </button>
          <p class="mt-4 text-[11px] leading-relaxed text-ink-muted">
            Тест ориентировочный и не заменяет консультацию косметолога или дерматолога. При проблемах с кожей обратитесь к специалисту.
          </p>
        </template>
      </div>
    </div>
  </Teleport>
</template>