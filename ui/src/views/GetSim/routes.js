export default {
  path: '/orders',
  name: 'orders',
  meta:{label: 'Recherche de commandes'},
  component: () => import('@/views/GetSim/index.vue'),
  children: [
    {
      name: 'orders.search',
      path: 'search',
      meta:{label: 'Recherche de commandes'},
      component: () => import('@/views/GetSim/SearchOrders.vue'),
    },
    {
      name: 'orders.reservations',
      path: 'reservations',
      meta:{label: ' Recherche de réservations'},
      component: () => import('@/views/GetSim/Reservations/index.vue'),
    },
  ],
};
