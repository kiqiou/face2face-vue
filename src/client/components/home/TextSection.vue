<template>
  <div class="flex flex-col gap-10 sm:gap-14">
    <!-- Философия -->
    <div class="flex flex-col gap-4 text-center sm:gap-5 lg:text-left">
      <span class="mx-auto inline-block w-fit rounded-full bg-peach px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-ink lg:mx-0">
        Наш подход
      </span>

      <p class="text-lg leading-relaxed text-ink sm:text-xl">
        Наша философия —
        <span class="font-semibold text-caramel">забота без навязывания</span>.
      </p>

      <p class="text-base leading-relaxed text-ink-muted sm:text-lg">
        Мы не обещаем волшебство «за 5 минут» и не втюхиваем дорогие средства.
        Наша цель — подобрать для вас тот самый уход, который действительно нужен вашей коже.
      </p>

      <p class="text-base leading-relaxed text-ink-muted sm:text-lg">
        <span class="text-xl font-semibold text-ink">Сбалансированная рутина</span>,
        грамотные процедуры и советы, которые работают.
      </p>
    </div>

    <div class="border-t border-line pt-10 sm:pt-14">
      <h3 class="mb-6 text-center font-display text-2xl font-medium text-ink sm:mb-8 sm:text-3xl lg:text-left lg:text-4xl">
        Почему выбирают нас?
      </h3>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <div
          v-for="text in whyChooseUsText"
          :key="text"
          class="flex items-start gap-3 rounded-3xl border border-line bg-white/70 p-5 shadow-[0_15px_35px_-25px_rgba(201,139,94,0.6)] transition-shadow hover:shadow-[0_20px_40px_-20px_rgba(201,139,94,0.6)] sm:p-6"
        >
          <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-caramel"></span>
          <span class="text-base text-ink sm:text-lg">{{ text }}</span>
        </div>
      </div>
    </div>

    <!-- Товары -->
    <div class="border-t border-line pt-10 sm:pt-14">
      <div class="overflow-hidden rounded-4xl border border-line bg-peach/60 p-6 sm:p-10 lg:p-12">
        <div class="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div class="max-w-xl">
            <p class="text-[11px] font-medium uppercase tracking-[0.3em] text-caramel-dark">
              Каталог ухода
            </p>
            <h3 class="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl">
              Уход, который продолжается дома
            </h3>
            <p class="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              Помимо процедур в студии, мы собрали каталог косметики для домашнего
              ухода — сыворотки, кремы и средства для разных типов кожи. Поможем
              подобрать линейку под ваш тип кожи и продолжить результат после визита.
            </p>
          </div>

          <router-link
            to="/products"
            class="shrink-0 rounded-full bg-caramel px-8 py-3.5 text-sm font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
          >
            Смотреть каталог →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const whyChooseUsText = ref([
  '100% оригинальная продукция от официальных поставщиков',
  'Всё в наличии в нашей студии на Кальварийской — без долгого ожидания',
  'Только культовые мировые бренды и проверенные бьюти-бестселлеры',
  'Удобно заглянуть за любимым уходом в любое рабочее время',
]);

</script>