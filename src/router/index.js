import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/client/pages/Home.vue';
import About from '@/client/pages/About.vue';
import Contacts from '@/client/pages/Contacts.vue';
import Procedures from '@/client/pages/Procedures.vue';
import Layout from '../client/layout/Layout.vue';
import Registration from '../views/Registration.vue';
import UserProfile from '@/client/pages/UserProfile.vue';
import Calendar from '../admin/pages/Calendar.vue';
import CosmetologistProcedures from '../client/pages/CosmetologistProcedures.vue';
import ProceduresCart from '../client/pages/ProceduresCart.vue';
import Success from '../client/pages/Success.vue';
import ProceduresAdmin from '../admin/pages/ProceduresAdmin.vue';
import CategoriesAdmin from '../admin/pages/CategoriesAdmin.vue';
import Products from '@/client/pages/Products.vue';
import ProductDetail from '@/client/pages/ProductDetail.vue';
import ProductsCart from '@/client/pages/ProductsCart.vue';
import AdminOrders from '@/admin/pages/AdminOrders.vue';
import ManufacturersAdmin from '@/admin/pages/AdminManufacturers.vue';
import AdminTaxonomy from '@/admin/pages/AdminTaxonomy.vue';
import ProductsAdmin from '@/admin/pages/ProductsAdmin.vue';
import OrderSuccess from '../client/pages/OrderSuccess.vue';

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
      { path: '/user-procedures-cart', component: ProceduresCart },
      { path: '/user-products-cart', component: ProductsCart },
      { path: '/success', component: Success },
      { path: '/orders/:id/success', component: OrderSuccess},
      { path: '/procedures', component: Procedures },
      {
        path: '/cosmetologist/:id/procedures',
        name: 'CosmetologistProcedures',
        component: CosmetologistProcedures,
      },
      { path: '/products', name: 'Products', component: Products },
      { path: '/products/:id', name: 'ProductDetail', component: ProductDetail },
    ],
  },
  { path: '/calendar', component: Calendar },
  { path: '/admin-orders', component: AdminOrders },
  { path: '/admin-manufacturers', component: ManufacturersAdmin },
  { path: '/admin-products', component: ProductsAdmin },
  { path: '/admin-procedures', component: ProceduresAdmin },
  { path: '/admin-categories', component: AdminTaxonomy },
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