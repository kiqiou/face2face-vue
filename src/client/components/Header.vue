<template>
  <header class="w-full px-4 sm:px-6 lg:px-8 mb-10">
    <div class="flex items-center justify-between md:hidden">
      <RouterLink to="/" class="inline-block">
        <h3
          class="text-2xl font-bold bg-gradient-to-br from-black/70 to-black/60 bg-clip-text text-transparent underline"
        >
          FACE2FACE
        </h3>
      </RouterLink>

      <button
        @click="isOpen = !isOpen"
        class="relative z-50 flex flex-col justify-between w-8 h-6"
      >
        <span
          :class="[
            'block h-[3px] w-full bg-black/60 rounded transition-all duration-300',
            isOpen ? 'rotate-45 translate-y-[10px]' : '',
          ]"
        />
        <span
          :class="[
            'block h-[3px] w-full bg-black/60 rounded transition-all duration-300',
            isOpen ? 'opacity-0' : '',
          ]"
        />
        <span
          :class="[
            'block h-[3px] w-full bg-black/60 rounded transition-all duration-300',
            isOpen ? '-rotate-45 -translate-y-[10px]' : '',
          ]"
        />
      </button>
    </div>

    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 md:hidden bg-gradient-to-br from-[#E5A663]/90 to-bl-[#FAEE9E] to-[#FAEE9E] text-white px-6 pt-28 pb-10 flex flex-col justify-between"
      >
        <nav>
          <ul class="flex flex-col gap-6">
            <li
              v-for="link in visibleLinks"
              :key="link.name"
              class="text-3xl font-semibold"
            >
              <RouterLink
                @click="isOpen = false"
                :to="link.link"
                class="text-black/80 hover:text-black/60 transition duration-300"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div
          class="border-t border-white/20 pt-6 text-sm text-white/80 leading-7"
        >
          <p class="font-semibold text-base text-black/80">
            Face2face.cosmetology
          </p>

          <p class="text-black/80">Кальварийская, 21, 157</p>

          <a
            href="tel:+375447799393"
            class="block underline text-black/80 hover:text-black/80 transition"
          >
            +375 44 779-93-93
          </a>

          <a
            href="https://www.instagram.com/face2face.cosmetology/"
            target="_blank"
            class="block text-black/80 hover:text-black/60 transition"
          >
            @face2face
          </a>
        </div>
      </div>
    </transition>

    <div
      id="gkHeaderNav"
      class="hidden md:flex justify-between items-center gap-10"
    >
      <RouterLink to="/" class="inline-block">
        <h3
          class="text-2xl lg:text-3xl font-bold bg-gradient-to-br from-black/70 to-black/60 bg-clip-text text-transparent hover:scale-105 transition-transform underline"
        >
          FACE2FACE
        </h3>
      </RouterLink>

      <nav>
        <ul class="flex gap-4 text-center">
          <li
            v-for="link in visibleLinks"
            :key="link.name"
            class="nav-link font-sans text-[15px] lg:text-[20px] font-medium"
          >
            <RouterLink :to="link.link">
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="dub_headr text-sm lg:text-base text-right text-gray-700">
        <p class="leading-tight">
          <span class="font-semibold"> Face2face.cosmetology </span>
          <br />

          <span>Кальварийская, 21, 157</span>
          <br />

          <span class="flex justify-end gap-1 text-xs">
            <a
              href="tel:+375447799393"
              class="text-accent hover:text-primary underline"
            >
              +375 44 779-93-93
            </a>

            <a href="https://www.instagram.com/face2face.cosmetology/">
              <span class="text-primary"> @face2face </span>
            </a>
          </span>
        </p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { RouterLink } from 'vue-router';
  import { authService } from '../../utils/auth.js';

  const isOpen = ref(false);

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
    name: 'Добавленные услуги',
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
        return [...baseLinks.value, profileLink];
      }

      return [...baseLinks.value, profileLink, cartLink];
    }

    return [
      ...baseLinks.value,
      {
        id: '6',
        name: 'Регистрация/вход',
        link: '/registration',
      },
    ];
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
