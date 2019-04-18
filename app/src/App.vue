<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component export default class App extends Vue {
    mounted() {
      navigator.serviceWorker.addEventListener('message', (message) => {
        if (message.data && message.data.type === 'error') {
          this.$message.error(message.data.message);
        }
      });

      window.addEventListener('message', (message) => {
        if (message.data && message.data.type === 'error') {
          this.$message.error(message.data.message);
        }

        if (message.data && message.data.accessTokenDropbox) {
          this.$store.commit('settings/setAccessTokenDropbox', message.data.accessTokenDropbox);
        }
      });
    }
  }
</script>

<style lang="scss">
</style>
