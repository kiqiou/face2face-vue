<template>
  <header class="mb-10 w-full px-4 sm:px-6 lg:px-8">
    <!-- Мобильная шапка -->
    <div class="flex items-center justify-between md:hidden">
      <RouterLink
        to="/"
        class="relative flex h-20 w-47.5 shrink-0 items-center"
      >
        <img
          class="absolute left-0 top-1/2 h-50 w-auto max-w-none -translate-y-1/2 object-contain"
          src="/images/logo.png"
          alt="Логотип FACE2FACE"
        />
      </RouterLink>

      <button
        @click="isOpen = !isOpen"
        class="relative z-50 flex h-6 w-8 flex-col justify-between"
        aria-label="Меню"
      >
        <span
          :class="[
            'block h-0.75 w-full rounded-full bg-ink transition-all duration-300',
            isOpen ? 'translate-y-2.5 rotate-45' : '',
          ]"
        />
        <span
          :class="[
            'block h-0.75 w-full rounded-full bg-ink transition-all duration-300',
            isOpen ? 'opacity-0' : '',
          ]"
        />
        <span
          :class="[
            'block h-0.75 w-full rounded-full bg-ink transition-all duration-300',
            isOpen ? '-translate-y-2.5 -rotate-45' : '',
          ]"
        />
      </button>
    </div>

    <!-- Мобильное меню -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 flex flex-col justify-between bg-linear-to-b from-cream via-paper to-[#F9E2CB] px-6 pb-10 pt-28 md:hidden"
      >
        <nav>
          <ul class="flex flex-col gap-3">
            <li v-for="link in visibleLinks" :key="link.name">
              <RouterLink
                @click="isOpen = false"
                :to="link.link"
                active-class="bg-peach"
                exact-active-class="bg-peach"
                class="block rounded-full px-5 py-3 text-2xl font-medium text-ink transition-colors hover:bg-peach/60"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div class="border-t border-line pt-6 text-sm leading-7 text-ink-muted">
          <p class="text-base font-semibold text-ink">Face2face.cosmetology</p>
          <p>Кальварийская, 21, 157</p>

          <a
            href="tel:+375447799393"
            class="block underline decoration-caramel/50 underline-offset-4 transition-colors hover:text-caramel"
          >
            +375 44 779-93-93
          </a>

          <a
            href="https://www.instagram.com/face2face.cosmetology/"
            target="_blank"
            rel="noopener noreferrer"
            class="block transition-colors hover:text-caramel"
          >
            @face2face
          </a>

          <a
            :href="BOOKING_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 block rounded-full bg-caramel px-4 py-3.5 text-center text-sm font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
          >
            Запись на процедуры →
          </a>
        </div>
      </div>
    </transition>

    <!-- Десктопная шапка -->
    <div id="gkHeaderNav" class="hidden items-center justify-between gap-6 md:flex lg:gap-10">
      <RouterLink
        to="/"
        class="relative flex h-20 w-47.5 shrink-0 items-center"
      >
        <img
          class="absolute left-0 top-1/2 h-50 w-auto max-w-none -translate-y-1/2 object-contain"
          src="/images/logo.png"
          alt="Логотип FACE2FACE"
        />
      </RouterLink>

      <nav
        ref="navRef"
        class="relative rounded-full border border-line bg-white/60 p-1.5 shadow-[0_15px_35px_-25px_rgba(201,139,94,0.6)]"
      >
        <!-- ползунок -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute rounded-full bg-peach"
          :class="animate ? 'transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]' : ''"
          :style="{
            left: indicator.left + 'px',
            top: indicator.top + 'px',
            width: indicator.width + 'px',
            height: indicator.height + 'px',
            opacity: indicator.visible ? 1 : 0,
          }"
        />

        <ul class="relative flex items-center gap-1 text-center">
          <li v-for="link in visibleLinks" :key="link.name">
            <RouterLink
              :to="link.link"
              :data-active="isActive(link.link)"
              class="relative block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 lg:text-[15px]"
              :class="isActive(link.link) ? 'text-ink' : 'text-ink-muted hover:text-ink'"
            >
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex shrink-0 flex-col items-end gap-3 text-right text-sm">
        <p class="leading-tight">
          <span class="font-semibold text-ink">Face2face.cosmetology</span>
          <br />
          <span class="text-ink-muted">Кальварийская, 21, 157</span>
          <br />
          <span class="mt-1 flex justify-end gap-2 text-xs text-ink-muted">
            <a
              href="tel:+375447799393"
              class="underline decoration-caramel/50 underline-offset-4 transition-colors hover:text-caramel"
            >
              +375 44 779-93-93
            </a>
            <a
              href="https://www.instagram.com/face2face.cosmetology/"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-caramel"
            >
              @face2face
            </a>
          </span>
        </p>

        <a
          :href="BOOKING_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block rounded-full bg-caramel px-5 py-2 text-xs font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
        >
          Запись на процедуры
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
  import { RouterLink, useRoute } from 'vue-router';
  import { authService } from '../../utils/auth.js';

  const isOpen = ref(false);
  const BOOKING_URL = 'https://dikidi.net/ru/profile/face2facecosmetology_639161';

  const baseLinks = ref([
    { id: '1', name: 'Главная', link: '/' },
    { id: '10', name: 'Каталог товаров', link: '/products' },
  ]);

  const profileLink = {
    id: '5',
    name: 'Личный кабинет',
    link: '/user-profile',
  };

  const productsCartLink = {
    id: '9',
    name: 'Корзина',
    link: '/user-products-cart',
  };

  const adminLink = {
    id: '7',
    name: 'Админка',
    link: '/admin-orders',
  };

  const user = authService.currentUser;

  const visibleLinks = computed(() => {
    if (user.value) {
      if (user.value.is_staff) {
        return [...baseLinks.value, adminLink, profileLink, productsCartLink];
      }
      return [...baseLinks.value, profileLink, productsCartLink];
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

  const route = useRoute();
  const navRef = ref<HTMLElement | null>(null);
  const animate = ref(false);
  const indicator = ref({ left: 0, top: 0, width: 0, height: 0, visible: false });

  const isActive = (path: string) =>
    path === '/' ? route.path === '/' : route.path.startsWith(path);

  const updateIndicator = () => {
  const nav = navRef.value;
  const el = nav?.querySelector<HTMLElement>('a[data-active="true"]');
  if (!nav || !el) {
    indicator.value = { ...indicator.value, visible: false };
    return;
  }

  const navRect = nav.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  indicator.value = {
    // clientLeft/clientTop учитывают рамку nav (border)
    left: elRect.left - navRect.left - nav.clientLeft,
    top: elRect.top - navRect.top - nav.clientTop,
    width: elRect.width,
    height: elRect.height,
    visible: true,
  };
};

  // переезжаем при смене страницы или набора ссылок (вход/выход)
  watch(
    () => [route.path, visibleLinks.value.length],
    async () => {
      await nextTick();
      updateIndicator();
    },
    { flush: 'post' }
  );

  let resizeObserver: ResizeObserver | null = null;

  onMounted(async () => {
    await nextTick();
    updateIndicator();
    // включаем анимацию только после первой установки, чтобы ползунок не «летел» с нуля
    requestAnimationFrame(() => (animate.value = true));

    // пересчёт при изменении размера и после загрузки шрифта
    if (navRef.value) {
      resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(navRef.value);
    }
    document.fonts?.ready.then(updateIndicator);
  });

  onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>