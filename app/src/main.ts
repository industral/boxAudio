import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import './registerServiceWorker';

import './assets/styles/style.css';
import './assets/styles/fonts.scss';
import './assets/styles/material-icons.scss';

import './assets/styles/components/index.scss';
import './assets/styles/scrollbar.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),

  beforeCreate() {
    store.commit('settings/initialiseStore');
  }
}).$mount('#app');
