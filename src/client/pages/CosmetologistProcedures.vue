<template>
  <div class="w-full min-h-screen max-w-6xl mx-auto">
    <ProcedureGroupsList
      v-if="cosmetologist"
      :cosmetologist="cosmetologist"
      :procedures="procedures"
    />
    <div v-else class="text-center text-xl text-gray-500 py-20">
      Загрузка данных косметолога...
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import ProcedureCard from '../components/ProcedureCard.vue';
  import { useCosmetologistById } from '../../composables/get/user/useCosmetologistById.js';
  import { useProceduresByCosmetologist } from '../../composables/get/procedures/useProceduresByCosmetologist.js';
  import { useCartStore } from '../../stores/cart.js';
  import { Procedure } from '../../models/procedure.js';
  import ProcedureGroupsList from '../components/ProcedureGroupsList.vue';

  const route = useRoute();
  const id = Number(route.params.id);

  const { cosmetologist, loadCosmetologistById } = useCosmetologistById();
  const { procedures, loadProceduresByCosmetologist } =
    useProceduresByCosmetologist();

  onMounted(() => {
    loadCosmetologistById(id);
    loadProceduresByCosmetologist(id);
  });

  const cart = useCartStore();

  const addToCart = (procedure: Procedure) => {
    if (!cosmetologist.value) return;

    cart.addProcedure(procedure, cosmetologist.value);
  };

  const isModalOpen = ref(false);
  const selectedProcedure = ref<Procedure | null>(null);

  const openModal = (procedure: Procedure) => {
    selectedProcedure.value = procedure;
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
    selectedProcedure.value = null;
  };
</script>
