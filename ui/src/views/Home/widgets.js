import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';
import ConsoGraphWidget from './widgets/ConsoGraphWidget';
import BillsWidget from './widgets/BillsWidget';
import OrdersStatusesWidget from './widgets/OrdersStatusesWidget';
import MassActionTable from './widgets/MassActionTable';
import SearchLinesByIdWidget from './widgets/SearchLinesByIdWidget';
import MassActionsByUserTableWidget from './widgets/MassActionsByUserTableWidget';
import ParcStateWidget from './widgets/ParcStateWidget';
import TriggeredAlarms from './widgets/TriggeredAlarms';
import TriggeredAlarmsPerDay from './widgets/TriggeredAlarmsPerDay';
import AverageTimeAct from './widgets/AverageWidgets/AverageTimeAct';
import SimTopActivation from './widgets/AverageWidgets/SimTopActivation';
import SimTopTermination from './widgets/AverageWidgets/SimTopTermination';
import SimTopScheduledTermination from './widgets/AverageWidgets/SimTopScheduledTermination';
import TopFlopCA from './widgets/AverageWidgets/TopFlopCA';
import PriseOrdre from './widgets/AverageWidgets/PriseOrdre';
import LinesConsumption from './widgets/AverageWidgets/LinesConsumption';
import Weather from './widgets/Weather';

import StatusActsWidget from './widgets/ActWidgets/precalculated/StatusActsWidget';
import ActivationActsWidget from './widgets/ActWidgets/precalculated/ActivationActsWidget';
import PreacActivationActsWidget from './widgets/ActWidgets/precalculated/PreacActivationActsWidget';
import FailedActsWidget from './widgets/ActWidgets/precalculated/FailedActsWidget';
import { excludeMocked } from '@/featureFlipping/plugin';

import { HIDE_MOCKS } from '@/featureFlipping/plugin.js';

const defaultWidgets = [
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
    mock: true,
  },
  {
    title: 'home.widgets.currentUsage',
    description: '',
    checked: true,
    large: true,
    seeMore: true,
    component: ConsoWidget,
    mock: true,
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
    title: 'home.widgets.dataVoiceConso',
    description: '',
    checked: true,
    large: true,
    seeMore: false,
    component: ConsoGraphWidget,
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
    title: 'searchLineById',
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
  {
    title: 'home.widgets.averageTimeAction',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: AverageTimeAct,
  },
  {
    title: 'home.widgets.simTopActivation',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SimTopActivation,
  },
  {
    title: 'home.widgets.simTopTermination',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SimTopTermination,
  },
  {
    title: 'home.widgets.simTopScheduledTermination',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SimTopScheduledTermination,
  },
  {
    title: 'getparc.lineDetail.tab3.networkMeteo',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: Weather,
  },
  {
    title: 'home.widgets.linesConsumption',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: LinesConsumption,
  },
  {
    title: 'home.widgets.topTriggeredAlarmsPerDay',
    description: '',
    checked: true,
    large: true,
    seeMore: true,
    component: TriggeredAlarmsPerDay,
  },
  {
    title: 'home.widgets.topBillingExchangeCA',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: TopFlopCA,
  },
  {
    title: 'home.widgets.topBillingExchangePO',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: PriseOrdre,
  },
];

export function loadWidgets() {
  const savedProfile = localStorage.getItem('_widgets_profile_');

  if (savedProfile && savedProfile !== getProfile()) {
    localStorage.removeItem('__homewidgets__');
  }

  let savedWidgets = localStorage.getItem('__homewidgets__');

  if (savedWidgets) {
    const loadedWidgets = JSON.parse(savedWidgets);
    return excludeMocked(
      loadedWidgets.map(w => {
        const widget = defaultWidgets.find(f => f.title === w.title);
        return { ...w, component: widget.component };
      })
    );
  } else {
    return excludeMocked(defaultWidgets);
  }
}

export function getProfile() {
  return `_${localStorage.getItem('username')}_${localStorage.getItem(HIDE_MOCKS)}_`;
}
