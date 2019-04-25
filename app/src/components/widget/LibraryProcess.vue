<template>
  <div class="cmp-widget cmp-widget-library-process">
    <div class="progress-wrapper">
      <progress min="0" max="100" :value="processedPercentage"></progress>
<!--      <el-progress :percentage="processedPercentage" :stroke-width="18" :text-inside="true"></el-progress>-->
<!--      <span @click="stop()" class="mdi mdi-16px mdi-close-circle-outline padding-left button-cancel"-->
<!--            v-if="isScanInProgress"></span>-->
    </div>

<!--    <div class="logs">-->
<!--      <ol>-->
<!--        <li v-for="log of logs">-->
<!--          <div class="message">{{ log.message }}</div>-->
<!--          &lt;!&ndash;          <div class="message-long" v-if="log.messageLong">{{ log.messageLong }}</div>&ndash;&gt;-->
<!--        </li>-->
<!--      </ol>-->
<!--    </div>-->
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import DropboxProcess from './Storage/Dropbox/Process';
  import {ILog} from '@/stores/modules/library-processing';

  @Component export default class LibraryProcess extends Vue {
    private dropboxProcess!: DropboxProcess;

    get logs(): ILog[] {
      return this.$store.state.libraryProcessing.logs;
    }

    get processedPercentage() {
      const processedFiles = this.$store.state.libraryProcessing.processedFiles;

      if (!processedFiles) return 0;
      return parseInt(100 / (this.$store.state.libraryProcessing.files / processedFiles), 10);
    }

    get isScanInProgress() {
      return this.$store.state.libraryProcessing.isScanInProgress;
    }

    async start() {
      this.dropboxProcess = new DropboxProcess();
      await this.dropboxProcess.start();
    }

    stop() {
    }
  }
</script>

<style lang="scss">
  .cmp-widget-library-process {
    .logs {
      font-size: 0.8vw;
      margin: 20px 0;
      height: 100px;
      overflow: hidden;
      text-align: left;
      display: flex;
      flex-direction: column-reverse;
      position: relative;
      padding: 10px;
      color: #fff;

      &:after {
        content: '';
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        position: absolute;
        top: 4px;
        left: 4px;
        box-shadow: 1px 1px 200px inset #000;
        filter: blur(6px);
        z-index: 0;
      }

      ol {
        white-space: pre;

        .message {
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
          width: 700px;
          overflow: hidden;
        }
      }
    }

    .progress-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-progress {
        width: 100%;
      }

      .button-cancel {
        color: #f56c6c;
        cursor: pointer;
        line-height: 18px;
      }
    }
  }
</style>
