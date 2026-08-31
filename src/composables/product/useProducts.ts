import { ref } from 'vue';
import { authPostForm, authPatchForm, authDelete } from '../../utils/apiAuthHelpers.js';
import { Product } from '../../models/product.js';
import { apiGet } from '../../utils/apiGet.js';
import { API_BASE } from './productBaseApi.js';
import { mapProduct } from '../../utils/mapProduct.js';

interface ProductFilters {
  manufacturer?: number;
  skinType?: number;
  purpose?: number;
  collection?: number;
  inStock?: boolean;
  ordering?: 'price_amount' | '-price_amount';
}

interface ProductInput {
  name: string;
  description: string;
  priceAmount: number;
  priceCurrency: 'BYN' | 'USD';
  manufacturerId: number;
  skinTypeIds: number[];
  purposeIds: number[];
  collectionIds: number[];
  inStock: boolean;
  media?: File[];
  mediaIdsToDelete?: number[];
}

function buildFormData(input: Partial<ProductInput>): FormData {
  const formData = new FormData();
  if (input.name !== undefined) formData.append('name', input.name);
  if (input.description !== undefined) formData.append('description', input.description);
  if (input.priceAmount !== undefined) formData.append('price_amount', String(input.priceAmount));
  if (input.priceCurrency !== undefined) formData.append('price_currency', input.priceCurrency);
  if (input.manufacturerId !== undefined) formData.append('manufacturer', String(input.manufacturerId));
  if (input.inStock !== undefined) formData.append('in_stock', String(input.inStock));
  input.skinTypeIds?.forEach((id) => formData.append('skin_types', String(id)));
  input.purposeIds?.forEach((id) => formData.append('purposes', String(id)));
  input.collectionIds?.forEach((id) => formData.append('collections', String(id)));
  input.media?.forEach((file) => formData.append('media', file));
  input.mediaIdsToDelete?.forEach((id) => formData.append('media_ids_to_delete', String(id)));
  return formData;
}

export function useProducts() {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async (filters: ProductFilters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      if (filters.manufacturer) params.set('manufacturer', String(filters.manufacturer));
      if (filters.skinType) params.set('skin_type', String(filters.skinType));
      if (filters.purpose) params.set('purpose', String(filters.purpose));
      if (filters.collection) params.set('collection', String(filters.collection));
      if (filters.inStock !== undefined) params.set('in_stock', String(filters.inStock));
      if (filters.ordering) params.set('ordering', filters.ordering);

      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiGet(API_BASE + 'get_products/' + query);
      products.value = data.map(mapProduct);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const add = async (input: ProductInput) => {
    error.value = null;
    try {
      const data = await authPostForm(API_BASE + 'add_product/', buildFormData(input));
      const product = mapProduct(data);
      products.value.push(product);
      return product;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const update = async (productId: number, input: Partial<ProductInput>) => {
    error.value = null;
    try {
      const data = await authPatchForm(API_BASE + `update_product/${productId}/`, buildFormData(input));
      const updated = mapProduct(data);
      const index = products.value.findIndex((p: Product) => p.id === productId);
      if (index !== -1) products.value[index] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  const remove = async (productId: number) => {
    error.value = null;
    try {
      await authDelete(API_BASE + `delete_product/${productId}/`);
      products.value = products.value.filter((p: Product) => p.id !== productId);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  };

  return { products, loading, error, load, add, update, remove };
}