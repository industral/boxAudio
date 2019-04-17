<template>
  <div class="cmp-page cmp-page-initial-setup pane-group" v-loading="isLoading">
    <div class="wrapper" v-show="!isLoading">
      <ConnectStorage v-if="showConnectStorageComponent" />
      <Player v-else />
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import Player from './Player.vue';
  import ConnectStorage from './InitialSetup.vue';

  @Component({
    components: {
      Player,
      ConnectStorage
    }
  }) export default class Main extends Vue {
    data() {
      return {
        isLoading: true
      };
    }

    get isDropboxTokenPresent(): boolean {
      return !!this.$store.state.settings.accessTokenDropbox;
    }

    get isDBPopulated() {
      return this.$store.state.settings.isDBPopulated;
    }

    get showConnectStorageComponent() {
      return !this.isDropboxTokenPresent || !this.isDBPopulated;
    }

    async created() {
      await this.$store.dispatch('settings/updateIsDBPopulated');
      this.$data.isLoading = false;
    }
  }
</script>

<style lang="scss">
  .cmp-page-initial-setup {
    .wrapper {
      width: 100%;
    }
  }
</style>
