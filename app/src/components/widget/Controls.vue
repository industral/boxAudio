<template>
  <div class="cmp-widget cmp-widget-controls">
    <div class="toolbar-actions">
      <div class="btn-group">
        <button class="btn btn-large btn-default">
          <span class="icon icon-fast-backward"></span>
        </button>

        <button @click="togglePlayPause()"
                class="btn btn-large btn-default"
                data-id="start-pause"
                data-is-playing={this.props.isPlaying}>
          <span :class="playPauseIconClass"></span>
        </button>

        <button class="btn btn-large btn-default">
          <span class="icon icon-fast-forward"></span>
        </button>
      </div>
    </div>

    <div class="seek">
      <input @change="setProgress($event)" @mousedown="setProgressMoving(true)" @mouseup="setProgressMoving(false)"
             max="100" min="0"
             ref="progress" step="0.1" type="range" />
    </div>

    <div class="connection-statuses">
      <DropboxConnectionStatus />
    </div>

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {IPlayingState} from '@/stores/modules/player';
  import DropboxConnectionStatus from '@/components/widget/Storage/Dropbox/ConnectionStatus.vue';
  import Player from '@/context/Player';

  @Component({
    components: {
      DropboxConnectionStatus
    }
  }) export default class Controls extends Vue {
    player: Player = Player;
    isProgressMoving: boolean = false;
    private updateProgressInterval;

    get currentTime() {
      return this.$store.state.player.currentTime;
    }

    get duration() {
      return this.$store.state.player.duration;
    }

    get progress() {
      if (!this.currentTime) return 0;
      return 100 / (this.duration / this.currentTime);
    }

    get isPlaying() {
      return this.$store.state.player.playingState === IPlayingState.Playing;
    }

    get playPauseIconClass() {
      return 'icon ' + (this.isPlaying ? 'icon-pause' : 'icon-play');
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

    mounted() {
      this.updateProgressInterval = setInterval(() => {
        if (!this.isProgressMoving) {
          this.$refs.progress.value = this.progress;
        }
      }, 500);
    }

    beforeDestroy() {
      clearInterval(this.updateProgressInterval);
    }
  }
</script>

<style lang="scss">
  .cmp-widget-controls {
    display: flex;
    flex-direction: row;
    align-items: center;

    .seek {
      margin: 0 0 0 20px;
      flex: 1;

      input {
        width: 400px;
      }
    }

    .connection-statuses {
      margin: 0 20px 0 30px;
    }
  }
</style>
