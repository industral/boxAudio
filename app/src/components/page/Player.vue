import {IPlayingState} from '../../stores/modules/player';
<template>
  <div class="cmp-page cmp-page-player">
    <div class="wrapper">
      <aside>
        <SideMenu />
      </aside>

      <section class="player">
        <div :class="['list', {'hide': isProgressShown}]">
          <ArtistList />
          <AlbumList />
          <SongList />

          <div @click="togglePlayingProgress()" class="toggle-playing-progress" v-show="isPlayingSong">
            <span class="mdi mdi-chevron-up action-toggle-playing-progress"></span>
          </div>
        </div>

        <Playing :class="['playing', {'hide': !isProgressShown}]" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import SideMenu from '@/components/widget/SideMenu.vue';
  import ArtistList from '@/components/widget/ArtistList.vue';
  import AlbumList from '@/components/widget/AlbumList.vue';
  import SongList from '@/components/widget/SongList.vue';
  import Playing from '@/components/widget/Playing.vue';

  @Component({
    components: {
      SideMenu,
      ArtistList,
      AlbumList,
      SongList,
      Playing
    }
  }) export default class Player extends Vue {
    get isProgressShown() {
      return this.$store.state.player.isProgressShown;
    }

    get isPlayingSong() {
      return !!this.$store.state.player.playingSongId;
    }

    togglePlayingProgress() {
      this.$store.commit('player/setShownProgress', !this.$store.state.player.isProgressShown);
    }

    mounted() {
      this.$store.commit('main/setLoading', false);
    }
  }
</script>

<style lang="scss">
  .cmp-page-player {
    .wrapper {
      background: inherit;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: inset 0 0 0 2000px rgba(255, 255, 255, .5);
        background: linear-gradient(to right, #e0460be0, #0014ffa3);
        border-radius: 9px;
        z-index: -1;
      }

      position: relative;
      display: flex;

      .player {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;

        .list {
          display: flex;
          height: calc(100vh - 120px);
          opacity: 1;
          transition: opacity 0.3s;
          z-index: 1;
          width: 100%;

          &.hide {
            opacity: 0;
          }
        }

        .playing {
          opacity: 1;
          transition: opacity 0.3s;
          z-index: 1;

          &.hide {
            opacity: 0;
            z-index: 0;
          }
        }

        .toggle-playing-progress {
          position: absolute;
          bottom: 0;
          left: 50%;
          cursor: pointer;
          z-index: 1;

          .mdi {
            font-size: 42px;
            color: palevioletred;
          }
        }
      }
    }
  }
</style>
