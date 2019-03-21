import { SET_ERROR, SET_MEETUP, SET_MEETUPS } from '../actionTypes';
import axios from 'axios';

export default {
  namespace: true,

  state: {
    meetups: [],
    meetup: {},
    error: null
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
    }
  },
  actions: {
    async fetchMeetups({ commit }) {
      try {
        const { data } = await axios.get('/api/v1/meetups');
        commit(SET_MEETUPS, data);
      } catch (error) {
        commit(SET_ERROR, error);
      }
    },
    async fetchMeetupById({ commit }, id) {
      commit(SET_MEETUP, {});
      try {
        const { data } = await axios.get(`/api/v1/meetups/${id}`);
        commit(SET_MEETUP, data);
      } catch (error) {
        commit(SET_ERROR, error);
      }
    }
  }
};
