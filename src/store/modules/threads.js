import {
  ADD_THREAD_TO_THREADS,
  SAVE_POST_TO_THREAD,
  SET_ALL_THREADS_LOADED,
  SET_ERROR,
  SET_LOADING,
  SET_THREADS
} from '../actionTypes';
import axios from 'axios';
import axiosInstance from '../../services/axios';
import Vue from 'vue';
import { applyFilters } from '../../helpers/fetchMeetupsFilters';

export default {
  namespace: true,

  state: {
    threads: [],
    loading: false,
    error: null,
    isAllThreadsLoaded: false
  },

  getters: {
    threads(state) {
      return state.threads;
    },

    threadsLoding(state) {
      return state.loading;
    },

    orderedThreads(state) {
      const copyThreads = [...state.threads];
      return copyThreads.sort((thread, nextThread) => {
        return new Date(nextThread.createdAt) - new Date(thread.createdAt);
      });
    },

    isAllThreadsLoaded(state) {
      return state.isAllThreadsLoaded;
    }
  },

  mutations: {
    [SET_THREADS](state, threads) {
      return state.threads.push(...threads);
      // if (state.threads && state.threads.leading > 0) {
      //   state.threads.push(...threads);
      // } else {
      //   state.threads = threads;
      // }
    },

    [SET_ERROR](state, error) {
      state.error = error;
    },

    [SET_LOADING](state, payload) {
      state.loading = payload;
    },

    // [ADD_THREAD_TO_THREADS](state, { index, item }) {
    //   Vue.set(state.threads, index, item);
    // }

    [ADD_THREAD_TO_THREADS](state, payload) {
      state.threads.push(payload);
    },

    [SAVE_POST_TO_THREAD](state, { posts, index }) {
      Vue.set(state.threads[index], 'posts', posts);
    },

    [SET_ALL_THREADS_LOADED](state, payload) {
      state.isAllThreadsLoaded = payload;
    }
  },

  actions: {
    async fetchThreads({ commit }, { meetupId, filter = {} }) {
      const url = applyFilters(`/api/v1/threads?meetupId=${meetupId}`, filter);

      // commit(SET_THREADS, []);
      commit(SET_LOADING, true);

      try {
        const {
          data: { threads, isAllDataLoaded }
        } = await axios.get(url);
        commit(SET_THREADS, threads);
        commit(SET_ALL_THREADS_LOADED, isAllDataLoaded);
        debugger;
        commit(SET_LOADING, false);
        return Promise.resolve(threads);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    },

    async postThreads({ commit }, { title, meetupId }) {
      const thread = {};
      thread.title = title;
      thread.meetup = meetupId;

      commit(SET_LOADING, true);
      try {
        const { data: createdThread } = await axiosInstance.post(
          `/api/v1/threads`,
          thread
        );
        commit(ADD_THREAD_TO_THREADS, createdThread);
        commit(SET_LOADING, false);
        return Promise.resolve(createdThread);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    },

    async sendPost({ commit, dispatch }, { text, threadId }) {
      const post = { text, thread: threadId };

      commit(SET_LOADING, true);
      try {
        const { data: createdPost } = await axiosInstance.post(
          `/api/v1/posts`,
          post
        );
        dispatch('addPostToThread', { post: createdPost, threadId });
        commit(SET_LOADING, false);
        return Promise.resolve(createdPost);
      } catch (error) {
        commit(SET_ERROR, error);
        commit(SET_LOADING, false);
        return Promise.reject(error);
      }
    },

    // senPost action helper
    addPostToThread({ commit, state }, { post, threadId }) {
      const threadIndex = state.threads.findIndex(
        (thread) => thread._id === threadId
      );

      if (threadIndex > -1) {
        const posts = state.threads[threadIndex].posts;
        posts.unshift(post);
        commit(SAVE_POST_TO_THREAD, { posts, index: threadIndex });
      }
    }

    // Vue.set version
    // async postThreads({ commit, state }, { title, meetupId }) {
    //   const thread = {};
    //   thread.title = title;
    //   thread.meetup = meetupId;
    //
    //   commit(SET_LOADING, true);
    //   try {
    //     const { data: createdThread } = await axiosInstance.post(
    //       `/api/v1/threads`,
    //       thread
    //     );
    //
    //     const index = state.threads.length;
    //     commit(ADD_THREAD_TO_THREADS, { item: createdThread, index });
    //
    //     commit(SET_LOADING, false);
    //   } catch (error) {
    //     commit(SET_ERROR, error);
    //     commit(SET_LOADING, false);
    //   }
    // },
  }
};
