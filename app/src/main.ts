import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import './registerServiceWorker';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';


Vue.use(ElementUI);
Vue.use(ElementUI, {locale});

import 'reset-css';
import './assets/styles/style.css';
import './assets/styles/photon.css';
import './assets/styles/fonts.scss';
import './assets/styles/material-icons.scss';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),

  beforeCreate() {
    store.commit('settings/initialiseStore');
  }
}).$mount('#app');
