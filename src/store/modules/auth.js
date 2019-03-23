import axios from 'axios';
import {
  SET_ERROR,
  SET_IS_AUTH_RESOLVED,
  SET_LOADING,
  SET_USER
} from '../actionTypes';
import router from '../../router';

export default {
  namespace: true,
  state: {
    user: null,
    error: null,
    loading: false,
    isAuthResolved: false
  },
  getters: {
    user(state) {
      return state.user || null;
    },
    isAuthenticated(state) {
      return !!state.user;
    },
    authLoading(state) {
      return state.loading;
    },
    isAuthResolved(state) {
      return state.isAuthResolved;
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
      state.loading = payload;
    },
    [SET_IS_AUTH_RESOLVED](state, payload) {
      return (state.isAuthResolved = payload);
    }
  },
  actions: {
    async loginWithEmailAndPassword({ commit }, userData) {
      console.log(userData);
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.post('/api/v1/users/login', userData);
        commit(SET_USER, data);
        commit(SET_LOADING, false);
        router.push({ path: '/' });
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    },
    async registerUser({ commit }, userData) {
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
    },
    async getAuthUser({ commit, getters }) {
      const authUser = getters['user'];
      if (authUser) return Promise.resolve(authUser);

      const config = {
        headers: {
          'Cache-Control': 'no-cache'
        }
      };

      commit(SET_LOADING, true);
      try {
        const { data } = await axios.get('/api/v1/users/me', config);
        commit(SET_USER, data);
        commit(SET_LOADING, false);
        commit(SET_IS_AUTH_RESOLVED, true);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_USER, null);
        commit(SET_LOADING, false);
        commit(SET_IS_AUTH_RESOLVED, true);
      }
    },
    async logout({ commit }) {
      commit(SET_LOADING, true);
      try {
        await axios.post('/api/v1/users/logout');
        commit(SET_USER, null);
        commit(SET_LOADING, false);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    }
  }
};
