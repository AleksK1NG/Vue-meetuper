import axios from 'axios';
import { SET_CATEGORIES, SET_ERROR, SET_LOADING } from '../actionTypes';

export default {
  namespace: true,
  state: {
    categories: [],
    error: null,
    loading: false
  },
  getters: {
    categories(state) {
      return state.categories;
    },
    loading(state) {
      return state.loading;
    }
  },
  mutations: {
    [SET_CATEGORIES](state, categories) {
      state.categories = categories;
    },

    [SET_ERROR](state, error) {
      state.error = error;
    },
    [SET_LOADING](state, payload) {
      console.log('loading =>', payload);
      state.loading = payload;
    }
  },
  actions: {
    async fetchCategories({ commit }) {
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.get('/api/v1/categories');
        commit(SET_CATEGORIES, data);
        commit(SET_LOADING, false);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    }
  }
};
