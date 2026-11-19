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

  const orderTotal = (order: (typeof orders.value)[number]) =>
    order.items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);

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
  <div class="flex min-h-screen w-full min-w-0 flex-col px-1 pb-16 sm:px-4 sm:pb-20">
    <!-- Шапка профиля -->
    <div class="flex flex-col items-center gap-3 pt-8 sm:gap-4 sm:pt-16">
      <div
        class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#E5A663] to-[#FAEE9E] shadow-lg shadow-[#E5A663]/20 sm:h-28 sm:w-28"
      >
        <span class="text-3xl font-black text-white/90 sm:text-4xl">
          {{ (user?.username || '?').charAt(0).toUpperCase() }}
        </span>
      </div>

      <div class="w-full min-w-0 text-center">
        <div v-if="!isEditingName" class="flex items-center justify-center gap-2 px-2">
          <h1 class="min-w-0 break-words text-2xl font-black text-slate-800 sm:text-3xl">
            {{ user?.username || 'Профиль' }}
          </h1>
          <button
            @click="startEditName"
            class="shrink-0 text-[#E5A663] hover:opacity-70"
            aria-label="Редактировать имя"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <div v-else class="flex flex-col items-center gap-2 px-2">
          <input
            v-model="nameInput"
            type="text"
            class="w-full max-w-xs border-b-2 border-[#E5A663] bg-transparent px-2 text-center text-xl font-black text-slate-800 outline-none sm:text-2xl"
            maxlength="150"
            @keyup.enter="saveName"
          />
          <span v-if="nameError" class="text-sm text-red-500">{{ nameError }}</span>
          <div class="mt-1 flex gap-4">
            <button
              @click="saveName"
              :disabled="nameLoading"
              class="text-sm font-semibold text-[#E5A663] hover:underline disabled:opacity-50"
            >
              {{ nameLoading ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button @click="isEditingName = false" class="text-sm font-semibold text-black/40 hover:underline">
              Отмена
            </button>
          </div>
        </div>

        <p class="mt-1 text-sm text-black/50 sm:text-base">{{ user?.phone || 'Телефон не указан' }}</p>
      </div>

      <GradientButton button-name="Выйти из аккаунта" @click="logout()" />
    </div>

    <SkinTypeCard />

    <div class="mx-auto mt-10 w-full max-w-3xl min-w-0 sm:mt-16">
      <div class="mb-4 flex items-center gap-3 sm:mb-6">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E5A663]/15 sm:h-10 sm:w-10">
          <svg class="h-5 w-5 text-[#E5A663]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
          </svg>
        </div>
        <h2 class="text-xl font-black text-slate-800 sm:text-2xl">Мои заказы</h2>
      </div>

      <!-- Табы: на телефоне прокручиваются по горизонтали -->
      <div
        class="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:mb-8 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
      >
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="activeStatusTab = tab.value"
          class="shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:text-sm"
          :class="
            activeStatusTab === tab.value
              ? 'border-[#E5A663] bg-[#E5A663] text-white'
              : 'border-[#E5A663]/20 bg-white/70 text-black/60 hover:border-[#E5A663]/50'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="ordersLoading" class="py-10 text-center text-black/50">
        Загружаем заказы...
      </div>

      <div v-else-if="orders.length === 0" class="rounded-3xl bg-white/70 p-6 text-center sm:p-10">
        <p class="text-black/60">У вас пока нет заказов</p>
        <router-link to="/products" class="mt-2 inline-block font-semibold text-[#E5A663] hover:underline">
          Перейти к товарам
        </router-link>
      </div>

      <div
        v-else-if="sortedFilteredOrders.length === 0"
        class="rounded-3xl bg-white/70 p-6 text-center sm:p-10"
      >
        <p class="text-black/60">Нет заказов с выбранным статусом</p>
      </div>

      <div v-else class="flex flex-col gap-3 sm:gap-4">
        <div
          v-for="order in sortedFilteredOrders"
          :key="order.id"
          class="min-w-0 rounded-2xl border border-[#E5A663]/20 bg-white/90 p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-[#E5A663]/40 hover:shadow-lg sm:p-6"
        >
          <div class="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 sm:mb-4">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <span class="text-base font-black text-slate-800 sm:text-lg">Заказ №{{ order.id }}</span>
              <span
                class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:px-3 sm:py-1 sm:text-xs"
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
            <span class="text-xs text-black/40 sm:text-sm">{{ formatOrderDate(order.createdAt) }}</span>
          </div>

          <div class="mb-3 flex flex-col gap-2.5 sm:mb-4 sm:gap-2">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center justify-between gap-2 text-sm text-black/70 sm:gap-3"
            >
              <div class="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div class="h-11 w-11 shrink-0 overflow-hidden rounded bg-petal-soft/40 sm:h-10 sm:w-10">
                  <img
                    v-if="coverImage(item.product)"
                    :src="coverImage(item.product)"
                    :alt="item.product?.name"
                    class="h-full w-full object-cover"
                  />
                </div>
                <span class="line-clamp-2 min-w-0 break-words text-[13px] leading-snug sm:text-sm">
                  {{ item.product?.name }} × {{ item.quantity }}
                </span>
              </div>
              <span class="shrink-0 whitespace-nowrap text-[13px] font-semibold text-black/90 sm:text-sm">
                {{ item.priceAtOrder * item.quantity }} BYN
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5 border-t border-[#E5A663]/15 pt-3 sm:gap-1 sm:pt-4">
            <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span class="text-xs text-black/50 sm:text-sm">{{ paymentLabel(order.paymentMethod) }}</span>
              <button
                @click="repeatOrder(order)"
                class="text-xs font-semibold text-[#E5A663] hover:underline sm:text-sm"
              >
                Повторить заказ
              </button>
            </div>

            <div v-if="order.discountPercent > 0" class="flex flex-col gap-0.5 text-xs sm:text-sm">
              <div class="flex justify-between gap-3 text-black/50">
                <span>Подытог</span>
                <span class="whitespace-nowrap">{{ orderSubtotal(order) }} BYN</span>
              </div>
              <div class="flex justify-between gap-3 font-medium text-emerald-600">
                <span class="min-w-0 break-words">
                  Скидка {{ order.discountPercent }}%{{ order.promoCode ? ` (промокод ${order.promoCode})` : '' }}
                </span>
                <span class="whitespace-nowrap">−{{ order.discountAmount }} BYN</span>
              </div>
            </div>

            <div class="flex justify-end">
              <span class="text-lg font-black text-[#E5A663] sm:text-xl">{{ orderFinalTotal(order) }} BYN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>