// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import * as VueGoogleMaps from 'vue2-google-maps'
import { Form, FormModel, DatePicker } from 'ant-design-vue'
import JsonExcel from 'vue-json-excel'

import './core/lazy_use' // use lazy load components
import './utils/filter' // global filter
import './global.less' // global style

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('downloadExcel', JsonExcel)
Vue.use(FormModel)
Vue.use(Form)
Vue.use(DatePicker)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCqylmPYk41UO3LWcyun3fMxieV7hxn6TI',
    // libraries: 'places', // This is required if you use the Autocomplete plugin
    region: 'VI',
    language: 'vi'
  }
})

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
