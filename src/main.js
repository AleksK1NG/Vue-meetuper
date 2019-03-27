import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AppSocket from './plugins/socket';

import AppDropdown from './components/shared/AppDropdown';
import AppHero from './components/shared/AppHero';

import moment from 'moment';
import AppSpinner from './components/shared/AppSpinner';
import Vuelidate from 'vuelidate';
import Toasted from 'vue-toasted';

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
Vue.filter('capitalize', (value) => {
  if (value && typeof value === 'string') {
    return value[0].toUpperCase() + value.slice(1);
  }

  return '';
});

Vue.filter('formatDate', (value, formatType = 'LL') => {
  if (!value) return '';

  return moment(value).format(formatType);
});

new Vue({
  router,
  store,
  Vuelidate,
  render: (h) => h(App)
}).$mount('#app');
