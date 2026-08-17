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
  import { useCosmetologistById } from '../../composables/user/useCosmetologistById.js';
  import ProcedureGroupsList from '../components/ProcedureGroupsList.vue';
import { useProceduresByCosmetologist } from '../../composables/procedure/useProceduresByCosmetologist.js';

  const route = useRoute();
  const id = Number(route.params.id);

  const { cosmetologist, loadCosmetologistById } = useCosmetologistById();
  const { procedures, loadProceduresByCosmetologist } =
    useProceduresByCosmetologist();

  onMounted(() => {
    loadCosmetologistById(id);
    loadProceduresByCosmetologist(id);
  });

</script>
