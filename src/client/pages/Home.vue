<template>
  <div class="flex flex-col">
    <section class="relative overflow-hidden bg-[#FFFBF3]">
      <!-- декоративное пятно на фоне, сдержанно и одно на всю секцию -->
      <div
        class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#FAEE9E]/50 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16 lg:py-20"
      >
        <!-- Image -->
        <div class="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div
            class="absolute inset-4 -z-10 rounded-t-[9rem] rounded-b-3xl border-2 border-[#E5A663]/40"
            aria-hidden="true"
          ></div>
          <div class="overflow-hidden rounded-t-[9rem] rounded-b-3xl shadow-xl shadow-[#E5A663]/20">
            <img
              src="/images/banner-2.jpg"
              alt="Интерьер студии красоты"
              class="h-[420px] w-full object-cover sm:h-[480px] lg:h-[560px]"
            />
          </div>
          <span
            class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#E5A663] shadow-md ring-1 ring-[#E5A663]/20 lg:left-6 lg:translate-x-0"
          >
            на кальварийке
          </span>
        </div>

        <div class="text-center lg:text-left">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[#E5A663]">
            Beauty studio
          </p>

          <h1 class="mt-4 font-serif text-4xl font-bold leading-[1.1] text-stone-800 sm:text-5xl lg:text-6xl">
            Ваше любимое
            <span class="text-[#E5A663]">место красоты</span>
          </h1>

          <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:mx-0">
            Заботимся о вашей коже честно и без спешки — подбираем процедуры,
            которые действительно работают.
          </p>

          <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <router-link
              to="/procedures"
              class="rounded-full bg-[#E5A663] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#E5A663]/30 transition-transform hover:scale-[1.03]"
            >
              Выбрать процедуру
            </router-link>
            <router-link
              to="/contacts"
              class="rounded-full border border-[#E5A663]/50 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#E5A663] transition-colors hover:bg-[#E5A663]/10"
            >
              Связаться с нами
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <TextSection />
    </div>

    <div class="mt-16">
      <About></About>
    </div>
    <div class="mt-16">
      <Procedures></Procedures>
    </div>
  </div>
</template>

<script setup lang="ts">
import Procedures from './Procedures.vue';
import About from './About.vue';
import TextSection from '../components/home/TextSection.vue';
</script>