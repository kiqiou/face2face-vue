<script setup lang="ts">
  import { ref, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import GradientButton from '../components/ui/GradientButton.vue';
  import { authService } from '../utils/auth.js';
  import { BASE_API } from '../composables/baseApi.js';

  const router = useRouter();
  const API_BASE = BASE_API + 'api/users/';

  const isLoading = ref(false);
  const isWaiting = ref(false); // ждём подтверждения в Telegram
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let authToken = '';

  const stopPolling = () => {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  };

  const startLogin = async () => {
    isLoading.value = true;

    try {
      const res = await fetch(API_BASE + 'generate-auth/', { method: 'POST' });
      const data = await res.json();

      authToken = data.auth_token;
      isWaiting.value = true;

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = data.telegram_link;
      } else {
        window.open(data.telegram_link, '_blank', 'width=600,height=700');
      }

      pollTimer = setInterval(pollStatus, 2000);
    } finally {
      isLoading.value = false;
    }
  };

const pollStatus = async () => {
  const res = await fetch(API_BASE + `auth-status/${authToken}/`);
  const data = await res.json();

  if (data.status === 'confirmed') {
    stopPolling();
    authService.setTokens(data.access, data.refresh, data.user);
    router.push('/user-profile');
  } else if (data.status === 'error') {
    stopPolling();
    alert(data.error);
  }
};

  onBeforeUnmount(stopPolling);
</script>

<template>
  <div class="flex flex-col p-8 items-center w-full min-h-screen gap-10">
    <div class="flex justify-center animate-fade-in-up bg-gradient-to-br from-[#E5A663]/80 to-[#FAEE9E] p-[2px] rounded-[32px] w-full max-w-sm">
      <p class="text-[40px] text-[#5D4037]">Face2face</p>
    </div>

    <div class="animate-fade-in-up bg-gradient-to-br from-[#E5A663] to-[#FAEE9E] p-[2px] rounded-[32px] w-full max-w-sm">
      <div class="bg-white/90 rounded-[30px] p-8 flex flex-col items-center gap-6">
        <h1 class="text-2xl text-[#5D4037]">Регистрация/вход</h1>

        <p v-if="isWaiting" class="text-sm text-gray-600 text-center">
          Подтвердите номер в открывшемся Telegram — кнопкой «Поделиться номером телефона».<br />
          Вход выполнится автоматически.
        </p>

        <GradientButton
          v-if="!isWaiting"
          :buttonName="isLoading ? 'Загрузка...' : 'Войти через Telegram'"
          :disabled="isLoading"
          @click="startLogin"
        />
      </div>
    </div>
  </div>
</template>