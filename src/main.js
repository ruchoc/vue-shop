import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入图标
import './assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
axios.defaults.baseURL='https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios

// 导入树形表
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

// 导入富文本编辑框
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter('dateFormat',originVal=>{
  const dt=new Date(originVal)
  const y=dt.getFullYear()
  const M=(dt.getMonth()+'').padStart(2,'0')
  const d=(dt.getDay()+'').padStart(2,'0')

  const h=(dt.getHours()+'').padStart(2,'0')
  const m=(dt.getMinutes()+'').padStart(2,'0')
  const s=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${M}-${d} ${h}:${m}:${s}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
