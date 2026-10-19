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

  const coverImage = (product: Product) => product.media[0]?.url || product.imageUrl || '';

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
  <div class="flex flex-col min-h-screen px-4 pb-20">
    <!-- Шапка профиля -->
    <div class="flex flex-col items-center gap-4 pt-16">
      <div
        class="w-28 h-28 bg-gradient-to-br from-[#E5A663] to-[#FAEE9E] rounded-full flex items-center justify-center shadow-lg shadow-[#E5A663]/20"
      >
        <span class="text-4xl font-black text-white/90">
          {{ (user?.username || '?').charAt(0).toUpperCase() }}
        </span>
      </div>

      <div class="text-center">
        <div v-if="!isEditingName" class="flex items-center justify-center gap-2">
          <h1 class="text-3xl font-black text-slate-800">
            {{ user?.username || 'Профиль' }}
          </h1>
          <button @click="startEditName" class="text-[#E5A663] hover:opacity-70" aria-label="Редактировать имя">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <div v-else class="flex flex-col items-center gap-2">
          <input
            v-model="nameInput"
            type="text"
            class="text-center text-2xl font-black text-slate-800 border-b-2 border-[#E5A663] outline-none bg-transparent px-2"
            maxlength="150"
            @keyup.enter="saveName"
          />
          <span v-if="nameError" class="text-sm text-red-500">{{ nameError }}</span>
          <div class="flex gap-3 mt-1">
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

        <p class="text-black/50 mt-1">{{ user?.phone || 'Телефон не указан' }}</p>
      </div>

      <GradientButton button-name="Выйти из аккаунта" @click="logout()" />
    </div>

    <div class="w-full max-w-3xl mx-auto mt-16">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-[#E5A663]/15 flex items-center justify-center">
          <svg class="w-5 h-5 text-[#E5A663]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-slate-800">Мои заказы</h2>
      </div>

      <!-- Табы фильтра по статусу -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="activeStatusTab = tab.value"
          class="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border"
          :class="
            activeStatusTab === tab.value
              ? 'bg-[#E5A663] text-white border-[#E5A663]'
              : 'bg-white/70 text-black/60 border-[#E5A663]/20 hover:border-[#E5A663]/50'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="ordersLoading" class="text-center py-10 text-black/50">
        Загружаем заказы...
      </div>

      <div v-else-if="orders.length === 0" class="bg-white/70 rounded-3xl p-10 text-center">
        <p class="text-black/60">У вас пока нет заказов</p>
        <router-link to="/products" class="text-[#E5A663] hover:underline font-semibold mt-2 inline-block">
          Перейти к товарам
        </router-link>
      </div>

      <div
        v-else-if="sortedFilteredOrders.length === 0"
        class="bg-white/70 rounded-3xl p-10 text-center"
      >
        <p class="text-black/60">Нет заказов с выбранным статусом</p>
      </div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="order in sortedFilteredOrders"
          :key="order.id"
          class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#E5A663]/20 hover:border-[#E5A663]/40 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div class="flex items-center gap-3">
              <span class="font-black text-lg text-slate-800">Заказ №{{ order.id }}</span>
              <span
                class="text-xs font-semibold px-3 py-1 rounded-full"
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
            <span class="text-sm text-black/40">{{ formatOrderDate(order.createdAt) }}</span>
          </div>

          <div class="flex flex-col gap-2 mb-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center justify-between text-sm text-black/70 gap-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="h-10 w-10 shrink-0 overflow-hidden rounded bg-petal-soft/40">
                  <img
                    v-if="coverImage(item.product)"
                    :src="coverImage(item.product)"
                    :alt="item.product.name"
                    class="h-full w-full object-cover"
                  />
                </div>
                <span class="truncate">{{ item.product?.name }} × {{ item.quantity }}</span>
              </div>
              <span class="font-semibold text-black/90 shrink-0">{{ item.priceAtOrder * item.quantity }} BYN</span>
            </div>
          </div>

          <<div class="flex flex-col gap-1 pt-4 border-t border-[#E5A663]/15">
  <div class="flex flex-wrap justify-between items-center gap-3">
    <span class="text-sm text-black/50">{{ paymentLabel(order.paymentMethod) }}</span>
    <button
      @click="repeatOrder(order)"
      class="text-sm font-semibold text-[#E5A663] hover:underline"
    >
      Повторить заказ
    </button>
  </div>

  <div v-if="order.discountPercent > 0" class="flex flex-col gap-0.5 text-sm">
    <div class="flex justify-between text-black/50">
      <span>Подытог</span>
      <span>{{ orderSubtotal(order) }} BYN</span>
    </div>
    <div class="flex justify-between text-emerald-600 font-medium">
      <span>Скидка {{ order.discountPercent }}%{{ order.promoCode ? ` (промокод ${order.promoCode})` : '' }}</span>
      <span>−{{ order.discountAmount }} BYN</span>
    </div>
  </div>

  <div class="flex justify-end">
    <span class="text-xl font-black text-[#E5A663]">{{ orderFinalTotal(order) }} BYN</span>
  </div>
</div>
        </div>
      </div>
    </div>
  </div>
</template>