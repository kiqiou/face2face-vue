<script setup lang="ts">
  import { ref, onBeforeUnmount, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import GradientButton from '../components/ui/GradientButton.vue';
  import { authService } from '../utils/auth.js';
  import { BASE_API } from '../composables/baseApi.js';

  const router = useRouter();
  const API_BASE = BASE_API + 'api/users/';
  const TOKEN_KEY = 'tg_auth_token';
  const TOKEN_TTL = 10 * 60 * 1000; // 10 минут, подстройте под срок жизни токена на бэке

  const isLoading = ref(false);
  const isWaiting = ref(false);
  const consentGiven = ref(false);
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let authToken = '';

  const saveToken = (t: string) =>
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ t, ts: Date.now() }));

  const loadToken = () => {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) return '';
      const { t, ts } = JSON.parse(raw);
      if (Date.now() - ts > TOKEN_TTL) {
        localStorage.removeItem(TOKEN_KEY);
        return '';
      }
      return t as string;
    } catch {
      return '';
    }
  };

  const clearToken = () => {
    authToken = '';
    localStorage.removeItem(TOKEN_KEY);
  };

  const stopPolling = () => {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  };

  const startPolling = () => {
    stopPolling();
    pollTimer = setInterval(pollStatus, 2000);
    pollStatus(); // сразу, не ждём 2 секунды
  };

  const startLogin = async () => {
    if (!consentGiven.value) return;
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
        return;
      }

      authToken = data.auth_token;
      saveToken(authToken);          // <-- сохраняем ДО ухода со страницы
      isWaiting.value = true;
      startPolling();

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = data.telegram_link;
      } else {
        window.open(data.telegram_link, '_blank', 'width=600,height=700');
      }
    } finally {
      isLoading.value = false;
    }
  };

  const pollStatus = async () => {
    if (!authToken) {
      stopPolling();
      return;
    }
    try {
      const res = await fetch(API_BASE + `auth-status/${authToken}/`);
      const data = await res.json();

      if (data.status === 'confirmed') {
        stopPolling();
        clearToken();
        authService.setTokens(data.access, data.refresh, data.user);
        router.push('/user-profile');
      } else if (data.status === 'error') {
        stopPolling();
        clearToken();
        isWaiting.value = false;
        alert(data.error);
      }
    } catch (e) {
      // сеть могла моргнуть при переключении приложений — просто попробуем в следующий тик
    }
  };

  const onVisible = () => {
    if (document.visibilityState === 'visible' && authToken) pollStatus();
  };

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onVisible); // возврат из bfcache

    const saved = loadToken();
    if (saved) {            // вернулись после ухода в Telegram
      authToken = saved;
      isWaiting.value = true;
      startPolling();
    }
  });

  onBeforeUnmount(() => {
    stopPolling();
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('pageshow', onVisible);
  });
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
