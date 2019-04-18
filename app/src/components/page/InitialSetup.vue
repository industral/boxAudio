<template>
  <div class="cmp-page cmp-page-initial-setup">
    <ConnectStorage />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import ConnectStorage from '../widget/ConnectStorage.vue';

  @Component({
    components: {
      ConnectStorage
    }
  }) export default class InitialSetup extends Vue {

  }
</script>

<style lang="scss">
  .cmp-page-initial-setup {
    width: 100%;
  }
</style>
