<template>
  <div class="flex flex-col">
    <section class="relative">
      <!-- мягкое персиковое пятно; обрезается скруглённой карточкой лейаута -->
      <div
        class="pointer-events-none absolute -right-16 -top-16 h-96 w-96 rounded-full bg-peach/70 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16 lg:py-20"
      >
        <!-- Image -->
        <div class="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div
            class="absolute inset-4 -z-10 rounded-t-[9rem] rounded-b-3xl border-2 border-caramel/40"
            aria-hidden="true"
          ></div>
          <div class="overflow-hidden rounded-t-[9rem] rounded-b-3xl shadow-[0_25px_60px_-25px_rgba(201,139,94,0.6)]">
            <img
              src="/images/banner-2.jpg"
              alt="Интерьер студии красоты"
              class="h-105 w-full object-cover sm:h-120 lg:h-140"
            />
          </div>
          <span
            class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-peach px-5 py-2 text-[11px] font-medium uppercase tracking-[0.25em] text-ink shadow-md lg:left-6 lg:translate-x-0"
          >
            на кальварийке
          </span>
        </div>

        <div class="text-center lg:text-left">
          <span class="inline-block rounded-full bg-peach px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-ink">
            Beauty studio
          </span>

          <h1 class="mt-5 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            Ваше любимое
            <span class="font-semibold text-caramel">место красоты</span>
          </h1>

          <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg lg:mx-0">
            Заботимся о вашей коже честно и без спешки — подбираем продукты,
            которые действительно работают.
          </p>

          <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <router-link
              to="/products"
              class="rounded-full bg-caramel px-8 py-3.5 text-sm font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
            >
              Смотреть каталог →
            </router-link>
            <button
              @click="scrollToBottom"
              class="rounded-full border border-caramel/60 px-8 py-3.5 text-sm font-medium tracking-widest text-ink transition-colors hover:bg-caramel hover:text-white"
            >
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <TextSection />
    </div>
  </div>

  <SkinQuizPrompt />
</template>

<script setup lang="ts">
import TextSection from '../components/home/TextSection.vue';
import SkinQuizPrompt from '../components/SkinQuizPrompt.vue';

const scrollToBottom = () => {
  const offset = 200; 
  const targetPosition = document.documentElement.scrollHeight - window.innerHeight - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
};

</script>