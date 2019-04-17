<template>
  <h1>Redirecting back...</h1>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import store from '@/stores/index';

  @Component export default class Dropbox extends Vue {
    mounted() {
      const accessTokenDropbox = new URLSearchParams(window.location.hash.replace('#', '')).get('access_token');

      window.opener.postMessage({
        accessTokenDropbox
      }, window.location.origin);

      window.close();
    }
  }
</script>

<style scoped>

</style>
