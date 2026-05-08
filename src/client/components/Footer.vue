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
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white"
        >
          <div class="flex gap-6 text-primary/80">
            <RouterLink
              to="/about"
              class="nav-link text-sm text-black/70 hover:text-black/90"
              >О нас</RouterLink
            >
            <RouterLink
              to="/feedback"
              class="nav-link text-sm text-black/70 hover:text-black/90"
              >Обратная связь</RouterLink
            >
          </div>
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
