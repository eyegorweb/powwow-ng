import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';
import CoachM2MWidget from './widgets/CoachM2MWidget';
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

export const WIDGETS_STORAGE_VERSION = '1';

const defaultWidgets = [
  {
    title: 'home.widgets.coach',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: CoachM2MWidget,
    permission: { domain: 'widget', action: 'line_coach' },
  },
  {
    title: 'home.widgets.topTriggeredAlarms',
    description: '',
    checked: true,
    large: false,
    seeMore: { domain: 'alarm', action: 'read' },
    component: TriggeredAlarms,
    permission: { domain: 'widget', action: 'alarm_top' },
  },
  {
    title: 'home.widgets.orders',
    description: '',
    checked: true,
    large: true,
    seeMore: { domain: 'getSim', action: 'read' },
    component: OrdersWidget,
    permission: { domain: 'widget', action: 'order_current' },
  },

  {
    title: 'home.widgets.bills',
    description: '',
    checked: true,
    large: false,
    seeMore: { domain: 'getReport', action: 'read_bill' },
    component: BillsWidget,
    permission: { domain: 'widget', action: 'bill_history' },
    mock: true,
  },
  {
    title: 'home.widgets.currentUsage.title',
    description: '',
    checked: true,
    large: true,
    seeMore: { domain: 'getReport', action: 'read_dashboard' },
    component: ConsoWidget,
    permission: { domain: 'widget', action: 'parc_current_consumption' },
    notDraggable: true,
  },
  {
    title: 'home.widgets.orderStatus',
    description: '',
    checked: true,
    large: false,
    seeMore: { domain: 'getSim', action: 'read' },
    component: OrdersStatusesWidget,
    permission: { domain: 'widget', action: 'order_status' },
  },
  {
    title: 'home.widgets.dataVoiceConso',
    description: '',
    checked: true,
    large: true,
    seeMore: { domain: 'getReport', action: 'read_dashboard' },
    component: ConsoGraphWidget,
    permission: { domain: 'widget', action: 'parc_consumption_history' },
  },

  {
    title: 'home.widgets.acts',
    description: '',
    checked: true,
    large: true,
    seeMore: { domain: 'act', action: 'manage_main' },
    component: MassActionTable,
    permission: { domain: 'widget', action: 'act_all' },
  },
  {
    title: 'home.widgets.activationAct',
    description: '',
    checked: true,
    large: false,
    component: ActivationActsWidget,
    permission: { domain: 'widget', action: 'act_activation' },

    seeMore: false,
  },
  {
    title: 'home.widgets.preactandActivationAct',
    description: '',
    checked: true,
    large: false,
    component: PreacActivationActsWidget,
    permission: { domain: 'widget', action: 'act_preactivation_activation' },

    seeMore: false,
  },
  {
    title: 'home.widgets.cancelationAct',
    description: '',
    checked: true,
    large: false,
    component: FailedActsWidget,
    permission: { domain: 'widget', action: 'act_cancellation' },

    seeMore: false,
  },
  {
    title: 'home.widgets.actsStatus',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: StatusActsWidget,
    permission: { domain: 'widget', action: 'act_status' },
  },
  {
    title: 'searchLineById',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SearchLinesByIdWidget,
    permission: { domain: 'widget', action: 'line_search' },
  },
  {
    title: 'home.widgets.userActs',
    description: '',
    checked: true,
    large: true,
    clickable: true,
    seeMore: { domain: 'act', action: 'manage_main' },
    component: MassActionsByUserTableWidget,
    permission: { domain: 'widget', action: 'act_login' },
  },
  {
    title: 'home.widgets.stateParc.title',
    description: '',
    checked: true,
    large: false,
    seeMore: { domain: 'getReport', action: 'read_dashboard' },
    component: ParcStateWidget,
    permission: { domain: 'widget', action: 'parc_state' },
  },
  {
    title: 'home.widgets.averageTimeAction',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: AverageTimeAct,
    permission: { domain: 'widget', action: 'act_delay' },
  },
  {
    title: 'home.widgets.simTopActivation',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SimTopActivation,
    permission: { domain: 'widget', action: 'line_top_activation' },
  },
  {
    title: 'home.widgets.simTopTermination',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SimTopTermination,
    permission: { domain: 'widget', action: 'line_top_cancellation' },
  },
  {
    title: 'home.widgets.simTopScheduledTermination',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SimTopScheduledTermination,
    permission: { domain: 'widget', action: 'line_top_scheduled_cancellation' },
  },
  {
    title: 'getparc.lineDetail.tab3.networkMeteo',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: Weather,
    permission: { domain: 'widget', action: 'network_weather' },
  },
  {
    title: 'home.widgets.linesConsumption',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: LinesConsumption,
    permission: { domain: 'widget', action: 'line_consumption' },
  },
  {
    title: 'home.widgets.topTriggeredAlarmsPerDay',
    description: '',
    checked: true,
    large: true,
    seeMore: { domain: 'alarm', action: 'read' },
    component: TriggeredAlarmsPerDay,
    permission: { domain: 'widget', action: 'alarm_history' },
  },
  {
    title: 'home.widgets.topBillingExchangeCA',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: TopFlopCA,
    permission: { domain: 'widget', action: 'bill_top_turnover' },
  },
  {
    title: 'home.widgets.topBillingExchangePO',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: PriseOrdre,
    permission: { domain: 'widget', action: 'bill_top_order' },
  },
];

export function loadWidgets() {
  const savedVersion = localStorage.getItem('widgets.version');
  const versionIsDifferent = savedVersion !== WIDGETS_STORAGE_VERSION;

  const savedProfile = localStorage.getItem('_widgets_profile_');
  const currentProfile = getProfile();
  const profileIsDifferent = savedProfile && savedProfile !== currentProfile;

  const shouldRemoveFromStorage = profileIsDifferent || versionIsDifferent;
  if (shouldRemoveFromStorage) {
    localStorage.removeItem('___homewidgets___');
    localStorage.removeItem('widgets.version');
  }

  let savedWidgets = localStorage.getItem('___homewidgets___');
  if (savedWidgets) {
    const loadedWidgets = JSON.parse(savedWidgets);
    const ret = excludeMocked(
      defaultWidgets.map(d => {
        const widget = loadedWidgets.find(f => f.title === d.title);
        const conf = {
          ...widget,
          ...d,
        };

        if (widget) {
          conf.checked = widget.checked;
        }
        return conf;
      })
    );
    return ret;
  } else {
    return excludeMocked(defaultWidgets);
  }
}

export function getProfile() {
  return `_${localStorage.getItem('username')}__${localStorage.getItem(HIDE_MOCKS)}_`;
}
