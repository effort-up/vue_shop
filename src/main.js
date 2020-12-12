import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  //console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}) 
Vue.prototype.$http = axios

import './plugins/element.js'
import './assets/css/golbal.css'



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
