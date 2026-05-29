import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/client/pages/Home.vue';
import About from '@/client/pages/About.vue';
import Contacts from '@/client/pages/Contacts.vue';
import Procedures from '@/client/pages/Procedures.vue';
import ProcedureModal from '../client/components/ProcedureModal.vue';
import Layout from '../client/layout/Layout.vue';
import Registration from '../views/Registration.vue';
import UserProfile from '@/client/pages/UserProfile.vue';
import Calendar from '../admin/pages/Calendar.vue';
import CosmetologistProcedures from '../client/pages/CosmetologistProcedures.vue';
import Cart from '../client/pages/Cart.vue';
import Success from '../client/pages/Success.vue';
import ProceduresAdmin from '../admin/pages/ProceduresAdmin.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: '/about', component: About },
      { path: '/contacts', component: Contacts },
      { path: '/registration', component: Registration },
      { path: '/user-profile', component: UserProfile },
      { path: '/user-cart', component: Cart },
      { path: '/success', component: Success },
      { path: '/procedures', component: Procedures },
      {
        path: '/cosmetologist/:id/procedures',
        name: 'CosmetologistProcedures',
        component: CosmetologistProcedures,
      },
    ],
  },
  { path: '/calendar', component: Calendar },
  { path: '/admin-procedures', component: ProceduresAdmin },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

export default router;
