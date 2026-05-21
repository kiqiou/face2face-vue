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
</template>

<script setup lang="ts">
  import Footer from '../components/Footer.vue';
  import Header from '../components/Header.vue';
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
