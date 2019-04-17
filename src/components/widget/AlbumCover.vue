<template>
  <div class="cmp-widget cmp-widget-album-cover">
    <ul>
      <li v-for="album of albums">
        <img :alt="`${album.name} cover`" :src="getCoverImg(album.cover)" class="media-object pull-left" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import utils from '@/assets/scripts/utils';

  // import TrackList from './TrackList.vue';

  @Component({
    props: {
      albums: {
        type: Array,
        default: []
      }
    },
    components: {
      // TrackList
    }
  }) export default class AlbumCover extends Vue {
    getCoverImg(cover: [] = []) {
      console.log('cover', cover);
      return utils.getURLFromArrayBuffer(cover[0]);
    }
  }
</script>

<style lang="scss">
  .cmp-widget-album-cover {
    li {
      display: inline-block;
    }
  }
</style>
