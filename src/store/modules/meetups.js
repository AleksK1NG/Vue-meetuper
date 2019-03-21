import {
  SET_ERROR,
  SET_LOADING,
  SET_MEETUP,
  SET_MEETUPS
} from '../actionTypes';
import axios from 'axios';

export default {
  namespace: true,

  state: {
    meetups: [],
    meetup: {},
    error: null,
    loading: false
  },
  getters: {
    meetups(state) {
      return state.meetups;
    },
    meetup(state) {
      return state.meetup;
    }
  },
  mutations: {
    [SET_MEETUPS](state, meetups) {
      state.meetups = meetups;
    },
    [SET_MEETUP](state, meetup) {
      state.meetup = meetup;
    },

    [SET_ERROR](state, error) {
      state.error = error;
    },
    [SET_LOADING](state, payload) {
      state.loading = payload;
    }
  },
  actions: {
    async fetchMeetups({ commit }) {
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.get('/api/v1/meetups');
        commit(SET_MEETUPS, data);
        commit(SET_LOADING, false);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    },
    async fetchMeetupById({ commit }, id) {
      commit(SET_MEETUP, {});
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.get(`/api/v1/meetups/${id}`);
        commit(SET_MEETUP, data);
        commit(SET_LOADING, false);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    }
  }
};
