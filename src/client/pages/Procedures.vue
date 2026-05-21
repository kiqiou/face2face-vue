<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { computed, onMounted } from 'vue';
  import ProcedureCard from '../components/ProcedureCard.vue';
  import { useProcedures } from '../../composables/get/procedures/useProcedures.js';
  import { useCartStore } from '../../stores/cart.js';
  import { useToast } from 'vue-toastification';
  import { Procedure } from '../../models/procedure.js';
  import { Cosmetologist } from '../../models/cosmetologist.js';
import { authService } from '../../utils/auth.js';

  const { procedures, load, loading, error } = useProcedures();

  const cart = useCartStore();
  const router = useRouter();
  const toast = useToast();
  const isAuthenticated = authService.isAuthenticated();

  onMounted(() => {
    load();
  });

  const groupedProcedures = computed(() => {
    const groups: Record<number, { info: any; items: Procedure[] }> = {};

    procedures.value.forEach((procedure: Procedure) => {
      const cosmoId = procedure.cosmetologist.id;
      if (!groups[cosmoId]) {
        groups[cosmoId] = {
          info: procedure.cosmetologist,
          items: [],
        };
      }
      groups[cosmoId].items.push(procedure);
    });

    return groups;
  });

  const addToCart = (procedure: Procedure, cosmetologist: Cosmetologist) => {
    if (!isAuthenticated) {
      toast.error('Пожалуйста, войдите в систему, чтобы добавить услугу');
      return;
    }
    cart.addProcedure(procedure, cosmetologist);
    toast.success(`"${procedure.name}" добавлено в корзину`);
  };

  const openService = (id: number) => {
    router.push(`/procedure/${id}`);
  };
</script>

<template>
  <div class="flex flex-col w-full max-w-6xl mx-auto p-4">
    <h2
      class="text-4xl self-center md:text-5xl font-black mb-6 bg-[#E5A663] bg-clip-text text-transparent"
    >
      Услуги
    </h2>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="!procedures.length">Нет услуг</div>
    <div
      v-else
      v-for="(group, cosmoId) in groupedProcedures"
      :key="cosmoId"
      class="mb-16"
    >
      <div class="flex items-center gap-6 mb-8 p-6 rounded-3xl">
        <img
          :src="group.info.avatarUrl"
          class="w-24 h-24 rounded-full object-cover"
        />

        <div>
          <h2 class="text-2xl font-bold">
            {{ group.info.user?.username || 'Без имени' }}
          </h2>

          <p class="text-[#E5A663]">
            {{ group.info.specializations }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <procedure-card
          v-for="proc in group.items"
          :key="proc.id"
          :procedure="proc"
          :show-button="true"
          @click="addToCart(proc, group.info)"
        />
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
