<template>
  <div class="flex flex-col justify-center items-center">
    <div class="flex flex-col items-center gap-6 max-w-4xl mx-auto">
      <h1
        class="text-center text-2xl sm: text-2xl lg:text-5xl font-black leading-tight bg-[#E5A663] bg-clip-text text-transparent drop-shadow-2xl"
      >
        Ваше любимое место красоты<br class="hidden md:block" /><span
          class="text-[#E5A663]"
        >
          башня на кальварийке</span
        >
      </h1>
      <div class="h-5"></div>
      <img
        src="/images/banner-2.jpg"
        class="max-h-screen lg:h-1/2 rounded-xl"
      />
      <TextSection></TextSection>
    </div>
    <div class="mt-15">
      <About></About>
    </div>
    <div class="mt-15">
      <Procedures></Procedures>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Procedures from './Procedures.vue';
  import About from './About.vue';
  import TextSection from '../components/home/TextSection.vue';

  const windowWidth = ref(0);

  const updateWidth = () => {
    windowWidth.value = window.innerWidth;
  };
</script>
