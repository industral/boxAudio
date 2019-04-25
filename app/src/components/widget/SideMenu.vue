<template>
  <div :class="['cmp-widget-site-menu', {collapsed: isCollapsed}]">
    <header>
      <img alt="boxAudio logo" class="logo" src="/img/logo.png" />
    </header>

    <div class="menu">
      <ul>
        <li>Library</li>
        <li>Setup</li>
      </ul>
    </div>

    <span @click="toggleCollapse()" class="mdi mdi-16px mdi-menu padding-left toggle-button"></span>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component export default class SideMenu extends Vue {
    data() {
      return {
        isCollapsed: false
      };
    }

    toggleCollapse() {
      this.$data.isCollapsed = !this.$data.isCollapsed;
    }
  }
</script>

<style lang="scss">
  .cmp-widget-site-menu {
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: inset 0 0 0 2000px rgba(255, 255, 255, .1);
      border-top-left-radius: 9px;
      border-bottom-left-radius: 9px;
    }

    &.collapsed {
      padding-right: 0;
      padding-left: 0;

      header, .menu {
        opacity: 0;
        width: 50px;
      }
    }

    .toggle-button {
      position: absolute;
      right: 5px;
      top: 15px;
      font-size: 32px;
      color: blueviolet;
      cursor: pointer;
      z-index: 1;
    }

    position: relative;
    height: 100%;
    padding: 20px 10px 10px 40px;
    box-sizing: border-box;

    header,
    .menu {
      position: relative;
      z-index: 1;
      opacity: 1;
      transition: all 0.1s;
      width: 240px;
    }

    header {
      .logo {
        width: 64px;
      }
    }

    .menu {
      margin: 40px 0 0 0;

      ul {
        li {
          margin: 30px 0;
        }
      }
    }
  }
</style>
