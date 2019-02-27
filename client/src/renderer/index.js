import Vue from 'vue';
import VueApollo from 'vue-apollo';
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

import './scss/variables.scss';

import router from './router';
import store from './store';
import apollo from './apollo';

import AppLayout from './components/AppLayout.vue';

// Add Plugins
Vue.use(Element, { locale });
Vue.use(VueApollo);

// Create apolloProvider
const apolloProvider = new VueApollo({ defaultClient: apollo });

// Instantiate Vue
new Vue({
  el: '#app',
  template: '<AppLayout />',
  components: { AppLayout },
  router,
  store,
  apolloProvider
});