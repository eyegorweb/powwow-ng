import OrdersWidget from './widgets/OrdersWidget';
import ConsoWidget from './widgets/ConsoWidget';
import CoachM2MWidget from './widgets/CoachM2MWidget';
import ConsoGraphWidget from './widgets/ConsoGraphWidget';
import BillsWidget from './widgets/BillsWidget';
import LastExportWidget from './widgets/LastExportWidget';
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
import NbIotLteM from './widgets/NbIotLteM';
import ActiveCustomerPark from './widgets/ActiveCustomerPark';

import StatusActsWidget from './widgets/ActWidgets/precalculated/StatusActsWidget';
import RequestManagementWidget from './widgets/ActWidgets/precalculated/RequestManagementWidget';
import ActivationActsWidget from './widgets/ActWidgets/precalculated/ActivationActsWidget';
import PreacActivationActsWidget from './widgets/ActWidgets/precalculated/PreacActivationActsWidget';
import FailedActsWidget from './widgets/ActWidgets/precalculated/FailedActsWidget';
import { excludeMocked } from '@/featureFlipping/plugin';

import { getHomeWidgetsStorage } from '@/utils/localstorage.js';

export const WIDGETS_STORAGE_VERSION = '4';

const checkSeeMoreForReport = ({
  havePermission,
  userIsPartner,
  singlePartner,
  userInfos,
  userIsGroupPartner,
  $loGet,
}) => {
  let canSeeMenu = havePermission('getReport', 'read_dashboard');
  if (userIsPartner) {
    canSeeMenu = canSeeMenu && !!singlePartner.flagStatisticsEnabled;
  }

  if (userIsGroupPartner) {
    canSeeMenu = canSeeMenu && !!$loGet(userInfos, 'partyGroup.flagStatisticsEnabled');
  }

  return canSeeMenu;
};

// COACH M2M / DIAGNOSTIC
export const defaultWidgets = [
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
    title: 'home.widgets.dataVoiceConso',
    description: '',
    checked: true,
    large: true,
    seeMore: checkSeeMoreForReport,
    component: ConsoGraphWidget,
    permission: { domain: 'widget', action: 'parc_consumption_history' },
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
    title: 'getparc.lineDetail.tab3.networkMeteo',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: Weather,
    permission: { domain: 'widget', action: 'network_weather' },
  },
  {
    title: 'home.widgets.nbiotltem',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: NbIotLteM,
    permission: { domain: 'widget', action: 'ltem_nbiot_eligibility' },
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
    title: 'home.widgets.stateParc.title',
    description: '',
    checked: true,
    large: false,
    seeMore: checkSeeMoreForReport,
    component: ParcStateWidget,
    permission: { domain: 'widget', action: 'parc_state' },
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
    title: 'home.widgets.coach',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: CoachM2MWidget,
    permission: { domain: 'widget', action: 'line_coach' },
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
  },
  {
    title: 'home.widgets.exports',
    description: '',
    checked: true,
    large: false,
    seeMore: { domain: 'getReport', action: 'manage_document' },
    component: LastExportWidget,
    permission: { domain: 'widget', action: 'report_history' },
  },
  {
    title: 'home.widgets.currentUsage.title',
    description: '',
    checked: false,
    large: true,
    seeMore: checkSeeMoreForReport,
    component: ConsoWidget,
    permission: { domain: 'widget', action: 'parc_current_consumption' },
    notDraggable: true,
  },

  {
    title: 'home.widgets.acts',
    description: '',
    checked: false,
    large: true,
    seeMore: { domain: 'act', action: 'manage_main' },
    component: MassActionTable,
    permission: { domain: 'widget', action: 'act_all' },
  },
  {
    title: 'home.widgets.activationAct',
    description: '',
    checked: false,
    large: false,
    component: ActivationActsWidget,
    permission: { domain: 'widget', action: 'act_activation' },

    seeMore: false,
  },
  {
    title: 'home.widgets.preactandActivationAct',
    description: '',
    checked: false,
    large: false,
    component: PreacActivationActsWidget,
    permission: { domain: 'widget', action: 'act_preactivation_activation' },

    seeMore: false,
  },
  {
    title: 'home.widgets.cancelationAct',
    description: '',
    checked: false,
    large: false,
    component: FailedActsWidget,
    permission: { domain: 'widget', action: 'act_cancellation' },

    seeMore: false,
  },
  {
    title: 'home.widgets.actsStatus',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: StatusActsWidget,
    permission: { domain: 'widget', action: 'act_status' },
  },
  {
    title: 'home.widgets.requestManagement',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: RequestManagementWidget,
    permission: { domain: 'widget', action: 'act_status_party' },
  },
  {
    title: 'home.widgets.userActs',
    description: '',
    checked: false,
    large: true,
    clickable: true,
    seeMore: { domain: 'act', action: 'manage_main' },
    component: MassActionsByUserTableWidget,
    permission: { domain: 'widget', action: 'act_login' },
  },
  {
    title: 'home.widgets.averageTimeAction',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: AverageTimeAct,
    permission: { domain: 'widget', action: 'act_delay' },
  },
  {
    title: 'home.widgets.simTopActivation',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: SimTopActivation,
    permission: { domain: 'widget', action: 'line_top_activation' },
  },
  {
    title: 'home.widgets.simTopTermination',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: SimTopTermination,
    permission: { domain: 'widget', action: 'line_top_cancellation' },
  },
  {
    title: 'home.widgets.simTopScheduledTermination',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: SimTopScheduledTermination,
    permission: { domain: 'widget', action: 'line_top_scheduled_cancellation' },
  },
  {
    title: 'home.widgets.topTriggeredAlarmsPerDay',
    description: '',
    checked: false,
    large: true,
    seeMore: { domain: 'alarm', action: 'read' },
    component: TriggeredAlarmsPerDay,
    permission: { domain: 'widget', action: 'alarm_history' },
  },
  {
    title: 'home.widgets.topBillingExchangeCA',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: TopFlopCA,
    permission: { domain: 'widget', action: 'bill_top_turnover' },
  },
  {
    title: 'home.widgets.topBillingExchangePO',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: PriseOrdre,
    permission: { domain: 'widget', action: 'bill_top_order' },
  },
  {
    title: 'home.widgets.activeCustomerPark.title',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: ActiveCustomerPark,
    permission: { domain: 'widget', action: 'parc_activated' },
  },
];

// Widgets permitted to userByCustomerAccount
export const userByCustomerAccountWidgets = [
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
    title: 'home.widgets.nbiotltem',
    description: '',
    checked: false,
    large: false,
    seeMore: false,
    component: NbIotLteM,
    permission: { domain: 'widget', action: 'ltem_nbiot_eligibility' },
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
    title: 'home.widgets.userActs',
    description: '',
    checked: false,
    large: true,
    clickable: true,
    seeMore: { domain: 'act', action: 'manage_main' },
    component: MassActionsByUserTableWidget,
    permission: { domain: 'widget', action: 'act_login' },
  },
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
    title: 'searchLineById',
    description: '',
    checked: true,
    large: false,
    seeMore: false,
    component: SearchLinesByIdWidget,
    permission: { domain: 'widget', action: 'line_search' },
  },
];

// export function loadWidgets() {
//   const savedVersion = localStorage.getItem('widgets.version');
//   const versionIsDifferent = savedVersion !== WIDGETS_STORAGE_VERSION;

//   const savedProfile = localStorage.getItem('_widgets_profile_');
//   let savedWidgets = localStorage.getItem('___homewidgets___');
//   if (savedWidgets) {
//     savedWidgets = JSON.parse(savedWidgets);
//   }

//   const currentProfile = getProfile();
//   const profileIsDifferent = savedProfile && savedProfile !== currentProfile;

//   const shouldRemoveFromStorage = profileIsDifferent || versionIsDifferent;
//   if (shouldRemoveFromStorage) {
//     localStorage.removeItem('___homewidgets___');
//     localStorage.removeItem('widgets.version');
//   }

//   if (savedWidgets) {
//     const ret = excludeMocked(
//       savedWidgets.map((d) => {
//         const widget = defaultWidgets.find((f) => f.title === d.title);
//         const conf = {
//           ...widget,
//           ...d,
//           seeMore: widget.seeMore,
//         };

//         conf.checked = d.checked;
//         conf.component = widget.component;
//         return conf;
//       })
//     );
//     return ret;
//   } else {
//     return excludeMocked(defaultWidgets);
//   }
// }

// export function getProfile() {
//   return `_${localStorage.getItem('username')}__${localStorage.getItem(HIDE_MOCKS)}_`;
// }

// new version

export function loadWidgets(userByCustomerAccount) {
  let homeWidgets = getHomeWidgetsStorage();
  let savedWidgets = homeWidgets ? homeWidgets['widgets'] : null;

  const savedVersion = homeWidgets ? homeWidgets['version'] : 0;
  const versionIsDifferent = savedVersion !== WIDGETS_STORAGE_VERSION;

  // const savedProfile = localStorage.getItem('_widgets_profile_');
  if (versionIsDifferent) {
    homeWidgets = null;
  }

  // const currentProfile = getProfile();
  // const profileIsDifferent = savedProfile && savedProfile !== currentProfile;

  // const shouldRemoveFromStorage = profileIsDifferent || versionIsDifferent;
  // if (shouldRemoveFromStorage) {
  //   localStorage.removeItem('___homewidgets___');
  //   localStorage.removeItem('widgets.version');
  // }

  if (savedWidgets) {
    const ret = excludeMocked(
      savedWidgets.map((d) => {
        let userWidgets = userByCustomerAccount ? userByCustomerAccountWidgets : defaultWidgets;
        const widget = userWidgets.find((f) => f.title === d.title);
        const conf = {
          ...widget,
          ...d,
          seeMore: widget.seeMore,
        };

        conf.checked = d.checked;
        conf.component = widget.component;
        return conf;
      })
    );
    return ret;
  } else {
    return excludeMocked(userByCustomerAccount ? userByCustomerAccountWidgets : defaultWidgets);
  }
}

// export function getProfile() {
//   return `_${localStorage.getItem('username')}__${localStorage.getItem(HIDE_MOCKS)}_`;
// }
