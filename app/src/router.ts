import Vue from 'vue';
import Router from 'vue-router';

import NotFoundComponent from '@/components/page/NotFoundComponent.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "Router-Home" */ '@/components/page/Home.vue'),
    },
    {
      path: '/initial-setup',
      name: 'initialSetup',
      component: () => import(/* webpackChunkName: "Router-InitialSetup" */ '@/components/page/InitialSetup.vue'),
    },
    {
      path: '/player',
      name: 'player',
      component: () => import(/* webpackChunkName: "Router-Player" */ '@/components/page/Player.vue'),
    },
    {
      path: '/dropbox-oauth-callback',
      component: () => import(/* webpackChunkName: "Router-DropboxCallback" */ '@/callbacks/Dropbox.vue'),
    },

    { path: '*', component: NotFoundComponent }
  ],
});
