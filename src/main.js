import Vue from 'vue'
import App from './App.vue'
import vmodal from 'vue-js-modal'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

Vue.use(vmodal)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
