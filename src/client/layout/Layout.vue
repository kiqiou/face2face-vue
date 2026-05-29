<template>
  <div
    class="flex flex-col max-w-auto min-h-screen py-12 bg-gradient-to-br from-[#E5A663]/90 to-bl-[#FAEE9E] to-[#FAEE9E] overflow-x-hidden"
  >
    <div class="mx-auto w-full max-w-[1400px] px-4">
      <Header />
    </div>
    <main class="flex flex-1 flex-col">
      <div
        class="mx-auto w-full max-w-6xl px-4 py-8"
        :class="[
          'flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-white p-4',
          'animate-fade-in-up',
          'sm:p-6 md:p-8 lg:p-12',
        ]"
      >
        <router-view v-slot="{ Component, route }">
          <Transition name="fade-in-up" mode="out-in" :key="route.name">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </main>
    <Footer></Footer>
  </div>
      <button
    @click="scrollToTop"
    v-show="showButton"
    class="fixed bottom-8 right-8 z-50 p-3 bg-[#E5A663] border-2 border-black/50 text-black/60 font-bold rounded-full"
    aria-label="Наверх"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';
import Footer from '../components/Footer.vue';
  import Header from '../components/Header.vue';

    
const showButton = ref(false)

const handleScroll = () => {
  showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
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
