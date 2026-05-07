import { defineStore } from 'pinia';
import { Procedure } from '../models/procedure.js';
import { Cosmetologist } from '../models/cosmetologist.js';

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

      this.procedures.push(proc);
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
