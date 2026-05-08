<template>
  <div
    id="gkHeaderNav"
    class="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-10 mb-10 px-4 sm:px-6 lg:px-8"
  >
    <RouterLink to="/" class="inline-block">
      <h3
        class="text-2xl lg:text-3xl font-bold bg-gradient-to-br from-black/70 to-black/60 bg-clip-text text-transparent hover:scale-105 transition-transform underline"
      >
        FACE2FACE
      </h3>
    </RouterLink>

    <nav>
      <ul class="flex flex-col sm:flex-row gap-5 sm:gap-4 text-center">
        <li
          v-for="link in visibleLinks"
          :key="link.name"
          class="nav-link font-sans text-[15px] lg:text-[20px] font-medium"
        >
          <RouterLink :to="link.link">{{ link.name }}</RouterLink>
        </li>
      </ul>
    </nav>

    <div
      class="dub_headr text-sm lg:text-base text-center sm:text-right text-gray-700"
    >
      <p class="leading-tight">
        <span class="font-semibold">Face2face.cosmetology</span><br />
        <span>Кальварийская, 21, 157</span><br />
        <span
          class="flex flex-wrap justify-center sm:justify-end gap-1 text-xs"
        >
          <a
            href="tel:+375447799393"
            class="text-accent hover:text-primary underline"
            >+375 44 779-93-93</a
          >
          <a href="https://www.instagram.com/face2face.cosmetology/"
            ><span class="text-primary">@face2face</span></a
          >
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { RouterLink } from 'vue-router';
  import { authService } from '../../utils/auth.js';

  const baseLinks = ref([
    { id: '1', name: 'Главная', link: '/' },
    { id: '2', name: 'Услуги', link: '/procedures' },
    { id: '3', name: 'Наши мастера', link: '/about' },
    { id: '4', name: 'Контакты', link: '/contacts' },
  ]);

  const profileLink = {
    id: '5',
    name: 'Личный кабинет',
    link: '/user-profile',
  };

  const cartLink = {
    id: '8',
    name: 'Корзина',
    link: '/user-cart',
  };

  const adminLink = {
    id: '7',
    name: 'График',
    link: '/calendar',
  };

  const user = authService.currentUser;

  const visibleLinks = computed(() => {
    if (user.value) {
      if (user.value.role === 6) {
        return [...baseLinks.value, profileLink, adminLink];
      }
      return [...baseLinks.value, profileLink, cartLink];
    } else {
      return [
        ...baseLinks.value,
        { id: '6', name: 'Регистрация/вход', link: '/registration' },
      ];
    }
  });
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
    background: linear-gradient(90deg, white 0%, #faee9e 50%, #fed9b7 100%);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1px;
  }

  .nav-link:hover::after {
    width: 100%;
  }
</style>
