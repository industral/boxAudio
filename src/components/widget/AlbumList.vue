<template>
  <ul class="cmp-widget cmp-widget-album-list list-group">
    <li :class="['list-group-item', {active: albumName === selectedAlbum}]" @click="selectAlbum(albumName)"
        v-for="(albumData, albumName) of albums">
      <AlbumCover :albums="[{cover: albumData.coverArt}]" />
      <div class="media-body">
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
    }

    get selectedArtist() {
      return this.$store.state.player.selectedArtist;
    }

    get selectedAlbum() {
      return this.$store.state.player.selectedAlbum;
    }

    @Watch('selectedArtist')
    async onPropertyChanged(value: string, oldValue: string) {
      console.log('CHANGED!', value, oldValue);

      console.log('A', this.$store.state.player.selectedArtist);
      this.albums = await db.getAlbumsForArtist(this.$store.state.player.selectedArtist);


      console.log(444, this.albums);
    }

    async mounted() {

    }
  }
</script>

<style lang="scss">
  .cmp-widget-album-list {
    > .list-group-item {
      display: flex;
    }

    li {
      img {
        height: 40px;
        width: 40px;
      }

      .media-body {
        width: 150px;
      }
    }
  }
</style>
