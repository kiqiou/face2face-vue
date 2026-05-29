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

      <div class="pt-8 mt-8 border-t-2 border-black/40">
      </div>

      <div class="flex flex-col">
        <h4 class="text-lg self-center font-semibold text-black/80 mb-4 text-center sm:text-left">
          Как добраться?
        </h4>
        <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2306.639487654321!2d27.5615!3d53.8985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dc18c8b8a8a8a9%3A0x1234567890abcdef!2z0JrRgNCw0YHRgtCw0Y8g0JrQvtGB0YrQsNC7LCDQoNC-0YHRgtCw0Y8sIDIxLCAyMjAwMDQsCDQo0L7RgdGC0LDRgNGC0L3QsNGPINGD0LvQuNGG0LAsINCe0LDRgNCw0YHRgtCw!5e0!3m2!1sru!2sby!4v1234567890123!5m2!1sru!2sby"
            width="100%"
            height="300"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="w-full"
          ></iframe>
        </div>
        <div class="mt-4 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
          <a
            href="https://yandex.by/maps/?rtext=~Кальварийская%2021%20Минск"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E5A663]/ border-1 border-black/70 text-black/70 font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7"></path>
            </svg>
            Построить маршрут в Яндекс
          </a>
          <a
            href="https://www.google.com/maps/dir//Кальварийская+21+Минск"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E5A663]/ border-1 border-black/60 text-black/70 font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
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
