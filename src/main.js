// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import store from './store'
import router from './router'

import './icons'

import '@/styles/index.scss' // global css
//使用elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// set ElementUI lang to EN
Vue.use(ElementUI, )

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
