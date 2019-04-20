<template>
  <div class="cmp-component cmp-component-loader">
    <div class="loading-logo-wrapper" v-show="isLoading">
      <img alt="Loading..." class="ld ld-rubber" height="100" src="/img/logo.png" width="100" />
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    props: {
      isLoading: {
        type: Boolean,
        default: true
      }
    }
  }) export default class Loader extends Vue {
  }
</script>

<style lang="scss">
  .cmp-component-loader {
  }
</style>
