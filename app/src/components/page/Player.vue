<template>
  <div class="cmp-page cmp-page-player pane-group">
    <div class="window">
      <header class="toolbar toolbar-header">
        <h1 class="title">ⓑoxAudio 🎶</h1>

        <Controls />
      </header>

      <section class="window-content">
        <div class="pane pane-sm sidebar">
          <ArtistList />
        </div>

        <div class="pane pane-sm sidebar">
          <AlbumList />
        </div>

        <div class="pane">
          <SongList />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import ArtistList from '../widget/ArtistList.vue';
  import AlbumList from '../widget/AlbumList.vue';
  import SongList from '../widget/SongList.vue';
  import Controls from '../widget/Controls.vue';

  @Component({
    components: {
      ArtistList,
      AlbumList,
      SongList,
      Controls
    }
  }) export default class Player extends Vue {
    mounted() {
      this.$store.commit('main/setLoading', false);
    }
  }
</script>

<style lang="scss">

</style>
