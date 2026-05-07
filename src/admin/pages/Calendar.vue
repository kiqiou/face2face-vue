<template>
  <div class="flex flex-col gap-6">
    <HeaderAdmin></HeaderAdmin>
    <div class="flex justify-center items-center gap-6">
      <button
        v-if="selectedWorkDay"
        class="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600"
        @click="deleteWorkDayHandler()"
      >
        Удалить рабочий день
      </button>
    </div>
    <div class="calendar-app w-100% px-5 h-screen">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
  <BookingModal
    v-if="isModalOpen && selectedBooking"
    :booking="selectedBooking"
    :workDays="workDaysFormatted"
    :procedures="selectedBooking.procedures"
    @close="isModalOpen = false"
    @cancel="cancelBooking"
    @move="moveBooking"
  />
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
  import BookingModal from '../components/BookingModal.vue';
  import { WorkDay } from '../../models/workday.js';
  import { EventInput } from '@fullcalendar/core/index.js';
  import HeaderAdmin from '../components/HeaderAdmin.vue';
  import { useCosmetologists } from '../../composables/get/user/useCosmetologists.js';
  import { useCreateWorkDay } from '../../composables/post/workDay/useCreateWorkDay.js';
  import { useWorkDays } from '../../composables/get/workday/useWorkDays.js';
  import { useBookingByCosmetologist } from '../../composables/get/booking/useBookingByCosmetologist.js';
  import { Booking } from '../../models/booking.js';
  import { useCancelBooking } from '../../composables/post/bookings/useCancelBooking.js';
  import { useToast } from 'vue-toastification';
  import { useUpdateBooking } from '../../composables/post/bookings/useUpdateBooking.js';
  import { useDeleteWorkDay } from '../../composables/post/workDay/useDeleteWorkDay.js';
  import { useUpdateWorkDay } from '../../composables/post/workDay/useUpdateWorkDay.js';

  const { cosmetologists, loadCosmetologists } = useCosmetologists();
  const { workDays, loadWorkDays } = useWorkDays();
  const { bookings, loadBookingByCosmetologist } = useBookingByCosmetologist();
  const { success, error, cancel } = useCancelBooking();
  const {
    updateBooking,
    success: updBookingSuccess,
    error: updBookingError,
  } = useUpdateBooking();
  const {
    success: delSuccess,
    error: delError,
    deleteWorkDay,
  } = useDeleteWorkDay();
  const {
    updateWorkDay,
    success: updSuccess,
    error: updError,
  } = useUpdateWorkDay();

  const {
    create,
    success: createSuccess,
    error: createError,
  } = useCreateWorkDay();

  const toast = useToast();

  const allEvents = ref<EventInput[]>([]);

  const selectedBooking = ref<Booking | null>(null);
  const selectedWorkDay = ref<WorkDay | null>(null);
  const calendar = ref<any>(null);
  const isModalOpen = ref(false);

  onMounted(() => {
    loadCosmetologists();
    loadWorkDays();
    loadBookingByCosmetologist();
  });

  const workDaysFormatted = computed(() => {
    return (workDays.value as any[]).map(
      (wd) =>
        new WorkDay(
          wd.id,
          wd.cosmetologist,
          new Date(wd.date),
          wd.start_time,
          wd.end_time,
          wd.is_working
        )
    );
  });

  const resources = computed(() => {
    if (!cosmetologists.value || cosmetologists.value.length === 0) {
      return [];
    }
    return cosmetologists.value.map((cosm) => ({
      id: `cosmetologist-${cosm.id}`,
      title: `Косметолог ${cosm.user.username}`,
    }));
  });

  const backgroundEvents = computed<EventInput[]>(() => {
    return workDaysFormatted.value.map((wd) => ({
      id: `workday-${wd.id}`,
      start: `${wd.date.toISOString().split('T')[0]}T${wd.startTime}`,
      end: `${wd.date.toISOString().split('T')[0]}T${wd.endTime}`,
      resourceId: `cosmetologist-${wd.cosmetologist.id}`,
      display: 'background',
      backgroundColor: '#bbf7d0',
      extraDays: 'bg-workday',
    }));
  });

  const eventsBooking = computed<EventInput[]>(() => {
    return bookings.value.map((b) => ({
      id: `booking-${b.id}`,
      start: `${b.date.toISOString().split('T')[0]}T${b.startTime}`,
      end: `${b.date.toISOString().split('T')[0]}T${b.endTime}`,
      resourceId: `cosmetologist-${b.cosmetologist.id}`,
      display: 'block',
      title: `Запись ${b.startTime}`,
      backgroundColor: 'green',
      borderColor: 'white',
      extendedProps: {
        bookingId: b.id,
      },
    }));
  });

  watch(
    [eventsBooking, backgroundEvents],
    () => {
      allEvents.value = [...eventsBooking.value, ...backgroundEvents.value];
    },
    { deep: true }
  );

  const deleteWorkDayHandler = async () => {
    if (!selectedWorkDay.value) return;

    const wd = selectedWorkDay.value;

    const ok = confirm(
      `Удалить рабочий день ${wd.startTime.slice(0, 5)}–${wd.endTime.slice(0, 5)}?`
    );
    if (!ok) return;

    await deleteWorkDay(wd.id);

    if (delSuccess) {
      selectedWorkDay.value = null;
      toast.success('Рабочий день удалён');
      loadWorkDays();
      loadBookingByCosmetologist();
    } else {
      toast.error(`Ошибка удаления: ${delError}`);
    }
  };

  const findWorkDayId = (date: string, cosmetologistId: number) => {
    const wd = workDaysFormatted.value.find((w) => {
      const wdDate = w.date.toISOString().split('T')[0];

      return (
        wdDate === date && w.cosmetologist.id === cosmetologistId && w.isWorking
      );
    });

    return wd?.id;
  };

  const isInsideWorkDay = (
    wd: WorkDay,
    start: string,
    end: string
  ): boolean => {
    const wdStart = wd.startTime.slice(0, 5);
    const wdEnd = wd.endTime.slice(0, 5);

    return start >= wdStart && end <= wdEnd && start < wdEnd;
  };

  const overlapsWorkDay = (
    wd: WorkDay,
    start: string,
    end: string
  ): boolean => {
    const wdStart = wd.startTime.slice(0, 5);
    const wdEnd = wd.endTime.slice(0, 5);

    return start < wdEnd && end > wdStart;
  };

  const hasBookingConflict = (
    date: string,
    cosmetologistId: number,
    start: string,
    end: string
  ): boolean => {
    return bookings.value.some((b: Booking) => {
      const bDate = b.date.toISOString().split('T')[0];
      const bStart = b.startTime.slice(0, 5);
      const bEnd = b.endTime.slice(0, 5);

      return (
        bDate === date &&
        b.cosmetologist.id === cosmetologistId &&
        start < bEnd &&
        end > bStart
      );
    });
  };

  const getWorkDaysForDay = (
    date: string,
    cosmetologistId: number
  ): WorkDay[] => {
    return workDaysFormatted.value.filter((wd) => {
      const wdDate = wd.date.toISOString().split('T')[0];
      return (
        wdDate === date &&
        wd.cosmetologist.id === cosmetologistId &&
        wd.isWorking
      );
    });
  };

  const isFullWorkDayOverlap = (
    wd: WorkDay,
    start: string,
    end: string
  ): boolean => {
    const wdStart = wd.startTime.slice(0, 5);
    const wdEnd = wd.endTime.slice(0, 5);

    return start === wdStart && end === wdEnd;
  };

  const getWorkDayMinTimeRange = (
    date: string,
    cosmetologistId: number
  ): { minStart: string; maxEnd: string } | null => {
    const dayBookings = bookings.value.filter((b: Booking) => {
      const bDate = b.date.toISOString().split('T')[0];
      return bDate === date && b.cosmetologist.id === cosmetologistId;
    });

    if (dayBookings.length === 0) {
      return null;
    }

    const sortedStart = [...dayBookings].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    const sortedEnd = [...dayBookings].sort((a, b) =>
      a.endTime.localeCompare(b.endTime)
    );

    return {
      minStart: sortedStart[0].startTime.slice(0, 5),
      maxEnd: sortedEnd[sortedEnd.length - 1].endTime.slice(0, 5),
    };
  };

  const calendarOptions = ref<any>({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      resourceTimelinePlugin,
      interactionPlugin,
    ],
    initialView: 'resourceTimelineDay',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,resourceTimelineDay,resourceTimelineWeek',
    },
    locale: 'ru',
    editable: true,
    eventResizableFromStart: true,
    eventDurationEditable: true,
    selectable: true,
    height: '80vh',
    expandRows: true,
    events: allEvents,
    resources: resources,

    eventDidMount(info: any) {
      if (!calendar.value) {
        calendar.value = info.view.calendar;
      }
    },

    eventClick(info: any) {
      const eventId = info.event.id;

      if (eventId?.startsWith('booking-')) {
        const bookingId = Number(eventId.replace('booking-', ''));
        const fullBooking = bookings.value.find(
          (b: Booking) => b.id === bookingId
        );
        selectedBooking.value = fullBooking ?? null;
        isModalOpen.value = Boolean(fullBooking);
      } else if (eventId?.startsWith('workday-')) {
        const workDayId = Number(eventId.replace('workday-', ''));
        const wd = workDaysFormatted.value.find((w) => w.id === workDayId);
        selectedWorkDay.value = wd ?? null;
      }
    },

    eventDrop: async (info: any) => {
      const eventId = info.event.id;

      if (!eventId?.startsWith('booking-')) {
        info.revert();
        return;
      }

      const bookingId = Number(eventId.replace('booking-', ''));

      const date = info.event.startStr.split('T')[0];
      const start_time = info.event.startStr.substring(11, 16);

      const resourceId =
        info.newResource?.id || info.event.getResources?.()?.[0]?.id;
      const cosmetologistId = Number(resourceId?.split('-')?.[1]);

      if (!cosmetologistId) {
        toast.error('Не найден косметолог');
        info.revert();
        return;
      }

      const workDayId = findWorkDayId(date, cosmetologistId);

      if (!workDayId) {
        toast.error('Рабочий день не найден');
        info.revert();
        return;
      }

      await updateBooking(bookingId, {
        workDayId,
        start_time,
      });

      if (updBookingSuccess.value) {
        toast.success('Запись перенесена');
        loadBookingByCosmetologist();
      } else {
        toast.error(updBookingError.value);
        info.revert();
      }
    },

    select: async (info: any) => {
      const calendarRef = calendar.value;

      const date = info.startStr.split('T')[0];
      const start = info.startStr.substring(11, 16);
      const end = info.endStr.substring(11, 16);

      const resourceId = info.resource?.id;
      const cosmoId = resourceId?.split('-')?.[1];
      const cosmetologistId = Number(cosmoId);

      if (!cosmoId) {
        toast.error('Не выбран косметолог');
        calendarRef?.unselect();
        return;
      }

      const wds = getWorkDaysForDay(date, cosmetologistId);

      const overlappingWds = wds.filter((wd) =>
        overlapsWorkDay(wd, start, end)
      );

      const fullMatchWd = overlappingWds.find((wd) =>
        isFullWorkDayOverlap(wd, start, end)
      );

      if (fullMatchWd) {
        const wd = fullMatchWd;
        const wdStart = wd.startTime.slice(0, 5);
        const wdEnd = wd.endTime.slice(0, 5);

        const msg = `Удалить рабочий день ${wdStart}–${wdEnd}?`;
        if (!confirm(msg)) {
          calendarRef?.unselect();
          return;
        }

        await deleteWorkDay(wd.id);

        if (delSuccess.value) {
          toast.success('Рабочий день удалён');
          selectedWorkDay.value = null;
          loadWorkDays();
          loadBookingByCosmetologist();
        } else {
          toast.error(`Ошибка удаления: ${delError}`);
        }

        calendarRef?.unselect();
        return;
      }

      if (overlappingWds.length === 1) {
        const wd = overlappingWds[0];
        const wdStart = wd.startTime.slice(0, 5);
        const wdEnd = wd.endTime.slice(0, 5);

        const minRange = getWorkDayMinTimeRange(date, cosmetologistId);

        if (minRange) {
          const newStart = start < wdStart ? start : wdStart;
          const newEnd = end > wdEnd ? end : wdEnd;

          if (newEnd < minRange.minStart || newStart > minRange.maxEnd) {
            toast.error(
              `Нельзя обрезать рабочий день так, чтобы брони (${minRange.minStart}–${minRange.maxEnd}) остались вне рабочего времени.`
            );
            calendarRef?.unselect();
            return;
          }
        }

        if (isInsideWorkDay(wd, start, end)) {
          const msg = `Обрезать рабочий день с ${wdStart}–${wdEnd} на ${start}–${end}?`;
          if (!confirm(msg)) {
            calendarRef?.unselect();
            return;
          }

          await updateWorkDay(wd.id, {
            start_time: `${start}:00`,
            end_time: `${end}:00`,
          });
        } else {
          const newStart = start < wdStart ? start : wdStart;
          const newEnd = end > wdEnd ? end : wdEnd;
          const msg = `Расширить рабочий день с ${wdStart}–${wdEnd} до ${newStart}–${newEnd}?`;
          if (!confirm(msg)) {
            calendarRef?.unselect();
            return;
          }

          await updateWorkDay(wd.id, {
            start_time: `${newStart}:00`,
            end_time: `${newEnd}:00`,
          });
        }

        if (updSuccess.value) {
          toast.success('Рабочий день обновлён');
          loadWorkDays();
          loadBookingByCosmetologist();
        } else {
          toast.error(`Ошибка обновления: ${updError}`);
        }

        calendarRef?.unselect();
        return;
      }

      if (overlappingWds.length > 1) {
        toast.error(
          'Нельзя одновременно обновить несколько рабочих дней или перерыв. ' +
            'Выберите только один рабочий день или слот между днями.'
        );
        calendarRef?.unselect();
        return;
      }

      const msg = `Создать новый рабочий день ${start}–${end}?`;
      if (!confirm(msg)) {
        calendarRef?.unselect();
        return;
      }

      await create(date, `${start}:00`, `${end}:00`);

      if (createSuccess.value) {
        toast.success('Рабочий день создан');
        loadWorkDays();
        loadBookingByCosmetologist();
      } else {
        toast.error(`Ошибка создания: ${createError}`);
      }

      calendarRef?.unselect();
    },
  });

  const cancelBooking = (id: number) => {
    cancel(id);

    if (success.value) {
      isModalOpen.value = false;
      loadBookingByCosmetologist();
      loadWorkDays();
      toast.success(`Запись отменена`);
    } else {
      toast.error(`Не удалось отменить запись: ${error}`);
    }
  };

  const moveBooking = async ({ id, workDayId, start_time }: any) => {
    await updateBooking(id, {
      workDayId,
      start_time,
    });

    if (updBookingSuccess.value) {
      toast.success('Запись перенесена');
      isModalOpen.value = false;
      loadBookingByCosmetologist();
      loadWorkDays();
    } else {
      toast.error(updBookingError.value);
    }
  };
</script>

<style scoped>
  .calendar-app {
    width: 100%;
    max-width: 100vw;
  }

  :deep(.fc) {
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    --fc-neutral-bg-color: #f9f9f9;
    --fc-event-bg-color: #ffffff;
  }

  :deep(.fc-header-toolbar) {
    margin-bottom: 0.8rem;
  }

  :deep(.fc-button) {
    background: white;
    border: 1px solid #e5e5e5;
    color: #444;
    padding: 0.4rem 1rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  :deep(.fc-button:focus-visible),
  :deep(.fc-button-active),
  :deep(.fc-button-primary) {
    background: #e5a663;
    color: #fff;
    border-color: #e5a663;
  }

  :deep(.fc-toolbar-title) {
    font-size: 1.3rem;
    font-weight: 900;
    color: #222;
  }

  :deep(.fc-resource-cell) {
    background: #f5f5f5;
  }

  :deep(.fc-resource-cell-text) {
    font-weight: 600;
    color: #e5a663;
  }

  :deep(.fc-event.bg-workday) {
    background: #bbf7d0 !important;
    border: 1px solid #10b981;
    border-radius: 12px;
    opacity: 0.9;
    color: #065f46;
    font-size: 0.9rem;
  }

  :deep(.fc-event.bg-booking) {
    background: #e5a663 !important;
    border: 1px solid #c28450;
    border-radius: 12px;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
  }

  :deep(.fc-event-time) {
    font-size: 0.75rem;
  }

  :deep(.fc-scrollgrid-table) {
    border: none;
  }

  :deep(.fc-scrollgrid) {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
    border-radius: 1.2rem;
    overflow: hidden;
  }

  :deep(.fc-timegrid-axis) {
    color: #555;
    font-size: 0.85rem;
  }

  :deep(.fc-day-today) {
    background: #fff;
  }
</style>
