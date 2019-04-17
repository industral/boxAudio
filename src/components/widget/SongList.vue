<template>
  <div class="cmp-widget cmp-widget-song-list table-striped">
    <table>
      <thead>
        <tr>
          <th class="track">Track</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="{active: song.file === selectedSong}" @dblclick="playSong(song)" v-for="song of songs">
          <td>{{ song.trackNumber }}</td>
          <td>{{ song.title }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import db, {ISong} from '@/context/db';
  import Player from '@/context/Player';

  @Component({
    components: {
      // TrackList
    }
  }) export default class SongList extends Vue {
    songs: ISong[] = [];

    selectSong(song: ISong) {
      this.$store.commit('player/selectSong', song.file);
    }

    async playSong(song: ISong) {
      if (this.$store.state.settings.accessTokenDropbox) {
        this.selectSong(song);
        await Player.play(song);
      } else {
        this.$message.error('No Dropbox Access Token was found. Please reconnect to Dropbox storage again.');
      }
    }

    get selectedAlbum() {
      return this.$store.state.player.selectedAlbum;
    }

    get selectedSong() {
      return this.$store.state.player.selectedSong;
    }


    @Watch('selectedAlbum')
    async onPropertyChanged(value: string, oldValue: string) {
      console.log('CHANGED!', value, oldValue);

      console.log('A', this.$store.state.player.selectedAlbum);
      this.songs = await db.getSongsForArtistAndAlbum(this.$store.state.player.selectedArtist, this.$store.state.player.selectedAlbum);


      console.log(44455, this.songs);
    }
  }
</script>

<style scoped>

</style>
