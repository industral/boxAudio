<template>
  <h1>Redirecting back...</h1>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

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
