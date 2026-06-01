<template>
  <div class="flex flex-row gap-15 mt-5 justify-around items-center">
    <div>
      <ul class="flex flex-row gap-6">
        <li
          v-for="link in baseLinks"
          :key="link.name"
          class="nav-link font-sans text-xl font-medium bg-black/80 bg-clip-text text-transparent hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
        >
          <RouterLink :to="link.link">{{ link.name }}</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router';

  const baseLinks = ref([
    { id: '1', name: 'Главная', link: '/' },
    { id: '2', name: 'Процедуры', link: '/admin-procedures' },
    { id: '3', name: 'Категории', link: '/admin-categories' },
    { id: '6', name: 'График', link: '/calendar' },
  ]);
</script>

<style scoped>
  .nav-link {
    position: relative;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #fed9b7 20%, #faee9e 50%, white 100%);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1px;
  }

  .nav-link:hover::after {
    width: 100%;
  }
</style>
