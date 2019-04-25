<template>
  <div class="cmp-widget-install-pwa" v-if="ableToInstall">
    <div @click="installApplication()" class="install">Install Application</div>
    <!--    <span @click="toggleCollapse()" class="mdi mdi-16px mdi-menu padding-left toggle-button"></span>-->
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component export default class InstallPWA extends Vue {
    private deferredPrompt: Event | null = null;

    data() {
      return {
        ableToInstall: false
      };
    }

    installApplication() {
      this.deferredPrompt!.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt!.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }

          this.deferredPrompt = null;
        });
    }

    mounted() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();

        this.deferredPrompt = e;
        this.$data.ableToInstall = true;
      });

      window.addEventListener('appinstalled', (evt) => {
        console.log('a2hs', 'installed');
      });

      // console.log(window.matchMedia);

      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('display-mode is standalone');
      }
    }

    toggleCollapse() {
      this.$data.isCollapsed = !this.$data.isCollapsed;
    }
  }
</script>

<style lang="scss">
  .cmp-widget-install-pwa {
    position: fixed;
    top: 50%;
    left: 0px;
    z-index: 2;
    transform: rotate(-90deg);
    background: #8a2aafe0;
    transform-origin: 0 0;
    padding: 10px 30px;
    color: rgba(255, 255, 255, 0.66);
    font-size: 1.1vw;
    /* display: flex; */
    /* margin: auto; */
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    /* box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5); */
    cursor: pointer;
    transition: padding 0.3s;

    &:hover {
      padding-bottom: 20px;
    }

    .install {
      /*transform: rotate(90deg);*/
    }
  }
</style>
