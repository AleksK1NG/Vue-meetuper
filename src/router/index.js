import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import PageHome from '../pages/PageHome';
import PageMeetupDetail from '../pages/PageMeetupDetail';
import PageMeetupFind from '../pages/PageMeetupFind';
import PageNotFound from '../pages/PageNotFound';
import PageLogin from '../pages/PageLogin';
import PageRegister from '../pages/PageRegister';
import PageSecret from '../pages/PageSecret';
import PageNotAuthenticated from '../pages/PageNotAuthenticated';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'PageHome',
      component: PageHome
    },
    {
      path: '/find',
      name: 'PageMeetupFind',
      component: PageMeetupFind
    },
    {
      path: '/meetups/secret',
      name: 'PageSecret',
      component: PageSecret,
      meta: { onlyAuthUser: true }
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: PageLogin,
      meta: { onlyGuestUser: true }
    },
    {
      path: '/register',
      name: 'PageRegister',
      component: PageRegister,
      meta: { onlyGuestUser: true }
    },
    {
      path: '/meetups/:id',
      name: 'PageMeetupDetail',
      component: PageMeetupDetail
    },
    {
      path: '/401',
      name: 'PageNotAuthenticated',
      component: PageNotAuthenticated
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ],
  mode: 'history'
});

/*
 * Route Guard
 * */

router.beforeEach((to, from, next) => {
  store.dispatch('getAuthUser').then(() => {
    const isAuthenticated = store.getters['isAuthenticated'];

    if (to.meta.onlyAuthUser) {
      if (isAuthenticated) {
        next();
      } else {
        next({ name: 'PageNotAuthenticated' });
      }
    } else if (to.meta.onlyGuestUser) {
      if (isAuthenticated) {
        next({ name: 'PageHome' });
      } else {
        next();
      }
    } else {
      next();
    }
  });
});

export default router;
