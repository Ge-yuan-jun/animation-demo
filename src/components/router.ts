import Vue from 'vue'
import VueRouter from 'vue-router'
import SpringLoading from './spring-loading/index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/spring-loading',
      name: 'SpringLoading',
      component: SpringLoading
    }
  ]
})

export default router
