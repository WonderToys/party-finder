import request from 'request-promise-native'
import { remote } from 'electron';

// -----
//  State
// -----
const state = {
  user: null,
  token: null
};

// -----
//  Getters
// ----- 
const getters = {
  // avatarUrl()
  avatarUrl(state) {
    const provider = state.user.providers.find(p => p.source === 'discord');
    if ( provider != null ) {
      const profile = provider.profile;
      if ( profile.avatar ) {
        return `http://cdn.discordapp.com/avatars/${ profile.id }/${ profile.avatar }.png`;
      }
      else {
        return `http://cdn.discordapp.com/embed/avatars/${ profile.discriminator }.png`;
      }
    }

    return null;
  } //- avatarUrl()
};

// -----
//  Actions
// -----
const actions = {
  // initialize()
  initialize({ commit }) {
    commit('setToken', localStorage.getItem('token'));
    commit('setUser', JSON.parse(localStorage.getItem('user')));
  }, //- initialize()

  // verifyToken()
  async verifyToken(context, { token }) {
    const opts = {
      method: 'GET',
      uri: `${ remote.app.config.serverRootUri }/auth/verify`,
      headers: {
        Authorization: `Bearer ${ token }`
      }
    };

    return request(opts);
  } //- verifyToken()
};

// -----
//  Mutations
// -----
const mutations = {
  // setToken()
  setToken(state, token) {
    state.token = token;
  }, //- setToken()

  // setUser()
  setUser(state, user) {
    state.user = user;
  } //- setUser()
};

// Export
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};