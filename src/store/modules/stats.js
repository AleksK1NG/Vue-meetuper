import { SET_ERROR, SET_LOADING, SET_STATS_STATE } from '../actionTypes';
import axiosInstance from '../../services/axios';

export default {
  namespace: true,
  state: {
    meetups: {
      data: [],
      count: null
    },
    threads: {
      data: [],
      count: null
    },
    posts: {
      data: [],
      count: null
    },
    error: null,
    loadingStats: false
  },
  getters: {},
  mutations: {
    [SET_STATS_STATE](state, { meetups, threads, posts }) {
      state.meetups = meetups;
      state.threads = threads;
      state.posts = posts;
    },
    [SET_LOADING](state, payload) {
      state.loadingStats = payload;
    },
    [SET_ERROR](state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchUserStats({ commit }) {
      commit(SET_LOADING, true);
      try {
        const {
          data: { meetups, threads, posts }
        } = await axiosInstance.get('/api/v1/users/me/activity');
        commit(SET_STATS_STATE, { meetups, threads, posts });
        debugger;
        commit(SET_LOADING, false);
      } catch (error) {
        console.error(error);
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    }
  }
};
