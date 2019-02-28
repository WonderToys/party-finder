<!-- template -->
<template>
  <el-dialog id="formPartyDialog"
             :visible.sync="isVisible"
             :modal="true"
             title="Form a party">


    <!-- pane0 -->
    <div id="pane0" key="0" v-if="currentPane === 0">
        <div class="el-form-item last is-required">
          <el-select placeholder="* Pick a game ..."
                    size="small"
                    v-model="selectedGame"
                    :loading="findingGames"
                    :remote-method="searchGames"
                    filterable remote reserve-keyword>
            <el-option v-for="option in gameList"
                      :key="option.key"
                      :label="option.name"
                      :value="option.key" />
          </el-select>
        </div>
    </div> <!-- /pane0 -->

    <!-- pane1 -->
    <div id="pane1" key="1" v-if="currentPane === 1">
      <div class="el-form-item is-required">
        <el-input type="text"
                  v-model="partyInfo.gameSettings.ign"
                  placeholder="* What's your name/id/etc in game?"
                  size="small" />
      </div>
        
      <div class="el-form-item" :class="{ last: !shouldShowRankInput}">
        <el-select id="gsSkillLevel"
                  size="small"
                  v-model="partyInfo.gameSettings.skillLevel"
                  placeholder="* And your skill level?">
          <el-option key="newbie" value="newbie" label="Newbie" />
          <el-option key="bad" value="bad" label="Bad" />
          <el-option key="decent" value="decent" label="Decent" />
          <el-option key="good" value="good" label="Good" />
          <el-option key="great" value="great" label="Great" />
          <el-option key="expert" value="expert" label="Expert" />
        </el-select>
      </div>

      <div class="el-form-item last" v-if="shouldShowRankInput">
        <el-input type="text"
                  size="small"
                  v-model="partyInfo.gameSettings.rank"
                  placeholder="Your rank/rating/etc in game?" />
      </div>
    </div> <!-- /pane1 -->

    <!-- pane2 -->
    <div id="pane2" key="2" v-if="currentPane === 2">
      <div class="el-form-item">
        <label class="el-form-item__label">How many more?</label>
        <div class="el-form-item__content">
          <el-input-number :min="1"
                           v-model="partyInfo.numPlayers"
                           size="mini" />
        </div>
      </div>

      <div class="el-form-item">
        <el-switch v-model="partyInfo.isCompetitive"
                   active-text="Competitive play"
                   inactive-text="Casual play" />
      </div>
    </div> <!-- /pane2 -->

    <!-- footer -->
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="danger" @click="isVisible = false">Cancel</el-button>
      <el-button-group>
        <el-button size="mini" type="primary" icon="el-icon-arrow-left" :disabled="!canGoBack()" @click="back">Back</el-button>
        <el-button size="mini" type="primary" :disabled="!canGoNext()" @click="next">
          Next
          <i class="el-icon-arrow-right" />
        </el-button>
      </el-button-group>
    </span>
  </el-dialog>
</template>
<!-- /template -->

<!-- style -->
<style lang="scss">
@import '../../../scss/variables.scss';

#formPartyDialog {
  .el-select {
    width: 100%;
  }

  label, .el-switch__label {
    color: rgba(255, 255, 255, 0.6);

    &.is-active {
      color: lighten($indigo, 40%);
    }
  }

  button[disabled], span.is-disabled {
    cursor: default;
  }

  .el-form-item {
    margin-bottom: 11px;

    &.last {
      margin-bottom: 0px;
    }
  }
}
</style>
<!-- /style -->

<!-- script -->
<script>
export default {
  props: [ 'visible' ],
  // data
  data() {
    return {
      currentPane: 0,
      selectedGame: '',
      findingGames: false,
      gameList: [],
      partyInfo: {
        gameId: null,
        gameName: null,
        numPlayers: 1,
        allowAutoJoin: false,
        skillLevel: null,
        isCompetitive: false,
        gameSettings: {
          ign: null,
          skillLevel: null,
          rank: null
        }
      }
    };
  }, //- data

  // computed
  computed: {
    isVisible: {
      get() { return this.visible },
      set(value) {
        this.$emit('update:visible', value);
      }
    },
    shouldShowRankInput() {
      const gameSettings = this.partyInfo.gameSettings;
      return gameSettings.skillLevel != null && gameSettings.skillLevel !== 'newbie';
    }
  }, //- computed

  // watch
  watch: {
    selectedGame(newValue) {
      const gameInfo = this.gameList.find(g => g.key === newValue);
      if ( gameInfo != null ) {
        this.partyInfo.gameId = newValue;
        this.partyInfo.gameName = gameInfo.name;
      }
      else {
        this.partyInfo.gameId = null;
        this.partyInfo.gameName = null;
      }
    }
  }, //- watch

  // methods
  methods: {
    // pane validations
    validatePane0() {
      return this.partyInfo.gameId != null && this.partyInfo.gameName != null;
    },
    validatePane1() {
      return (this.partyInfo.gameSettings.ign != null && this.partyInfo.gameSettings.ign.trim().length > 0) &&
             (this.partyInfo.gameSettings.skillLevel != null && this.partyInfo.gameSettings.skillLevel.length > 0 );
    },
    validatePane2() {
      return false;
    },
    //- pane validations
    
    canGoBack() {
      return this.currentPane !== 0;
    },
    canGoNext() {
      const validationFunction = this[`validatePane${ this.currentPane }`];
      if ( typeof(validationFunction) === 'function' ) {
        return validationFunction();
      }

      return true;
    },

    back() {
      this.currentPane -= 1;
    },
    next() {
      this.currentPane += 1;
    },

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
  } //- methods
};
</script>
<!-- /script -->