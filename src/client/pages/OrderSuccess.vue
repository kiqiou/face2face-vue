<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import router from '../../router/index.js';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import { ORDER_STATUS_LABELS } from '../../models/order.js';
  import type { Order } from '../../models/order.js';
  import { useGetUserOrders } from '../../composables/order/useGetUserOrder.js';
  import OrderInstructions from '../components/OrderInstructions.vue';

  const route = useRoute();
  const { loadOne } = useGetUserOrders();

  const order = ref<Order | null>(null);
  const loading = ref(true);
  const loadError = ref<string | null>(null);

  onMounted(async () => {
    const id = Number(route.params.id);
    if (!id) {
      loadError.value = 'Заказ не найден';
      loading.value = false;
      return;
    }
    try {
      order.value = await loadOne(id);
    } catch {
      loadError.value = 'Не удалось загрузить заказ';
    } finally {
      loading.value = false;
    }
  });

  const paymentLabel = (method: string) =>
    method === 'card' ? 'Картой' : 'Наличными';

  const subtotal = computed(() =>
    order.value ? order.value.items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0) : 0
  );

  const finalTotal = computed(() =>
    subtotal.value - (order.value?.discountAmount || 0)
  );
</script>

<template>
  <div class="flex min-h-screen flex-col items-center px-4 py-10 sm:py-16">
    <div class="w-full max-w-xl rounded-4xl border border-line bg-white/70 p-6 shadow-[0_30px_80px_-40px_rgba(201,139,94,0.55)] sm:p-10 md:p-12">
      <div v-if="loading" class="py-10 text-center text-ink-muted">
        Загружаем заказ...
      </div>

      <div v-else-if="loadError" class="py-10 text-center">
        <p class="mb-6 text-ink-muted">{{ loadError }}</p>
        <button
          @click="router.push('/')"
          class="rounded-full bg-caramel px-8 py-3 text-sm font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
        >
          На главную
        </button>
      </div>

      <div v-else-if="order" class="flex flex-col items-center gap-6">
        <!-- галочка -->
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-peach shadow-[0_10px_25px_-10px_rgba(176,111,67,0.6)]">
          <svg class="h-10 w-10 text-caramel-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div class="text-center">
          <h1 class="font-display text-2xl font-medium text-ink sm:text-3xl">Ваш заказ оформлен!</h1>
          <p class="mt-3 inline-block rounded-full bg-peach px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
            Заказ №{{ order.id }} · {{ ORDER_STATUS_LABELS[order.status] }}
          </p>
        </div>

        <!-- данные -->
        <div class="flex w-full flex-col gap-3 border-t border-line pt-6">
          <div class="flex justify-between gap-4 text-ink-muted">
            <span>Имя</span>
            <span class="font-medium text-ink">{{ order.user.username }}</span>
          </div>
          <div class="flex justify-between gap-4 text-ink-muted">
            <span>Телефон</span>
            <span class="font-medium text-ink">{{ order.user.phone }}</span>
          </div>
          <div class="flex justify-between gap-4 text-ink-muted">
            <span>Оплата</span>
            <span class="font-medium text-ink">{{ paymentLabel(order.paymentMethod) }}</span>
          </div>
          <div v-if="order.comment" class="flex justify-between gap-4 text-ink-muted">
            <span>Комментарий</span>
            <span class="max-w-[60%] text-right font-medium text-ink">{{ order.comment }}</span>
          </div>
        </div>

        <!-- товары -->
        <div class="flex w-full flex-col gap-4 border-t border-line pt-6">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between gap-4"
          >
            <div class="flex min-w-0 items-center gap-3">
              <img
                v-if="item.product?.imageUrl"
                :src="item.product.imageUrl"
                class="h-14 w-14 shrink-0 rounded-2xl object-cover"
              />
              <div class="min-w-0">
                <div class="font-medium text-ink">{{ item.product?.name }}</div>
                <div class="text-sm text-ink-muted">×{{ item.quantity }}</div>
              </div>
            </div>
            <div class="shrink-0 whitespace-nowrap font-semibold text-caramel">
              {{ item.priceAtOrder * item.quantity }} BYN
            </div>
          </div>
        </div>

        <!-- итог -->
        <div class="flex w-full flex-col gap-2 border-t border-line pt-6">
          <div v-if="order.discountPercent > 0" class="flex justify-between text-ink-muted">
            <span>Подытог</span>
            <span>{{ subtotal }} BYN</span>
          </div>
          <div v-if="order.discountPercent > 0" class="flex justify-between gap-3 font-medium text-emerald-700">
            <span>Скидка {{ order.discountPercent }}%{{ order.promoCode ? ` (промокод ${order.promoCode})` : '' }}</span>
            <span class="whitespace-nowrap">−{{ order.discountAmount }} BYN</span>
          </div>
          <div class="flex items-center justify-between pt-1">
            <span class="text-xl text-ink">Итого</span>
            <span class="text-2xl font-semibold text-caramel">{{ finalTotal }} BYN</span>
          </div>
        </div>

        <OrderInstructions />

        <!-- кнопки -->
        <div class="mt-2 flex w-full flex-col gap-3 sm:flex-row">
          <button
            @click="router.push('/user-profile')"
            class="w-full rounded-full bg-caramel px-6 py-3.5 text-sm font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
          >
            Мои заказы
          </button>
          <button
            @click="router.push('/')"
            class="w-full rounded-full border border-caramel/60 px-6 py-3.5 text-sm font-medium tracking-widest text-ink transition-colors hover:bg-caramel hover:text-white"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  </div>
</template>