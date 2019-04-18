<template>
  <ul class="cmp-widget cmp-widget-artist-list list-group">
    <li :class="['list-group-item', {active: artistName === selectedArtist}]" @click="selectArtist(artistName)"
        v-for="(artistData, artistName) of artists">
      <AlbumCover :albums="artistData.albums" />
      <div class="media-body">
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
      this.$store.commit('player/selectArtist', artistName);
    }

    async mounted() {
      this.artists = await db.getArtistsWithinAlbums();
    }
  }
</script>

<style lang="scss">
  .cmp-widget-artist-list {
    li {
      img {
        height: 40px;
        width: 40px;
      }
    }
  }
</style>
