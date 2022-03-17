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
  meta:{label: 'Ligne'},
  component: GetParcLineDetail,
  children: [
    {
      name: 'lineDetail.details',
      path: 'details',
      meta:{label: 'Détail de la ligne'},
      component: LineDetailsTab,
      children: [
        {
          name: 'lineDetail.details.info',
          path: 'info',
          meta:{label: 'Détail de la ligne - Informations'},
          component: LineInfoSection,
        },
        {
          name: 'lineDetail.details.billing',
          path: 'billing',
          meta:{label: 'Détail de la ligne - Facturation et offre'},
          component: BillingSection,
        },
        {
          name: 'lineDetail.details.services',
          path: 'services',
          meta:{label: 'Détail de la ligne - Services de la ligne'},
          component: LineServicesSection,
        },
        {
          name: 'lineDetail.details.alarms',
          path: 'alarms',
          meta:{label: 'Détail de la ligne - Liste des alarmes'},
          component: AlarmList,
        },
        {
          name: 'lineDetail.details.acts',
          path: 'acts',
          meta:{label: 'Détail de la ligne - Suivi/pilotage des actes de gestion'},
          component: ActsHistory,
        },
      ],
    },
    {
      name: 'lineDetail.ongoing',
      path: 'ongoing',
      meta:{label: 'Détail de la ligne - En cours de consommation'},
      component: LineDetailsOngoingTabTab,
    },
    {
      name: 'lineDetail.diagnosis',
      path: 'diagnosis',
      meta:{label: 'Détail de la ligne - Analyser la ligne'},
      component: LineDetailsDiagnosisTabTab,
      children: [
        {
          name: 'lineDetail.diagnosis.last_tests',
          path: 'tests',
          meta:{label: 'Détail de la ligne - Derniers tests Coach M2M'},
          component: LastTests,
        },
        {
          name: 'lineDetail.diagnosis.analysis',
          path: 'analysis',
          meta:{label: 'Détail de la ligne - Analyser la ligne'},
          component: LineAnalysisSubMenu1,
        },
        {
          name: 'lineDetail.diagnosis.networkStatus',
          path: 'network-location-test',
          meta:{label: 'Détail de la ligne - Tester le réseau et la localisation'},
          component: NetworkStatusSubMenu2,
        },
        {
          name: 'lineDetail.diagnosis.networkTestControl',
          path: 'network-test-control',
          meta:{label: 'Détail de la ligne - Tester et contrôler la consommation'},
          component: NetworkTestControl,
        },
        {
          name: 'lineDetail.diagnosis.supervision',
          path: 'supervision',
          meta:{label: ' Détail de la ligne - Supervision'},
          component: Supervision,
        },
        {
          name: 'lineDetail.diagnosis.networkHistory',
          path: 'network-history',
          meta:{label: 'Détail de la ligne - Historique réseau et itinérance'},
          component: NetworkHistory,
        },
      ],
    },
  ],
};
