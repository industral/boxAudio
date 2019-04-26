<template>
  <div class="cmp-widget-playing">
    <span @click="toggleCollapse()" class="mdi mdi-chevron-down action-expand-collapse"></span>

    <div class="background">
      <img :src="albumCover" alt="Album cover" />
    </div>

    <header>
      <div class="description">
        <div class="artist">{{ artist }}</div>
        <div class="album">{{ songTitle }} | {{ album }}</div>
      </div>

      <div class="cover">
        <img :src="albumCover" alt="Album cover" />
      </div>
    </header>

    <Controls />
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';

  import Controls from '@/components/widget/Controls.vue';
  import utils from '@/assets/scripts/utils';
  import db from '@/context/db';

  @Component({
    components: {
      Controls
    }
  }) export default class Playing extends Vue {
    data() {
      return {
        playingSongInfo: null,
        albumCover: null
      };
    }

    get artist() {
      const playingSongInfo = this.$data.playingSongInfo;
      return playingSongInfo && playingSongInfo.albumArtist;
    }

    get album() {
      const playingSongInfo = this.$data.playingSongInfo;
      return playingSongInfo && playingSongInfo.album;
    }

    get songTitle() {
      const playingSongInfo = this.$data.playingSongInfo;
      return playingSongInfo && playingSongInfo.title;
    }

    get playingSongId() {
      return this.$store.state.player.playingSongId;
    }

    @Watch('playingSongId')
    async playingSongIdChange() {
      this.$data.playingSongInfo = await db.getSongInfo(this.playingSongId);
      this.$data.albumCover = this.getAlbumCover();
    }

    getAlbumCover() {
      const coverArt = this.$data.playingSongInfo.coverArt;
      return utils.getURLFromArrayBuffer(coverArt && coverArt[0]);
    }

    toggleCollapse() {
      this.$store.commit('player/setShownProgress', !this.$store.state.player.isProgressShown);
    }
  }
</script>

<style lang="scss">
  .cmp-widget-playing {
    position: absolute;
    top: 0;
    height: calc(100vh - 120px);
    width: 100%;
    z-index: 1;
    padding: 20px;
    box-sizing: border-box;

    .action-expand-collapse {
      font-size: 32px;
      position: absolute;
      top: 16px;
      left: 13px;
      color: #e0460be0;
      cursor: pointer;
    }

    .background {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      align-content: center;
      overflow: hidden;
      z-index: -1;
      left: 0;
      top: 0;
      border-top-right-radius: 9px;
      border-bottom-right-radius: 9px;

      img {
        min-width: 100%;
        min-height: 100%;
        filter: blur(3px);
        box-shadow: 18px 19px 20px 2000px rgba(255, 255, 255, 0.8);
        opacity: 0.3;
      }
    }

    header {
      display: flex;
      height: calc(60vh - 60px);
      align-items: center;

      .description {
        flex: 3;

        .artist {
          font-size: 2vw;
          margin: 20px 0;
        }

        .album {
          font-size: 1.2vw;
        }
      }

      .cover {
        flex: 1;

        img {
          width: 250px;
          box-shadow: 2px 3px 17px #333;
        }
      }
    }
  }
</style>
