import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';
import BillsWidget from './widgets/BillsWidget';
import OrdersStatusesWidget from './widgets/OrdersStatusesWidget';
import ActivationWidget from './widgets/ActWidgets/ActivationWidget';
import PreactivationActivationWidget from './widgets/ActWidgets/PreactivationActivationWidget';
import CanceledWidget from './widgets/ActWidgets/CanceledWidget';
import GenericWidget from './widgets/ActWidgets/GenericWidget';

export default [
  {
    id: 'w3',
    title: 'Mes commandes',
    description: '',
    checked: true,
    large: true,
    component: OrdersWidget,
  },
  {
    id: 'w2',
    title: 'Dernière factures',
    description: '',
    checked: true,
    large: false,
    component: BillsWidget,
  },
  {
    id: 'w1',
    title: 'En cours de consomation',
    description: '',
    checked: true,
    large: true,
    component: ConsoWidget,
  },
  {
    id: 'w4',
    title: 'Statut des commandes',
    description: '',
    checked: true,
    large: false,
    component: OrdersStatusesWidget,
  },
  {
    id: 'w5',
    title: 'Actes: Activation',
    description: '',
    checked: true,
    large: false,
    component: ActivationWidget,
  },
  {
    id: 'w6',
    title: 'Actes: Préactivation / Action',
    description: '',
    checked: true,
    large: false,
    component: PreactivationActivationWidget,
  },
  {
    id: 'w7',
    title: 'Actes: Résiliation',
    description: '',
    checked: true,
    large: false,
    component: CanceledWidget,
  },
  {
    id: 'w8',
    title: 'Statut des actes de gestion',
    description: '',
    checked: true,
    large: false,
    component: GenericWidget,
  },
];
