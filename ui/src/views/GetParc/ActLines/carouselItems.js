import { excludeMocked } from '@/featureFlipping/plugin';

export default excludeMocked([
  {
    icon: 'ic-Plug-Icon',
    title: 'getparc.actCreation.carouselItem.ACTIVATE_PREACTIVATE',
    stepTitle: 'getparc.actCreation.step2Titles.ACTIVATE_PREACTIVATE',
    selected: false,
    // havePrereqs: true,
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
    stepTitle: 'getparc.actCreation.step2Titles.CUSTOM_FIELDS',
    subtitle: '',
    selected: false,
    hideForMVNO: true,
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
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_SERVICES',
    subtitle: '',
    selected: false,
    havePrereqs: true,
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
    icon: 'ic-pause-circle',
    title: 'getparc.actCreation.carouselItem.SUSPEND',
    stepTitle: 'getparc.actCreation.step2Titles.SUSPEND',
    subtitle: '',
    selected: false,
    color: 'blue',
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
    stepTitle: 'getparc.actCreation.step2Titles.SUSPEND',
    subtitle: '',
    selected: false,
    color: 'red',
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'SUSPENDED',
            label: 'Suspendu',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Sim-Icon',
    title: 'getparc.actCreation.carouselItem.CHANGE_SIMCARD',
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_SIMCARD',
    selected: false,
    containFile: true,
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
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_MSISDN',
    selected: false,
    containFile: true,
    hideForMVNO: true,
    permission: { domain: 'act', action: 'msisdn_change' },
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
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_OFFER',
    subtitle: '',
    selected: false,
    havePrereqs: true,
    color: 'blue',
    hideForMVNO: true,
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
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_CF',
    subtitle: '',
    selected: false,
    havePrereqs: true,
    hideForMVNO: true,
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
    stepTitle: 'getparc.actCreation.carouselItem.REACTIVATE',
    subtitle: '',
    selected: false,
    color: 'blue',
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
    stepTitle: 'getparc.actCreation.step2Titles.TRANSFERT_LINES',
    subtitle: '',
    selected: false,
    boOnly: true,
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
    stepTitle: 'getparc.actCreation.step2Titles.MANAGE_CANCELLATION',
    subtitle: '',
    selected: false,
    color: 'orange',
    boOnly: true,
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
            label: 'demandeDeResiliation',
          },
        ],
      },
    ],
  },
  {
    icon: 'ic-Arrow-Forward-Icon',
    title: 'getparc.actCreation.carouselItem.TEST_PHASE',
    stepTitle: 'getparc.actCreation.step2Titles.TEST_PHASE',
    subtitle: '',
    selected: false,
    hideForMVNO: true,
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
    stepTitle: 'getparc.actCreation.carouselItem.SEND_SMS',
    subtitle: '',
    selected: false,
    hideForMVNO: true,
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
    stepTitle: 'getparc.actCreation.step2Titles.CHANGE_STATUS',
    subtitle: '',
    selected: false,
    color: 'orange',
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
    stepTitle: 'getparc.actCreation.carouselItem.SIM_TRANSFER',
    subtitle: '',
    selected: false,
    restrictPartnerType: 'MVNO',
    color: 'orange',
    hideForMVNO: true,
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
]);
