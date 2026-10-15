<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue';
  import router from '../../router/index.js';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import ProductCard from '../components/ProductCard.vue';
  import { useProductsCartStore } from '../../stores/productsCart.js';
  import { useCreateOrder } from '../../composables/order/useCreateOrder.js';
  import OrderInstructions from '../components/OrderInstructions.vue';
  import { authService } from '../../utils/auth.js';
  import { usePromo } from '../../composables/promotion/usePromo.js';
  import { useToast } from 'vue-toastification';

  // TODO: заполнить перед запуском (эти же данные должны быть в оферте)
  const PICKUP_ADDRESS = 'Кальварийская, 21, 157';

  const cart = useProductsCartStore();
  const { submitting, error, success, submit } = useCreateOrder();
  const { myDiscount, promoResult, isChecking, loadMyDiscount, checkPromoCode } = usePromo();

  const user = authService.getUser();
  const toast = useToast();

  onMounted(() => {
    loadMyDiscount();
    cart.reload();
  });

  // Имя и телефон берутся из аккаунта и при оформлении не редактируются
  const form = reactive({
    name: user?.username ?? '',
    phone: user?.phone ?? '',
    paymentMethod: 'cash' as 'cash' | 'card',
    approvementMethod: 'call' as 'call' | 'message',
    comment: '',
  });

  const formErrors = reactive({
    phone: '',
  });

  const promoInput = ref('');
  // Код, который реально был проверен и применён. Отправляем именно его,
  // а не текущий текст в поле: пользователь мог изменить поле после проверки
  const appliedPromoCode = ref('');

  // Два отдельных согласия: на обработку данных и на условия покупки
  const consentPersonalData = ref(false);
  const termsAccepted = ref(false);
  const calculateSubmit = (() => { if (consentPersonalData.value && termsAccepted.value){
    return true;
  } else {
    toast.error('Пожалуйста, примите условия покупки и согласитесь на обработку персональных данных');
    return false;
  }
});

  const round2 = (n: number) => Math.round(n * 100) / 100;
  const money = (n: number) => round2(n).toFixed(2);

  const total = computed(() => cart.total);

  // Как и раньше: приоритет у применённого промокода, иначе персональная скидка.
  // Окончательную сумму считает сервер, здесь только показываем её пользователю
  const appliedDiscountPercent = computed(() => {
    if (promoResult.value?.valid) return promoResult.value.discountPercent;
    return myDiscount.value?.currentDiscountPercent || 0;
  });

  const discountAmount = computed(() => round2((total.value * appliedDiscountPercent.value) / 100));

  const finalTotal = computed(() => round2(total.value - discountAmount.value));

  const applyPromo = async () => {
    const code = promoInput.value.trim();
    if (!code) return;
    await checkPromoCode(code);
    appliedPromoCode.value = promoResult.value?.valid ? code : '';
  };

  const validate = () => {
    formErrors.phone = form.phone ? '' : 'Не указан номер телефона. Войдите в аккаунт заново';
    return !formErrors.phone;
  };

  const handleSubmit = async () => {
    if (cart.items.length === 0) return;
    let canSubmit: boolean = calculateSubmit();
    if (!canSubmit) return;
    if (!validate()) return;

    try {
      const order = await submit({
        user: user,
        paymentMethod: form.paymentMethod,
        approvementMethod: form.approvementMethod,
        comment: form.comment.trim(),
        promoCode: appliedPromoCode.value || undefined,
        items: cart.items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });

      cart.clear();
      form.comment = '';
      form.paymentMethod = 'cash';
      form.approvementMethod = 'call';
      promoInput.value = '';
      appliedPromoCode.value = '';
      consentPersonalData.value = false;
      termsAccepted.value = false;

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
                aria-label="Уменьшить количество"
                @click="cart.decrement(item.product.id)"
              >
                −
              </button>
              <span class="w-6 text-center font-semibold">{{ item.quantity }}</span>
              <button
                type="button"
                class="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-lg font-bold"
                aria-label="Увеличить количество"
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

      <!-- Промокод и скидка -->
      <div class="mt-8 pt-6 border-t border-[#E5A663]/30 flex flex-col gap-3">
        <div
          v-if="myDiscount && myDiscount.currentDiscountPercent > 0"
          class="text-sm text-emerald-600"
        >
          У вас персональная скидка {{ myDiscount.currentDiscountPercent }}%
        </div>

        <div class="flex flex-col sm:flex-row gap-2 w-full sm:max-w-sm sm:ml-auto">
           <input
              v-model="promoInput"
              type="text"
              placeholder="Промокод"
              aria-label="Промокод"
              class="flex-1 min-w-0 rounded-xl border border-black/10 px-4 py-2.5 outline-none focus:border-[#E5A663]"
            />
           <button
              type="button"
              class="shrink-0 px-4 py-2.5 rounded-xl border border-[#E5A663] text-[#E5A663] font-semibold hover:bg-[#E5A663]/10 disabled:opacity-50"
              :disabled="isChecking"
              @click="applyPromo"
            >
            {{ isChecking ? '...' : 'Применить' }}
          </button>
        </div>

        <div v-if="promoResult && !promoResult.valid" class="text-sm text-red-500 text-right">
          {{ promoResult.error }}
        </div>
        <div v-if="promoResult?.valid" class="text-sm text-emerald-600 text-right">
          Промокод применён: скидка {{ promoResult.discountPercent }}%
        </div>

        <div class="flex flex-col gap-1 text-right">
          <div class="text-black/50">
            Подытог: <span class="font-semibold text-black/80">{{ money(total) }} BYN</span>
          </div>
          <div v-if="appliedDiscountPercent > 0" class="text-emerald-600 font-medium">
            Скидка {{ appliedDiscountPercent }}%: −{{ money(discountAmount) }} BYN
          </div>
          <div class="text-xl text-black/80 mt-1">
            Итого: <span class="font-black text-[#E5A663]">{{ money(finalTotal) }}</span> BYN
          </div>
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
            <label for="order-name" class="text-sm font-semibold text-black/70">Имя</label>
            <input
              id="order-name"
              v-model="form.name"
              type="text"
              disabled
              placeholder="Ваше имя"
              class="rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E5A663]"
            />
            <!-- TODO: когда в профиле появится поле имени, проверить путь /profile -->
            <span v-if="!form.name" class="text-sm text-black/50">
              Имя можно указать в
              <router-link to="/profile" class="text-[#E5A663] underline">профиле</router-link>
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <label for="order-phone" class="text-sm font-semibold text-black/70">Телефон</label>
            <input
              id="order-phone"
              v-model="form.phone"
              type="text"
              disabled
              placeholder="Ваш телефон"
              class="rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E5A663]"
            />
            <span v-if="formErrors.phone" class="text-sm text-red-500">{{ formErrors.phone }}</span>
            <span class="text-sm text-black/50">
              Заказ оформляется на номер вашего аккаунта, по нему мы свяжемся с вами
            </span>
          </div>

          <div class="rounded-xl bg-[#E5A663]/10 px-4 py-3 text-sm text-black/70">
            <div class="font-semibold text-black/80">Выдача заказа по договорённости</div>
            <div>{{ PICKUP_ADDRESS }}</div>
            <div class="mt-1">
              После оформления мы свяжемся с вами и согласуем время выдачи
            </div>
            <div class="mt-1 text-black/50">Доставки нет</div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-black/70">Способ оплаты</span>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="cash" v-model="form.paymentMethod" />
                Наличными при получении
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="card" v-model="form.paymentMethod" />
                Картой при получении
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-sm font-semibold text-black/70">Способ подтверждения</span>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="call" v-model="form.approvementMethod" />
                Звонок
              </label>
              <!-- TODO: уточнить канал (SMS, Viber, Telegram) и добавить его в Политику -->
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="message" v-model="form.approvementMethod" />
                Сообщение
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="order-comment" class="text-sm font-semibold text-black/70">Комментарий</label>
            <textarea
              id="order-comment"
              v-model="form.comment"
              rows="3"
              placeholder="Комментарий к заказу (необязательно)"
              class="rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E5A663] resize-none"
            ></textarea>
          </div>

          <div class="flex flex-col gap-2 text-sm text-black/60">
            <label class="flex items-start gap-2">
              <input type="checkbox" v-model="consentPersonalData" class="mt-1 shrink-0" />
              <span>
                Даю согласие на обработку моего имени и номера телефона для выполнения заказа в
                соответствии с
                <router-link to="/privacy-policy" target="_blank" class="text-[#E5A663] underline">
                  Политикой обработки персональных данных
                </router-link>
              </span>
            </label>

            <label class="flex items-start gap-2">
              <input type="checkbox" v-model="termsAccepted" class="mt-1 shrink-0" />
              <span>
                Принимаю условия
                <router-link to="/offer" target="_blank" class="text-[#E5A663] underline">
                  публичной оферты
                </router-link>
                и
                <router-link to="/return-policy" target="_blank" class="text-[#E5A663] underline">
                  возврата и обмена
                </router-link>
              </span>
            </label>
          </div>

          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

          <GradientButton type="submit" :disabled="submitting || !calculateSubmit" button-name="Подтвердить">
            {{ submitting ? 'Оформляем...' : `Оформить заказ на ${money(finalTotal)} BYN` }}
          </GradientButton>
        </form>
      </div>

      <OrderInstructions />
    </div>
  </div>
</template>