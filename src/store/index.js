import Vue from 'vue';
import Vuex from 'vuex';

import categories from './modules/categories';
import threads from './modules/threads';
import meetups from './modules/meetups';
import auth from './modules/auth';
import stats from './modules/stats';
import meta from './modules/meta';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    categories,
    threads,
    meetups,
    auth,
    stats,
    meta
  }
});
