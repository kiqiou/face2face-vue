<template>
  <div class="flex min-h-screen flex-col overflow-x-hidden bg-linear-to-b from-cream via-paper to-[#F9E2CB] py-12">
    <div class="mx-auto my-0 w-full max-w-350 px-4">
      <Header />
    </div>

    <main class="flex flex-1 flex-col">
      <div
        class="mx-auto flex w-full max-w-6xl flex-col items-center justify-center rounded-4xl border border-line bg-cream p-4 shadow-[0_30px_80px_-40px_rgba(201,139,94,0.55)] animate-fade-in-up sm:p-6 md:p-8 lg:p-12 my-8"
      >
        <router-view v-slot="{ Component, route }">
          <Transition name="fade-in-up" mode="out-in" :key="route.name">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </main>

    <Footer />
  </div>

  <div>
    <button
      @click="scrollToTop"
      v-show="showScrollToTopButton"
      class="fixed bottom-8 right-8 z-50 rounded-full bg-caramel p-3 text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
      aria-label="Наверх"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    </button>

    <button
      @click="goToCart"
      v-show="showCartButton"
      class="fixed bottom-24 right-8 z-50 rounded-full bg-caramel p-3 text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
      aria-label="Корзина"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import Footer from '../components/Footer.vue';
  import Header from '../components/Header.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useProductsCartStore } from '../../stores/productsCart.js';

  const cartStore = useProductsCartStore();

  const route = useRoute();
  const router = useRouter();

  const cartVisibleOnPage = computed(
    () => route.path === '/' || route.path === '/products'
  );

  const showCartButton = computed(
    () => cartVisibleOnPage.value && cartStore.items.length > 0
  );

  const showScrollToTopButton = ref(false);

  const handleScroll = () => {
    showScrollToTopButton.value = window.scrollY > 300;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const goToCart = () => {
    router.push('/user-products-cart');
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style scoped>
  .fade-in-up-enter-active,
  .fade-in-up-leave-active {
    transition: all 0.3s ease;
  }
  .fade-in-up-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }
  .fade-in-up-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
