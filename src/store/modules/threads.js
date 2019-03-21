import { SET_ERROR, SET_THREADS } from '../actionTypes';
import axios from 'axios';

export default {
  namespace: true,

  state: {
    threads: [],
    error: null
  },
  getters: {
    threads(state) {
      return state.threads;
    }
  },
  mutations: {
    [SET_THREADS](state, threads) {
      state.threads = threads;
    },
    [SET_ERROR](state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchThreads({ commit }, meetupId) {
      commit(SET_THREADS, {});
      try {
        const { data } = await axios.get(
          `/api/v1/threads?meetupId=${meetupId}`
        );
        commit(SET_THREADS, data);
      } catch (error) {
        commit(SET_ERROR, error);
      }
    }
  }
};
