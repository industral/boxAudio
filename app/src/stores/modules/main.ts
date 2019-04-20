interface IState {
  isLoading: boolean;
}

const internalState: IState = {
  isLoading: true
};

const actions = {
};

const mutations = {
  setLoading(state: IState, isLoading: boolean) {
    state.isLoading = isLoading;
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
