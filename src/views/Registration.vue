<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GradientButton from '../components/ui/GradientButton.vue';
import TextField from '../components/ui/TextField.vue';
import { authService } from '../utils/auth.js';
import { BASE_API } from '../composables/baseApi.js';
import PhoneInput from '../components/ui/PhoneInput.vue';

const router = useRouter();

const API_BASE = BASE_API + 'api/users/';
const code = ref('');
const isCodeSent = ref(false);
const isLoading = ref(false);
const phoneNumber = ref("");

const sendPhone = async () => {
  if (!phoneNumber.value.trim()) return;

  isLoading.value = true;

  try {
    const res = await fetch(API_BASE + 'generate-auth/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber.value.trim() }),
    });

    const data = await res.json();

    if (res.ok) {
      isCodeSent.value = true;

      const telegramLink = data.telegram_link;
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        window.location.href = telegramLink;
      } else {
        window.open(telegramLink, '_blank', 'width=600,height=700');
      }
    } else {
      alert(data.error || 'Ошибка');
    }
  } finally {
    isLoading.value = false;
  }
};

const confirmCode = async () => {
  isLoading.value = true;

  try {
    const res = await fetch(API_BASE + 'confirm/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneNumber.value.trim(),
        code: code.value.trim(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      authService.setTokens(data.access, data.refresh, data.user);
      router.push('/user-profile');
    } else {
      alert(data.error);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col p-8 items-center w-full min-h-screen gap-10">
    <div
      class="flex justify-center animate-fade-in-up bg-gradient-to-br from-[#E5A663]/80 to-[#FAEE9E] p-[2px] rounded-[32px] w-full max-w-sm"
    >
      <p class="text-[40px] text-[#5D4037]">Face2face</p>
    </div>

    <div
      class="animate-fade-in-up bg-gradient-to-br from-[#E5A663] to-[#FAEE9E] p-[2px] rounded-[32px] w-full max-w-sm"
    >
      <div
        class="bg-white/90 rounded-[30px] p-8 flex flex-col items-center gap-6"
      >
        <h1 class="text-2xl text-[#5D4037]">
          {{ isCodeSent ? 'Введите код' : 'Регистрация/вход' }}
        </h1>

        <PhoneInput
          v-if="!isCodeSent"
          placeholder="Номер телефона"
          v-model="phoneNumber"
        />

        <TextField
          v-if="isCodeSent"
          placeholder="Код из Telegram"
          v-model="code"
          type="number"
          maxlength="6"
        />

        <GradientButton
          :buttonName="
            isLoading
              ? 'Загрузка...'
              : isCodeSent
                ? 'Подтвердить'
                : 'Отправить код'
          "
          :disabled="isLoading"
          @click="isCodeSent ? confirmCode() : sendPhone()"
        />
        
        <p v-if="isCodeSent" class="text-sm text-gray-600 text-center">
          Проверьте Telegram — код отправлен в чат с ботом
        </p>
      </div>
    </div>
  </div>
</template>