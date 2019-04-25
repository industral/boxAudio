<template>
  <div id="app">
    <Background />
    <Loader :isLoading="isLoading" />
    <router-view />
    <InstallPWA />
    <SWUpdate />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import Loader from '@/components/component/Loader.vue';
  import Background from '@/components/component/Background.vue';
  import InstallPWA from '@/components/widget/InstallPWA.vue';
  import SWUpdate from '@/components/widget/SWUpdate.vue';

  @Component({
    components: {
      Loader,
      Background,
      InstallPWA,
      SWUpdate
    }
  }) export default class App extends Vue {
    get isLoading() {
      return this.$store.state.main.isLoading;
    }

    mounted() {
      navigator.serviceWorker.addEventListener('message', (message) => {
        if (message.data && message.data.type === 'error') {
          this.$message.error(message.data.message);
        }

        if (message.data && message.data.type === 'worker') {
          if (message.data.message === 'activated') {
            location.reload();
          }
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
  #app {
    .cmp-page {
      width: 100vw;
      height: 100vh;
      padding: 5vw;
      position: relative;
      z-index: 2;
      box-sizing: border-box;
    }
  }
</style>
