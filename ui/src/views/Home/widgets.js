import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';
import BillsWidget from './widgets/BillsWidget';
import OrdersStatusesWidget from './widgets/OrdersStatusesWidget';

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
    id: 'w2',
    title: 'Dernière factures',
    description: 'Description',
    checked: true,
    large: false,
    component: BillsWidget,
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
    id: 'w4',
    title: 'Statut des commandes',
    description: 'Description',
    checked: true,
    large: false,
    component: OrdersStatusesWidget,
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
