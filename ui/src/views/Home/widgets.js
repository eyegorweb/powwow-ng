import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';
import BillsWidget from './widgets/BillsWidget';
import OrdersStatusesWidget from './widgets/OrdersStatusesWidget';
import ActivationWidget from './widgets/ActWidgets/ActivationWidget';
import PreactivationActivationWidget from './widgets/ActWidgets/PreactivationActivationWidget';
import CanceledWidget from './widgets/ActWidgets/CanceledWidget';
import GenericWidget from './widgets/ActWidgets/GenericWidget';
import MassActionTable from './widgets/MassActionTable';
import SearchLinesByIdWidget from './widgets/SearchLinesByIdWidget';

export default [
  {
    title: 'Mes commandes',
    description: '',
    checked: true,
    large: true,
    clickable: true,
    component: OrdersWidget,
  },
  {
    title: 'Dernière factures',
    description: '',
    checked: true,
    large: false,
    clickable: true,
    component: BillsWidget,
  },
  {
    title: 'En cours de consomation',
    description: '',
    checked: true,
    large: true,
    clickable: true,
    component: ConsoWidget,
  },
  {
    title: 'Statut des commandes',
    description: '',
    checked: true,
    large: false,
    clickable: true,
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
    clickable: true,
  },
  {
    title: 'Actes: Préactivation / Action',
    description: '',
    checked: true,
    large: false,
    component: PreactivationActivationWidget,
    clickable: true,
  },
  {
    title: 'Actes: Résiliation',
    description: '',
    checked: true,
    large: false,
    component: CanceledWidget,
    clickable: true,
  },
  {
    title: 'Statut des actes de gestion',
    description: '',
    checked: true,
    large: false,
    clickable: true,
    component: GenericWidget,
  },
  {
    title: 'Rechercher une ligne',
    description: '',
    checked: true,
    large: false,
    clickable: false,
    component: SearchLinesByIdWidget,
  },
];
