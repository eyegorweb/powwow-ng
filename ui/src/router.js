import Vue from 'vue';
import Router from 'vue-router';
import AuthenticationOnLoadCallback from './views/Authentication/AuthenticationOnLoadCallback.vue';
import AuthenticationRefreshCallback from './views/Authentication/AuthenticationRefreshCallback.vue';

import Home from '@/views/Home';

import { excludeMocked } from '@/featureFlipping/plugin';

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
      component: () => import('@/views/GetSim/index.vue'),
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
      component: () => import('@/views/GetParc/MassActionsPage/index.vue'),
    },
    {
      path: '/act-detail/:massActionId',
      name: 'actDetail',
      component: () => import('@/views/GetParc/UnitActionsPage/index.vue'),
    },
    {
      path: '/line-detail/:lineId',
      name: 'lineDetail',
      component: () => import('@/views/GetParc/LineDetail'),
    },
    {
      path: '/act-lines',
      name: 'actLines',
      component: () => import('@/views/GetParc/ActLines'),
    },
    {
      path: '/alarms',
      name: 'alarms',
      component: () => import('@/views/GetVision/alarms'),
    },
    {
      path: '/alarm/:alarmId',
      name: 'alarmDetail',
      component: () => import('@/views/GetVision/alarmDetail'),
      mock: true,
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/GetReport/reports/index.vue'),
      mock: true,
    },
    {
      path: '/exemples',
      name: 'exemples',
      component: () => import('@/views/Examples'),
      mock: true,
    },
  ]),
});
