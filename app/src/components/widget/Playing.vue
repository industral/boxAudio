<template>
  <div class="cmp-widget-playing">
    <span @click="toggleCollapse()" class="mdi mdi-chevron-down action-expand-collapse"></span>

    <div class="background">
      <img :src="getCoverImg(albumCovers)" alt="Album cover" />
    </div>

    <header>
      <div class="description">
        <div class="artist">{{ selectedArtist }}</div>
        <div class="album">{{ songTitle }} | {{ selectedAlbum }}</div>
      </div>

      <div class="cover">
        <img :src="getCoverImg(albumCovers)" alt="Album cover" />
      </div>
    </header>

    <Controls />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import Controls from '@/components/widget/Controls.vue';
  import utils from '@/assets/scripts/utils';

  @Component({
    components: {
      Controls
    }
  }) export default class Playing extends Vue {
    get selectedArtist() {
      return this.$store.state.player.selectedArtist;
    }

    get selectedAlbum() {
      return this.$store.state.player.selectedAlbum;
    }

    get songTitle() {
      return this.$store.state.player.songTitle;
    }

    get albumCovers() {
      return this.$store.state.player.albumCovers;
    }

    getCoverImg(covers: [] = []) {
      if (!covers) return;
      return utils.getURLFromArrayBuffer(covers[0]);
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
        filter: blur(22px);
        box-shadow: 18px 19px 20px 2000px rgba(255, 255, 255, 0.8);
        opacity: 0.5;
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
        /*position: relative;*/
        /*left: calc(50% - 125px);*/

        img {
          width: 250px;
          border-radius: 9px;
          box-shadow: 2px 3px 17px #333;
        }
      }
    }
  }
</style>
