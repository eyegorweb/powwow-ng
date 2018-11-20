import Vue from 'vue';
import Router from 'vue-router';

const Filters = () => import('@/views/Filters');
const Home = () => import('@/views/Home');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/filters',
      name: 'filters',
      component: Filters,
    },
  ],
});
