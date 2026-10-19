<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ page: number; totalPages: number }>();
const emit = defineEmits<{ (e: 'change', page: number): void }>();

const visiblePages = computed<(number | '…')[]>(() => {
  const pages: (number | '…')[] = [];
  for (let i = 1; i <= props.totalPages; i++) {
    if (i === 1 || i === props.totalPages || Math.abs(i - props.page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }
  return pages;
});

const go = (p: number) => {
  if (p >= 1 && p <= props.totalPages && p !== props.page) emit('change', p);
};
</script>

<template>
  <nav v-if="totalPages > 1" class="mt-10 flex items-center justify-center gap-1 text-sm">
    <button @click="go(page - 1)" :disabled="page === 1"
      class="px-3 py-2 text-ink-muted hover:text-ink disabled:opacity-30">←</button>

    <template v-for="(p, i) in visiblePages" :key="i">
      <span v-if="p === '…'" class="px-2 text-ink-muted">…</span>
      <button v-else @click="go(p)" class="min-w-9 border px-3 py-2 transition-colors"
        :class="p === page ? 'border-moss bg-moss text-paper' : 'border-line text-ink hover:border-moss'">
        {{ p }}
      </button>
    </template>

    <button @click="go(page + 1)" :disabled="page === totalPages"
      class="px-3 py-2 text-ink-muted hover:text-ink disabled:opacity-30">→</button>
  </nav>
</template>