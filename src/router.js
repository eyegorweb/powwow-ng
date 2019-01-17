import Vue from 'vue';
import Router from 'vue-router';
import AuthenticationOnLoadCallback from './views/Authentication/AuthenticationOnLoadCallback.vue';
import AuthenticationRefreshCallback from './views/Authentication/AuthenticationRefreshCallback.vue';

const Home = () => import('@/views/Home');
const DragHome = () => import('@/views/DragHome/index');
const GetSim = () => import('@/views/GetSim/index');
// const GetSimOrdersBillingAccount = () => import('@/views/GetSimOrdersBillingAccount');
// const GetSimOrdersPartners = () => import('@/views/GetSimOrdersPartners');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: GetSim,
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
      path: '/exemples',
      name: 'exemples',
      component: Home,
    },
  ],
});
