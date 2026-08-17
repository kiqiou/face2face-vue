<template>
  <div class="min-h-screen">
    <div class="text-center mb-20">
      <h1
        class="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-[#E5A663] to-[#FAEE9E] bg-clip-text text-transparent"
      >
        Контакты
      </h1>
    </div>

    <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 mb-20">
      <div
        class="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#E5A663]/20 hover:shadow-2xl transition-all duration-300"
      >
        <h3
          class="text-2xl font-black text-black/80 mb-6 flex items-center gap-3"
        >
          Наши телефоны
        </h3>
        <div class="flex flex-col gap-4">
          <a
            v-for="cosmetologist in cosmetologists"
            href="tel:{{ cosmetologist.user.phone }}"
            class="p-4 rounded-2xl hover:from-[#E5A663]/20 hover:shadow-lg transition-all"
          >
            <div
              class="font-semibold text-xl text-black/70 group-hover:text-[#E5A663]"
            >
              {{ cosmetologist.user.username }}
            </div>
            <div class="text-2xl font-black text-[#E5A663] mt-1">
              {{ cosmetologist.user.phone }}
            </div>
            <div class="text-sm text-black/70 mt-1 flex items-center gap-2">
              Viber / Telegram
            </div>
          </a>
        </div>
      </div>

      <div
        class="flex flex-col gap-6 bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#E5A663]/20 hover:shadow-2xl transition-all duration-300"
      >
        <h3 class="text-2xl font-black text-black/80">Адрес</h3>
        <div class="text-lg text-slate-700">
          <div>
            <div class="font-semibold flex items-center gap-3 text-[#E5A663]">
              Минск
            </div>
            <p class="text-black/70">ул. Кальварийская, 21, 157</p>
          </div>
        </div>
        <h3 class="text-2xl font-black text-black/80 mt-6">Социальные сети</h3>
        <div class="flex flex-wrap">
          <a
            href="https://instagram.com/face2face"
            target="_blank"
            class="p-6 rounded-3xl bg-gradient-to-br to-[#FAEE9E]/20 hover:shadow-xl hover:scale-105 transition-all"
          >
            <svg
              class="w-12 h-12 mx-auto mb-2 text-[#E5A663] group-hover:scale-110 transition"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
            <div class="font-semibold text-black/80">@face2face</div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useCosmetologists } from '../../composables/user/useCosmetologists.js';

  const { cosmetologists, loadCosmetologists } = useCosmetologists();

  onMounted(() => {
    loadCosmetologists();
  });
</script>
