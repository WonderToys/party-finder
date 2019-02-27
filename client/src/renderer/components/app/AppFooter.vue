<!-- template -->
<template>
  <div id="footerContainer">
    <img class="avatar" :src="avatarUrl" />
    <div id="userDetails">
      <span class="name">{{ user.name }}</span>
      <span class="discriminator">#{{ user.discriminator }}</span>
    </div>
    <el-button class="form-party" size="mini" type="primary" @click="isFormPartyDialogOpen = !isFormPartyDialogOpen">Form Party</el-button>
    <form-party-dialog :visible.sync="isFormPartyDialogOpen"></form-party-dialog>
  </div>
</template>
<!-- /template -->

<!-- style -->
<style lang="scss">
// footerContainer
#footerContainer {
  display: flex;
  align-items: center;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 6px;
    opacity: 0.8;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  #userDetails {
    flex: 1;

    span {
      display: block;
      color: white;

      &.name {
        font-size: 0.9rem;
      }

      &.discriminator {
        font-size: 0.7rem;
        opacity: 0.6;
      }
    }
  }
} //- footerContainer
</style>
<!-- /style -->

<!-- script -->
<script>
import { mapGetters, mapState } from 'vuex';

import FormPartyDialog from './party/FormPartyDialog.vue';

export default {
  components: { FormPartyDialog },
  props: [ 'user' ],
  data() {
    return {
      isFormPartyDialogOpen: false
    };
  },
  computed: {
    ...mapGetters({
      avatarUrl: 'user/avatarUrl'
    })
  }
};
</script>
<!-- /script -->