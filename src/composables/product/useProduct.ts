import { ref } from 'vue';
import { Product } from '../../models/product.js';
import { mapProduct } from '../../utils/mapProduct.js';
import { API_BASE } from './productBaseApi.js';
import { apiGet } from '../../utils/apiGet.js';

export function useProduct() {
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async (productId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGet(API_BASE + `get_product/${productId}/`);
      product.value = mapProduct(data);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { product, loading, error, load };
}