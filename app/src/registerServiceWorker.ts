/* tslint:disable:no-console */

import {register} from 'register-service-worker';

register(`${process.env.BASE_URL}sw.js`, {
  ready() {
    console.log('App is being served from cache by a service worker');
  },

  registered() {
    console.log('Service worker has been registered.');
  },

  cached() {
    console.log('Content has been cached for offline use.');
  },

  updatefound() {
    console.log('New content is downloading.');
  },

  updated() {
    window.postMessage({
      type: 'worker',
      action: 'updated'
    }, location.origin);

    console.log('New content is available; please refresh.');
  },

  offline() {
    console.log('No internet connection found. App is running in offline mode.');
  },

  error(error) {
    console.error('Error during service worker registration:', error);
  },
});
