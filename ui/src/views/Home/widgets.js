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
import MassActionsByUserTableWidget from './widgets/MassActionsByUserTableWidget';

export default [
  {
    title: 'Mes commandes',
    description: '',
    checked: true,
    large: true,
    seeMore: true,
    component: OrdersWidget,
  },
  {
    title: 'Dernière factures',
    description: '',
    checked: true,
    large: false,
    seeMore: true,
    component: BillsWidget,
  },
  {
    title: 'En cours de consomation',
    description: '',
    checked: true,
    large: true,
    seeMore: true,
    component: ConsoWidget,
  },
  {
    title: 'Statut des commandes',
    description: '',
    checked: true,
    large: false,
    seeMore: true,
    component: OrdersStatusesWidget,
  },
  {
    title: 'Acte de gestion',
    description: '',
    checked: true,
    large: true,
    seeMore: true,
    component: MassActionTable,
  },
  {
    title: 'Actes: Activation',
    description: '',
    checked: true,
    large: false,
    component: ActivationWidget,
    seeMore: false,
  },
  {
    title: 'Actes: Préactivation / Activation',
    description: '',
    checked: true,
    large: false,
    component: PreactivationActivationWidget,
    seeMore: false,
  },
  {
    title: 'Actes: Résiliation',
    description: '',
    checked: true,
    large: false,
    component: CanceledWidget,
    seeMore: false,
  },
  {
    title: 'Statut des actes de gestion',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: GenericWidget,
  },
  {
    title: 'Rechercher une ligne',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SearchLinesByIdWidget,
  },
  {
    title: 'DERNIERS ACTES DE GESTION DE L’UTILISATEUR « LOGIN »',
    description: '',
    checked: true,
    large: true,
    clickable: true,
    seeMore: true,
    component: MassActionsByUserTableWidget,
  },
];
