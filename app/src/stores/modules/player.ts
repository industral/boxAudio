export enum IPlayingState {
  None,
  Playing,
  Stopped,
  Paused
}

interface IState {
  selectedArtist?: string | null;
  selectedAlbum?: string | null;

  playingSongId?: string | null;

  playingState: IPlayingState;
  duration: number;

  isProgressShown: boolean;
}

const internalState: IState = {
  selectedArtist: null,
  selectedAlbum: null,

  playingSongId: null,

  playingState: IPlayingState.None,
  duration: 0,

  isProgressShown: false
};

const actions = {};

const mutations = {
  setSelectedArtist(state: IState, artist: string | null) {
    state.selectedArtist = artist;
  },

  setSelectedAlbum(state: IState, album: string | null) {
    state.selectedAlbum = album;
  },

  setPlayingSongId(state: IState, playingSongId: string | null) {
    state.playingSongId = playingSongId;
  },

  setDuration(state: IState, duration: number) {
    state.duration = duration;
  },

  setPlayingState(state: IState, playingState: IPlayingState) {
    state.playingState = playingState;
  },

  setShownProgress(state: IState, isShownProgress: boolean) {
    state.isProgressShown = isShownProgress;
  }
};

const getters = {};

export default {
  namespaced: true,
  state: internalState,
  actions,
  getters,
  mutations
};
