import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { Product } from '../models/product.js';
import { useToast } from 'vue-toastification';
import { authService } from '../utils/auth.js';
import router from '../router/index.js'; 

interface CartItem {
  product: Product;
  quantity: number;
}

const toast = useToast();
const isAuthenticated = authService.isAuthenticated();
const storageKey = () => `cart:${authService.getUser()?.id ?? 'guest'}`;

const loadItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(storageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useProductsCartStore = defineStore('productsCart', () => {
  const items = ref<CartItem[]>(loadItems());

  watch(
    items,
    (value: any) => {
      try {
        localStorage.setItem(storageKey(), JSON.stringify(value));
      } catch {
        // хранилище переполнено или отключено, корзина просто не сохранится
      }
    },
    { deep: true }
  );

  const reload = () => {
    items.value = loadItems();
  };

  const products = computed(() => items.value.map((i) => i.product));

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.effectivePrice * i.quantity, 0)
  );

  const totalCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  );

  const getQuantity = (productId: number) =>
    items.value.find((i) => i.product.id === productId)?.quantity ?? 0;

  const addProduct = (product: Product) => {
    if (!authService.isAuthenticated()) {
      toast.error('Пожалуйста, войдите или зарегистрируйтесь');
      router.push('/registration');
      return;
  }

    const existing = items.value.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      toast.success(`"${product.name}" добавлено в корзину`);
      items.value.push({ product, quantity: 1 });
    }
  };

  const increment = (productId: number) => {
    const item = items.value.find((i) => i.product.id === productId);
    if (item) item.quantity++;
  };

  const decrement = (productId: number) => {
    const item = items.value.find((i) => i.product.id === productId);
    if (!item) return;
    item.quantity--;
    if (item.quantity <= 0) removeProduct(productId);
  };

  const removeProduct = (productId: number) => {
    items.value = items.value.filter((i) => i.product.id !== productId);
  };

  const clear = () => {
    items.value = [];
  };

  return {
    items,
    products,
    total,
    totalCount,
    getQuantity,
    addProduct,
    increment,
    decrement,
    removeProduct,
    clear,
    reload
  };
});