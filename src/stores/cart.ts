import { defineStore } from 'pinia';
import { Procedure } from '../models/procedure.js';
import { Cosmetologist } from '../models/cosmetologist.js';
import { router } from '../router/index.js';
import { useToast } from 'vue-toastification';
import { authService } from '../utils/auth.js';

const toast = useToast();
const isAuthenticated = authService.isAuthenticated();

export const useCartStore = defineStore('cart', {
  state: () => ({
    procedures: [] as Procedure[],
    cosmetologist: null as Cosmetologist | null,
  }),

  actions: {
    addProcedure(proc: Procedure, cosmetologist: Cosmetologist) {
      if (!this.cosmetologist) {
        this.cosmetologist = cosmetologist;
      }

      if (this.cosmetologist?.id !== cosmetologist.id) {
        this.procedures = [];
        this.cosmetologist = cosmetologist;
      }

      if (!isAuthenticated) {
        toast.error(
          'Пожалуйста, войдите или зарегистрируйтесь, чтобы добавить услугу'
        );
        router.push('/registration');
      } else {
        this.procedures.push(proc);
        toast.success(`"${proc.name}" добавлено в корзину`);
      }
    },

    removeProcedure(id: number) {
      this.procedures = this.procedures.filter((p) => p.id !== id);
    },

    clearCart() {
      this.procedures = [];
      this.cosmetologist = null;
    },
  },

  getters: {
    total: (state) => state.procedures.reduce((sum, p) => sum + p.price, 0),
  },
});
