import Vue from 'vue';
import Router from 'vue-router';
import AuthenticationOnLoadCallback from './views/AuthenticationOnLoadCallback.vue';
import AuthenticationRefreshCallback from './views/AuthenticationRefreshCallback.vue';

const Filters = () => import('@/views/Filters');
const Home = () => import('@/views/Home');
const DragHome = () => import('@/views/DragHome');
const GetSim = () => import('@/views/GetSim');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/callback',
      name: 'callback',
      component: AuthenticationOnLoadCallback,
    },
    {
      path: '/refresh',
      name: 'refresh',
      component: AuthenticationRefreshCallback,
    },
    {
      path: '/draghome',
      name: 'draghome',
      component: DragHome,
    },
    {
      path: '/filters',
      name: 'filters',
      component: Filters,
    },
    {
      path: '/getsim',
      name: 'getsim',
      component: GetSim,
    },
  ],
});
