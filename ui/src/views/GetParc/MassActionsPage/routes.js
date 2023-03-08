export default {
  path: '/act-history',
  name: 'actHistory',
  meta: { label: 'Historique des actes', permission: { domain: 'act', action: 'read' } },
  component: () => import('@/views/GetParc/MassActionsPage/index.vue'),
  children: [
    {
      name: 'actHistory.classic',
      meta: { label: 'Historique des actes', permission: { domain: 'act', action: 'read' } },
      path: 'classic',
      component: () => import('@/views/GetParc/MassActionsPage/ClassicMassActions.vue'),
    },
    {
      name: 'actHistory.esim',
      meta: {
        label: 'Historique des actes eSIM',
        permission: { domain: 'act', action: 'manage_esim' },
      },
      path: 'esim',
      component: () => import('@/views/GetParc/MassActionsPage/EsimMassActions/index.vue'),
    },
  ],
};
