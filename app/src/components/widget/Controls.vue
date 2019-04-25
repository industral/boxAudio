<template>
  <div class="cmp-widget cmp-widget-controls">
    <div class="action-group">
      <span class="mdi mdi-skip-backward action-backward"></span>
      <span :class="['mdi', 'action-play-pause', playPauseIconClass]" @click="togglePlayPause()"></span>
      <span class="mdi mdi-skip-forward action-forward"></span>
    </div>

    <div class="seek">
      <div class="icon" ref="icon-loading-dots" v-show="isProgressLoading"></div>
      <input @change="setProgress($event)" @mousedown="setProgressMoving(true)" @mouseup="setProgressMoving(false)"
             max="100" min="0"
             ref="progress" step="0.1" type="range" v-show="!isProgressLoading" />
    </div>

    <div class="connection-statuses">
      <DropboxConnectionStatus />
    </div>

  </div>
</template>

<script lang="ts">
  import lottie from 'lottie-web';

  import {Component, Vue} from 'vue-property-decorator';
  import {IPlayingState} from '@/stores/modules/player';
  import DropboxConnectionStatus from '@/components/widget/Storage/Dropbox/ConnectionStatus.vue';
  import Player from '@/context/Player';

  import icon from '@/assets/icons/loading-dots.json';

  @Component({
    components: {
      DropboxConnectionStatus
    }
  }) export default class Controls extends Vue {
    private player: Player = Player;
    private isProgressMoving: boolean = false;
    private updateProgressInterval: number = 0;
    private iconLoadingDots;

    data() {
      return {
        isProgressLoading: true
      };
    }

    get currentTime() {
      return this.$store.state.player.currentTime;
    }

    get duration() {
      return this.$store.state.player.duration;
    }

    get progress() {
      if (!this.currentTime) return NaN;
      return 100 / (this.duration / this.currentTime);
    }

    get isPlaying() {
      return this.$store.state.player.playingState === IPlayingState.Playing;
    }

    get playPauseIconClass() {
      return this.isPlaying ? 'mdi-pause' : 'mdi-play';
    }

    setProgress(event) {
      const newProgressValue = Number(event.target.value);
      Player.setProgress(newProgressValue);
    }

    setProgressMoving(isMoving: boolean) {
      this.isProgressMoving = isMoving;
    }

    togglePlayPause() {
      this.player.toggle();
    }

    startUpdatingProgress() {
      this.updateProgressInterval = setInterval(() => {
        if (!this.isProgressMoving) {
          this.updateProgressLoading();
          this.updateSeekProgress();
        }
      }, 500);
    }

    updateProgressLoading() {
      this.$data.isProgressLoading = !Number.isFinite(this.progress);

      if (this.$data.isProgressLoading) {
        if (this.iconLoadingDots.isPaused) this.iconLoadingDots.play();
      } else {
        this.iconLoadingDots.stop();
      }
    }

    updateSeekProgress() {
      this.$refs.progress.value = this.progress;
    }

    initLoadingIcon() {
      Vue.nextTick(() => {
        this.iconLoadingDots = lottie.loadAnimation({
          container: this.$refs['icon-loading-dots'],
          renderer: 'canvas',
          loop: true,
          autoplay: true,
          animationData: icon
        });
      });
    }

    mounted() {
      this.startUpdatingProgress();
      this.initLoadingIcon();
    }

    beforeDestroy() {
      clearInterval(this.updateProgressInterval);
    }
  }
</script>

<style lang="scss">
  .cmp-widget-controls {
    text-align: center;

    .action-group {
      .mdi {
        font-size: 2vw;
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.3);
        display: inline-block;
        padding: 5px;
        margin: 0 10px;
        color: #222;
        cursor: pointer;
        transition: all 0.1s;

        &:hover {
          transform: scale(1.1);
          color: #000;
        }
      }

      .action-play-pause {
        font-size: 4vw;
      }
    }

    .seek {
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .icon {
        width: 200px;
        margin: auto;
      }

      input {
        width: 400px;
      }
    }
  }
</style>
