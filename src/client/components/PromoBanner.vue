<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>(),
  {
    title: 'Скидка на первый заказ',
    subtitle: 'Используйте промокод при оформлении — FIRSTORDER — и получите скидку 10% на первый заказ.',
    ctaText: 'В каталог',
    ctaLink: '/products',
  }
);
</script>

<template>
  <div
    class="flex flex-col items-start justify-between gap-4 bg-gradient-to-r from-moss/15 to-petal-soft/30 border border-line px-6 py-8 sm:flex-row sm:items-center sm:px-10"
  >
    <div>
      <h3 class="font-display text-2xl text-ink">{{ title }}</h3>
      <p class="mt-1 text-sm text-ink-muted">{{ subtitle }}</p>
    </div>
  </div>
</template>