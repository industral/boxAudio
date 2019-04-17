import store from '@/stores/index';
import {IPlayingState} from '@/stores/modules/player';
//@ts-ignore
import AV from 'av/build/aurora';
import Streamer from '@/components/widget/Storage/Dropbox/Streamer';
import {ISong} from '@/context/db';

//@ts-ignore
window.AV = AV;

require('av/src/devices/webaudio');

// require('ogg.js');
// require('flac.js');
require('mp3/build/mp3');
require('aac/build/aac');
require('alac/build/alac');

export default new class Player {
  private player: any = null;
  private streamer: Streamer | null = null;
  private currentSong: object | null = null;

  async play(song: ISong) {
    this.currentSong = song;
    this.stop();

    store.commit('player/setDuration', song.duration * 1000);

    // const audio = new Audio();
    // const audio = document.getElementById('audio');
    // window.AUDIO = audio;

    // audio.src = `/storage/download?file=${encodeURIComponent(songFile)}`;
    // await audio.play();
    // this.streamer = new Streamer(songFile);
    // const streamerResult = await this.streamer.fetch();
    //
    // console.log('streamerResult.blob', streamerResult.blob);
    // this.player = AV.Player.fromBuffer(streamerResult.blob);
    try {
      this.player = AV.Player.fromURL(`/storage/download?file=${encodeURIComponent(song.file)}`, {
        length: song.size
      });
    } catch(error) {
      console.log('PPP2', error);
    }

    this.player.on('error', (error) => {
      console.error('PPPP', error);
    });

    this.player.on('progress', (progress: number) => {
      store.commit('player/setCurrentTime', progress);
    });
    //
    // console.log('this.player', this.player);
    await this.player.play();
    // // this.player.volume = 0;
    //
    // const t = setInterval(() => {
    console.dir(this.player);
    // }, 500);
    //
    // setTimeout(() => {
    //   clearInterval(t);
    // }, 60000);
    //
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
