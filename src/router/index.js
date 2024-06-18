import { createRouter, createWebHistory } from 'vue-router'
import starter from '@/view/starter.vue'
import Login from '@/view/login.vue'
import Signup from '@/view/signup.vue'
import Home from '@/view/home.vue'
import Food from '@/view/resto.vue'
import Order from '@/view/order.vue'
import MenuResto from '@/view/menuResto.vue'

const routes = [
  {
    path: '/',
    name: 'starter',
    component: starter
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/food',
    name: 'Food',
    component: Food
  },
  {
    path: '/order',
    name: 'order',
    component: Order
  },
  {
    path: '/menu',
    name: 'Menu',
    component: MenuResto
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
