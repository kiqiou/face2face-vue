<script setup lang="ts">
  import router from '../../router/index.js';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useCartStore } from '../../stores/cart.js';
  import { useCreateBooking } from '../../composables/post/bookings/useCreateBooking.js';
  import { useWorkDaysByCosmetologist } from '../../composables/get//workday/useWorkDayByCosmetologist.js';
  import { WorkDay } from '../../models/workday.js';
  import { useFreeIntervals } from '../../composables/get/workday/useFreeIntervals.js';
import ProcedureCard from '../components/ProcedureCard.vue';

  const cart = useCartStore();

  const { booking, createBooking, success, error } = useCreateBooking();
  const { workDays, loadWorkDayByCosmetologist } = useWorkDaysByCosmetologist();
  const { freeIntervals, loadFreeIntervals } = useFreeIntervals();

  const selectedTime = ref<string | null>(null);
  const selectedHour = ref<string | null>(null);
  const selectedWorkDay = ref<WorkDay>();

  onMounted(() => {
    if (cart.cosmetologist) {
      loadWorkDayByCosmetologist(cart.cosmetologist.id);
    }
  });

  const total = computed(() =>
    cart.procedures.reduce((sum, p) => sum + p.price, 0)
  );

  const now = new Date();

  const futureWorkDays = computed(() => {
    return workDays.value
      .filter((day) => {
        const dayDate = new Date(day.date);

        if (dayDate.toDateString() === now.toDateString()) {
          return day.endTime > now.toTimeString().slice(0, 5);
        }

        return dayDate > now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  watch(selectedWorkDay, async (day) => {
    selectedTime.value = null;
    if (day) await loadFreeIntervals(day.id);
  });

  const totalDurationMinutes = computed(() => {
    return cart.procedures.reduce((sum, p) => {
      const [h, m] = p.duration.split(':').map(Number);
      return sum + h * 60 + m;
    }, 0);
  });

  const generatedSlots = computed(() => {
    const slots: string[] = [];

    const step = 5;

    freeIntervals.value.forEach((interval) => {
      let [h, m] = interval.start.split(':').map(Number);
      const [endH, endM] = interval.end.split(':').map(Number);

      while (true) {
        const startMinutes = h * 60 + m;
        const endMinutes = endH * 60 + endM;

        if (startMinutes + totalDurationMinutes.value > endMinutes) break;

        slots.push(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        );

        m += step;
        if (m >= 60) {
          h += Math.floor(m / 60);
          m = m % 60;
        }
      }
    });

    return slots;
  });

  const groupedSlotsArray = computed(() => {
    const groups: Record<string, string[]> = {};

    generatedSlots.value.forEach((time) => {
      const hour = time.split(':')[0];
      if (!groups[hour]) groups[hour] = [];
      groups[hour].push(time);
    });

    Object.keys(groups).forEach((hour) => {
      groups[hour].sort((a, b) => {
        const [, am] = a.split(':').map(Number);
        const [, bm] = b.split(':').map(Number);
        return am - bm;
      });
    });

    return Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b)
      .map((hourNum) => ({
        hour: hourNum.toString().padStart(2, '0'),
        slots: groups[hourNum.toString().padStart(2, '0')],
      }));
  });

  const confirmBooking = async () => {
    if (!selectedWorkDay.value || !selectedTime.value) {
      alert('Выберите дату и время!');
      return;
    }

    const procedureIds = cart.procedures.map((p) => p.id);
    await createBooking(
      procedureIds,
      selectedWorkDay.value.id,
      selectedTime.value
    );

    if (success.value) {
      router.push('/success');
      cart.clearCart()
    } else if (error.value) {
      alert(error.value);
    }
  };
</script>

<template>
  <div class="flex flex-col gap-6 w-full min-h-screen">
    <div v-if="cart.cosmetologist" class="">
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div
          class="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-[#E5A663]/20 to-[#FAEE9E]/20"
        >
          <img
            :src="cart.cosmetologist.avatarUrl"
            alt="Фото косметолога"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-black text-slate-800 mb-1">
            {{ cart.cosmetologist.user.username }}
          </div>
          <div class="text-xl text-[#E5A663] mb-2 font-semibold">
            {{ cart.cosmetologist.specialization }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="cart.procedures.length > 0"
      class="bg-white/90 rounded-3xl p-6 md:p-8 mb-8"
    >
      <h2
        class="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3"
      >
        Услуги в корзине
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProcedureCard 
        v-for="proc in cart.procedures"
          :key="proc.id"
          :procedure="proc"
          :show-button="false" />
          
      </div>

      <div class="mt-8 pt-6 border-t border-[#E5A663]/30 text-right">
        <div class="text-xl text-black/80">
          Итого: <span class="font-black text-[#E5A663]">{{ total }}</span> BYN
        </div>
      </div>
      <div class="flex gap-3 overflow-x-auto pb-2">
        <button
          v-for="day in futureWorkDays"
          :key="day.id"
          @click="selectedWorkDay = day"
          class="px-4 py-2 rounded-xl border whitespace-nowrap"
          :class="
            selectedWorkDay?.id === day.id
              ? 'bg-[#E5A663] text-white'
              : 'bg-white'
          "
        >
          {{ new Date(day.date).toLocaleDateString() }}
        </button>
      </div>

      <div v-if="selectedWorkDay" class="mt-6">
        <h3 class="text-2xl font-bold text-slate-800 mb-3">Выберите время</h3>

        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="group in groupedSlotsArray"
            :key="group.hour"
            @click="selectedHour = group.hour"
            class="px-4 py-2 rounded-xl border"
            :class="
              selectedHour === group.hour
                ? 'bg-[#E5A663] text-white'
                : 'bg-white'
            "
          >
            {{ group.hour }}
          </button>
        </div>
        <div v-if="selectedHour" class="mt-4">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="time in groupedSlotsArray.find(
                (g) => g.hour === selectedHour
              )?.slots || []"
              :key="time"
              @click="selectedTime = time"
              class="px-3 py-2 rounded-xl border"
              :class="
                selectedTime === time ? 'bg-[#E5A663] text-white' : 'bg-white'
              "
            >
              {{ time }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="cart.procedures.length > 0" class="flex justify-center mt-8">
        <GradientButton
          button-name="Подтвердить запись"
          class="text-xl py-4 px-10"
          @click="confirmBooking"
        />
      </div>
    </div>

    <div v-else class="flex justify-center text-black/70 text-2xl">
      Вы еще не добавили услуги
    </div>
  </div>
</template>
