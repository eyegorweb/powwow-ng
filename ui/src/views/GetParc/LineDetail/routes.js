const GetParcLineDetail = () => import('@/views/GetParc/LineDetail');
const LineDetailsTab = () => import('@/views/GetParc/LineDetail/DetailsTab/index.vue');
const LineDetailsOngoingTabTab = () => import('@/views/GetParc/LineDetail/OngoingTab/index.vue');
const LineDetailsDiagnosisTabTab = () =>
  import('@/views/GetParc/LineDetail/DiagnosisTab/index.vue');

const LineInfoSection = () =>
  import('@/views/GetParc/LineDetail/DetailsTab/LineInfoSection/index.vue');

const BillingSection = () =>
  import('@/views/GetParc/LineDetail/DetailsTab/BillingSection/index.vue');

const LineServicesSection = () =>
  import('@/views/GetParc/LineDetail/DetailsTab/LineServicesSection/index.vue');

const AlarmList = () => import('@/views/GetParc/LineDetail/DetailsTab/AlarmList/index.vue');
const ActsHistory = () => import('@/views/GetParc/LineDetail/DetailsTab/ActsHistory/index.vue');

const LastTests = () => import('@/views/GetParc/LineDetail/DiagnosisTab/LastTests/index.vue');
const LineAnalysisSubMenu1 = () =>
  import('@/views/GetParc/LineDetail/DiagnosisTab/LineAnalysisSubMenu1/index.vue');

const NetworkHistory = () =>
  import('@/views/GetParc/LineDetail/DiagnosisTab/NetworkHistorySubMenu5/index.vue');
const NetworkStatusSubMenu2 = () =>
  import('@/views/GetParc/LineDetail/DiagnosisTab/NetworkStatusSubMenu2/index.vue');
const NetworkTestControl = () =>
  import('@/views/GetParc/LineDetail/DiagnosisTab/NetworkTestControl/index.vue');
const Supervision = () => import('@/views/GetParc/LineDetail/DiagnosisTab/Supervision/index.vue');

export default {
  path: '/line-detail/:lineId',
  name: 'lineDetail',
  component: GetParcLineDetail,
  children: [
    {
      path: '',
      redirect: 'details',
    },
    {
      name: 'lineDetail.details',
      path: 'details',
      component: LineDetailsTab,
      children: [
        {
          path: '',
          redirect: 'info',
        },
        {
          name: 'lineDetail.details.info',
          path: 'info',
          component: LineInfoSection,
        },
        {
          name: 'lineDetail.details.billing',
          path: 'billing',
          component: BillingSection,
        },
        {
          name: 'lineDetail.details.services',
          path: 'services',
          component: LineServicesSection,
        },
        {
          name: 'lineDetail.details.alarms',
          path: 'alarms',
          component: AlarmList,
        },
        {
          name: 'lineDetail.details.acts',
          path: 'acts',
          component: ActsHistory,
        },
      ],
    },
    {
      name: 'lineDetail.ongoing',
      path: 'ongoing',
      component: LineDetailsOngoingTabTab,
    },
    {
      name: 'lineDetail.diagnosis',
      path: 'diagnosis',
      component: LineDetailsDiagnosisTabTab,
      children: [
        {
          path: '',
          redirect: 'analysis',
        },
        {
          name: 'lineDetail.diagnosis.last_tests',
          path: 'tests',
          component: LastTests,
        },
        {
          name: 'lineDetail.diagnosis.analysis',
          path: 'analysis',
          component: LineAnalysisSubMenu1,
        },
        {
          name: 'lineDetail.diagnosis.networkStatus',
          path: 'network-location-test',
          component: NetworkStatusSubMenu2,
        },
        {
          name: 'lineDetail.diagnosis.networkTestControl',
          path: 'network-test-control',
          component: NetworkTestControl,
        },
        {
          name: 'lineDetail.diagnosis.supervision',
          path: 'supervision',
          component: Supervision,
        },
        {
          name: 'lineDetail.diagnosis.networkHistory',
          path: 'network-history',
          component: NetworkHistory,
        },
      ],
    },
  ],
};
