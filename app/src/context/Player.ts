import store from '@/stores/index';
import {IPlayingState} from '@/stores/modules/player';
import AV from 'av/build/aurora';
import {ISong} from '@/context/db';

window.AV = AV;

require('av/src/devices/webaudio');

require('flac.js/build/flac');
require('mp3/build/mp3');
require('aac/build/aac');
require('alac/build/alac');

export default new class Player {
  private player: any = null;
  private currentSong: object | null = null;

  async play(song: ISong) {
    this.currentSong = song;
    this.stop();

    store.commit('player/setDuration', song.duration * 1000);

    this.player = AV.Player.fromURL(`/storage/download?file=${encodeURIComponent(song.file)}`, {
      length: song.size,
      //TODO: temporary fix, until fixed playback for m4a files.
      chunkSize: song.file.endsWith('.m4a') ? song.size : 1024 ** 2
    });

    this.player.on('error', (error: any) => {
      window.postMessage({
        type: 'error',
        message: typeof error === 'string' ? error : 'Network error'
      }, location.origin);
    });

    this.player.on('progress', (progress: number) => {
      store.commit('player/setCurrentTime', progress);
    });

    await this.player.play();

    store.commit('player/setPlayingState', IPlayingState.Playing);
  }

  async resume() {
    await this.player.play();
    store.commit('player/setPlayingState', IPlayingState.Playing);
  }

  stop() {
    if (this.player) {
      this.player.stop();
      this.player.asset.source.stream && this.player.asset.source.stream.close();
      store.commit('player/setCurrentTime', 0);
      store.commit('player/setDuration', 0);
      store.commit('player/setPlayingState', IPlayingState.Stopped);
    }
  }

  pause() {
    if (this.player) {
      this.player.pause();
      store.commit('player/setPlayingState', IPlayingState.Paused);
    }
  }

  async toggle() {
    switch (store.state.player.playingState) {
      case IPlayingState.Playing:
        this.pause();
        break;

      case IPlayingState.Paused:
        await this.resume();
        break;

      default:
        await this.play(this.currentSong);
    }
  }

  setProgress(value: number) {
    const duration = store.state.player.duration;
    this.player.seek(duration * value / 100);
  }
};
