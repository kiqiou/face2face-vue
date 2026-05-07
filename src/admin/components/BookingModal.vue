<template>
  <BaseModal @close="$emit('close')">
    <div class="flex flex-col gap-3 text-gray-700">
      <h2 class="text-xl font-bold text-gray-900">Бронь</h2>

      <p v-if="booking.user">
        <span class="font-semibold">Клиент:</span>
        {{ booking.user.username }}
      </p>

      <p v-if="booking.user">
        <span class="font-semibold">Телефон:</span>
        {{ booking.user.phone }}
      </p>

      <p>
        <span class="font-semibold">Начало:</span>
        {{ booking.start }}
      </p>

      <p>
        <span class="font-semibold">Конец:</span>
        {{ booking.end }}
      </p>

      <div class="my-2 h-px bg-gray-200"></div>

      <h3 class="font-semibold text-gray-900">Перенос записи</h3>

      <div class="flex gap-3 overflow-x-auto pb-2">
        <button
          v-for="day in futureWorkDays"
          :key="day.id"
          @click="selectedWorkDay = day"
          class="px-4 py-2 rounded-xl border whitespace-nowrap"
          :class="
            selectedWorkDay?.id === day.id
              ? 'bg-blue-500 text-white'
              : 'bg-white'
          "
        >
          {{ new Date(day.date).toLocaleDateString() }}
        </button>
      </div>

      <div v-if="selectedWorkDay">
        <h3 class="text-xl font-bold text-black/80 mb-3">Выберите время</h3>

        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="group in groupedSlotsArray"
            :key="group.hour"
            @click="selectedHour = group.hour"
            class="px-4 py-2 rounded-xl border"
            :class="
              selectedHour === group.hour
                ? 'bg-blue-500 text-white'
                : 'bg-white'
            "
          >
            {{ group.hour }}
          </button>
        </div>
        <div v-if="selectedHour" class="mt-2">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="time in groupedSlotsArray.find(
                (g) => g.hour === selectedHour
              )?.slots || []"
              :key="time"
              @click="selectedTime = time"
              class="px-3 py-2 rounded-xl border"
              :class="
                selectedTime === time ? 'bg-blue-500 text-white' : 'bg-white'
              "
            >
              {{ time }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4 flex gap-2 justify-end">
        <button
          @click="$emit('close')"
          class="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
        >
          Закрыть
        </button>

        <button
          @click="handleMove"
          class="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          Перенести
        </button>

        <button
          @click="$emit('cancel', booking.id)"
          class="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
        >
          Отменить
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import BaseModal from '../../components/ui/BaseModal.vue';
  import { Booking } from '../../models/booking.js';
  import { WorkDay } from '../../models/workday.js';
  import { Procedure } from '../../models/procedure.js';
  import { useFreeIntervals } from '../../composables/get/workday/useFreeIntervals.js';
  import { useWorkDaysByCosmetologist } from '../../composables/get/workday/useWorkDayByCosmetologist.js';

  const { freeIntervals, loadFreeIntervals } = useFreeIntervals();

  const props = defineProps<{
    booking: Booking;
    workDays: WorkDay[];
    procedures: Procedure[];
  }>();

  const selectedTime = ref<string | null>(null);
  const selectedHour = ref<string | null>(null);
  const selectedWorkDay = ref<WorkDay>();

  const now = new Date();

  const futureWorkDays = computed(() => {
    return props.workDays
      .filter((day) => {
        const dayDate = new Date(day.date);

        if (dayDate.toDateString() === now.toDateString()) {
          return day.endTime.slice(0, 5) > now.toTimeString().slice(0, 5);
        }

        return dayDate > now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  const totalDurationMinutes = computed(() => {
    return props.procedures.reduce((sum, p) => {
      const [h, m] = p.duration.split(':').map(Number);
      return sum + h * 60 + m;
    }, 0);
  });

  watch(selectedWorkDay, async (day) => {
    selectedTime.value = null;
    if (day) await loadFreeIntervals(day.id);
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

  const emit = defineEmits(['close', 'cancel', 'move']);

  const handleMove = () => {
    if (!selectedWorkDay.value || !selectedTime.value) return;

    emit('move', {
      id: props.booking.id,
      work_day_id: selectedWorkDay.value.id,
      start_time: selectedTime.value,
    });
  };
</script>
