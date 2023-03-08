import Vue from 'vue';
import Router from 'vue-router';
import AuthenticationOnLoadCallback from './views/Authentication/AuthenticationOnLoadCallback.vue';
import AuthenticationRefreshCallback from './views/Authentication/AuthenticationRefreshCallback.vue';

const Home = () => import('@/views/Home');
const Examples = () => import('@/views/Examples');
const Alarms = () => import('@/views/GetVision/alarms');
const AlarmDetail = () => import('@/views/GetVision/alarmDetail');
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
const GetStocks = () => import('@/views/GetSim/Stocks/index.vue');
const RolesManagement = () => import('@/views/GetAdmin/RolesManagement/index.vue');
const MarketingOffersManagement = () =>
  import('@/views/GetAdmin/MarketingOffersManagement/index.vue');

import lineDetailRoute from '@/views/GetParc/LineDetail/routes.js';
import partnerDetailRoute from '@/views/GetAdmin/PartnerDetail/routes.js';
import accountCreationRoute from '@/views/AccountCreation/routes.js';

import getSimRoutes from '@/views/GetSim/routes.js';

import getParcRoutes from '@/views/GetParc/MassActionsPage/routes.js';

import { excludeMocked } from '@/featureFlipping/plugin';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes: excludeMocked([
    lineDetailRoute,
    partnerDetailRoute,
    getSimRoutes,
    getParcRoutes,
    accountCreationRoute,
    {
      path: '/create-account/ok/:paymentId',
      name: 'createAccount.ok',
      meta: { label: 'Création de compte Paynum OK' },
      component: () => import('@/views/AccountCreation/SuccessPage.vue'),
    },
    {
      path: '/create-account/ko/:paymentId',
      name: 'createAccount.ko',
      meta: { label: 'Création de compte Paynum KO' },
      component: () => import('@/views/AccountCreation/ErrorPage.vue'),
    },
    {
      path: '/payment/ok/:paymentId',
      name: 'payment.ok',
      meta: { label: 'Paiement Paynum OK' },
      component: () => import('@/views/AccountCreation/SuccessPage.vue'),
    },
    {
      path: '/payment/ko/:paymentId',
      name: 'payment.ko',
      meta: { label: 'Paiement Paynum KO' },
      component: () => import('@/views/AccountCreation/ErrorPage.vue'),
    },
    {
      path: '/',
      name: 'home',
      meta: { label: 'Accueil' },
      component: Home,
    },
    {
      path: '/stocks',
      name: 'stocks',
      meta: { label: 'Stock' },
      component: GetStocks,
    },
    {
      path: '/callback',
      name: 'callback',
      component: AuthenticationOnLoadCallback,
      ignoreAnalytics: true,
    },
    {
      path: '/refresh',
      name: 'refresh',
      component: AuthenticationRefreshCallback,
      ignoreAnalytics: true,
    },

    {
      path: '/act-detail/:massActionId',
      name: 'actDetail',
      meta: {
        label: 'Détail acte de gestion',
        permission: [
          { domain: 'getParc', action: 'read' },
          { domain: 'getParc', action: 'manage_esim' },
        ],
      },
      component: GetParcActDetail,
    },
    {
      path: '/act-lines',
      name: 'actLines',
      meta: { label: 'Recherche de lignes', permission: { domain: 'getParc', action: 'read' } },
      component: GetParcManagementActLines,
    },
    {
      path: '/alarms',
      name: 'alarms',
      meta: { label: 'Recherche des alarmes', permission: { domain: 'alarm', action: 'read' } },
      component: Alarms,
    },
    {
      path: '/alarm/:alarmId',
      name: 'alarmDetail',
      meta: { label: 'Détail alarme', permission: { domain: 'alarm', action: 'read' } },
      component: AlarmDetail,
    },
    {
      path: '/getreport/models',
      name: 'getReportsModels',
      meta: { label: 'Modèles de rapports', permission: { domain: 'getReport', action: 'read' } },
      component: ReportsModels,
    },
    {
      path: '/reports/documents',
      name: 'documents',
      meta: {
        label: 'Gestion des documents',
        permission: { domain: 'getReport', action: 'manage_document' },
      },
      component: Documents,
    },
    {
      path: '/reports/dashboard',
      name: 'reportsDashboard',
      meta: {
        label: 'Tableau de bord',
        permission: { domain: 'getReport', action: 'read_dashboard' },
      },
      component: GetReportDashboard,
    },
    {
      path: '/reports/bill',
      name: 'reportsBill',
      meta: { label: 'Factures', permission: { domain: 'getReport', action: 'read_bill' } },
      component: GetReportBill,
    },
    {
      path: '/getadmin/users',
      name: 'getAdminUsers',
      meta: { label: 'Gestion des utilisateurs', permission: { domain: 'user', action: 'read' } },
      component: SearchUsers,
    },
    {
      path: '/getadmin/cf',
      name: 'getAdminCF',
      meta: {
        label: 'Comptes de facturation',
        permission: { domain: 'party', action: 'read_customer_account' },
      },
      component: SearchCF,
    },
    {
      path: '/getadmin/partners',
      name: 'getAdminPartners',
      meta: { label: 'Gestion des partenaires', permission: { domain: 'user', action: 'read' } },
      component: SearchPartners,
    },
    {
      path: '/getadmin/manage-roles',
      name: 'getAdminRoles',
      meta: { label: 'Gestion des rôles', permission: { domain: 'admin', action: 'permission' } },
      component: RolesManagement,
    },
    {
      path: '/devices',
      name: 'getDevice',
      meta: {
        label: 'Recherche des équipements',
        permission: { domain: 'getDevice', action: 'read' },
      },
      component: GetDevice,
    },
    {
      path: '/monitoring',
      name: 'getVisionMonitoring',
      meta: {
        label: 'Supervision',
        permission: [
          { domain: 'getVision', action: 'read' },
          { domain: 'getVision', action: 'service_state' },
          { domain: 'getVision', action: 'service_state_roaming' },
          { domain: 'getVision', action: 'alarm' },
        ],
      },
      component: GetVisionMonitoring,
    },
    {
      path: '/exemples',
      name: 'exemples',
      meta: { label: 'Exemples' },
      component: Examples,
      mock: true,
    },
    {
      path: '/components',
      name: 'catalog',
      meta: { label: 'Catalogue' },
      component: Catalog,
      mock: true,
    },
    {
      path: '/admin-settings/messages',
      name: 'messagesList',
      meta: { label: 'Messages' },
      component: () => import('@/views/AdminSettings/Messages/index.vue'),
      ignoreAnalytics: true,
    },
    {
      path: '/admin-settings/messages/edit/:id?',
      name: 'messagesEdit',
      meta: { label: 'Edition des messages' },
      component: () => import('@/views/AdminSettings/Messages/MessageEdit.vue'),
      ignoreAnalytics: true,
    },
    {
      path: '/getadmin/manage-marketing-offers',
      name: 'getAdminCatalogOffers',
      meta: {
        label: 'Gestion du catalogue des offres',
        permission: { domain: 'catalog', action: 'read_catalog_offer' },
      },
      component: MarketingOffersManagement,
    },
  ]),
});
