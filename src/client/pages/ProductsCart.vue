<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import router from '../../router/index.js';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import ProductCard from '../components/ProductCard.vue';
  import { useProductsCartStore } from '../../stores/productsCart.js';
  import { useCreateOrder } from '../../composables/order/useCreateOrder.js';
  import OrderInstructions from '../components/OrderInstructions.vue';
  import { authService } from '../../utils/auth.js';

  const cart = useProductsCartStore();
  const { submitting, error, success, submit } = useCreateOrder();

  const user = authService.getUser();
  
  const form = reactive({
    name: user.username,
    phone: user.phone,
    paymentMethod: 'cash' as 'cash' | 'card',
    approvementMethod: 'call' as 'call' | 'message',
    comment: '',
  });

  const formErrors = reactive({
    name: '',
    phone: '',
  });

  const total = computed(() => cart.total);

  const validate = () => {
    formErrors.name = form.name.trim().length < 2 ? 'Введите имя' : '';
    return !formErrors.name && !formErrors.phone;
  };

  const handleSubmit = async () => {
    if (cart.items.length === 0) return;
    if (!validate()) return;

    try {
      const order = await submit({
        user: user,
        paymentMethod: form.paymentMethod,
        approvementMethod: form.approvementMethod,
        comment: form.comment.trim(),
        items: cart.items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });

      cart.clear();
      form.comment = '';
      form.paymentMethod = 'cash';
      form.approvementMethod = 'call';

      router.push(`/orders/${order.id}/success`);
    } catch {
      error.value = 'Не удалось создать заказ';
    }
  };
</script>

<template>
  <div class="flex flex-col gap-6 w-full min-h-screen">
    <div v-if="cart.items.length > 0" class="bg-white/90 rounded-3xl p-6 md:p-8 mb-2">
      <h2 class="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
        Продукты в корзине
      </h2>

      <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in cart.items" :key="item.product.id" class="flex flex-col gap-2">
          <ProductCard :show-button="false" :product="item.product" />

          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-lg font-bold"
                @click="cart.decrement(item.product.id)"
              >
                −
              </button>
              <span class="w-6 text-center font-semibold">{{ item.quantity }}</span>
              <button
                type="button"
                class="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-lg font-bold"
                @click="cart.increment(item.product.id)"
              >
                +
              </button>
            </div>

            <button
              type="button"
              class="text-sm text-red-500 hover:text-red-600"
              @click="cart.removeProduct(item.product.id)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-[#E5A663]/30 text-right">
        <div class="text-xl text-black/80">
          Итого: <span class="font-black text-[#E5A663]">{{ total }}</span> BYN
        </div>
      </div>
    </div>

    <div v-else-if="!success" class="flex justify-center text-black/70 text-2xl">
      Вы еще не добавили товаров
    </div>

    <!-- Форма оформления + информационный блок справа -->
    <div v-if="cart.items.length > 0" class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div class="bg-white/90 rounded-3xl p-6 md:p-8">
        <h2 class="text-2xl font-black text-slate-800 mb-6">Оформление заказа</h2>

        <form class="flex flex-col gap-4 max-w-lg" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-black/70">Имя</label>
            <input
              v-model="form.name"
              type="text"
              disabled
              placeholder="Ваше имя"
              class="rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E5A663]"
            />
            <span v-if="formErrors.name" class="text-sm text-red-500">{{ formErrors.name }}</span>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-black/70">Телефон</label>
            <input
              v-model="form.phone"
              type="text"
              disabled
              placeholder="Ваш телефон"
              class="rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E5A663]"
            />
            <span v-if="formErrors.phone" class="text-sm text-red-500">{{ formErrors.phone }}</span>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-black/70">Способ оплаты</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="cash" v-model="form.paymentMethod" />
                Наличными
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="card" v-model="form.paymentMethod" />
                Картой
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-black/70">Способ подтверждения</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="call" v-model="form.approvementMethod" />
                Звонок
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="message" v-model="form.approvementMethod" />
                Сообщение
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-black/70">Комментарий</label>
            <textarea
              v-model="form.comment"
              rows="3"
              placeholder="Комментарий к заказу (необязательно)"
              class="rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E5A663] resize-none"
            ></textarea>
          </div>

          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
          <div v-if="success" class="text-green-600 text-sm">
            Заказ оформлен! Мы свяжемся с вами в ближайшее время.
          </div>

          <GradientButton type="submit" :disabled="submitting">
            {{ submitting ? 'Оформляем...' : `Оформить заказ на ${total} BYN` }}
          </GradientButton>
        </form>
      </div>

      <OrderInstructions />
    </div>
  </div>
</template>