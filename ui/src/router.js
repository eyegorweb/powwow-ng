import Vue from 'vue';
import Router from 'vue-router';
import AuthenticationOnLoadCallback from './views/Authentication/AuthenticationOnLoadCallback.vue';
import AuthenticationRefreshCallback from './views/Authentication/AuthenticationRefreshCallback.vue';

import Home from '@/views/Home';
import Examples from '@/views/Examples';
import GetSim from '@/views/GetSim';
import Alarms from '@/views/GetVision/alarms';
import MassActionsPage from '@/views/GetParc/MassActionsPage';
import GetParcActDetail from '@/views/GetParc/UnitActionsPage';
import GetParcManagementActLines from '@/views/GetParc/ActLines';
import GetParcLineDetail from '@/views/GetParc/LineDetail';

import { excludeMocked } from '@/featureFlipping/plugin';

// const Home = () => import('@/views/Home');
// const GetSim = () => import('@/views/GetSim/index');
// const GetSimOrdersBillingAccount = () => import('@/views/GetSimOrdersBillingAccount');
// const GetSimOrdersPartners = () => import('@/views/GetSimOrdersPartners');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes: excludeMocked([
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/orders',
      name: 'orders',
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
      path: '/act-history',
      name: 'actHistory',
      component: MassActionsPage,
    },
    {
      path: '/act-detail/:massActionId',
      name: 'actDetail',
      component: GetParcActDetail,
    },
    {
      path: '/line-detail/:lineId',
      name: 'lineDetail',
      component: GetParcLineDetail,
    },
    {
      path: '/act-lines',
      name: 'actLines',
      component: GetParcManagementActLines,
    },
    {
      path: '/alarms',
      name: 'alarms',
      component: Alarms,
    },
    {
      path: '/exemples',
      name: 'exemples',
      component: Examples,
      mock: true,
    },
  ]),
});
