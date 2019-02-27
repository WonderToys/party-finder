<!-- template -->
<template>
  <div id="appContainer">
    <div id="content">
      <router-view></router-view>
    </div>
    <div id="footer">
      <app-footer :user="user"></app-footer>
    </div>
  </div>
</template>
<!-- /template -->

<!-- style -->
<style lang="scss">
@import '../../scss/variables.scss';

#appContainer {
  #content {
    position: absolute;
    bottom: 48px;
    left: 0px; right: 0px;
    top: 0px;
  }

  #footer {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 48px;
    padding: 8px 16px;
    box-sizing: border-box;
    background-color: darken($ultramarine, 3%);
    border-top: 1px solid lighten($ultramarine, 1%);
  }
}
</style>
<!-- /style -->

<!-- script -->
<script>
import { mapState } from 'vuex';

import AppFooter from './AppFooter.vue';

export default {
  components: { AppFooter },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      token: (state) => state.user.token
    })
  },

  async mounted() {
    try {
      const response = await this.$store.dispatch('user/verifyToken', { token: this.token });

      const parsed = JSON.parse(response);
      this.$store.commit('user/setUser', parsed.user);
    }
    catch ( error ) {
      this.$store.commit('user/setToken', null);
      this.$store.commit('user/setUser', null);

      this.$router.push({ name: 'login' });
    }
  }
};
</script>
<!-- /script -->