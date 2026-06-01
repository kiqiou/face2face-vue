<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useProcedures } from '../../composables/get/procedures/useProcedures.js';
  import { Procedure } from '../../models/procedure.js';
  import ProcedureGroupsList from '../components/ProcedureGroupsList.vue';

  const { procedures, load, loading, error } = useProcedures();

  onMounted(() => {
    load();
  });

  const groupedProcedures = computed(() => {
    const groups: Record<number, { info: any }> = {};

    procedures.value.forEach((procedure: Procedure) => {
      const cosmoId = procedure.cosmetologist.id;

      if (!groups[cosmoId]) {
        groups[cosmoId] = {
          info: procedure.cosmetologist,
        };
      }
    });

    return groups;
  });
</script>

<template>
  <div class="flex flex-col w-full max-w-6xl mx-auto p-4 min-h-screen">
    <h2
      class="text-4xl self-center md:text-5xl font-black mb-6 bg-[#E5A663] bg-clip-text text-transparent"
    >
      Услуги
    </h2>
    <div v-if="loading" class="flex self-center text-2xl">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="!procedures.length">Нет услуг</div>

    <div v-else>
      <ProcedureGroupsList
        v-for="(group, cosmoId) in groupedProcedures"
        :key="cosmoId"
        :cosmetologist="group.info"
        :procedures="
          procedures.filter((proc) => proc.cosmetologist.id === group.info.id)
        "
      />
    </div>
  </div>
</template>
