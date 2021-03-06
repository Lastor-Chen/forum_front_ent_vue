import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSession from 'vue-session'
import './assets/application.scss'
import { emptyImageFilter } from './utils/mixins.js'

Vue.config.productionTip = false
Vue.mixin(emptyImageFilter)
Vue.use(VueSession)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
