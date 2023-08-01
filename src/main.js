import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import VueWait from 'vue-wait'

Vue.use(VueWait)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  wait: new VueWait({
    useVuex: true
  }),
  render: h => h(App)
}).$mount('#app')
