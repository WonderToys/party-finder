<!-- template -->
<template>
  <div id="titleBar">
    <div class="title-text">Party Finder</div>
    <div class="title-buttons">
      <i class="el-icon-minus" @click="minimize"></i>
      <i class="el-icon-close" @click="close"></i>
    </div>
  </div>
</template>
<!-- /template -->

<!-- style -->
<style lang="scss">
@import '../scss/variables.scss';

#titleBar {
  background-color: $indigo;
  height: 28px;
  padding: 0px 10px 0px 12px;
  display: flex;
  align-items: center;
  -webkit-user-select: none;

  .title-text {
    vertical-align: middle;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.9rem;
    font-weight: 500;
    flex: 1;
    -webkit-app-region: drag;
  }

  .title-buttons {
    margin: 0 auto;

    > i {
      color: rgba(255, 255, 255, 0.5);
      padding: 2px;

      &:hover {
        font-weight: 500;
        border-radius: 2px;
        color: rgba(255, 255, 255, 1);

        &.el-icon-close {
          background: $crimson;
        }

        &.el-icon-minus {
          background: rgba(255, 255, 255, 0.25);
        }
      }
    }
  }
}
</style>
<!-- /style -->

<!-- script -->
<script>
import { remote } from 'electron';

export default {
  computed: {
    currentWindow() {
      return remote.getCurrentWindow();
    }
  },
  methods: {
    minimize() {
      this.currentWindow.minimize();
    },
    close() {
      this.currentWindow.close();
    }
  }
}
</script>
<!-- /script -->