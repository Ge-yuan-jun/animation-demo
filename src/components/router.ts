import Vue from 'vue'
import VueRouter from 'vue-router'

import FireWork from './fireworks/index.vue'
import SpringLoading from './spring-loading/index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/spring-loading',
      name: 'SpringLoading',
      component: SpringLoading
    },
    {
      path: '/firework',
      name: 'FireWork',
      component: FireWork
    }
  ]
})

export default router
