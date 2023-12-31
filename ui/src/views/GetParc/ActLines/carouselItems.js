import { excludeMocked } from '@/featureFlipping/plugin';

export default excludeMocked([
  {
    icon: 'ic-Plug-Icon',
    title: 'getparc.actCreation.carouselItem.ACTIVATE_PREACTIVATE',
    id: 'ACTIVATE_PREACTIVATE',
    stepTitle: 'getparc.actCreation.step2Titles.ACTIVATE_PREACTIVATE',
    selected: false,
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'NOT_PREACTIVATED',
            label: 'Non préactivée',
          },
          {
            id: 'PREACTIVATED',
            label: 'Préactivée',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Edit-Icon',
    title: 'getparc.actCreation.carouselItem.CUSTOM_FIELDS',
    id: 'CUSTOM_FIELDS',
    stepTitle: 'getparc.actCreation.step2Titles.CUSTOM_FIELDS',
    subtitle: '',
    selected: false,
    hideForMVNO: true,
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'PREACTIVATED',
            label: 'Préactivée',
          },
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Settings-Icon',
    title: 'getparc.actCreation.carouselItem.CHANGE_SERVICES',
    id: 'CHANGE_SERVICES',
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_SERVICES',
    subtitle: '',
    selected: false,
    havePrereqs: true,
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
          { id: 'SUSPENDED', label: 'Suspendue' },
        ],
      },
    ],
  },
  {
    icon: 'ic-pause-circle',
    title: 'getparc.actCreation.carouselItem.SUSPEND',
    id: 'SUSPEND',
    stepTitle: 'getparc.actCreation.step2Titles.SUSPEND',
    subtitle: '',
    selected: false,
    color: 'blue',
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
      {
        id: 'filters.lines.commercialStatus',
        values: [
          {
            id: 'facturationActive',
            label: 'Facturation active',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-pause-circle',
    title: 'getparc.actCreation.carouselItem.SUSPEND_BILLS',
    id: 'SUSPEND',
    stepTitle: 'getparc.actCreation.step2Titles.SUSPEND',
    subtitle: '',
    selected: false,
    color: 'red',
    boOnly: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'SUSPENDED',
            label: 'Suspendue',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Sim-Icon',
    title: 'getparc.actCreation.carouselItem.CHANGE_SIMCARD',
    id: 'CHANGE_SIMCARD',
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_SIMCARD',
    selected: false,
    containFile: true,
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Sim-Icon',
    title: 'getparc.actCreation.carouselItem.RADIUS_ADMIN',
    id: 'RADIUS_ADMIN',
    stepTitle: 'getparc.actCreation.step2Titles.RADIUS_ADMIN',
    selected: false,
    containFile: true,
    havePrereqs: true,
    permission: [
      { domain: 'act', action: 'radius_administration' },
      { domain: 'act', action: 'radius_read' },
    ],
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Smartphone-Icon',
    title: 'getparc.actCreation.carouselItem.CHANGE_MSISDN',
    id: 'CHANGE_MSISDN',
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_MSISDN',
    selected: false,
    containFile: true,
    hideForMVNO: true,
    permission: { domain: 'act', action: 'msisdn_change' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Ticket-Icon',
    title: 'getparc.actCreation.carouselItem.UPDATE_YORK_COMMUNITY',
    id: 'UPDATE_YORK_COMMUNITY',
    stepTitle: 'getparc.actCreation.step2Titles.UPDATE_YORK_COMMUNITY',
    subtitle: '',
    permission: { domain: 'act', action: 'change_cos' },
    selected: false,
    havePrereqs: true,
    color: 'blue',
    hideForMVNO: true,
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Ticket-Icon',
    title: 'getparc.actCreation.carouselItem.CHANGE_OFFER',
    id: 'CHANGE_OFFER',
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_OFFER',
    subtitle: '',
    selected: false,
    havePrereqs: true,
    color: 'blue',
    hideForMVNO: true,
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
    ],
  },

  {
    icon: 'ic-Wallet-Icon',
    title: 'getparc.actCreation.carouselItem.CHANGE_CF',
    id: 'CHANGE_CF',
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_CF',
    subtitle: '',
    selected: false,
    havePrereqs: true,
    hideForMVNO: true,
    hideForMultiCustomer: true,
    permission: { domain: 'act', action: 'transfer_customer_account' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Play-Icon',
    title: 'getparc.actCreation.carouselItem.REACTIVATE',
    id: 'REACTIVATE',
    stepTitle: 'getparc.actCreation.carouselItem.REACTIVATE',
    subtitle: '',
    selected: false,
    color: 'blue',
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'SUSPENDED',
            label: 'Suspendue',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Shuffle-Icon',
    title: 'getparc.actCreation.carouselItem.TRANSFERT_LINES',
    id: 'TRANSFERT_LINES',
    stepTitle: 'getparc.actCreation.step2Titles.TRANSFERT_LINES',
    subtitle: '',
    selected: false,
    permission: { domain: 'act', action: 'transfer_party' },
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'NOT_PREACTIVATED',
            label: 'Non préactivée',
          },
          {
            id: 'PREACTIVATED',
            label: 'Préactivée',
          },
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Wheel-Icon',
    title: 'getparc.actCreation.carouselItem.MANAGE_CANCELLATION',
    id: 'MANAGE_CANCELLATION',
    stepTitle: 'getparc.actCreation.step2Titles.MANAGE_CANCELLATION',
    subtitle: '',
    selected: false,
    color: 'orange',
    permission: { domain: 'act', action: 'validate_termination' },
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
          {
            id: 'SUSPENDED',
            label: 'Suspendue',
          },
        ],
      },
      {
        id: 'filters.lines.commercialStatus',
        values: [
          {
            id: 'demandeDeResiliation',
            label: 'Demande de résiliation',
          },
        ],
      },
      {
        id: 'filters.lines.terminationValidated',
        value: 'Non',
        meta: { label: 'Non', value: false },
      },
      {
        id: 'filters.lines.securityTerminationEnd',
        value: 'Oui',
      },
    ],
  },
  {
    icon: 'ic-Arrow-Forward-Icon',
    title: 'getparc.actCreation.carouselItem.TEST_PHASE',
    id: 'TEST_PHASE',
    stepTitle: 'getparc.actCreation.step2Titles.TEST_PHASE',
    subtitle: '',
    selected: false,
    hideForMVNO: true,
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
      {
        id: 'filters.lines.billingStatus',
        values: [
          {
            id: 'TEST',
            label: 'Test',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Message-Icon',
    title: 'getparc.actCreation.carouselItem.SEND_SMS',
    id: 'SEND_SMS',
    stepTitle: 'getparc.actCreation.carouselItem.SEND_SMS',
    subtitle: '',
    selected: false,
    hideForMVNO: true,
    boOnly: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
        ],
      },
      {
        id: 'filters.lines.billingStatus',
        values: [
          {
            id: 'CANCELED',
            label: 'Annulée',
          },
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
          {
            id: 'TEST',
            label: 'Test',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Alt-Icon',
    title: 'getparc.actCreation.carouselItem.CHANGE_STATUS',
    id: 'CHANGE_STATUS',
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_STATUS',
    subtitle: '',
    selected: false,
    color: 'orange',
    permission: { domain: 'act', action: 'manage_main' },
    canShowActAsUserByCF: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
          {
            id: 'SUSPENDED',
            label: 'Suspendue',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Sim-Icon',
    title: 'getparc.actCreation.carouselItem.SIM_TRANSFER',
    id: 'SIM_TRANSFER',
    stepTitle: 'getparc.actCreation.carouselItem.SIM_TRANSFER',
    subtitle: '',
    selected: false,
    restrictPartnerType: 'MVNO',
    color: 'orange',
    hideForMVNO: true,
    permission: { domain: 'act', action: 'transfer_party' },
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activée',
          },
          {
            id: 'SUSPENDED',
            label: 'Suspendue',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Refresh-Icon',
    title: 'getparc.actCreation.carouselItem.RECHARGE_LINES',
    id: 'RECHARGE_LINES',
    stepTitle: 'getparc.actCreation.step2Titles.configure',
    selected: false,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          { id: 'ACTIVATED', label: 'Activée' },
          { id: 'SUSPENDED', label: 'Suspendue' },
        ],
      },
    ],
  },
  {
    icon: 'ic-Refresh-Icon',
    title: 'getparc.actCreation.carouselItem.esim.CHARGE_LV_LINES',
    id: 'CHARGE_LV_LINES',
    stepTitle: 'getparc.actCreation.step2Titles.configure',
    selected: false,
    esimAct: true,
    partnerFeature: 'LV',
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          { id: 'ACTIVATED', label: 'Activée' },
          { id: 'SUSPENDED', label: 'Suspendue' },
        ],
      },
    ],
  },
  {
    icon: 'ic-Plug-Icon',
    title: 'getparc.actCreation.carouselItem.esim.DOWNLOAD_ESIM_PROFILE',
    id: 'DOWNLOAD_ESIM_PROFILE',
    stepTitle: 'getparc.actCreation.step2Titles.configure',
    selected: false,
    esimAct: true,
    permission: { domain: 'act', action: 'manage_esim' },
    filters: [
      {
        id: 'indicators.getparc.lines.esim.category',
        value: 'eSim',
        meta: { label: 'eSim', value: 'ESIM' },
      },
      {
        id: 'indicators.getparc.lines.esim.type',
        value: 'STEP2',
        meta: { label: 'STEP2', value: 'STEP2' },
      },
      {
        id: 'indicators.getparc.lines.esim.pairedLine',
        value: 'Oui',
        meta: { label: 'Oui', value: 'YES' },
      },
      {
        id: 'filters.downloadedProfile',
        value: 'Non déterminé',
        meta: { id: 3, label: 'notDefined', value: 'Non déterminé', default: false },
      },
    ],
  },
  {
    icon: 'ic-Settings-Icon',
    title: 'getparc.actCreation.carouselItem.esim.AUDIT',
    id: 'ESIM_AUDIT',
    stepTitle: 'getparc.actCreation.step2Titles.configure',
    selected: false,
    permission: { domain: 'act', action: 'audit_esim_light' },
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [{ id: 'ACTIVATED', label: 'Activée' }],
      },
      {
        id: 'indicators.getparc.lines.esim.family',
        value: 'eSim client',
        meta: { label: 'simcard.family.esim.owner', value: 'ESIM_OWNER' },
      },
    ],
  },
  {
    icon: 'ic-Settings-Icon',
    title: 'getparc.actCreation.carouselItem.esim.POLICY_RULES',
    id: 'POLICY_RULES',
    stepTitle: 'getparc.actCreation.step2Titles.configure',
    selected: false,
    esimAct: true,
    permission: { domain: 'act', action: 'manage_esim' },
    filters: [
      {
        id: 'indicators.getparc.lines.esim.category',
        value: 'eSim',
        meta: { label: 'eSim', value: 'ESIM' },
      },
      {
        id: 'indicators.getparc.lines.esim.type',
        value: 'STEP2',
        meta: { label: 'STEP2', value: 'STEP2' },
      },
      {
        id: 'indicators.getparc.lines.esim.pairedLine',
        value: 'Oui',
        meta: { label: 'Oui', value: 'YES' },
      },
    ],
  },
  {
    icon: 'ic-Plug-Icon',
    title: 'getparc.actCreation.carouselItem.esim.CHANGE_STATUS_PROFIL_ESIM',
    id: 'CHANGE_STATUS_PROFIL_ESIM',
    stepTitle: 'getparc.actCreation.step2Titles.configure',
    selected: false,
    permission: { domain: 'act', action: 'manage_esim' },
    esimAct: true,
    filters: [
      { id: 'filters.lines.SIMCardStatus', values: [{ id: 'ACTIVATED', label: 'Activée' }] },
      {
        id: 'indicators.getparc.lines.esim.category',
        value: 'eSim',
        meta: { label: 'eSim', value: 'ESIM' },
      },
      {
        id: 'indicators.getparc.lines.esim.pairedLine',
        value: 'Oui',
        meta: { label: 'Oui', value: 'YES' },
      },
    ],
  },
  {
    icon: 'ic-Plug-Icon',
    title: 'getparc.actCreation.carouselItem.esim.FREE_RESERVATION',
    id: 'FREE_RESERVATION',
    stepTitle: 'getparc.actCreation.step2Titles.configure',
    selected: false,
    esimAct: true,
    permission: { domain: 'act', action: 'manage_esim' },
    filters: [
      {
        id: 'indicators.getparc.lines.esim.category',
        value: 'eSim',
        meta: { label: 'eSim', value: 'ESIM' },
      },
      {
        id: 'indicators.getparc.lines.esim.type',
        value: 'STEP2',
        meta: { label: 'STEP2', value: 'STEP2' },
      },
      {
        id: 'filters.lines.SIMCardStatus',
        values: [{ id: 'NOT_PREACTIVATED', label: 'Non préactivée' }],
      },
    ],
  },
  {
    icon: 'ic-Plug-Icon',
    title: 'getparc.actCreation.carouselItem.esim.PAIRING',
    id: 'PAIRING',
    stepTitle: 'getparc.actCreation.step2Titles.PAIRING',
    selected: false,
    esimAct: true,
    permission: { domain: 'act', action: 'manage_esim' },
    filters: [
      {
        id: 'indicators.getparc.lines.esim.category',
        value: 'eSim',
        meta: { label: 'eSim', value: 'ESIM' },
      },
      {
        id: 'indicators.getparc.lines.esim.type',
        value: 'STEP2',
        meta: { label: 'STEP2', value: 'STEP2' },
      },
      {
        id: 'indicators.getparc.lines.esim.pairedLine',
        value: 'Non',
        meta: { label: 'Non', value: 'NO' },
      },
    ],
  },
]);
