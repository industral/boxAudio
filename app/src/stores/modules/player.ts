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
  albumCovers?: [];
  songTitle: string|null,
  duration: number;
  currentTime: number;
  playingState: IPlayingState;

  isProgressShown: boolean;
}

const internalState: IState = {
  selectedArtist: null,
  selectedAlbum: null,
  selectedSong: null,
  songTitle: null,

  albumCovers: [],

  duration: 0,
  currentTime: 0,
  playingState: IPlayingState.None,

  isProgressShown: false
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

  setSongTitle(state: IState, songTitle: string|null) {
    state.songTitle = songTitle;
  },

  setDuration(state: IState, duration: number) {
    state.duration = duration;
  },

  setCurrentTime(state: IState, currentTime: number) {
    state.currentTime = currentTime;
  },

  setPlayingState(state: IState, playingState: IPlayingState) {
    state.playingState = playingState;
  },

  setShownProgress(state: IState, isShownProgress: boolean) {
    state.isProgressShown = isShownProgress;
  },

  setAlbumCovers(state: IState, albumCovers) {
    state.albumCovers = albumCovers;
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
