import { SET_ERROR, SET_LOADING, SET_META_DATA } from '../actionTypes';
import axios from 'axios';

export default {
  namespace: true,
  state: {
    metaData: {
      city: '',
      country: ''
    },
    error: null,
    loadingMeta: false
  },
  getters: {
    metaData(state) {
      return state.metaData;
    },
    metaLoading(state) {
      return state.loadingMeta;
    },
    location(state) {
      const { city, country } = state.metaData;
      return city && country ? city + ', ' + country : '';
    }
  },
  mutations: {
    [SET_META_DATA](state, metaData) {
      state.metaData = metaData;
    },

    [SET_LOADING](state, payload) {
      state.loadingStats = payload;
    },

    [SET_ERROR](state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchMetaData({ commit }) {
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.get('/api/v1');
        commit(SET_META_DATA, data);
        commit(SET_LOADING, false);
      } catch (error) {
        console.error(error);
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    }
  }
};
