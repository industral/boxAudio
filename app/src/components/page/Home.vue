<template>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component export default class Main extends Vue {
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

      if (this.showConnectStorageComponent) {
        this.$router.push({name: 'welcome'});
      } else {
        this.$router.push({name: 'player'});
      }
    }
  }
</script>
