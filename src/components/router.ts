import Vue from 'vue'
import VueRouter from 'vue-router'

import Demo from './demo/index.vue'
import FireWork from './fireworks/index.vue'
import LogoCanvas from './logo-canvas/index.vue'
import Redpack from './rotate3d/index.vue'
import Smoke from './smoke/index.vue'
import SpringLoading from './spring-loading/index.vue'
import Stage from './stage/index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Demo',
      component: Demo
    },
    {
      path: '/spring-loading',
      name: 'SpringLoading',
      component: SpringLoading
    },
    {
      path: '/firework',
      name: 'FireWork',
      component: FireWork
    },
    {
      path: '/smoke',
      name: 'Smoke',
      component: Smoke
    },
    {
      path: '/stage',
      name: 'Stage',
      component: Stage
    },
    {
      path: '/redpack',
      name: 'Redpack',
      component: Redpack
    },
    {
      path:'/logo-canvas',
      name: 'LogoCanvas',
      component: LogoCanvas
    }
  ]
})

export default router
