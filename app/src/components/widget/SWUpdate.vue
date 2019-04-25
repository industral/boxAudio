<template>
  <div class="cmp-widget-sw-update" v-show="isNewUpdate">
    <div class="icon" ref="icon"></div>
    <h3>New update is available</h3>
    <span :class="['install', {'not-started': !isUpdateInProgress}]" @click="installUpdate()">{{ updateText }}</span>
  </div>
</template>

<script lang="ts">
  import lottie from 'lottie-web';
  import {Component, Vue} from 'vue-property-decorator';

  import icon from '@/assets/icons/gears.json';

  enum UpdateStatus {
    Update,
    Updating,
    Reloading
  }

  @Component export default class InstallPWA extends Vue {
    private iconGears;
    private updateTextMap = {
      [UpdateStatus.Update]: 'Update',
      [UpdateStatus.Updating]: 'Updating...',
      [UpdateStatus.Reloading]: 'Reloading...',
    };

    data() {
      return {
        isNewUpdate: false,
        currentUpdateStatus: UpdateStatus.Update
      };
    }

    get updateText() {
      return this.$data.updateTextMap[this.$data.currentUpdateStatus];
    }

    get isUpdateInProgress() {
      return this.$data.currentUpdateStatus !== UpdateStatus.Update;
    }

    async installUpdate() {
      if (this.isUpdateInProgress) return;

      this.updateStatus(UpdateStatus.Updating);
      this.iconGears.play();

      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration && registration.waiting) {
          return registration.waiting.postMessage({
            type: 'worker',
            action: 'skip-waiting'
          });
        }
      }

      this.$message.error(`Can't send message to service worker`);
      this.updateStatus(UpdateStatus.Update);
      this.iconGears.pause();
    }

    updateStatus(status: UpdateStatus) {
      this.$data.currentUpdateStatus = status;

      switch (status) {
        case UpdateStatus.Update:
          break;
        case UpdateStatus.Updating:
        case UpdateStatus.Reloading:
          break;
      }
    }

    mounted() {
      window.addEventListener('message', (message) => {
        if (message.data && message.data.type === 'worker') {
          this.$data.isNewUpdate = message.data.action === 'updated';

          Vue.nextTick(() => {
            this.iconGears = lottie.loadAnimation({
              container: this.$refs.icon,
              renderer: 'canvas',
              loop: true,
              autoplay: false,
              animationData: icon
            });
          });
        }
      });

      navigator.serviceWorker.addEventListener('message', (message) => {
        if (message.data && message.data.type === 'worker') {
          if (message.data.message === 'activated') {
            this.updateStatus(UpdateStatus.Reloading);

            Vue.nextTick(() => {
              location.reload();
            });
          }
        }
      });
    }
  }
</script>

<style lang="scss">
  .cmp-widget-sw-update {
    position: absolute;
    top: 0;
    left: calc(50% - 100px);
    z-index: 2;
    padding: 5px 30px;
    background: #6eb4f7;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    text-align: center;
    display: flex;
    align-items: center;
    cursor: default;

    .icon {
      width: 32px;
      height: 32px;
      margin: 0 10px 0 0;
    }

    h3 {
    }

    .install {
      margin: 0 0 0 10px;

      &.not-started {
        text-decoration: underline;
        color: blue;
        cursor: pointer;
      }
    }
  }
</style>
