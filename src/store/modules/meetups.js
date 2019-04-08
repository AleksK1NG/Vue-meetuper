import {
  ADD_USERS_TO_MEETUP,
  MERGE_MEETUP,
  SET_ERROR,
  SET_LOADING,
  SET_MEETUP,
  SET_MEETUPS
} from '../actionTypes';
import axios from 'axios';
import router from '../../router';
import axiosInstance from '../../services/axios';
import Vue from 'vue';
import { applyFilters } from '../../helpers/fetchMeetupsFilters';

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
    },

    meetupsLoading(state) {
      return state.loading;
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
    },

    [ADD_USERS_TO_MEETUP](state, joinedPeople) {
      Vue.set(state.meetup, 'joinedPeople', joinedPeople);
    },

    [MERGE_MEETUP](state, updatedMeetup) {
      state.meetup = { ...state.meetup, ...updatedMeetup };
    }
  },
  actions: {
    async fetchMeetups({ commit }, options = {}) {
      commit(SET_LOADING, true);
      const url = applyFilters('/api/v1/meetups', options.filter);

      try {
        const { data } = await axios.get(url);
        commit(SET_MEETUPS, data);
        commit(SET_LOADING, false);
        return Promise.resolve(data);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    },

    async fetchMeetupById({ commit }, id) {
      commit(SET_MEETUP, {});

      commit(SET_LOADING, true);
      try {
        const { data } = await axios.get(`/api/v1/meetups/${id}`);
        commit(SET_MEETUP, data);
        commit(SET_LOADING, false);
        return Promise.resolve(data);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    },

    async createMeetup({ commit, rootState }, meetupToCreate) {
      // Add Creator
      meetupToCreate.meetupCreator = rootState.auth.user;
      // Add Location
      meetupToCreate.processedLocation = meetupToCreate.location
        .toLowerCase()
        .replace(/[\s,]+/g, '')
        .trim();

      commit(SET_MEETUP, {});
      commit(SET_LOADING, true);
      try {
        const { data } = await axiosInstance.post(
          `/api/v1/meetups`,
          meetupToCreate
        );
        commit(SET_MEETUP, data);
        commit(SET_LOADING, false);
        router.push({ path: `/meetups/${data._id}` });
        return Promise.resolve(data);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    },

    async joinMeetup({ commit, rootState, dispatch, state }, meetupId) {
      const user = rootState.auth.user;

      commit(SET_LOADING, true);
      try {
        const { data } = await axiosInstance.post(
          `/api/v1/meetups/${meetupId}/join`,
          user
        );
        dispatch('addMeetupToAuthUser', meetupId, { root: true });

        const joinedPeople = state.meetup.joinedPeople;
        commit(ADD_USERS_TO_MEETUP, [...joinedPeople, user]);

        // commit(SET_MEETUP, data);
        commit(SET_LOADING, false);
        return Promise.resolve(data);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    },

    async leaveMeetup({ commit, rootState, dispatch, state }, meetupId) {
      const user = rootState.auth.user;

      commit(SET_LOADING, true);
      try {
        const { data } = await axiosInstance.post(
          `/api/v1/meetups/${meetupId}/leave`,
          user
        );
        dispatch('removeMeetupFromAuthUser', meetupId, { root: true });

        const joinedPeople = state.meetup.joinedPeople;
        const index = joinedPeople.findIndex(
          (joinedUser) => joinedUser._id === user._id
        );

        joinedPeople.slice(index, 1);

        commit(ADD_USERS_TO_MEETUP, joinedPeople);
        commit(SET_LOADING, false);
        return Promise.resolve(data);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    },

    async updateMeetup({ commit, state }, meetupData) {
      meetupData.processedLocation = meetupData.location
        .toLowerCase()
        .replace(/[\s,]+/g, '')
        .trim();

      commit(SET_LOADING, true);

      try {
        const { data } = await axiosInstance.patch(
          `/api/v1/meetups/${meetupData._id}`,
          meetupData
        );
        commit(MERGE_MEETUP, data);
        commit(SET_LOADING, false);
        return Promise.resolve(state.meetup);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    }
  }
};
