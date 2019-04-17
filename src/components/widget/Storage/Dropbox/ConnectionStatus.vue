<template>
  <div :title="title" class="cmp-widget cmp-widget-storage-dropbox-connection-status">
    <div :class="{ok: isDropboxTokenPresented}" @click="handleConnectStorageClick()" class="icon icon-dropbox"></div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import dropboxConnect from '@/components/widget/Storage/Dropbox/Connect';

  @Component export default class ConnectionStatus extends Vue {
    get isDropboxTokenPresented(): boolean {
      return !!this.$store.state.settings.accessTokenDropbox;
    }

    get title() {
      return this.isDropboxTokenPresented ? 'Connected to Dropbox' : `Isn't connected to Dropbox`;
    }

    connectStorage() {
      dropboxConnect.connect();
    }

    handleConnectStorageClick() {
      if (!this.isDropboxTokenPresented) {
        this.connectStorage();
      }
    }
  }
</script>

<style lang="scss">
  .cmp-widget-storage-dropbox-connection-status {
    .icon {
      font-size: 22px;
      cursor: pointer;

      &.ok {
        color: dodgerblue;
      }
    }
  }
</style>
