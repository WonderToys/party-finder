import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import user from './modules/user';
import party from './modules/party';

// Store
const store = new Vuex.Store({
  modules: {
    user,
    party
  }
});

store.subscribe((mutation, state) => {
  switch ( mutation.type ) {
    case 'user/setToken': {
      if ( mutation.payload == null ) {
        localStorage.removeItem('token');
      }
      else {
        localStorage.setItem('token', mutation.payload);
      }
      break;
    }
    case 'user/setUser': {
      if ( mutation.payload == null ) {
        localStorage.removeItem('user');
      }
      else {
        localStorage.setItem('user', JSON.stringify(mutation.payload));
      }
      break;
    }
  }
});

// Exports
export default store;