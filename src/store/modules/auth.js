import axios from 'axios';
import {
  SET_ERROR,
  SET_IS_AUTH_RESOLVED,
  SET_LOADING,
  SET_MEETUP_TO_AUTH_USER,
  SET_USER
} from '../actionTypes';
import router from '../../router';
import { checkTokenValidity } from '../../helpers/checkTokenValidity';
import axiosInstance from '../../services/axios';
import { rejectError } from '../../helpers/rejectError';
import Vue from 'vue';

export default {
  namespace: true,
  state: {
    user: null,
    error: null,
    loading: false,
    isAuthResolved: false
  },
  getters: {
    user(state) {
      return state.user || null;
    },
    isAuthenticated(state) {
      return !!state.user;
    },
    authLoading(state) {
      return state.loading;
    },
    isAuthResolved(state) {
      return state.isAuthResolved;
    },
    // cb for get second param from outside
    isMeetupOwner: (state) => (meetupCreatorId) => {
      if (!state.user) return false;

      return state.user._id === meetupCreatorId;
    },
    isMember: (state) => (meetupId) => {
      return (
        state.user &&
        state.user.joinedMeetups &&
        state.user.joinedMeetups.includes(meetupId)
      );
    }
  },
  mutations: {
    [SET_USER](state, user) {
      state.user = user;
    },
    [SET_ERROR](state, error) {
      state.error = error;
    },
    [SET_LOADING](state, payload) {
      state.loading = payload;
    },
    [SET_IS_AUTH_RESOLVED](state, payload) {
      return (state.isAuthResolved = payload);
    },
    [SET_MEETUP_TO_AUTH_USER](state, meetups) {
      return Vue.set(state.user, 'joinedMeetups', meetups);
    }
  },
  actions: {
    async loginWithEmailAndPassword({ commit }, userData) {
      console.log(userData);
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.post('/api/v1/users/login', userData);
        commit(SET_USER, data);
        localStorage.setItem('meetuper-jwt', data.token);
        commit(SET_LOADING, false);
        router.push({ path: '/' });
        return Promise.resolve(data);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return rejectError(error);
      }
    },
    async registerUser({ commit }, userData) {
      commit(SET_LOADING, true);
      try {
        const { data } = await axios.post('/api/v1/users/register', userData);
        commit(SET_USER, data);
        commit(SET_LOADING, false);
        router.push({ path: '/' });
        return Promise.resolve(data);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return rejectError(error);
      }
    },
    async getAuthUser({ commit, getters }) {
      const authUser = getters['user'];
      const token = localStorage.getItem('meetuper-jwt');
      const isTokenValid = checkTokenValidity(token);

      if (authUser && isTokenValid) return Promise.resolve(authUser);

      const config = {
        headers: {
          'Cache-Control': 'no-cache'
          // Authorization: `Bearer ${token}`
        }
      };

      commit(SET_LOADING, true);
      try {
        const { data } = await axiosInstance.get('/api/v1/users/me', config);
        commit(SET_USER, data);
        localStorage.setItem('meetuper-jwt', data.token);
        commit(SET_LOADING, false);
        commit(SET_IS_AUTH_RESOLVED, true);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_USER, null);
        commit(SET_LOADING, false);
        commit(SET_IS_AUTH_RESOLVED, true);
      }
    },
    async logout({ commit }) {
      commit(SET_LOADING, true);
      try {
        await axios.post('/api/v1/users/logout');
        commit(SET_USER, null);
        localStorage.removeItem('meetuper-jwt');
        commit(SET_LOADING, false);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
      }
    },
    async addMeetupToAuthUser({ commit, state }, meetupId) {
      // new user meetups
      const userMeetups = [...state.user.joinedMeetups, meetupId];
      commit(SET_MEETUP_TO_AUTH_USER, userMeetups);
    },
    async removeMeetupFromAuthUser({ commit, state }, meetupId) {
      const userMeetupsIds = [...state.user.joinedMeetups];
      const index = userMeetupsIds.findIndex(
        (userMeetupId) => userMeetupId === meetupId
      );

      userMeetupsIds.splice(index, 1);

      commit(SET_MEETUP_TO_AUTH_USER, userMeetupsIds);
    }
  }
};
