<template>
  <div class="cmp-widget cmp-widget-song-list">
    <table>
      <thead>
        <tr>
          <th class="track">Track</th>
          <th class="name">Name</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="{active: song.file === playingSong, selected: song.file === selectedSong}" @click="selectSong(song)"
            @dblclick="playSong(song)" v-for="song of songs">
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

  @Component export default class SongList extends Vue {
    data() {
      return {
        selectedSong: null
      };
    }

    songs: ISong[] = [];

    selectSong(song: ISong) {
      this.$data.selectedSong = song.file;
    }

    async playSong(song: ISong) {
      if (this.$store.state.settings.accessTokenDropbox) {
        // if (!this.playingSong) {
          this.$store.commit('player/setShownProgress', true);
        // }

        this.$store.commit('player/selectSong', song.file);
        this.$store.commit('player/setSongTitle', song.title);

        await Player.play(song);
      } else {
        this.$message.error('No Dropbox Access Token was found. Please reconnect to Dropbox storage again.');
      }
    }

    get selectedAlbum() {
      return this.$store.state.player.selectedAlbum;
    }

    get playingSong() {
      return this.$store.state.player.selectedSong;
    }

    @Watch('selectedAlbum')
    async onPropertyChanged() {
      this.songs = await db.getSongsForArtistAndAlbum(this.$store.state.player.selectedArtist, this.$store.state.player.selectedAlbum);
    }
  }
</script>

<style lang="scss">
  .cmp-widget-song-list {
    display: flex;
    flex: 1;
    overflow: auto;

    .selected {
      background: rgba(255, 255, 255, 0.8);
    }

    table {
      width: 100%;

      thead {
        tr {
          height: 30px;
          line-height: 30px;
        }
      }

      tbody {
        tr {
          cursor: default;

          &:after {
            display: none;
          }

          td {
            padding: 5px 10px;
          }

          &:nth-child(even) {
            td {
              background: rgba(0, 0, 0, 0.1);
            }
          }
        }
      }
    }

    .track {
    }

    .name {

    }
  }
</style>
