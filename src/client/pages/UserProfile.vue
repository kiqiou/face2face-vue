<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import router from '../../router/index.js';
  import { authService } from '../../utils/auth.js';
  import { ORDER_STATUS_LABELS } from '../../models/order.js';
import { useGetUserOrders } from '../../composables/order/useGetUserOrder.js';

  // --- логика записей (закомментировано, не удалено) ---
  // import ProcedureCard from '../components/ProcedureCard.vue';
  // import { useCancelBooking } from '../../composables/bookings/useCancelBooking.js';
  // import { useToast } from 'vue-toastification';
  // import { useUserBookings } from '../../composables/bookings/useUserBookings.js';
  //
  // const { bookings, load } = useUserBookings();
  // const { success, error, cancel } = useCancelBooking();
  // const toast = useToast();
  //
  // const futureBookings = computed(() => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //
  //   return bookings.value
  //     .filter((booking) => new Date(booking.date) >= today)
  //     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  // });
  //
  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString('ru-RU', {
  //     weekday: 'short',
  //     day: 'numeric',
  //     month: 'short',
  //     year: 'numeric',
  //   });
  // };
  //
  // const daysUntil = (date: Date) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const bookingDate = new Date(date);
  //   bookingDate.setHours(0, 0, 0, 0);
  //
  //   const diffTime = bookingDate.getTime() - today.getTime();
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //
  //   if (diffDays === 0) return 'Сегодня';
  //   if (diffDays === 1) return 'Завтра';
  //   return `через ${diffDays} дн.`;
  // };
  //
  // const cancelBooking = async (id: number) => {
  //   await cancel(id);
  //
  //   if (success.value) {
  //     await load();
  //     toast.success('Запись отменена');
  //   } else {
  //     toast.error(`Не удалось отменить запись: ${error.value}`);
  //   }
  // };
  // --- конец логики записей ---

  const { orders, loading: ordersLoading, loadAll: loadOrders } = useGetUserOrders();

  onMounted(() => {
    // load(); // загрузка записей — закомментировано вместе с блоком выше
    loadOrders();
  });

  const user = authService.getUser();

  const logout = () => {
    authService.logout();
    router.replace('/').catch(() => {
      window.location.href = '/';
    });
  };

  const orderTotal = (order: (typeof orders.value)[number]) =>
    order.items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);

  const paymentLabel = (method: string) =>
    method === 'card' ? 'Картой' : 'Наличными';

  const formatOrderDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
</script>

<template>
  <div class="flex flex-col min-h-screen px-4 pb-20">
    <!-- Шапка профиля -->
    <div class="flex flex-col items-center gap-4 pt-16">
      <div
        class="w-28 h-28 bg-gradient-to-br from-[#E5A663] to-[#FAEE9E] rounded-full flex items-center justify-center shadow-lg shadow-[#E5A663]/20"
      >
        <span class="text-4xl font-black text-white/90">
          {{ (user?.username || '?').charAt(0).toUpperCase() }}
        </span>
      </div>

      <div class="text-center">
        <h1 class="text-3xl font-black text-slate-800">
          {{ user?.username || 'Профиль' }}
        </h1>
        <p class="text-black/50 mt-1">{{ user?.phone || 'Телефон не указан' }}</p>
      </div>

      <GradientButton button-name="Выйти из аккаунта" @click="logout()" />
    </div>

    <!-- Мои заказы -->
    <div class="w-full max-w-3xl mx-auto mt-16">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-[#E5A663]/15 flex items-center justify-center">
          <svg class="w-5 h-5 text-[#E5A663]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-slate-800">Мои заказы</h2>
      </div>

      <div v-if="ordersLoading" class="text-center py-10 text-black/50">
        Загружаем заказы...
      </div>

      <div v-else-if="orders.length === 0" class="bg-white/70 rounded-3xl p-10 text-center">
        <p class="text-black/60">У вас пока нет заказов</p>
        <router-link to="/products" class="text-[#E5A663] hover:underline font-semibold mt-2 inline-block">
          Перейти к товарам
        </router-link>
      </div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#E5A663]/20 hover:border-[#E5A663]/40 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div class="flex items-center gap-3">
              <span class="font-black text-lg text-slate-800">Заказ №{{ order.id }}</span>
              <span
                class="text-xs font-semibold px-3 py-1 rounded-full"
                :class="{
                  'bg-amber-100 text-amber-700': order.status === 'new',
                  'bg-blue-100 text-blue-700': order.status === 'confirmed',
                  'bg-green-100 text-green-700': order.status === 'done',
                  'bg-red-100 text-red-700': order.status === 'cancelled',
                }"
              >
                {{ ORDER_STATUS_LABELS[order.status] }}
              </span>
            </div>
            <span class="text-sm text-black/40">{{ formatOrderDate(order.createdAt) }}</span>
          </div>

          <div class="flex flex-col gap-2 mb-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex justify-between text-sm text-black/70"
            >
              <span>{{ item.product?.name }} × {{ item.quantity }}</span>
              <span class="font-semibold text-black/90">{{ item.priceAtOrder * item.quantity }} BYN</span>
            </div>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-[#E5A663]/15">
            <span class="text-sm text-black/50">{{ paymentLabel(order.paymentMethod) }}</span>
            <span class="text-xl font-black text-[#E5A663]">{{ orderTotal(order) }} BYN</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- Мои записи (закомментировано, не удалено) -->
    <!--
    <div class="max-w-2xl">
      <div class="max-w-4xl mx-auto mt-16 mb-20">
        <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#E5A663]/30 shadow-2xl">
          <div class="flex flex-col items-center justify-center gap-4">
            <svg class="w-12 h-12 text-[#E5A663]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            <div class="w-24 h-24 mx-auto bg-gradient-to-r from-[#E5A663]/20 to-[#FAEE9E]/20 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-[#E5A663]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 class="text-2xl font-black text-black/70 mb-2">Записей нет</h4>
            <p class="text-black/70 max-w-md mx-auto">
              У вас пока нет активных записей. Запишитесь на процедуру в
              <router-link to="/about" class="text-[#E5A663] hover:underline font-semibold">
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
                <span class="text-xl">Косметолог: {{ booking.cosmetologist.user.username }}</span>
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
                    <div class="text-2xl font-black">{{ formatDate(booking.date) }}</div>
                    <div class="text-lg font-semibold">{{ booking.startTime }}</div>
                    <div class="text-xs text-slate-500 mt-1">{{ daysUntil(booking.date) }}</div>
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
    </div>
    -->
    <!-- ==================== -->
  </div>
</template>