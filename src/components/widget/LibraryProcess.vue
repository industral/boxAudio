<template>
  <div class="cmp-widget cmp-widget-library-process">
    <div class="progress-wrapper">
      <el-progress :percentage="processedPercentage" :stroke-width="18" :text-inside="true"></el-progress>
      <span @click="stop()" class="mdi mdi-16px mdi-close-circle-outline padding-left button-cancel"
            v-if="isScanInProgress"></span>
    </div>

    <div class="logs">
      <ol>
        <li v-for="log of logs">
          <div class="message">{{ log.message }}</div>
          <!--          <div class="message-long" v-if="log.messageLong">{{ log.messageLong }}</div>-->
        </li>
      </ol>
    </div>
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
      // this.$data.isShown = true;
      // console.log('started...');

      this.dropboxProcess = new DropboxProcess();
      await this.dropboxProcess.start();
    }

    stop() {
      // console.log('stopping...');
      // this.$data.isShown = false;
    }
  }
</script>

<style lang="scss">
  .cmp-widget-library-process {
    .logs {
      font-family: Menlo;
      margin: 20px 0;
      height: 100px;
      overflow: hidden;
      text-align: left;

      display: flex;
      flex-direction: column-reverse;
      /*align-items: flex-end;*/

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
