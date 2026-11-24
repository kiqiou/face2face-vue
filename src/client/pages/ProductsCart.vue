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

  const user = authService.currentUser;
  const toast = useToast();

  onMounted(() => {
    loadMyDiscount();
    cart.reload();
    cart.syncWithServer();
  });

  // Имя и телефон берутся из аккаунта и при оформлении не редактируются
  const form = reactive({
    name: user?.value.username ?? '',
    phone: user?.value.phone ?? '',
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
        user: user.value,
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
  
  const goToProduct = (id: number) => {
    router.push(`/products/${id}`);
  };
</script>

<template>
  <div class="flex min-h-screen w-full flex-col gap-6">
    <h1 class="font-display text-2xl font-medium text-ink sm:text-3xl">Корзина</h1>

    <!-- Товары -->
    <div
      v-if="cart.items.length > 0"
      class="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_20px_50px_-30px_rgba(201,139,94,0.55)] md:p-8"
    >
      <div class="mb-6 flex items-center gap-3">
        <h2 class="font-display text-xl font-medium text-ink sm:text-2xl">Продукты в корзине</h2>
        <span class="rounded-full bg-peach px-3 py-0.5 text-xs font-medium text-ink">
          {{ cart.items.length }}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in cart.items" :key="item.product.id" class="flex flex-col gap-3">
          <ProductCard :show-button="false" :product="item.product" @open-details="goToProduct(item.product.id)" />

          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-1 rounded-full border border-line bg-cream p-1">
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full text-lg text-ink transition-colors hover:bg-peach"
                aria-label="Уменьшить количество"
                @click="cart.decrement(item.product.id)"
              >
                −
              </button>
              <span class="w-6 text-center text-sm font-semibold text-ink">{{ item.quantity }}</span>
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full text-lg text-ink transition-colors hover:bg-peach"
                aria-label="Увеличить количество"
                @click="cart.increment(item.product.id)"
              >
                +
              </button>
            </div>

            <button
              type="button"
              class="text-sm text-ink-muted underline decoration-clay/40 underline-offset-4 transition-colors hover:text-clay"
              @click="cart.removeProduct(item.product.id)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <!-- Промокод и итог -->
      <div class="mt-8 flex flex-col gap-3 border-t border-line pt-6">
        <div
          v-if="myDiscount && myDiscount.currentDiscountPercent > 0"
          class="w-fit rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-800"
        >
          У вас персональная скидка {{ myDiscount.currentDiscountPercent }}%
        </div>

        <div class="flex w-full flex-col gap-2 sm:ml-auto sm:max-w-sm sm:flex-row">
          <input
            v-model="promoInput"
            type="text"
            placeholder="Промокод"
            aria-label="Промокод"
            class="min-w-0 flex-1 rounded-full border border-line bg-cream px-5 py-2.5 text-ink outline-none placeholder:text-ink-muted/60 focus:border-caramel"
          />
          <button
            type="button"
            class="shrink-0 rounded-full border border-caramel/60 px-5 py-2.5 text-sm font-medium tracking-[0.05em] text-ink transition-colors hover:bg-caramel hover:text-white disabled:opacity-50"
            :disabled="isChecking"
            @click="applyPromo"
          >
            {{ isChecking ? '...' : 'Применить' }}
          </button>
        </div>

        <div v-if="promoResult && !promoResult.valid" class="text-right text-sm text-clay">
          {{ promoResult.error }}
        </div>
        <div v-if="promoResult?.valid" class="text-right text-sm text-emerald-700">
          Промокод применён: скидка {{ promoResult.discountPercent }}%
        </div>

        <div class="flex flex-col gap-1 text-right">
          <div class="text-ink-muted">
            Подытог: <span class="font-semibold text-ink">{{ money(total) }} BYN</span>
          </div>
          <div v-if="appliedDiscountPercent > 0" class="font-medium text-emerald-700">
            Скидка {{ appliedDiscountPercent }}%: −{{ money(discountAmount) }} BYN
          </div>
          <div class="mt-1 text-xl text-ink">
            Итого: <span class="text-2xl font-semibold text-caramel">{{ money(finalTotal) }}</span> BYN
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!success"
      class="flex flex-col items-center gap-4 rounded-4xl border border-line bg-white/70 p-10 text-center"
    >
      <p class="text-xl text-ink-muted">Вы ещё не добавили товаров</p>
      <router-link
        to="/products"
        class="rounded-full bg-caramel px-6 py-2.5 text-sm font-medium tracking-widest text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark"
      >
        Перейти к товарам →
      </router-link>
    </div>

    <!-- Оформление + инструкции -->
    <div v-if="cart.items.length > 0" class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
      <div class="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_20px_50px_-30px_rgba(201,139,94,0.55)] md:p-8">
        <h2 class="mb-6 font-display text-xl font-medium text-ink sm:text-2xl">Оформление заказа</h2>

        <form class="flex max-w-lg flex-col gap-5" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1.5">
            <label for="order-name" class="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted">Имя</label>
            <input
              id="order-name"
              v-model="form.name"
              type="text"
              disabled
              placeholder="Ваше имя"
              class="rounded-full border border-line bg-cream px-5 py-3 text-ink outline-none disabled:opacity-70"
            />
            <span v-if="!form.name" class="text-sm text-ink-muted">
              Имя можно указать в
              <router-link to="/user-profile" class="text-caramel underline underline-offset-4">профиле</router-link>
            </span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="order-phone" class="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted">Телефон</label>
            <input
              id="order-phone"
              v-model="form.phone"
              type="text"
              disabled
              placeholder="Ваш телефон"
              class="rounded-full border border-line bg-cream px-5 py-3 text-ink outline-none disabled:opacity-70"
            />
            <span v-if="formErrors.phone" class="text-sm text-clay">{{ formErrors.phone }}</span>
            <span class="text-sm text-ink-muted">
              Заказ оформляется на номер вашего аккаунта, по нему мы свяжемся с вами
            </span>
          </div>

          <div class="rounded-3xl bg-peach/60 px-5 py-4 text-sm text-ink-muted">
            <div class="font-semibold text-ink">Выдача заказа по договорённости</div>
            <div>{{ PICKUP_ADDRESS }}</div>
            <div class="mt-1">После оформления мы свяжемся с вами и согласуем время выдачи</div>
            <div class="mt-1 text-ink-muted/80">Доставки нет</div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted">Способ оплаты</span>
            <div class="flex flex-wrap gap-3">
              <label
                class="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm text-ink transition-colors"
                :class="form.paymentMethod === 'cash' ? 'border-caramel bg-peach' : 'border-line bg-cream hover:border-caramel/60'"
              >
                <input type="radio" value="cash" v-model="form.paymentMethod" class="accent-caramel" />
                Наличными при получении
              </label>
              <label
                class="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm text-ink transition-colors"
                :class="form.paymentMethod === 'card' ? 'border-caramel bg-peach' : 'border-line bg-cream hover:border-caramel/60'"
              >
                <input type="radio" value="card" v-model="form.paymentMethod" class="accent-caramel" />
                Картой при получении
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted">Способ подтверждения</span>
            <div class="flex flex-wrap gap-3">
              <label
                class="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm text-ink transition-colors"
                :class="form.approvementMethod === 'call' ? 'border-caramel bg-peach' : 'border-line bg-cream hover:border-caramel/60'"
              >
                <input type="radio" value="call" v-model="form.approvementMethod" class="accent-caramel" />
                Звонок
              </label>
              <label
                class="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm text-ink transition-colors"
                :class="form.approvementMethod === 'message' ? 'border-caramel bg-peach' : 'border-line bg-cream hover:border-caramel/60'"
              >
                <input type="radio" value="message" v-model="form.approvementMethod" class="accent-caramel" />
                Сообщение
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="order-comment" class="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted">Комментарий</label>
            <textarea
              id="order-comment"
              v-model="form.comment"
              rows="3"
              placeholder="Комментарий к заказу (необязательно)"
              class="resize-none rounded-3xl border border-line bg-cream px-5 py-3 text-ink outline-none placeholder:text-ink-muted/60 focus:border-caramel"
            ></textarea>
          </div>

          <div class="flex flex-col gap-3 text-sm text-ink-muted">
            <label class="flex items-start gap-2.5">
              <input type="checkbox" v-model="consentPersonalData" class="mt-1 shrink-0 accent-caramel" />
              <span>
                Даю согласие на обработку моего имени и номера телефона для выполнения заказа в
                соответствии с
                <router-link to="/privacy-policy" target="_blank" class="text-caramel underline underline-offset-4">
                  Политикой обработки персональных данных
                </router-link>
              </span>
            </label>

            <label class="flex items-start gap-2.5">
              <input type="checkbox" v-model="termsAccepted" class="mt-1 shrink-0 accent-caramel" />
              <span>
                Принимаю условия
                <router-link to="/offer" target="_blank" class="text-caramel underline underline-offset-4">
                  публичной оферты
                </router-link>
                и
                <router-link to="/return-policy" target="_blank" class="text-caramel underline underline-offset-4">
                  возврата и обмена
                </router-link>
              </span>
            </label>
          </div>

          <div v-if="error" class="text-sm text-clay">{{ error }}</div>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full rounded-full bg-caramel px-8 py-3.5 text-sm font-medium tracking-[0.08em] text-white shadow-[0_10px_25px_-10px_rgba(176,111,67,0.8)] transition-colors hover:bg-caramel-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {{ submitting ? 'Оформляем...' : `Оформить заказ` }}
          </button>
        </form>
      </div>

      <OrderInstructions />
    </div>
  </div>
</template>