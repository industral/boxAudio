import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import libraryProcessing from './modules/library-processing';
import player from './modules/player';
import settings from './modules/settings';
import main from './modules/main';

export default new Vuex.Store({
  modules: {
    libraryProcessing,
    player,
    settings,
    main
  },

  strict: process.env.NODE_ENV !== 'production'
});
