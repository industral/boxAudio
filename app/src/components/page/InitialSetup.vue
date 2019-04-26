<template>
  <div class="cmp-page cmp-page-initial-setup">
    <InitialSetupWidget />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import InitialSetupWidget from '../widget/InitialSetup.vue';

  @Component({
    components: {
      InitialSetupWidget
    }
  }) export default class InitialSetup extends Vue {

  }
</script>

<style lang="scss">
  html[data-page-name='initialSetup'] {
    .cmp-component-background {
      .mask {
        display: block;
      }
    }
  }

  .cmp-page-initial-setup {
    width: 100%;
  }
</style>
