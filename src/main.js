import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AppSocket from './plugins/socket';

import AppDropdown from './components/shared/AppDropdown';
import AppHero from './components/shared/AppHero';

import AppSpinner from './components/shared/AppSpinner';
import Vuelidate from 'vuelidate';
import Toasted from 'vue-toasted';
import filters from './filters';

Vue.use(Vuelidate);
Vue.use(Toasted);
/*
 * Socket.io init
 * */
Vue.use(AppSocket, { connection: 'http://localhost:3001' });

Vue.config.productionTip = false;

/*
 * Global Components
 * */
Vue.component('AppHero', AppHero);
Vue.component('AppDropdown', AppDropdown);
Vue.component('AppSpinner', AppSpinner);

/*
 * Filters
 * */
filters();

new Vue({
  router,
  store,
  Vuelidate,
  render: (h) => h(App)
}).$mount('#app');
