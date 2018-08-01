import Vue from 'vue'
import App from './App.vue'
import vmodal from 'vue-js-modal'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(vmodal)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
