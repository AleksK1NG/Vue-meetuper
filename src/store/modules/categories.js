import axios from 'axios';
import { SET_CATEGORIES, SET_ERROR } from '../actionTypes';

export default {
  namespace: true,
  state: {
    categories: [],
    error: null
  },
  getters: {
    categories(state) {
      return state.categories;
    }
  },
  mutations: {
    [SET_CATEGORIES](state, categories) {
      state.categories = categories;
    },

    [SET_ERROR](state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchCategories({ commit }) {
      try {
        const { data } = await axios.get('/api/v1/categories');
        commit(SET_CATEGORIES, data);
      } catch (error) {
        commit(SET_ERROR, error);
      }
    }
  }
};
