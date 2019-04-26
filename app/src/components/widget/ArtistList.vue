<template>
  <ul class="cmp-widget cmp-widget-artist-list">
    <li :class="[{active: artistName === selectedArtist}]" @click="selectArtist(artistName)"
        v-for="(artistData, artistName) of artists">
      <AlbumCover :albums="artistData.albums" />
      <div class="album-info">
        <strong :title="artistName">{{ artistName }}</strong>
        <p>{{ artistData.albums.length }} albums</p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import db, {IAlbum} from '@/context/db';

  import AlbumCover from './AlbumCover.vue';

  @Component({
    components: {
      AlbumCover
    }
  }) export default class ArtistList extends Vue {
    artists: IAlbum[] = [];

    get selectedArtist() {
      return this.$store.state.player.selectedArtist;
    }

    selectArtist(artistName: string) {
      this.$store.commit('player/setSelectedArtist', artistName);
      this.$store.commit('player/setSelectedAlbum', null);
    }

    selectArtistAtStartup() {
      const artistsKeys = Object.keys(this.artists);
      if (artistsKeys.length) {
        this.selectArtist(artistsKeys[0]);
      }
    }

    async mounted() {
      this.artists = await db.getArtistsWithinAlbums();

      this.selectArtistAtStartup();
    }
  }
</script>

<style lang="scss">
  .cmp-widget-artist-list {
    position: relative;
    background: rgba(255, 255, 255, 0.5);

    box-sizing: border-box;
    overflow: auto;
    width: 330px;

    li, .album-info {
      padding: 5px 0 5px 10px;
    }

    > li {
      position: relative;

      &:nth-child(even) {
        background: rgba(255, 255, 255, 0.3);
      }

      strong {
        font-weight: bold;
        margin: 0 0 5px 0;
        display: inline-block;
      }

      img {
        height: 50px;
        width: 50px;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        display: inline-block;
      }

      &.active {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>
