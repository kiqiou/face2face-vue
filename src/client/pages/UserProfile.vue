<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import router from '../../router/index.js';
  import { authService } from '../../utils/auth.js';
  import { ORDER_STATUS_LABELS, OrderStatus } from '../../models/order.js';
  import { useGetUserOrders } from '../../composables/order/useGetUserOrder.js';
  import { Product } from '../../models/product.js';
  import { useProductsCartStore } from '../../stores/productsCart.js';
  import { useToast } from 'vue-toastification';
  import { useUpdateUserName } from '../../composables/user/useUpdateUsername.js';
  import SkinTypeCard from '../components/SkinTypeCard.vue';

  const { updateName, loading: nameLoading, error: nameError } = useUpdateUserName();
  const { orders, loading: ordersLoading, loadAll: loadOrders } = useGetUserOrders();
  const productsCartStore = useProductsCartStore();
  const toast = useToast();
    
  onMounted(() => {
    loadOrders();
  });

  const user = ref(authService.getUser());
  const isEditingName = ref(false);
  const nameInput = ref(user.value?.username || '');

  const coverImage = (product?: Product | null) =>
    product?.media?.[0]?.url || product?.imageUrl || '';
    
  const expandedOrders = ref(new Set<number | string>());

  const toggleOrder = (id: number | string) => {
    const next = new Set(expandedOrders.value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    expandedOrders.value = next;
  };

  const tabCount = (value: StatusTab) =>
    value === 'all'
      ? orders.value.length
      : orders.value.filter((o) => o.status === value).length;

  const doneCount = computed(() => tabCount('done'));

  const totalSpent = computed(() =>
    orders.value
      .filter((o) => o.status === 'done')
      .reduce((sum, o) => sum + orderFinalTotal(o), 0)
  );

  const logout = () => {
    authService.logout();
    router.replace('/').catch(() => {
      window.location.href = '/';
    });
  };

  const startEditName = () => {
    nameInput.value = user.value?.username || '';
    nameError.value = null;
    isEditingName.value = true;
  };

  const saveName = async () => {
    const trimmed = nameInput.value.trim();
    if (!trimmed) return;

    const updatedUser = await updateName(trimmed);
    if (updatedUser) {
      user.value = updatedUser;
      isEditingName.value = false;
      toast.success('Имя обновлено');
    }
  };

  const orderSubtotal = (order: (typeof orders.value)[number]) =>
    order.items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);

  const orderFinalTotal = (order: (typeof orders.value)[number]) =>
    orderSubtotal(order) - (order.discountAmount || 0);

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

  type StatusTab = 'all' | OrderStatus;

  const statusTabs: { value: StatusTab; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'new', label: 'Новые' },
    { value: 'confirmed', label: 'Подтверждённые' },
    { value: 'done', label: 'Выполненные' },
    { value: 'cancelled', label: 'Отменённые' },
  ];

  const activeStatusTab = ref<StatusTab>('all');

  const filteredOrders = computed(() => {
    if (activeStatusTab.value === 'all') return orders.value;
    return orders.value.filter((order) => order.status === activeStatusTab.value);
  });

  const sortedFilteredOrders = computed(() =>
    [...filteredOrders.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

    const repeatOrder = (order: (typeof orders.value)[number]) => {
    order.items.forEach((item) => {
      if (!item.product) return;
      for (let i = 0; i < item.quantity; i++) {
        productsCartStore.addProduct(item.product);
      }
    });

    toast.success('Товары из заказа добавлены в корзину');
    router.push('/user-products-cart');
  };

</script>

<template>
  <div class="mx-auto w-full max-w-5xl min-w-0 px-1 pb-16 sm:px-4 sm:pb-20">
    <h1 class="mb-6 text-center font-display text-2xl font-medium text-ink sm:mb-10 sm:text-left sm:text-3xl">
      Личный кабинет
    </h1>

    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10">
      <!-- ЛЕВАЯ КОЛОНКА: профиль -->
      <aside class="flex flex-col gap-6 lg:sticky lg:top-6">
        <div class="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_20px_50px_-30px_rgba(201,139,94,0.55)]">
          <div class="flex flex-col items-center gap-4 text-center">
            <div class="w-full min-w-0">
              <div v-if="!isEditingName" class="flex items-center justify-center gap-2">
                <h2 class="min-w-0 wrap-break-word text-xl font-semibold text-ink">
                  {{ user?.username || 'Профиль' }}
                </h2>
                <button
                  @click="startEditName"
                  class="shrink-0 text-caramel transition-colors hover:text-caramel-dark"
                  aria-label="Редактировать имя"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>

              <div v-else class="flex flex-col items-center gap-2">
                <input
                  v-model="nameInput"
                  type="text"
                  maxlength="150"
                  class="w-full rounded-full border border-caramel/50 bg-cream px-4 py-2 text-center text-ink outline-none focus:border-caramel"
                  @keyup.enter="saveName"
                />
                <span v-if="nameError" class="text-sm text-clay">{{ nameError }}</span>
                <div class="flex gap-2">
                  <button
                    @click="saveName"
                    :disabled="nameLoading"
                    class="rounded-full bg-caramel px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-caramel-dark disabled:opacity-50"
                  >
                    {{ nameLoading ? 'Сохранение...' : 'Сохранить' }}
                  </button>
                  <button
                    @click="isEditingName = false"
                    class="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-peach/40"
                  >
                    Отмена
                  </button>
                </div>
              </div>

              <p class="mt-1 text-sm text-ink-muted">{{ user?.phone || 'Телефон не указан' }}</p>
            </div>
          </div>

          <!-- мини-статистика -->
          <div class="mt-6 gap-3">
            <div class="rounded-2xl bg-peach/40 p-3 text-center">
              <p class="text-xl font-semibold text-caramel-dark">{{ orders.length }}</p>
              <p class="text-[11px] uppercase tracking-[0.15em] text-ink-muted">Заказов</p>
            </div>
          </div>

          <button
            @click="logout()"
            class="mt-6 w-full rounded-full border border-caramel/50 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-ink transition-colors hover:bg-caramel hover:text-white"
          >
            Выйти из аккаунта
          </button>
        </div>

        <SkinTypeCard />
      </aside>

      <!-- ПРАВАЯ КОЛОНКА: заказы -->
      <section class="min-w-0">
        <div class="mb-5 flex items-center gap-3">
          <h2 class="font-display text-xl font-medium text-ink sm:text-2xl">Мои заказы</h2>
          <span v-if="orders.length" class="rounded-full bg-peach px-3 py-0.5 text-xs font-medium text-ink">
            {{ orders.length }}
          </span>
        </div>

        <!-- табы -->
        <div class="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="activeStatusTab = tab.value"
            class="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm"
            :class="
              activeStatusTab === tab.value
                ? 'border-caramel bg-caramel text-white'
                : 'border-line bg-white/70 text-ink-muted hover:border-caramel/60'
            "
          >
            {{ tab.label }}
            <span
              v-if="tabCount(tab.value)"
              class="rounded-full px-1.5 text-[10px]"
              :class="activeStatusTab === tab.value ? 'bg-white/25' : 'bg-peach text-ink'"
            >
              {{ tabCount(tab.value) }}
            </span>
          </button>
        </div>

        <div v-if="ordersLoading" class="py-10 text-center text-ink-muted">Загружаем заказы...</div>

        <div v-else-if="orders.length === 0" class="rounded-4xl border border-line bg-white/70 p-8 text-center sm:p-12">
          <p class="text-ink-muted">У вас пока нет заказов</p>
          <router-link
            to="/products"
            class="mt-4 inline-block rounded-full bg-caramel px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-caramel-dark"
          >
            Перейти к товарам →
          </router-link>
        </div>

        <div v-else-if="sortedFilteredOrders.length === 0" class="rounded-4xl border border-line bg-white/70 p-8 text-center">
          <p class="text-ink-muted">Нет заказов с выбранным статусом</p>
        </div>

        <div v-else class="flex flex-col gap-4">
          <article
            v-for="order in sortedFilteredOrders"
            :key="order.id"
            class="min-w-0 rounded-3xl border border-line bg-white/80 p-4 transition-shadow hover:shadow-[0_20px_40px_-25px_rgba(201,139,94,0.6)] sm:p-6"
          >
            <!-- шапка: кликабельна, раскрывает состав -->
            <button
              @click="toggleOrder(order.id)"
              class="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 text-left"
              :aria-expanded="expandedOrders.has(order.id)"
            >
              <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <span class="font-semibold text-ink sm:text-lg">Заказ №{{ order.id }}</span>
                <span
                  class="rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:text-xs"
                  :class="{
                    'bg-amber-100 text-amber-800': order.status === 'new',
                    'bg-sky-100 text-sky-800': order.status === 'confirmed',
                    'bg-emerald-100 text-emerald-800': order.status === 'done',
                    'bg-clay/10 text-clay': order.status === 'cancelled',
                  }"
                >
                  {{ ORDER_STATUS_LABELS[order.status] }}
                </span>
              </div>
              <span class="flex items-center gap-2 text-xs text-ink-muted sm:text-sm">
                {{ formatOrderDate(order.createdAt) }}
                <span
                  class="inline-block transition-transform"
                  :class="expandedOrders.has(order.id) ? 'rotate-180' : ''"
                  aria-hidden="true"
                >⌄</span>
              </span>
            </button>

            <!-- свёрнуто: миниатюры -->
            <div v-if="!expandedOrders.has(order.id)" class="mt-4 flex items-center gap-2">
              <div
                v-for="item in order.items.slice(0, 4)"
                :key="item.id"
                class="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-peach/40"
              >
                <img
                  v-if="coverImage(item.product)"
                  :src="coverImage(item.product)"
                  :alt="item.product?.name"
                  class="h-full w-full object-cover"
                />
              </div>
              <span
                v-if="order.items.length > 4"
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-peach text-xs font-medium text-ink"
              >
                +{{ order.items.length - 4 }}
              </span>
            </div>

            <!-- развёрнуто: полный состав -->
            <div v-else class="mt-4 flex flex-col gap-3">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between gap-3 text-sm text-ink"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-peach/40">
                    <img
                      v-if="coverImage(item.product)"
                      :src="coverImage(item.product)"
                      :alt="item.product?.name"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <span class="line-clamp-2 min-w-0 wrap-break-word leading-snug">
                    {{ item.product?.name }} × {{ item.quantity }}
                  </span>
                </div>
                <span class="shrink-0 whitespace-nowrap font-medium">
                  {{ item.priceAtOrder * item.quantity }} BYN
                </span>
              </div>

              <div v-if="order.discountPercent > 0" class="flex flex-col gap-0.5 border-t border-line pt-3 text-xs sm:text-sm">
                <div class="flex justify-between gap-3 text-ink-muted">
                  <span>Подытог</span>
                  <span class="whitespace-nowrap">{{ orderSubtotal(order) }} BYN</span>
                </div>
                <div class="flex justify-between gap-3 font-medium text-emerald-700">
                  <span class="min-w-0 wrap-break-word">
                    Скидка {{ order.discountPercent }}%{{ order.promoCode ? ` (промокод ${order.promoCode})` : '' }}
                  </span>
                  <span class="whitespace-nowrap">−{{ order.discountAmount }} BYN</span>
                </div>
              </div>
            </div>

            <!-- низ: оплата, итог, действие -->
            <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <div class="flex flex-col">
                <span class="text-xs text-ink-muted">{{ paymentLabel(order.paymentMethod) }}</span>
                <span class="text-xl font-semibold text-caramel">{{ orderFinalTotal(order) }} BYN</span>
              </div>
              <button
                @click="repeatOrder(order)"
                class="rounded-full border border-caramel/60 px-5 py-2 text-xs font-medium tracking-widest text-ink transition-colors hover:bg-caramel hover:text-white sm:text-sm"
              >
                Повторить заказ
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>