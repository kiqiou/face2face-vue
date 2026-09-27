<template>
  <button
    @click="$emit('click')"
    class="group/btn relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-ink bg-ink text-xs font-medium uppercase tracking-[0.15em] text-paper transition-all duration-300 hover:bg-moss hover:border-moss active:scale-[0.97]"
  >
    <svg
      class="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/btn:rotate-90"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
    </svg>
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: 'В корзину',
  }
);

defineEmits<{
  (e: 'click'): void;
}>();
</script>