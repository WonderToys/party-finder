<!-- template -->
<template>
  <div id="window">
    <title-bar></title-bar>
    <main>
        <router-view></router-view>
    </main>
  </div>
</template>
<!-- /template -->

<!-- style -->
<style lang="scss" src="../scss/app-layout.scss"></style>
<!-- /style -->

<!-- script -->
<script>
import TitleBar from './TitleBar.vue';

export default {
  components: { TitleBar }
};
</script>
<!-- /script -->