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
  const consentGiven = ref(false);

  const stopPolling = () => {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  };

const startLogin = async () => {
  if (!consentGiven.value) return; // на всякий случай, хотя кнопка и так задизейблена

  isLoading.value = true;

  try {
    const res = await fetch(API_BASE + 'generate-auth/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent: consentGiven.value }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Не удалось начать авторизацию');
      return; // не запускаем поллинг с пустым токеном
    }

    authToken = data.auth_token;
    isWaiting.value = true;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = data.telegram_link;
    } else {
      window.open(data.telegram_link, 'width=600,height=700');
    }

    pollTimer = setInterval(pollStatus, 2000);
  } finally {
    isLoading.value = false;
  }
};

const pollStatus = async () => {
  if (!authToken) {
    stopPolling();
    return;
  }
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

        <!-- Инструкция ДО начала авторизации -->
        <div v-if="!isWaiting" class="text-xs text-stone-600 bg-stone-50 border border-stone-200/60 p-4 rounded-2xl w-full space-y-2">
          <p class="font-semibold text-stone-700">Как пройти регистрацию:</p>
          <ol class="list-decimal list-inside space-y-1.5 pl-1">
            <li>Нажмите кнопку <span class="font-medium text-[#E5A663]">«Войти через Telegram»</span></li>
            <li>В открывшемся боте нажмите <span class="font-medium">«Запустить» (Start)</span></li>
            <li>Нажмите появившуюся кнопку <span class="font-medium">«Поделиться номером телефона»</span></li>
            <li>После этого вернитесь на сайт — вход выполнится автоматически</li>
          </ol>
        </div>

        <!-- Инструкция ВО ВРЕМЯ ожидания ответа от Telegram -->
        <div v-if="isWaiting" class="flex flex-col items-center gap-3 text-center">
          <!-- Пульсирующая иконка ожидания -->
          <div class="w-8 h-8 rounded-full border-2 border-t-transparent border-[#E5A663] animate-spin"></div>
          <p class="text-sm text-gray-700 font-medium">
            Ждем подтверждения в Telegram...
          </p>
          <p class="text-xs text-gray-500 leading-relaxed">
            Перейдите в открывшееся окно мессенджера, нажмите кнопку <strong>«Поделиться номером телефона»</strong>, а затем сразу возвращайтесь на эту страницу.
          </p>
        </div>

        <label class="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" v-model="consentGiven" class="mt-1" />
          <span>
            Я даю согласие ИП Песлякова А.А. на обработку моего имени и номера телефона для оформления заказа и связи со мной, в соответствии с
            <router-link to="/privacy-policy" target="_blank" class="underline text-[#E5A663]">Политикой в отношении обработки персональных данных.</router-link>
          </span>
        </label>

        <GradientButton
          v-if="!isWaiting"
          :buttonName="isLoading ? 'Загрузка...' : 'Войти через Telegram'"
          :disabled="isLoading || !consentGiven"
          @click="startLogin"
        />
      </div>
    </div>
  </div>
</template>
