import Vue from 'vue';
import Router from 'vue-router';
import MainLayout from './components/layout/Main.vue';
import NotFoundComponent from '@/components/page/NotFoundComponent';
import Dropbox from './callbacks/Dropbox.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',

  routes: [
    {
      path: '/',
      name: 'home',
      component: MainLayout,
    },
    {
      path: '/dropbox-oauth-callback',
      component: Dropbox,
    },

    { path: '*', component: NotFoundComponent }
  ],
});
