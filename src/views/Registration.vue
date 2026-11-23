<script setup lang="ts">
  import { ref, onBeforeUnmount, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import GradientButton from '../components/ui/GradientButton.vue';
  import { authService } from '../utils/auth.js';
  import { BASE_API } from '../composables/baseApi.js';

  const router = useRouter();
  const API_BASE = BASE_API + 'api/users/';
  const TOKEN_KEY = 'tg_auth_token';
  const TOKEN_TTL = 5 * 60 * 1000; 

  const isLoading = ref(false);
  const isWaiting = ref(false);
  const consentGiven = ref(false);
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let expireTimer: ReturnType<typeof setTimeout> | null = null;
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
    if (expireTimer) clearTimeout(expireTimer);
    pollTimer = null;
    expireTimer = null;
  };

  const startPolling = () => {
    stopPolling();
    pollTimer = setInterval(pollStatus, 2000);
    expireTimer = setTimeout(() => {
      cancelLogin();
      alert('Время ожидания истекло, попробуйте ещё раз');
    }, TOKEN_TTL);
    pollStatus();
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

  const cancelLogin = () => {
    stopPolling();
    clearToken();
    isWaiting.value = false;
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
      }  else if (data.status === 'expired') {
        cancelLogin();
        alert('Время ожидания истекло, попробуйте ещё раз');
      } 
    } catch (e) {
      // сеть могла моргнуть при переключении приложений — просто попробуем в следующий тик
    }
  }

  const onVisible = () => {
    if (document.visibilityState === 'visible' && authToken) pollStatus();
  };

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onVisible); // возврат из bfcache

    const saved = loadToken();
    if (saved) {            
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

```vue
<template>
  <div class="flex min-h-screen w-full flex-col items-center gap-8 px-4 py-10 sm:py-14">
    <!-- Заголовок -->
    <div class="w-full max-w-xl text-center">
      <p class="mb-3 text-xs uppercase tracking-[0.2em] text-ink-muted">
        FACE2FACE COSMETOLOGY
      </p>
      <h1 class="font-display text-3xl font-medium text-ink sm:text-4xl">
        Регистрация / вход
      </h1>
      <p class="mt-3 text-sm leading-relaxed text-ink-muted">
        Войдите через Telegram, чтобы оформлять заказы и управлять своим профилем
      </p>
    </div>

    <!-- Карточка авторизации -->
    <div
      class="w-full max-w-xl rounded-[2rem] border border-line bg-white/70 p-6 shadow-[0_20px_50px_-30px_rgba(201,139,94,0.55)] sm:p-9"
    >
      <!-- Иконка -->
      <div class="mb-6 flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-peach text-3xl text-caramel">
          <span>♡</span>
        </div>
      </div>

      <h2 class="mb-2 text-center font-display text-xl font-medium text-ink sm:text-2xl">
        {{ isWaiting ? 'Подтвердите вход' : 'Добро пожаловать!' }}
      </h2>

      <p class="mb-7 text-center text-sm text-ink-muted">
        {{
          isWaiting
            ? 'Остался всего один шаг для завершения авторизации'
            : 'Для входа используйте свой аккаунт Telegram'
        }}
      </p>

      <!-- Инструкция до авторизации -->
      <div
        v-if="!isWaiting"
        class="mb-7 rounded-3xl bg-peach/50 p-5"
      >
        <p class="mb-4 text-sm font-semibold text-ink">
          Как войти на сайт?
        </p>

        <ol class="space-y-3 text-sm leading-relaxed text-ink-muted">
          <li class="flex gap-3">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-caramel">1</span>
            <span>
              Нажмите кнопку
              <strong class="font-medium text-ink">«Войти через Telegram»</strong>.
            </span>
          </li>

          <li class="flex gap-3">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-caramel">2</span>
            <span>
              В открывшемся боте нажмите
              <strong class="font-medium text-ink">«Запустить» (Start)</strong>.
            </span>
          </li>

          <li class="flex gap-3">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-caramel">3</span>
            <span>
              Нажмите
              <strong class="font-medium text-ink">«Поделиться номером телефона»</strong>.
            </span>
          </li>

          <li class="flex gap-3">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-caramel">4</span>
            <span>
              Вернитесь на сайт — вход выполнится автоматически.
            </span>
          </li>
        </ol>
      </div>

      <!-- Ожидание подтверждения -->
      <div
        v-if="isWaiting"
        class="mb-7 flex flex-col items-center gap-4 rounded-3xl bg-peach/50 px-5 py-8 text-center"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white">
          <div
            class="h-7 w-7 animate-spin rounded-full border-[3px] border-caramel/20 border-t-caramel"
          ></div>
        </div>

        <div>
          <p class="font-medium text-ink">
            Ждём подтверждения в Telegram...
          </p>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">
            Перейдите в открывшееся окно Telegram, нажмите кнопку
            «Поделиться номером телефона», а затем вернитесь на эту страницу.
          </p>
        </div>

        <button
          type="button"
          class="text-sm text-ink-muted underline decoration-caramel/50 underline-offset-4 transition-colors hover:text-caramel"
          @click="cancelLogin"
        >
          Отменить авторизацию
        </button>
      </div>

      <!-- Согласие -->
      <label
        v-if="!isWaiting"
        class="mb-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-muted"
      >
        <input
          type="checkbox"
          v-model="consentGiven"
          class="mt-1 h-4 w-4 shrink-0 accent-caramel"
        />
        <span>
          Я даю согласие ИП Песлякова А.А. на обработку моего имени и номера телефона
          для оформления заказа и связи со мной в соответствии с
          <router-link
            to="/privacy-policy"
            target="_blank"
            class="text-caramel underline decoration-caramel/40 underline-offset-4 hover:text-ink"
          >
            Политикой обработки персональных данных
          </router-link>.
        </span>
      </label>

      <!-- Кнопка авторизации -->
      <button
        v-if="!isWaiting"
        type="button"
        :disabled="isLoading || !consentGiven"
        @click="startLogin"
        class="w-full rounded-full bg-caramel px-6 py-3.5 text-sm font-medium tracking-[0.08em] text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {{ isLoading ? 'Подключение...' : 'Войти через Telegram →' }}
      </button>

      <p
        v-if="!isWaiting"
        class="mt-5 text-center text-xs leading-relaxed text-ink-muted"
      >
        Ваш номер телефона используется только для авторизации,
        оформления заказов и связи с вами.
      </p>
    </div>

    <!-- Дополнительная информация -->
    <p class="text-center text-xs text-ink-muted">
      FACE2FACE COSMETOLOGY · Красота начинается с заботы о себе
    </p>
  </div>
</template>
```