import { createRouter, createWebHistory } from 'vue-router'
import Lists from '../views/lists.vue'
import Box from '../views/box.vue'
import Sphere from '../views/sphere.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: Lists
    },{
      path: '/box',
      name: 'box',
      component: Box
    },{
      path: '/sphere',
      name: 'sphere',
      component: Sphere
    },
  ]
})

export default router
