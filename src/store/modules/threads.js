import { SET_ERROR, SET_LOADING, SET_THREADS } from '../actionTypes';
import axios from 'axios';

export default {
  namespace: true,

  state: {
    threads: [],
    loading: false,
    error: null
  },
  getters: {
    threads(state) {
      return state.threads;
    },
    threadsLoding(state) {
      return state.loading;
    }
  },
  mutations: {
    [SET_THREADS](state, threads) {
      state.threads = threads;
    },
    [SET_ERROR](state, error) {
      state.error = error;
    },
    [SET_LOADING](state, payload) {
      state.loading = payload;
    }
  },
  actions: {
    async fetchThreads({ commit }, meetupId) {
      commit(SET_THREADS, {});
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.get(
          `/api/v1/threads?meetupId=${meetupId}`
        );
        commit(SET_THREADS, data);
        commit(SET_LOADING, false);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    }
  }
};
