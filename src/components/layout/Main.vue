<template>
  <div class="cmp-layout">
    <MainPage />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import MainPage from '../page/Main.vue';

  @Component({
    components: {
      MainPage
    }
  }) export default class Main extends Vue {

  }
</script>

<style scoped>

</style>
