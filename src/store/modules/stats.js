import { SET_STATS_STATE } from '../actionTypes';
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
    }
  },
  getters: {},
  mutations: {
    [SET_STATS_STATE](state, stats) {
      return Object.assign(state, {}, stats);
    }
  },
  actions: {
    async fetchUserStats({ commit }) {
      try {
        const { data } = await axiosInstance.get('/api/v1/users/me/activity');
        commit(SET_STATS_STATE, data);
        debugger;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
