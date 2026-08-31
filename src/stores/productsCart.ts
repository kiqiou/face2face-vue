import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Product } from '../models/product.js';
import { useToast } from 'vue-toastification';

interface CartItem {
  product: Product;
  quantity: number;
}

const toast = useToast();

export const useProductsCartStore = defineStore('productsCart', () => {
  const items = ref<CartItem[]>([]);

  const products = computed(() => items.value.map((i) => i.product));

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.priceAmount * i.quantity, 0)
  );

  const totalCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  );

  const getQuantity = (productId: number) =>
    items.value.find((i) => i.product.id === productId)?.quantity ?? 0;

  const addProduct = (product: Product) => {
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
  };
});