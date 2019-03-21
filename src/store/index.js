import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
  SET_CATEGORIES,
  SET_ERROR,
  SET_MEETUP,
  SET_MEETUPS,
  SET_THREADS
} from './actionTypes';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    meetups: [],
    categories: [],
    threads: [],
    meetup: {},
    error: null
  },
  getters: {
    meetups(state) {
      return state.meetups;
    },
    meetup(state) {
      return state.meetup;
    },
    categories(state) {
      return state.categories;
    },
    threads(state) {
      return state.threads;
    }
  },
  mutations: {
    [SET_MEETUPS](state, meetups) {
      state.meetups = meetups;
    },
    [SET_MEETUP](state, meetup) {
      state.meetup = meetup;
    },
    [SET_CATEGORIES](state, categories) {
      state.categories = categories;
    },
    [SET_THREADS](state, threads) {
      state.threads = threads;
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
      try {
        const { data } = await axios.get(`/api/v1/meetups/${id}`);
        commit(SET_MEETUP, data);
      } catch (error) {
        commit(SET_ERROR, error);
      }
    },
    async fetchCategories({ commit }) {
      try {
        const { data } = await axios.get('/api/v1/categories');
        commit(SET_CATEGORIES, data);
      } catch (error) {
        commit(SET_ERROR, error);
      }
    },
    async fetchThreads({ commit }, meetupId) {
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
});
