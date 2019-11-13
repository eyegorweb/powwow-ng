import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';
import BillsWidget from './widgets/BillsWidget';
import OrdersStatusesWidget from './widgets/OrdersStatusesWidget';
import MassActionTable from './widgets/MassActionTable';
import SearchLinesByIdWidget from './widgets/SearchLinesByIdWidget';
import MassActionsByUserTableWidget from './widgets/MassActionsByUserTableWidget';
import ParcStateWidget from './widgets/ParcStateWidget';
import TriggeredAlarms from './widgets/TriggeredAlarms';

import StatusActsWidget from './widgets/ActWidgets/precalculated/StatusActsWidget';
import ActivationActsWidget from './widgets/ActWidgets/precalculated/ActivationActsWidget';
import PreacActivationActsWidget from './widgets/ActWidgets/precalculated/PreacActivationActsWidget';
import FailedActsWidget from './widgets/ActWidgets/precalculated/FailedActsWidget';

export default [
  {
    title: 'home.widgets.topTriggeredAlarms',
    description: '',
    checked: true,
    large: false,
    seeMore: true,
    component: TriggeredAlarms,
  },
  {
    title: 'home.widgets.orders',
    description: '',
    checked: true,
    large: true,
    seeMore: true,
    component: OrdersWidget,
  },
  {
    title: 'home.widgets.bills',
    description: '',
    checked: true,
    large: false,
    seeMore: true,
    component: BillsWidget,
  },
  {
    title: 'home.widgets.currentUsage',
    description: '',
    checked: true,
    large: true,
    seeMore: true,
    component: ConsoWidget,
  },
  {
    title: 'home.widgets.orderStatus',
    description: '',
    checked: true,
    large: false,
    seeMore: true,
    component: OrdersStatusesWidget,
  },
  {
    title: 'home.widgets.acts',
    description: '',
    checked: true,
    large: true,
    seeMore: true,
    component: MassActionTable,
  },
  {
    title: 'home.widgets.activationAct',
    description: '',
    checked: true,
    large: false,
    component: ActivationActsWidget,
    seeMore: false,
  },
  {
    title: 'home.widgets.preactandActivationAct',
    description: '',
    checked: true,
    large: false,
    component: PreacActivationActsWidget,
    seeMore: false,
  },
  {
    title: 'home.widgets.cancelationAct',
    description: '',
    checked: true,
    large: false,
    component: FailedActsWidget,
    seeMore: false,
  },
  {
    title: 'home.widgets.actsStatus',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: StatusActsWidget,
  },
  {
    title: 'home.widgets.searchLine',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SearchLinesByIdWidget,
  },
  {
    title: 'home.widgets.userActs',
    description: '',
    checked: true,
    large: true,
    clickable: true,
    seeMore: true,
    component: MassActionsByUserTableWidget,
  },
  {
    title: 'home.widgets.stateParc.title',
    description: '',
    checked: true,
    large: false,
    seeMore: true,
    component: ParcStateWidget,
  },
];
