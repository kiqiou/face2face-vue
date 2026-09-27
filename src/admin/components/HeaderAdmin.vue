<template>
  <header class="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
      <!-- Логотип / бренд -->
      <RouterLink to="/" class="flex items-center gap-2 shrink-0">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-black/80">
          <span class="font-display text-sm font-bold text-white">A</span>
        </div>
        <span class="font-display text-sm font-semibold uppercase tracking-[0.15em] text-black/80">
          Админка
        </span>
      </RouterLink>

      <!-- Навигация -->
      <nav>
        <ul class="flex flex-row items-center gap-1">
          <li v-for="link in baseLinks" :key="link.id">
            <RouterLink
              :to="link.link"
              class="nav-link group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-black/60 transition-all duration-300 hover:text-black"
              :class="{ 'is-active': route.path === link.link }"
              active-class="is-active"
            >
              <span class="relative z-10 flex items-center gap-2">
                <component :is="link.icon" class="h-4 w-4 shrink-0" />
                {{ link.name }}
              </span>
              <span class="nav-pill" aria-hidden="true" />
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { h, ref } from 'vue';
  import { RouterLink, useRoute } from 'vue-router';

  const route = useRoute();

  // маленькие инлайн-иконки без внешних зависимостей
  const IconHome = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
      [h('path', { d: 'M3 12l9-9 9 9M5 10v10h14V10' })]
    );
  const IconBox = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
      [h('path', { d: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8' })]
    );
  const IconClipboard = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
      [h('path', { d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 12h6M9 16h6' })]
    );
  const IconFactory = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
      [h('path', { d: 'M3 21h18M5 21V10l5 3V10l5 3V6l4 3v12M9 17h.01M13 17h.01' })]
    );
  const IconTag = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
      [h('path', { d: 'M20.59 13.41L11 3.83A2 2 0 009.59 3.24H4a1 1 0 00-1 1v5.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.83 0l4.59-4.58a2 2 0 000-2.83z' }), h('circle', { cx: '7.5', cy: '7.5', r: '1.5' })]
    );

  const baseLinks = ref([
    { id: '1', name: 'Главная', link: '/', icon: IconHome },
    { id: '5', name: 'Товары', link: '/admin-products', icon: IconBox },
    { id: '4', name: 'Заказы', link: '/admin-orders', icon: IconClipboard },
    { id: '6', name: 'Аналитика', link: '/admin-analytics', icon: IconClipboard },
    { id: '2', name: 'Производители', link: '/admin-manufacturers', icon: IconFactory },
    { id: '3', name: 'Категории', link: '/admin-categories', icon: IconTag },
  ]);
</script>

<style scoped>
  .nav-pill {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: linear-gradient(135deg, #fed9b7 0%, #faee9e 100%);
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.25s ease, transform 0.25s ease;
    z-index: 0;
  }

  .nav-link:hover .nav-pill {
    opacity: 0.35;
    transform: scale(1);
  }

  .nav-link.is-active {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
  }

  .nav-link.is-active .nav-pill {
    opacity: 1;
    transform: scale(1);
  }
</style>