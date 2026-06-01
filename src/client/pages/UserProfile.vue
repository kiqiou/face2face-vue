<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import { useUserBookings } from '../../composables/get/booking/useUserBookings.js';
  import router from '../../router/index.js';
  import { authService } from '../../utils/auth.js';
  import ProcedureCard from '../components/ProcedureCard.vue';
  import { useCancelBooking } from '../../composables/post/bookings/useCancelBooking.js';
  import { useToast } from 'vue-toastification';

  const { bookings, load } = useUserBookings();
  const { success, error, cancel } = useCancelBooking();

  onMounted(() => {
    load();
  });

  const user = authService.getUser();

  const toast = useToast();

  const logout = () => {
    authService.logout();
    router.replace('/').catch(() => {
      window.location.href = '/';
    });
  };

  const futureBookings = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.value
      .filter((booking) => new Date(booking.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const daysUntil = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    return `через ${diffDays} дн.`;
  };

  const cancelBooking = async (id: number) => {
    await cancel(id);

    if (success.value) {
      await load();
      toast.success('Запись отменена');
    } else {
      toast.error(`Не удалось отменить запись: ${error.value}`);
    }
  };
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex flex-col justify-center items-center gap-3">
      <div
        class="w-40 h-40 sm: w-25 sm: h-25 bg-gradient-to-r from-[#E5A663] to-[#FAEE9E] rounded-full"
      ></div>
      <h1
        class="text-3xl sm: text-2xl font-black bg-black/80 bg-clip-text text-transparent"
      >
        {{ user.username || 'Профиль' }}
      </h1>
      <p class="text-xl md:text-2xl text-black/80 max-w-2xl leading-relaxed">
        Ваш личный кабинет
      </p>
      <div class="flex flex-row">
        <div class="text-sm font-medium text-black/70">Телефон</div>
        <div class="text-sm text-black/70]">
          {{ user?.phone || 'Не указан' }}
        </div>
      </div>
    </div>

    <div class="max-w-2xl">
      <div class="max-w-4xl mx-auto mt-16 mb-20">
        <div
          class="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#E5A663]/30 shadow-2xl"
        >
          <div class="flex flex-col items-center justify-center gap-4">
            <svg
              class="w-12 h-12 text-[#E5A663]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div class="flex flex-col items-center">
              <h3 class="text-3xl font-black text-black/80">Мои записи</h3>
              <p class="text-black/70 mt-1">Текущие записи на процедуры</p>
            </div>
            <div class="border border-[#E5A663]/20 rounded-xl p-4 mb-2">
              <p class="text-black/70 mt-1">
                Самостоятельно отменить запись можно за 2 часа до, иначе
                необходимо связаться с кометологом по номеру телефона или в
                Telegram/Viber
              </p>
            </div>
          </div>

          <div v-if="futureBookings.length === 0" class="text-center py-20">
            <div
              class="w-24 h-24 mx-auto bg-gradient-to-r from-[#E5A663]/20 to-[#FAEE9E]/20 rounded-2xl flex items-center justify-center mb-6"
            >
              <svg
                class="w-12 h-12 text-[#E5A663]/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 class="text-2xl font-black text-black/70 mb-2">Записей нет</h4>
            <p class="text-black/70 max-w-md mx-auto">
              У вас пока нет активных записей. Запишитесь на процедуру в
              <router-link
                to="/about"
                class="text-[#E5A663] hover:underline font-semibold"
              >
                списке мастеров
              </router-link>
            </p>
          </div>

          <div v-else class="flex flex-col space-y-4">
            <div
              v-for="booking in futureBookings"
              :key="booking.id"
              class="flex flex-col group bg-[#FAEE9E]/20 backdrop-blur-sm rounded-2xl p-6 border border-[#E5A663]/30 hover:shadow-xl hover:border-[#E5A663]/50 transition-all duration-300 overflow-hidden"
            >
              <div class="flex flex-col md:justify-between gap-6">
                <span class="text-xl"
                  >Косметолог: {{ booking.cosmetologist.user.username }}</span
                >
                <span class="text-xl">Процедуры:</span>
                <procedure-card
                  v-for="(procedure, index) in booking.procedures"
                  :key="procedure.id || index"
                  :procedure="procedure"
                  :show-button="false"
                  class="w-full"
                />

                <div>
                  <div class="flex flex-col items-end text-right">
                    <div class="text-2xl font-black">
                      {{ formatDate(booking.date) }}
                    </div>
                    <div class="text-lg font-semibold">
                      {{ booking.startTime }}
                    </div>
                    <div class="text-xs text-slate-500 mt-1">
                      {{ daysUntil(booking.date) }}
                    </div>
                  </div>
                </div>
                <GradientButton
                  button-name="Отменить запись"
                  v-on:click="cancelBooking(booking.id)"
                ></GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-20">
        <GradientButton
          button-name="Выйти из аккаунта"
          v-on:click="logout()"
        ></GradientButton>
      </div>
    </div>
  </div>
</template>
