<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

import HeaderAdmin from '../components/HeaderAdmin.vue';
import GradientButton from '../../components/ui/GradientButton.vue';

import { useCategories } from '../../composables/category/useCategories.js';
import { useCreateCategory } from '../../composables/category/useCreateCategory.js';
import { useUpdateCategory } from '../../composables/category/useUpdateCategory.js';
import { useDeleteCategory } from '../../composables/category/useDeleteCategory.js';

const toast = useToast();

const { categories, loadCategories } = useCategories();
const { createCategory } = useCreateCategory();
const { updateCategory } = useUpdateCategory();
const { deleteCategory } = useDeleteCategory();

const showModal = ref(false);
const editingCategory = ref<any>(null);
const saving = ref(false);

const form = reactive({
  name: '',
});

onMounted(() => {
  loadCategories();
});

const openCreateModal = () => {
  editingCategory.value = null;

  Object.assign(form, {
    name: '',
  });

  showModal.value = true;
};

const openEditModal = (category: any) => {
  editingCategory.value = category;

  Object.assign(form, {
    name: category.name,
  });

  showModal.value = true;
};

const closeModal = () => {
  editingCategory.value = null;

  Object.assign(form, {
    name: '',
  });

  showModal.value = false;
};

const createCategoryInForm = async () => {
  try {
    saving.value = true;

    await createCategory(form.name);

    await loadCategories();

    toast.success('Категория создана');
    closeModal();
  } catch {
    toast.error('Не удалось создать категорию');
  } finally {
    saving.value = false;
  }
};

const updateCategoryInForm = async () => {
  try {
    saving.value = true;

    await updateCategory(editingCategory.value.id, {
      name: form.name,
    });

    await loadCategories();

    toast.success('Категория обновлена');
    closeModal();
  } catch {
    toast.error('Не удалось обновить категорию');
  } finally {
    saving.value = false;
  }
};

const handleDeleteCategory = async (id: number) => {
  try {
    await deleteCategory(id);

    await loadCategories();

    toast.success('Категория удалена');
  } catch {
    toast.error('Не удалось удалить категорию');
  }
};

const handleSubmit = () => {
  if (editingCategory.value) {
    updateCategoryInForm();
  } else {
    createCategoryInForm();
  }
};
</script>

<template>
  <div  class="
    min-h-screen
    bg-gradient-to-b
    from-slate-50
    via-white
    to-slate-100
  ">
    <HeaderAdmin />

  <div class="flex flex-col items-center gap-8 max-w-5xl mx-auto p-8">
    <h1 class="text-3xl font-black text-black">
      Управление категориями
    </h1>

    <GradientButton
      button-name="Добавить категорию"
      @click="openCreateModal"
      class="px-8 py-3 text-lg"
    />

    <div
      v-if="categories.length === 0"
      class="text-center py-20"
    >

      <h3 class="text-2xl font-black text-slate-600 mb-2">
        Нет категорий
      </h3>

      <p class="text-slate-500">
        Создайте первую категорию
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
    >
      <div
        v-for="category in categories"
        :key="category.id"
         class="
  relative
  overflow-hidden
  bg-gradient-to-b
  from-white/90
  to-white/5
  backdrop-blur-sm
  rounded-[28px]
  p-6
  border
  border-white
  shadow-xl
  hover:shadow-2xl
  hover:-translate-y-1
  transition-all
  duration-300
"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-black text-black/80">
            {{ category.name }}
          </h3>

          <div class="flex gap-2">
            <button
              @click="openEditModal(category)"
              class="p-2 rounded-lg hover:bg-white/40 transition"
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
              @click="handleDeleteCategory(category.id)"
              class="p-2 rounded-lg hover:bg-red-100 transition"
            >
               <svg
                class="w-5 h-5 text-red-400"
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
      </div>
    </div>
  </div>
  </div>
 
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-3xl p-8 max-w-md w-full"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-black text-slate-800">
          {{
            editingCategory
              ? 'Редактировать категорию'
              : 'Создать категорию'
          }}
        </h2>

        <button
          @click="closeModal"
          class="p-2 hover:bg-slate-100 rounded-xl"
        >
          ✕
        </button>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="space-y-6"
      >
        <div>
          <label
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Название категории
          </label>

          <input
            v-model="form.name"
            required
            class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E5A663] focus:border-transparent"
            placeholder="Например: Чистки лица"
          />
        </div>

        <div class="flex gap-3">
          <GradientButton
            :button-name="
              editingCategory
                ? 'Сохранить'
                : 'Создать'
            "
            type="submit"
            class="flex-1"
            :disabled="saving"
          />

          <button
            type="button"
            @click="closeModal"
            :disabled="saving"
            class="flex-1 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>