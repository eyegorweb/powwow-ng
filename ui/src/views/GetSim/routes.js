export default {
  path: '/orders',
  name: 'orders',
  component: () => import('@/views/GetSim/index.vue'),
  children: [
    {
      path: '',
      redirect: 'search',
    },
    {
      name: 'orders.search',
      path: 'search',
      component: () => import('@/views/GetSim/SearchOrders.vue'),
    },
    {
      name: 'orders.reservations',
      path: 'reservations',
      component: () => import('@/views/GetSim/Reservations/index.vue'),
    },
  ],
};
