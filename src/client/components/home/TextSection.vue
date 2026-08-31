<template>
  <div class="flex flex-col gap-10 sm:gap-14">
    <!-- Философия -->
    <div class="flex flex-col gap-4 text-center sm:gap-5 lg:text-left">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[#E5A663]">
        Наш подход
      </p>

      <p class="text-lg leading-relaxed text-stone-600 sm:text-xl">
        Наша философия —
        <span class="font-semibold italic text-[#E5A663]">забота без навязывания</span>.
      </p>

      <p class="text-base leading-relaxed text-stone-600 sm:text-lg">
        Мы не обещаем волшебство «за 5 минут» и не втюхиваем дорогие процедуры.
        Наша цель — подобрать для вас тот самый уход, который действительно нужен вашей коже.
      </p>

      <p class="text-base leading-relaxed text-stone-600 sm:text-lg">
        <span class="font-serif text-xl font-bold sm:text-xl">
          Сбалансированная рутина
        </span>
        , грамотные процедуры и советы, которые работают.
      </p>
    </div>

    <div class="border-t border-[#E5A663]/25 pt-10 sm:pt-14">
      <h3 class="mb-6 text-center font-serif text-2xl font-bold text-stone-800 sm:mb-8 sm:text-3xl lg:text-left lg:text-4xl">
        Почему выбирают нас?
      </h3>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <div
          v-for="text in whyChooseUsText"
          :key="text"
          class="flex items-start gap-3 rounded-2xl border border-[#E5A663]/15 bg-white p-5 shadow-sm shadow-[#E5A663]/5 transition-shadow hover:shadow-md sm:p-6"
        >
          <span class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#E5A663]"></span>
          <span class="text-base text-stone-700 sm:text-lg">{{ text }}</span>
        </div>
      </div>
    </div>

    <!-- Товары -->
    <div class="border-t border-[#E5A663]/25 pt-10 sm:pt-14">
      <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAEE9E]/40 to-[#E5A663]/10 p-6 sm:p-10 lg:p-12">
        <div class="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div class="max-w-xl">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[#E5A663]">
              Каталог ухода
            </p>
            <h3 class="mt-3 font-serif text-2xl font-bold text-stone-800 sm:text-3xl">
              Уход, который продолжается дома
            </h3>
            <p class="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
              Помимо процедур в студии, мы собрали каталог косметики для домашнего
              ухода — сыворотки, кремы и средства для разных типов кожи. Поможем
              подобрать линейку под ваш тип кожи и продолжить результат после визита.
            </p>
          </div>

          <router-link
            to="/products"
            class="flex-shrink-0 rounded-full bg-[#E5A663] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#E5A663]/30 transition-transform hover:scale-[1.03]"
          >
            Смотреть каталог
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const whyChooseUsText = ref([
  'Честный подход: подбираем по потребностям',
  'Душевная атмосфера доверия',
  'Команда профессионалов',
  'Уверенность',
]);
</script>