import db from '@/context/db';

interface IState {
  accessTokenDropbox?: string | null;
  isDBPopulated: boolean;
}

const internalState: IState = {
  accessTokenDropbox: null,
  isDBPopulated: false
};

const actions = {
  async updateIsDBPopulated({commit}) {
    try {
      const result = await db.playlistCount();
      commit('setDBPopulated', result);
    } catch (error) {
      return error;
    }
  },
};

const mutations = {
  setAccessTokenDropbox(state: IState, token: string | null) {
    localStorage.accessTokenDropbox = token;
    state.accessTokenDropbox = token;
  },

  setDBPopulated(state: IState, isPopulated: boolean) {
    state.isDBPopulated = isPopulated;
  },

  initialiseStore(state: IState) {
    state.accessTokenDropbox = localStorage.accessTokenDropbox;

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({accessTokenDropbox: state.accessTokenDropbox});
    }
  }
};

const getters = {
};

export default {
  namespaced: true,
  state: internalState,
  actions,
  getters,
  mutations
};
