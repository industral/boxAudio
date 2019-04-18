export enum IPlayingState {
  None,
  Playing,
  Stopped,
  Paused
}

interface IState {
  selectedArtist?: string|null;
  selectedAlbum?: string|null;
  selectedSong?: string|null;
  duration: number,
  currentTime: number,
  playingState: IPlayingState
}

const internalState: IState = {
  selectedArtist: null,
  selectedAlbum: null,
  selectedSong: null,

  duration: 0,
  currentTime: 0,
  playingState: IPlayingState.None
};

const actions = {
};

const mutations = {
  selectArtist(state: IState, artist: string|null) {
    state.selectedArtist = artist;
  },

  selectAlbum(state: IState, album: string|null) {
    state.selectedAlbum = album;
  },

  selectSong(state: IState, songFile: string|null) {
    state.selectedSong = songFile;
  },

  setDuration(state: IState, duration: number) {
    state.duration = duration;
  },

  setCurrentTime(state: IState, currentTime: number) {
    state.currentTime = currentTime;
  },

  setPlayingState(state: IState, playingState: IPlayingState) {
    state.playingState = playingState;
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
