import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';
import BillsWidget from './widgets/BillsWidget';
import OrdersStatusesWidget from './widgets/OrdersStatusesWidget';
import ActivationWidget from './widgets/ActWidgets/ActivationWidget';
import PreactivationActivationWidget from './widgets/ActWidgets/PreactivationActivationWidget';
import CanceledWidget from './widgets/ActWidgets/CanceledWidget';
import GenericWidget from './widgets/ActWidgets/GenericWidget';
import MassActionTable from './widgets/MassActionTable';

export default [
  {
    title: 'Mes commandes',
    description: '',
    checked: true,
    large: true,
    component: OrdersWidget,
  },
  {
    title: 'Dernière factures',
    description: '',
    checked: true,
    large: false,
    component: BillsWidget,
  },
  {
    title: 'En cours de consomation',
    description: '',
    checked: true,
    large: true,
    component: ConsoWidget,
  },
  {
    title: 'Statut des commandes',
    description: '',
    checked: true,
    large: false,
    component: OrdersStatusesWidget,
  },
  {
    title: 'Acte de gestion',
    description: '',
    checked: true,
    large: true,
    component: MassActionTable,
  },
  {
    title: 'Actes: Activation',
    description: '',
    checked: true,
    large: false,
    component: ActivationWidget,
  },
  {
    title: 'Actes: Préactivation / Action',
    description: '',
    checked: true,
    large: false,
    component: PreactivationActivationWidget,
  },
  {
    title: 'Actes: Résiliation',
    description: '',
    checked: true,
    large: false,
    component: CanceledWidget,
  },
  {
    title: 'Statut des actes de gestion',
    description: '',
    checked: true,
    large: false,
    component: GenericWidget,
  },
];
