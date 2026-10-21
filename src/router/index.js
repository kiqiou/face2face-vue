import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/client/pages/Home.vue';
import Layout from '../client/layout/Layout.vue';
import Registration from '../views/Registration.vue';
import UserProfile from '@/client/pages/UserProfile.vue';
import Products from '@/client/pages/Products.vue';
import ProductDetail from '@/client/pages/ProductDetail.vue';
import ProductsCart from '@/client/pages/ProductsCart.vue';
import AdminOrders from '@/admin/pages/AdminOrders.vue';
import ManufacturersAdmin from '@/admin/pages/AdminManufacturers.vue';
import AdminTaxonomy from '@/admin/pages/AdminTaxonomy.vue';
import ProductsAdmin from '@/admin/pages/ProductsAdmin.vue';
import OrderSuccess from '../client/pages/OrderSuccess.vue';
import OrderDetails from '../admin/pages/OrderDetails.vue';
import AdminAnalytics from '../admin/pages/AdminAnalytics.vue';
import Privacy from '../client/pages/Privacy.vue';


const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: '/registration', component: Registration },
      { path: '/user-profile', component: UserProfile },
      { path: '/user-products-cart', component: ProductsCart },
      { path: '/orders/:id/success', component: OrderSuccess},
      { path: '/products', name: 'Products', component: Products },
      { 
        path: '/products/:id', 
        name: 'ProductDetail', 
        component: ProductDetail,
        props: route => ({ id: Number(route.params.id), backRoute: '/products' }) 
      },
      {
        path: '/privacy-policy',
        name: 'PrivacyPolicy',
        component: Privacy,
      },
      {
        path: '/return-policy',
        name: 'ReturnPolicy',
        component: () => import('../client/pages/ReturnPolicy.vue'),
      },
      {
        path: '/offer',
        name: 'Offer',
        component: () => import('../client/pages/Offer.vue'),
      }
    ],
  },
  { path: '/admin-orders', component: AdminOrders },
  { path: '/admin-manufacturers', component: ManufacturersAdmin },
  { path: '/admin-products', component: ProductsAdmin },
  { path: '/admin-categories', component: AdminTaxonomy },
  { path: '/admin-analytics', component: AdminAnalytics },
  { path: '/admin-promocodes', component: () => import('../admin/pages/AdminPromoCodes.vue') },
  { path: '/admin-clients', component: () => import('../admin/pages/AdminClients.vue') },
  { 
    path: '/admin/products/:id', 
    name: 'AdminProductDetail', 
    component: ProductDetail,
    props: route => ({ id: Number(route.params.id), backRoute: '/admin-products' }) // Укажите ваш роут админки
  },
  {
    path: '/admin/orders/:id',
    name: 'OrderDetails',
    component: OrderDetails,
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // даём каталогу время загрузиться, иначе страница ещё короткая
      return new Promise((resolve) => setTimeout(() => resolve(savedPosition), 400));
    }
    if (to.path === from.path) return false; // меняется только query: не прокручивать
    return { top: 0 };
  },
});

export default router;