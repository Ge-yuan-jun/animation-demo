import 'babel-polyfill'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Demo from './components/spring-loading/index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Demo',
      component: Demo
    }
  ]
})

const root = new Vue({
  data: {
    isTesting: process.env.NODE_ENV === 'testing'
  },
  router
})

if (process.env.NODE_ENV !== 'testing') {
  root.$mount('#app-ctnr')
}

export {
  router,
  root
}
