import Vue from 'vue';
import Router from 'vue-router';
import AuthenticationOnLoadCallback from './views/Authentication/AuthenticationOnLoadCallback.vue';
import AuthenticationRefreshCallback from './views/Authentication/AuthenticationRefreshCallback.vue';

const Home = () => import('@/views/Home');
const Examples = () => import('@/views/Examples');
const GetSim = () => import('@/views/GetSim');
const Alarms = () => import('@/views/GetVision/alarms');
const AlarmDetail = () => import('@/views/GetVision/alarmDetail');
const MassActionsPage = () => import('@/views/GetParc/MassActionsPage');
const GetParcActDetail = () => import('@/views/GetParc/UnitActionsPage');
const GetParcManagementActLines = () => import('@/views/GetParc/ActLines');
const SearchUsers = () => import('@/views/GetAdmin/SearchUsers');
const SearchCF = () => import('@/views/GetAdmin/SearchCF');
const SearchPartners = () => import('@/views/GetAdmin/SearchPartners');
const ReportsModels = () => import('@/views/GetReport/reports/ReportsModels');
const Documents = () => import('@/views/GetReport/Documents/index.vue');
const Catalog = () => import('@/views/Catalog');
const GetReportDashboard = () => import('@/views/GetReport/Dashboard/index.vue');
const GetReportBill = () => import('@/views/GetReport/Bill/index.vue');
const GetDevice = () => import('@/views/GetDevice/index.vue');
const GetVisionMonitoring = () => import('@/views/GetVision/monitoring');

import lineDetailRoute from '@/views/GetParc/LineDetail/routes.js';
import partnerDetailRoute from '@/views/GetAdmin/PartnerDetail/routes.js';

import { excludeMocked } from '@/featureFlipping/plugin';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes: excludeMocked([
    lineDetailRoute,
    partnerDetailRoute,
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
      path: '/alarm/:alarmId',
      name: 'alarmDetail',
      component: AlarmDetail,
    },
    {
      path: '/getreport/models',
      name: 'getReportsModels',
      component: ReportsModels,
    },
    {
      path: '/reports/documents',
      name: 'documents',
      component: Documents,
    },
    {
      path: '/reports/dashboard',
      name: 'reportsDashboard',
      component: GetReportDashboard,
    },
    {
      path: '/reports/bill',
      name: 'reportsBill',
      component: GetReportBill,
    },
    {
      path: '/getamin/users',
      name: 'getAdminUsers',
      component: SearchUsers,
    },
    {
      path: '/getamin/cf',
      name: 'getAdminCF',
      component: SearchCF,
    },
    {
      path: '/getamin/partners',
      name: 'getAdminPartners',
      component: SearchPartners,
    },
    {
      path: '/devices',
      name: 'getDevice',
      component: GetDevice,
    },
    {
      path: '/monitoring',
      name: 'getVisionMonitoring',
      component: GetVisionMonitoring,
    },
    {
      path: '/exemples',
      name: 'exemples',
      component: Examples,
      mock: true,
    },
    {
      path: '/components',
      name: 'catalog',
      component: Catalog,
      mock: true,
    },
  ]),
});
