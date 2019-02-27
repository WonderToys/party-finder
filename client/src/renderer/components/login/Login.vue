<!-- template -->
<template>
  <div id="loginContainer">
    <el-button type="primary" class="discord-button" @click="login" :loading="isLoggingIn">
      <div>
        <img src="../../images/discord-logo.svg" />
        <span>Login with Discord</span>
      </div>
    </el-button>
  </div>
</template>
<!-- /template -->

<!-- style -->
<style lang="scss">
$discord-color: #7289DA;

#loginContainer {
  display: flex; 
  align-items: center; 
  justify-content: center; 
  height: 452px; 

  .discord-button {
    background-color: $discord-color;
    border-color: $discord-color;
    
    > span div {
      display: flex; 
      align-items: center;

      img {
        height: 32px;
        display: inline-block;
        margin-right: 4px;
      }

      span {
        font-size: 1.1rem;
        font-weight: 500;
      }
    }

    &:hover {
      background-color: lighten($discord-color, 5%);
      border-color: lighten($discord-color, 5%);
    }
  }
}
</style>
<!-- /style -->

<!-- script -->
<script>
import { mapState } from 'vuex';
import { ipcRenderer } from 'electron';

export default {
  data() {
    return {
      isLoggingIn: false
    }
  },
  computed: {
    ...mapState('user', [ 'token', 'user' ])
  },
  methods: {
    login() {
      this.isLoggingIn = true;

      ipcRenderer.send('discord-auth');

      // Auth canceled
      ipcRenderer.on('auth-canceled', () => {
        this.isLoggingIn = false;
      });

      // Auth failed
      ipcRenderer.on('auth-failed', () => {
        this.isLoggingIn = false;
      });

      // Auth successful
      ipcRenderer.once('discord-auth', (event, { user, token }) => {
        this.$store.commit('user/setToken', token);
        this.$store.commit('user/setUser', user);

        this.isLoggingIn = false;

        this.$router.push({ name: 'app' });
      });
    }
  },

  // Lifecycle
  mounted() {
    this.$store.dispatch('user/initialize');

    if ( this.token != null && this.user != null ) {
      this.$router.push({ name: 'app' });
    }
  }
};
</script>
<!-- /script -->