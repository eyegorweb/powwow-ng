export default {
  path: '/act-history',
  name: 'actHistory',
  component: () => import('@/views/GetParc/MassActionsPage/index.vue'),
  children: [
    {
      name: 'actHistory.classic',
      path: 'classic',
      component: () => import('@/views/GetParc/MassActionsPage/ClassicMassActions.vue'),
    },
    {
      name: 'actHistory.esim',
      path: 'esim',
      component: () => import('@/views/GetParc/MassActionsPage/EsimMassActions/index.vue'),
    },
  ],
};
