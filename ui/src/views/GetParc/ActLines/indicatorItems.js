import { fetchTotalMassActions } from '@/api/massActions';

export default [
  {
    name: 'notProcessedResiliations',
    labelKey: 'indicators.getparc.lines.cancellation',
    color: 'text-danger',
    clickable: false,
    filters: [
      {
        id: 'filters.lines.commercialStatus',
        values: [
          {
            id: 'demandeDeResiliation',
            label: 'demandeDeResiliation',
          },
        ],
      },
      {
        id: 'filters.lines.terminationValidated',
        value: true,
      },
    ],
  },
  // taper sur l'api massActions
  {
    name: 'failed',
    labelKey: 'indicators.getparc.lines.failed',
    color: 'text-danger',
    clickable: false,
    filters: [
      {
        id: 'filters.actStatus',
        values: [
          {
            id: 'IN_ERROR',
            label: 'En erreur',
          },
        ],
      },
    ],
    fetch: async indicator => {
      return await fetchTotalMassActions(indicator.filters);
    },
  },
  {
    name: 'simCardsInStock',
    labelKey: 'indicators.getparc.lines.availableSIMCards',
    color: 'text-success',
    clickable: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'NOT_PREACTIVATED',
            label: 'Non préactivée',
          },
        ],
      },
    ],
  },
  {
    name: 'allocatedSIMCards',
    labelKey: 'indicators.getparc.lines.allocatedSIMCards',
    color: 'text-success',
    clickable: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'PREACTIVATED',
            label: 'Préactivée',
          },
        ],
      },
    ],
  },
  {
    name: 'activatedSIMCards',
    labelKey: 'indicators.getparc.lines.activatedSIMCards',
    color: 'text-success',
    clickable: true,
    filters: [
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
            label: 'Activé',
          },
        ],
      },
    ],
  },
  {
    name: 'suspended',
    labelKey: 'indicators.getparc.lines.suspended',
    color: 'text-warning',
    clickable: true,
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
    name: 'traffic',
    labelKey: 'indicators.getparc.lines.traffic',
    color: 'text-warning',
    clickable: true,
    filters: [
      {
        id: 'filters.lines.traffic',
        values: [
          {
            id: 'lineTrafficState',
            label: 'Oui',
          },
        ],
      },
    ],
  },
  /*
  // Reporté
  {
    name: 'validation',
    labelKey: 'indicators.getparc.lines.validation',
    filters: [],
  },
  //*/
];
