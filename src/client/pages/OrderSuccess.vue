<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import router from '../../router/index.js';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import { ORDER_STATUS_LABELS } from '../../models/order.js';
  import type { Order } from '../../models/order.js';
  import { useGetUserOrders } from '../../composables/order/useGetUserOrder.js';

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
</script>

<template>
  <div class="flex flex-col items-center min-h-screen px-4 py-16">
    <div class="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#E5A663]/30 shadow-2xl">
      <div v-if="loading" class="text-center py-10 text-black/60">
        Загружаем заказ...
      </div>

      <div v-else-if="loadError" class="text-center py-10">
        <p class="text-black/70 mb-6">{{ loadError }}</p>
        <GradientButton button-name="На главную" @click="router.push('/')" />
      </div>

      <div v-else-if="order" class="flex flex-col items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-gradient-to-r from-[#E5A663] to-[#FAEE9E] flex items-center justify-center">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div class="text-center">
          <h1 class="text-3xl font-black text-slate-800">Ваш заказ оформлен!</h1>
          <p class="text-black/60 mt-2">
            Заказ №{{ order.id }} · {{ ORDER_STATUS_LABELS[order.status] }}
          </p>
        </div>

        <div class="w-full border-t border-[#E5A663]/30 pt-6 flex flex-col gap-3">
          <div class="flex justify-between text-black/70">
            <span>Имя</span>
            <span class="font-semibold text-black/90">{{ order.name }}</span>
          </div>
          <div class="flex justify-between text-black/70">
            <span>Телефон</span>
            <span class="font-semibold text-black/90">{{ order.phone }}</span>
          </div>
          <div class="flex justify-between text-black/70">
            <span>Оплата</span>
            <span class="font-semibold text-black/90">{{ paymentLabel(order.paymentMethod) }}</span>
          </div>
          <div v-if="order.comment" class="flex justify-between text-black/70">
            <span>Комментарий</span>
            <span class="font-semibold text-black/90 text-right max-w-[60%]">{{ order.comment }}</span>
          </div>
        </div>

        <div class="w-full border-t border-[#E5A663]/30 pt-6 flex flex-col gap-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <img
                v-if="item.product?.imageUrl"
                :src="item.product.imageUrl"
                class="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <div class="font-semibold text-black/90">{{ item.product?.name }}</div>
                <div class="text-sm text-black/50">×{{ item.quantity }}</div>
              </div>
            </div>
            <div class="font-black text-[#E5A663]">
              {{ item.priceAtOrder * item.quantity }} BYN
            </div>
          </div>
        </div>

        <div class="w-full border-t border-[#E5A663]/30 pt-6 flex justify-between items-center">
          <span class="text-xl text-black/80">Итого</span>
          <span class="text-2xl font-black text-[#E5A663]">
            {{ order.items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0) }} BYN
          </span>
        </div>

        <div class="w-full flex flex-col sm:flex-row gap-3 mt-4">
          <GradientButton button-name="Мои заказы" class="w-full" @click="router.push('/user-profile')" />
          <GradientButton button-name="На главную" class="w-full" @click="router.push('/')" />
        </div>
      </div>
    </div>
  </div>
</template>