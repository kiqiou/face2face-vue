<template>
  <div class="w-full min-h-screen max-w-6xl mx-auto">
    <div v-if="cosmetologist" class="flex flex-col gap-8">
      <div
        class="flex flex-col gap-6 justify-between backdrop-blur-sm rounded-3xl p-8"
      >
        <div class="flex flex-row gap-10">
          <div
            class="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#E5A663]/20 to-[#FAEE9E]/20"
          >
            <img
              :src="cosmetologist.avatarUrl"
              alt="Фото косметолога"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex flex-col">
            <div class="text-2xl font-semibold font-black text-slate-800 mb-2">
              {{ cosmetologist.user.username }}
            </div>
            <div class="text-xl text-[#E5A663] mb-6">
              {{ cosmetologist.specialization }}
            </div>
          </div>
        </div>
        <div class="text-lg text-slate-700 leading-relaxed">
          {{ cosmetologist.bio }}
        </div>
        <div class="flex flex-col gap-6">
          <div
            class="text-2xl font-semibold font-black text-slate-800 mb-2 p-2"
          >
            Услуги
          </div>

          <div
            v-if="procedures.length === 0"
            class="text-center text-lg text-black/70 py-8"
          >
            Нет процедур
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <procedure-card
              v-for="(procedure, index) in procedures"
              :key="procedure.id || index"
              :procedure="procedure"
              :show-button="true"
              @click="addToCart"
            />
          </div>
        </div>
      </div>
      <div v-if="procedures.length === 0">Нет процедур</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import ProcedureCard from '../components/ProcedureCard.vue';
  import { useCosmetologistById } from '../../composables/get/user/useCosmetologistById.js';
  import { useProceduresByCosmetologist } from '../../composables/get/procedures/useProceduresByCosmetologist.js';
  import { useCartStore } from '../../stores/cart.js';
  import { Procedure } from '../../models/procedure.js';

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

  const toast = useToast();

  const addToCart = (procedure: Procedure) => {
    if (!cosmetologist.value) return;

    cart.addProcedure(procedure, cosmetologist.value);

    toast.success(`"${procedure.name}" добавлено в корзину`);
  };
</script>
