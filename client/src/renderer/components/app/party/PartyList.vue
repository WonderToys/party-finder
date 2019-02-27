<!-- template -->
<template>
  <div id="partyListContainer">
    <div id="searchBoxContainer">
      <el-select placeholder="Filter by game ..."
                 size="small"
                 v-model="selectedGame"
                 :loading="findingGames"
                 :remote-method="searchGames"
                 filterable remote reserve-keyword>
        <el-option v-for="option in gameList"
                   :key="option.key"
                   :label="option.name"
                   :value="option.key"/>
      </el-select>

    </div>
  </div>
</template>
<!-- /template -->

<!-- style -->
<style lang="scss">
#partyListContainer {
  padding: 12px;

  .el-select {
    width: 100%;
  }
}
</style>
<!-- /style -->

<!-- script -->
<script>
export default {
  data() {
    return {
      findingGames: false,
      selectedGame: '',
      gameList: []
    };
  },
  methods: {
    // searchGames()
    async searchGames(query) {
      if ( !query || query.trim().length < 3 ) {
        this.gameList = [];
        return;
      }

      this.findingGames = true;

      const list = await this.$store.dispatch('party/searchGames', query);
      this.gameList = list;

      this.findingGames = false;
    } //- searchGames()
  }
};
</script>
<!-- /script -->