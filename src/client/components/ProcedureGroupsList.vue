<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { Procedure } from '../../models/procedure.js';
  import ProcedureCard from './ProcedureCard.vue';
  import ProcedureModal from './ProcedureModal.vue';
  import { useCartStore } from '../../stores/cart.js';
  import { Cosmetologist } from '../../models/cosmetologist.js';

  const props = defineProps<{
    cosmetologist: any;
    procedures: Procedure[];
  }>();

const groupedProcedures = computed(() => {
  const groups: Record<number, Procedure[]> = {};

  props.procedures.forEach((procedure) => {
    const categoryId = procedure.category?.id || 0;

    if (!groups[categoryId]) {
      groups[categoryId] = [];
    }

    groups[categoryId].push(procedure);
  });

  return Object.entries(groups).sort(([, a], [, b]) => {
    const aName = a[0]?.category?.name ?? '';
    const bName = b[0]?.category?.name ?? '';

    if (aName === 'Акционные предложения') return -1;
    if (bName === 'Акционные предложения') return 1;

    return 0;
  });
});

  const cart = useCartStore();

  const addToCart = (procedure: Procedure, cosmetologist: Cosmetologist) => {
    console.log('procedure', procedure);

    cart.addProcedure(procedure, cosmetologist);
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

<template>
  <div>
    <div class="flex items-center gap-6 mb-8">
      <img
        :src="cosmetologist.avatarUrl"
        class="w-24 h-24 rounded-full object-cover"
      />

      <div>
        <h2 class="text-2xl font-bold">
          {{ cosmetologist.user?.username }}
        </h2>

        <p class="text-[#E5A663]">
          {{ cosmetologist.specialization }}
        </p>
      </div>
    </div>
    <div
      v-for="[categoryId, categoryProcedures] in groupedProcedures"
      :key="categoryId"
      class="mb-8"
    >
      <h3 class="text-2xl font-bold mb-6">
        {{
          Number(categoryId) === 0
            ? 'Без категории'
            : categoryProcedures[0]?.category?.name
        }}
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <procedure-card
          v-for="(procedure, index) in categoryProcedures"
          :key="procedure.id || index"
          :procedure="procedure"
          :show-button="true"
          @click="addToCart(procedure, cosmetologist)"
          @open-details="openModal"
        />
      </div>
    </div>
  </div>
  <ProcedureModal
    v-if="isModalOpen && selectedProcedure"
    :procedure="selectedProcedure"
    @close="closeModal"
  />
</template>
