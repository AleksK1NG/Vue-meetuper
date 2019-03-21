import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

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
    categories(state) {
      return state.categories;
    }
  },
  mutations: {
    SET_MEETUPS(state, meetups) {
      state.meetups = meetups;
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchMeetups({ commit }) {
      try {
        const { data } = await axios.get('/api/v1/meetups');
        commit('SET_MEETUPS', data);
      } catch (error) {
        commit('SET_ERROR', error);
      }
    },
    async fetchCategories({ commit }) {
      try {
        const { data } = await axios.get('/api/v1/categories');
        commit('SET_CATEGORIES', data);
      } catch (error) {
        commit('SET_ERROR', error);
      }
    }
  }
});
