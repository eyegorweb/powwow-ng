import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';

export default [
  {
    id: 'w3',
    title: 'Mes commandes',
    description: 'Description',
    checked: true,
    large: true,
    component: OrdersWidget,
  },
  {
    id: 'w1',
    title: 'En cours de consomation',
    description: 'Description',
    checked: true,
    large: true,
    component: ConsoWidget,
  },
  {
    id: 'w2',
    title: 'Rechercher une ligne',
    description: 'Description',
    checked: false,
    large: false,
  },
  {
    id: 'w4',
    title: 'Mon parc',
    description: 'Description',
    checked: false,
    large: false,
  },
  {
    id: 'w5',
    title: 'Comparer 2 lignes',
    description: 'Description',
    checked: false,
    large: false,
  },
  {
    id: 'w6',
    title: 'Découvrir GetDiag',
    description: 'Description',
    checked: false,
    large: false,
  },
  {
    id: 'w7',
    title: 'Historique de consommation',
    description: 'Description',
    checked: false,
    large: false,
  },
];
