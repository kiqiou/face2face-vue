<template>
  <footer class="w-full mt-20 pb-8 backdrop-blur-xl">
    <div class="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <!-- Контакты -->
        <div class="space-y-4 text-center sm:text-left">
          <RouterLink to="/" class="inline-block">
            <h3
              class="text-2xl font-bold bg-gradient-to-br from-black to-black/50 bg-clip-text text-transparent hover:scale-105 transition-transform underline"
            >
              FACE2FACE
            </h3>
          </RouterLink>
          <p class="text-black/90 text-sm leading-relaxed">
            Косметология в Минске<br />
            <span class="font-semibold text-primary"
              >Кальварийская, 21, 157</span
            >
          </p>
        </div>

        <div class="space-y-4 text-center sm:text-left">
          <h4 class="text-lg font-semibold text-black/90">Телефоны</h4>
          <div class="space-y-1 text-sm">
            <a href="tel:+375447799394" class="block text-black/70"
              >+375 44 779-93-93 Вера</a
            >
            <a href="tel:+375447799394" class="block text-black/70"
              >+375 29 178-60-34 Анастасия</a
            >
          </div>
        </div>

        <div class="space-y-4 text-center sm:text-left">
          <h4 class="text-lg font-semibold text-black/90">Инстаграмм</h4>
          <a
            href="https://www.instagram.com/face2face.cosmetology/"
            target="_blank"
            class="inline-flex items-center gap-2 text-black/70 font-semibold hover:scale-105 transition-all"
          >
            @face2face
          </a>
        </div>
      </div>

      <div class="pt-8 mt-8 border-t-2 border-black/40"></div>

      <div class="flex flex-col items-center">
        <h4
          class="text-lg self-center font-semibold text-black/80 mb-4 text-center sm:text-left"
        >
          Как добраться?
        </h4>
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Ad827a45a9b693fc8fcbe892131b61eef5cb535d09891f9c13504a6178d67df55&amp;source=constructor"
          width="100%"
          height="580"
          frameborder="0"
          class="rounded-xl"
        ></iframe>
        <div
          class="mt-4 flex flex-col sm:flex-row gap-3 justify-around sm:justify-center"
        >
          <a
            href="https://yandex.by/maps/?rtext=~Кальварийская%2021%20Минск"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E5A663]/ border-1 border-black/70 text-black/70 font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            Построить маршрут в Яндекс
          </a>
          <a
            href="https://www.google.com/maps/dir//Кальварийская+21+Минск"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E5A663]/ border-1 border-black/60 text-black/70 font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            Построить маршрут в Google
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import { RouterLink } from 'vue-router';
</script>

<style scoped>
  .nav-link {
    position: relative;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, white 100%, #faee9e 50%, #fed9b7 50%);
    transition: width 0.3s ease;
  }

  .nav-link:hover::after {
    width: 100%;
  }
</style>
