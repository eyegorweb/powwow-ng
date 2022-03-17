export default {
  path: '/act-history',
  name: 'actHistory',
  meta:{label: 'Historique des actes'},
  component: () => import('@/views/GetParc/MassActionsPage/index.vue'),
  children: [
    {
      name: 'actHistory.classic',
      meta:{label: 'Historique des actes'},
      path: 'classic',
      component: () => import('@/views/GetParc/MassActionsPage/ClassicMassActions.vue'),
    },
    {
      name: 'actHistory.esim',
      meta:{label: 'Historique des actes eSIM'},
      path: 'esim',
      component: () => import('@/views/GetParc/MassActionsPage/EsimMassActions/index.vue'),
    },
  ],
};
