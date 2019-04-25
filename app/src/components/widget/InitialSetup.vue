<template>
  <div class="cmp-widget cmp-widget-initial-setup">
    <div class="wrapper">
      <div class="no-storage-no-db" v-if="!isDropboxTokenPresented">
        <button @click="connectStorage()" class="button primary">Connect Dropbox</button>
      </div>

      <div class="no-db" v-else-if="!isDBPopulated">
        <div class="text">
          <p>You have to put all your songs in
            <a class="select" href="https://www.dropbox.com/home/Apps/boxAudio" target="_blank">/Apps/boxAudio</a>
            folder.
          </p>
          <p>After you done it, you can start scanning your library.</p>
        </div>

        <button :disabled="isScanInProgress" @click="startLibraryProcess()" class="button primary">Scan Library
        </button>

        <LibraryProcess ref="LibraryProcess" v-show="isScanInProgress" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import dropboxConnect from './Storage/Dropbox/Connect';

  import LibraryProcess from './LibraryProcess.vue';

  @Component({
    components: {
      LibraryProcess
    }
  }) export default class InitialSetup extends Vue {
    get isScanInProgress() {
      return this.$store.state.libraryProcessing.isScanInProgress;
    }

    get isDropboxTokenPresented(): boolean {
      return !!this.$store.state.settings.accessTokenDropbox;
    }

    get isDBPopulated() {
      return this.$store.state.settings.isDBPopulated;
    }

    @Watch('isScanInProgress')
    async isScanInProgressChanged() {
      await this.$store.dispatch('settings/updateIsDBPopulated');
    }

    @Watch('isDBPopulated')
    async isDBPopulatedChanged() {
      if (this.isDBPopulated) this.$router.push({name: 'player'});
    }

    connectStorage() {
      dropboxConnect.connect();
    }

    startLibraryProcess() {
      const libraryProcessCmp = this.$refs.LibraryProcess as any; //FIXME: why LibraryProcess doesn't work?
      libraryProcessCmp.start();
    }

    async created() {
      await this.$store.dispatch('settings/updateIsDBPopulated');

      if (this.isDBPopulated) {
        this.$router.push({name: 'player'});
      } else {
        this.$store.commit('main/setLoading', false);
      }
    }
  }
</script>

<style lang="scss">
  .cmp-widget-initial-setup {
    width: 100%;
    height: 100%;

    font-size: calc(0.7vw + 2.5vh + 0.5vmin);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .wrapper {
      text-align: center;
    }

    p {
      color: #fff;
      margin: 10px 0;
    }

    .button.primary {
      display: block;
      margin: 30px auto;
    }
  }
</style>
