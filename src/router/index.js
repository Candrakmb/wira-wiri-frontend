// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import starter from '@/view/starter.vue';
import Login from '@/view/login.vue';
import Signup from '@/view/signup.vue';
import Home from '@/view/home.vue';
import Food from '@/view/resto.vue';
import Order from '@/view/order.vue';
import Profil from '@/view/profil.vue'
import MenuResto from '@/view/menuResto.vue';
import Alamat from '@/view/alamat.vue';
import CreateAlamat from '@/components/createAlamat.vue';
import Chekout from '@/view/chekout.vue'
import EditCustom from '@/components/editCustomeCart.vue'
import store from '../store'; // Impor store di sini

const routes = [
  {
    path: '/starter',
    name: 'starter',
    component: starter,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    // meta: { requiresAuth: true },
  },
  {
    path: '/food',
    name: 'Food',
    component: Food,
    // meta: { requiresAuth: true },
  },
  {
    path: '/order',
    name: 'order',
    component: Order,
    // meta: { requiresAuth: true },
  },
  {
    path: '/menu/:id',
    name: 'Menu',
    component: MenuResto,
    props: true,
    // meta: { requiresAuth: true },
  },
  {
    path: '/profil',
    name: 'Profil',
    component: Profil,
    // meta: { requiresAuth: true },
  },
  {
    path: '/alamat',
    name: 'Alamat',
    component: Alamat,
    // meta: { requiresAuth: true },
  },
  {
    path: '/alamat/:type',
    name: 'CretaeOrEdit',
    component: CreateAlamat,
    props: true,
    // meta: { requiresAuth: true },
  },
  {
    path: '/chekout',
    name: 'Chekout',
    component: Chekout,
    // meta: { requiresAuth: true },
  },
  {
    path: '/edit/custom',
    name: 'EditCustom',
    component: EditCustom,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/starter','/login', '/signup'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = store.getters.isAuthenticated;
  console.log(loggedIn);

  if (authRequired && !loggedIn) {
    next('/starter');
  } else if(loggedIn && !authRequired) {
    next('/');
  } else {
    next();
  }
});

// router.beforeEach(async (to, from, next) => {
//   console.log(store.getters.isAuthenticated);
//   console.log(store.state.user);
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!store.state.isAuthenticated) {
//       await store.dispatch('fetchUser');
//     }
//     if (!store.state.isAuthenticated) {
//       next({ name: 'starter' });
//     } else {
//       next();
//     }
//   } else if (['login', 'signup', 'starter'].includes(to.name) && store.state.isAuthenticated) {
//     next({ name: 'home' });
//   } else {
//     next();
//   }
// });

export default router;