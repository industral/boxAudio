<template>
  <div class="cmp-component cmp-component-background">
    <div class="mask"></div>
    <img alt="Background image" ref="img" src="/img/backgrounds/2-preview.jpg" :class="[{loaded: isLoaded}]"/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component export default class Background extends Vue {
    data() {
      return {
        isLoaded: false
      }
    }

    created() {
      const image = new Image();

      image.onload = () => {
        this.$refs.img.src = '/img/backgrounds/2-800.jpg';
        this.$data.isLoaded = true;
      };

      image.src = '/img/backgrounds/2-800.jpg';
    }
  }
</script>

<style lang="scss">
  .cmp-component-background {
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(to right, #e0460be0, #0014ffa3);
      /*opacity: 0.3;*/
      z-index: 1;
    }

    img {
      width: 100vw;
      height: 100vh;
      position: fixed;
      z-index: 0;
      filter: blur(5px);

      &.loaded {
        filter: none;
      }
    }
  }
</style>
