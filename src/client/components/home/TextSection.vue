<template>
  <div
    class="flex flex-col gap-4 sm:gap-6 text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed px-4 sm:px-6"
  >
    <p class="break-words hyphens-auto">
      Наша философия —
      <span class="font-semibold text-[#E5A663] italic break-words"
        >забота без навязывания</span
      >.
    </p>
    <p class="break-words hyphens-auto">
      Мы не обещаем волшебство «за 5 минут» и не втюхиваем дорогие процедуры.
      Наша цель — подобрать для вас тот самый уход, который действительно нужен
      вашей коже.
    </p>
    <p class="break-words hyphens-auto">
      <span
        class="font-bold text-xl sm:text-2xl md:text-3xl text-[#E5A663] break-words"
      >
        Сбалансированная рутина </span
      >, грамотные процедуры и советы, которые работают.
    </p>
    <div class="pt-6 sm:pt-8 border-t border-[#E5A663]/30">
      <h3
        class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-[#E5A663] to-[#FAEE9E] bg-clip-text text-transparent"
      >
        Почему выбирают нас?
      </h3>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-base sm:text-lg"
      >
        <div
          v-for="text in whyChooseUsText"
          :key="text"
          class="space-y-3 sm:space-y-5 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#E5A663]/20 flex items-start"
        >
          <span
            class="inline-block w-2 h-2 bg-[#E5A663] rounded-full flex-shrink-0 mt-1 sm:mt-2"
          ></span>
          <span class="ml-3">{{ text }}</span>
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
    'Легкое сердце + уверенность',
  ]);
</script>
