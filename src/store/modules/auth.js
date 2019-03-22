import axios from 'axios';
import { SET_ERROR, SET_LOADING, SET_USER } from '../actionTypes';
import router from '../../router';

export default {
  namespace: true,
  state: {
    user: null,
    error: null,
    loading: false
  },
  getters: {
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading;
    }
  },
  mutations: {
    [SET_USER](state, user) {
      state.user = user;
    },

    [SET_ERROR](state, error) {
      state.error = error;
    },
    [SET_LOADING](state, payload) {
      console.log('loading =>', payload);
      state.loading = payload;
    }
  },
  actions: {
    async loginWithEmailAndPassword({ commit }, userData) {
      console.log(userData);
      // commit(SET_LOADING, true);
      // try {
      //   const { data } = await axios.post('/api/v1/categories', userData);
      //   commit(SET_USER, data);
      //   commit(SET_LOADING, false);
      // } catch (error) {
      //   commit(SET_ERROR, error);
      //   commit(SET_LOADING, false);
      // }
    },
    async registerUser({ commit }, userData) {
      console.log('user from register => ', userData);
      debugger
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.post('/api/v1/users/register', userData);
        commit(SET_USER, data);
        commit(SET_LOADING, false);
        router.push({ path: '/' });
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    }
  }
};
