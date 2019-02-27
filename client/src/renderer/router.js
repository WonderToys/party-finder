import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from './components/login/Login.vue';
import App from './components/app/App.vue';
import PartyList from './components/app/party/PartyList.vue';

Vue.use(VueRouter);

// Exports
export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    // App
    {
      path: '/app',
      name: 'app',
      component: App,
      redirect: '/app/parties',
      beforeEnter(to, from, next) {
        if ( localStorage.getItem('token') == null ) {
          return next('/login');
        }

        next();
      },
      children: [
        {
          path: 'parties',
          name: 'parties',
          component: PartyList
        }
      ]
    },
    // Login
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
});