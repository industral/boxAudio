<template>
  <div class="cmp-page cmp-page-welcome">
    <div class="wrapper">
      <div class="text">
        <p>Welcome! <a href="https://boxAudio.app" class="select" title="boxAudio Home Page">boxAudio</a> allows you to stream your audio library directly from <a
            class="select" href="https://dropbox.com" rel="nofollow">Dropbox</a>.
        </p>
        <p>No registration is required. Application completely stand-alone.</p>
      </div>

      <button @click="next()" class="button primary">Continue</button>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ConnectStorage from '../widget/InitialSetup.vue';

  @Component({
    components: {
      ConnectStorage
    }
  }) export default class InitialSetup extends Vue {
    next() {
      this.$router.push({name: 'initialSetup'});
    }

    mounted() {
      this.$store.commit('main/setLoading', false);
    }
  }
</script>

<style lang="scss">
  html[data-page-name='welcome'] {
    .cmp-component-background {
      .mask {
        display: block;
      }
    }
  }

  .cmp-page-welcome {
    width: 100%;
    font-size: calc(0.7vw + 2.5vh + 0.5vmin);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .wrapper {
      text-align: center;
    }

    p {
      color: #fff;
      margin: 10px 0;
    }

    .button.primary {
      margin: 20px 0;
    }
  }
</style>
