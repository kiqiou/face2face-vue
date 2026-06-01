<template>
  <HeaderAdmin></HeaderAdmin>
  <div class="flex flex-col items-center gap-8 max-w-6xl mx-auto p-8">
    <h1 class="text-3xl font-black text-black">Управление процедурами</h1>

    <GradientButton
      button-name="Добавить процедуру"
      @click="openCreateModal"
      class="px-8 py-3 text-lg"
    />

    <div v-if="procedures.length === 0 && !loading" class="text-center py-20">
      <div
        class="w-24 h-24 mx-auto bg-[#E5A663]/20 rounded-2xl flex items-center justify-center mb-6"
      >
        <svg
          class="w-12 h-12 text-[#E5A663]/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 class="text-2xl font-black text-slate-600 mb-2">Нет процедур</h3>
      <p class="text-slate-500">Добавьте первую процедуру выше</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div
        v-for="procedure in procedures"
        :key="procedure.id"
        class="bg-gradient-to-br from-[#E5A663]/60 to-[#FAEE9E] rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-slate-100 hover:border-[#E5A663]/30 transition-all duration-300"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-xl font-black text-black/80 pr-4">
            {{ procedure.name }}
          </h3>
          <div class="flex gap-2">
            <button
              @click="openEditModal(procedure)"
              class="p-2 text-black/80 hover:bg-blue-50 rounded-lg transition-colors"
              title="Редактировать"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="handleDeleteProcedure(procedure.id)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Удалить"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-3 mb-6">
          <div class="flex items-center gap-2">
            <span
              class="text-xl font-black bg-black/70 bg-clip-text text-transparent"
            >
              {{ procedure.price }} BYN
            </span>
          </div>
          <div class="flex items-center gap-2 text-black/80">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ procedure.duration }} ч.
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showModal"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-black text-slate-800">
          {{ editingProcedure ? 'Редактировать' : 'Добавить' }} процедуру
        </h2>
        <button @click="closeModal" class="p-2 hover:bg-slate-100 rounded-xl">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2"
            >Название процедуры</label
          >
          <input
            v-model="form.name"
            required
            class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E5A663] focus:border-transparent transition-all"
            placeholder="Например: Чистка лица"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2"
              >Цена (BYN)</label
            >
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E5A663] focus:border-transparent transition-all"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Часы
              </label>
              <select
                v-model.number="formHours"
                class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E5A663] focus:border-transparent transition-all"
              >
                <option v-for="h in 5" :key="h - 1" :value="h - 1">
                  {{ h - 1 }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Минуты
              </label>
              <select
                v-model.number="formMinutes"
                class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E5A663] focus:border-transparent transition-all"
              >
                <option value="0">0</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="60">60</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Категория
          </label>
          <select
            v-model.number="selectedCategory"
            class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E5A663] focus:border-transparent transition-all"
          >
            <option :value="0">Выберите категорию</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2"
            >Описание процедуры</label
          >
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E5A663] focus:border-transparent transition-all"
            placeholder="Например: Глубокая очистка кожи лица с использованием профессиональных средств."
          ></textarea>
        </div>

        <div class="flex gap-3 pt-4">
          <GradientButton
            button-name="Сохранить"
            type="submit"
            class="flex-1"
            :disabled="saving"
          />
          <button
            @click="closeModal"
            :disabled="saving"
            type="button"
            class="flex-1 px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, watchEffect, computed } from 'vue';
  import { useToast } from 'vue-toastification';
  import GradientButton from '../../components/ui/GradientButton.vue';
  import { useProceduresByCosmetologist } from '../../composables/get/procedures/useProceduresByCosmetologist.js';
  import { useCreateProcedure } from '../../composables/post/procedure/useCreateProcedure.js';
  import { useDeleteProcedure } from '../../composables/post/procedure/useDeleteProcedure.js';
  import { useUpdateProcedure } from '../../composables/post/procedure/useUpdateProcedure.js';
  import { useCosmetologistByUserId } from '../../composables/get/user/useCosmetologistByUserId.js';
  import { authService } from '../../utils/auth.js';
  import HeaderAdmin from '../components/HeaderAdmin.vue';
  import { useCategories } from '../../composables/get/category/useCategories.js';

  const toast = useToast();
  const user = authService.getUser();

  const { cosmetologist, loadCosmetologistByUserId } =
    useCosmetologistByUserId();
  const { procedures, loading, loadProceduresByCosmetologist } =
    useProceduresByCosmetologist();
  const { createProcedure } = useCreateProcedure();
  const { deleteProcedure } = useDeleteProcedure();
  const { updateProcedure } = useUpdateProcedure();
  const { loadCategories, categories } = useCategories();
  const showModal = ref(false);
  const editingProcedure = ref<any>(null);
  const saving = ref(false);
  const formHours = ref(0);
  const formMinutes = ref(0);
  const selectedCategory = ref<number>(0);

  watchEffect(() => {
    if (cosmetologist.value?.id) {
      loadProceduresByCosmetologist(cosmetologist.value.id);
    }
  });

  onMounted(async () => {
    loadCategories();
    if (!user?.id) {
      toast.error('Не удалось определить пользователя');
      return;
    }
    await loadCosmetologistByUserId(user.id);
  });

  const form = reactive({
    name: '',
    price: 0,
    duration: '',
    isSale: false,
    category: 0,
    description: '',
  });

  const durationFormatted = computed(() => {
    const h = String(formHours.value).padStart(2, '0');
    const m = String(formMinutes.value).padStart(2, '0');
    return `${h}:${m}:00`;
  });

  const cosmetologistIdComputed = computed(() => cosmetologist.value?.id || 0);

  const openCreateModal = () => {
    showModal.value = true;
    editingProcedure.value = null;
    Object.assign(form, {
      name: '',
      price: 0,
      duration: '',
      description: '',
      category: 0,
      isSale: false,
    });
    formHours.value = 0;
    formMinutes.value = 0;
    selectedCategory.value = 0;
  };

  const openEditModal = (procedure: any) => {
    editingProcedure.value = procedure;
    form.name = procedure.name;
    form.price = procedure.price ?? 0;
    form.description = procedure.description ?? '';
    form.isSale = procedure.isSale ?? false;
    form.category = procedure.category?.id ?? 0;

    const duration = procedure.duration;
    const [h, m] = duration.split(':').map(Number);
    formHours.value = h || 0;
    formMinutes.value = m || 0;

    selectedCategory.value = procedure.category?.id ?? 0;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    editingProcedure.value = null;
    Object.assign(form, {
      name: '',
      price: 0,
      duration: '',
      description: '',
      category: 0,
      isSale: false,
    });
    formHours.value = 0;
    formMinutes.value = 0;
    selectedCategory.value = 0;
  };

  const createProcedureInForm = async () => {
    const id = cosmetologistIdComputed.value;
    if (!id) return;

    const duration = durationFormatted.value;

    try {
      saving.value = true;
      await createProcedure(
        form.name,
        form.price,
        duration,
        form.isSale,
        selectedCategory.value,
        form.description
      );
      await loadProceduresByCosmetologist(id);
      toast.success('Процедура добавлена');
      closeModal();
    } catch (err) {
      toast.error('Не удалось создать процедуру');
    } finally {
      saving.value = false;
    }
  };

  const updateProcedureInForm = async () => {
    if (!editingProcedure.value?.id) return;
    const id = cosmetologistIdComputed.value;
    if (!id) return;

    const duration = durationFormatted.value;

    try {
      saving.value = true;
      await updateProcedure(editingProcedure.value.id, {
        name: form.name,
        price: form.price,
        duration,
        description: form.description,
        category: selectedCategory.value,
        isSale: form.isSale,
      });
      await loadProceduresByCosmetologist(id);
      toast.success('Процедура обновлена');
      closeModal();
    } catch (err) {
      toast.error('Не удалось обновить процедуру');
    } finally {
      saving.value = false;
    }
  };

  const handleDeleteProcedure = async (id: number) => {
    const cosmetologistId = cosmetologistIdComputed.value;
    if (!cosmetologistId) return;

    try {
      await deleteProcedure(id);
      await loadProceduresByCosmetologist(cosmetologistId);
      toast.success('Процедура удалена');
    } catch (err) {
      toast.error('Не удалось удалить процедуру');
    }
  };

  const handleSubmit = () => {
    if (editingProcedure.value) {
      updateProcedureInForm();
    } else {
      createProcedureInForm();
    }
  };
</script>
