<template>
  <div class="cmp-widget cmp-widget-connect-storage">
    <div class="no-storage-no-db" v-if="noConnectStorageNoDB">
      <h1>Initial setup</h1>
      <div class="description">Welcome! Looks like it's your first time, and before you can start you have to connect
        Dropbox storage first
      </div>

      <el-button @click="connectStorage()" type="primary">Connect Dropbox</el-button>
    </div>

    <div class="no-storage-no-db" v-else-if="!isDropboxTokenPresented && isDBPopulated">
      <h1>Re-connect to Dropbox</h1>
      <div class="description">We can't find you Dropbox access key. Please reconnect to Dropbox</div>

      <el-button @click="connectStorage()" type="primary">Connect Dropbox</el-button>
    </div>

    <div class="no-db" v-else-if="!isDBPopulated">
      <h1>Scan library</h1>
      <div class="description">
        You have to put all your songs in <a class="link" href="https://www.dropbox.com/home/Apps/BoxAudio"
                                             target="_blank">/Apps/BoxAudio</a> folder.
        After you done it, you can start scanning your library.
      </div>

      <el-button :loading="isScanInProgress" @click="startLibraryProcess()" type="primary">Scan Library</el-button>

      <LibraryProcess ref="LibraryProcess" v-show="isScanInProgress" />
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
  }) export default class ConnectStorage extends Vue {
    get isScanInProgress() {
      return this.$store.state.libraryProcessing.isScanInProgress;
    }

    get isDropboxTokenPresented(): boolean {
      return !!this.$store.state.settings.accessTokenDropbox;
    }

    get isDBPopulated() {
      return this.$store.state.settings.isDBPopulated;
    }

    get noConnectStorageNoDB() {
      return !this.isDropboxTokenPresented && !this.isDBPopulated;
    }

    @Watch('isScanInProgress')
    async isScanInProgressChanged(value: string, oldValue: string) {
      await this.$store.dispatch('settings/updateIsDBPopulated');
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
    }
  }
</script>

<style lang="scss">
  .cmp-widget-connect-storage {
    width: 100%;

    .no-storage-no-db,
    .no-db {
      text-align: center;

      .description {
        font-size: 20px;
        margin: 20px 0 100px 0;
      }

      .el-button--primary {
        width: 200px;
        height: 50px;
        font-size: 18px;
        margin: 20px 0;
        cursor: pointer;
      }
    }

    .link {
      font-weight: bold;
      cursor: pointer;
      color: dodgerblue;
      text-decoration: none;
    }

    .cmp-widget-library-process {
      width: 700px;
      margin: 50px auto 0;
    }
  }
</style>
