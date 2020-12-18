import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 引入表格组件树插件
import ZkTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'


//配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  //console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}) 
Vue.prototype.$http = axios
Vue.component('tree-table', ZkTable)

// 导入 element 按需导入的文件
import './plugins/element.js'
// 导入 全局 css 文件
import './assets/css/golbal.css'
// 引入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 使用插件
Vue.use(VueQuillEditor, /* { default global options } */)

//定义全局 时间过滤器
Vue.filter('dateFormat', function(originVal) { //originVal 传入的时间戳
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 月份从 0 开始的 ，所以 +1 然后转换为字符串， 当月份不足两位数时， 在前面加 0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') //padStart(2, '0')  2，总共 2位数， 不足加 0
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  // 输出时间的格式
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
