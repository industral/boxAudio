<template>
  <ul class="cmp-widget cmp-widget-album-list">
    <li :class="[{active: albumName === selectedAlbum}]" @click="selectAlbum(albumName)"
        v-for="(albumData, albumName) of albums">
      <AlbumCover :albums="[{cover: albumData.coverArt}]" />
      <div class="album-info">
        <strong :title="albumName">{{ albumName }}</strong>
        <p>{{ albumData.count }} songs</p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
  import {Component, Vue, Watch,} from 'vue-property-decorator';

  import AlbumCover from './AlbumCover.vue';
  import db, {IAlbum} from '@/context/db';

  @Component({
    components: {
      AlbumCover
    }
  }) export default class AlbumList extends Vue {
    albums: IAlbum[] = [];

    selectAlbum(albumName: string) {
      this.$store.commit('player/selectAlbum', albumName);
      this.$store.commit('player/setAlbumCovers', this.albums[albumName].coverArt);
    }

    get selectedArtist() {
      return this.$store.state.player.selectedArtist;
    }

    get selectedAlbum() {
      return this.$store.state.player.selectedAlbum;
    }

    selectAlbumAtStartup() {
      if (this.selectedAlbum) return;

      const albumsKeys = Object.keys(this.albums);
      if (albumsKeys.length) {
        this.selectAlbum(albumsKeys[0]);
      }
    }

    @Watch('selectedArtist')
    async onPropertyChanged() {
      this.albums = await db.getAlbumsForArtist(this.$store.state.player.selectedArtist);

      this.selectAlbumAtStartup();
    }
  }
</script>

<style lang="scss">
  .cmp-widget-album-list {
    position: relative;
    background: rgba(255, 255, 255, 0.5);

    box-sizing: border-box;
    overflow: auto;
    width: 330px;

    li, .album-info {
      padding: 5px 0 5px 10px;
    }

    li {
      position: relative;

      strong {
        font-weight: bold;
        margin: 0 0 5px 0;
        display: inline-block;
      }

      img {
        height: 50px;
        width: 50px;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      }

      &.active {
        img {
          height: 60px;
          width: 60px;
        }
      }
    }
  }
</style>
