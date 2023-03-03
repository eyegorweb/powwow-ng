export default {
  path: '/orders',
  name: 'orders',
  meta: { label: 'Recherche de commandes', permission: { domain: 'getSim', action: 'read' } },
  component: () => import('@/views/GetSim/index.vue'),
  children: [
    {
      name: 'orders.search',
      path: 'search',
      meta: { label: 'Recherche de commandes', permission: { domain: 'getSim', action: 'read' } },
      component: () => import('@/views/GetSim/SearchOrders.vue'),
    },
    {
      name: 'orders.reservations',
      path: 'reservations',
      meta: {
        label: ' Recherche de réservations',
        permission: [
          { domain: 'getSim', action: 'order_esim' },
          { domain: 'getSim', action: 'manage_esim' },
        ],
      },
      component: () => import('@/views/GetSim/Reservations/index.vue'),
    },
  ],
};
