import 'babel-polyfill'

import Vue from 'vue'
import router from './components/router'

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
