import { fetchSingleIndicator } from '@/api/linesActions';
import { fetchTotalMassActions } from '@/api/massActions';
import moment from 'moment';

export default [
  {
    name: 'notProcessedResiliations',
    labelKey: 'indicators.getparc.lines.cancellation',
    color: 'text-danger',
    clickable: false,
    total: '-',
    roles: ['BO'],
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
    fetch: async (indicator, contextFilters) => {
      return await fetchSingleIndicator(indicator.filters, contextFilters);
    },
  },
  {
    name: 'failed',
    labelKey: 'indicators.getparc.lines.failed',
    color: 'text-danger',
    clickable: true,
    overrideClick: true,
    total: '-',
    roles: ['BO', 'PARTNER'],
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
      const dateFilter = {
        id: 'filters.actDateCreation',
        endDate: moment()
          .subtract(6, 'month')
          .format('DD/MM/YYYY'),
      };
      return await fetchTotalMassActions([...indicator.filters, dateFilter]);
    },
    hideZeroValue: true,
  },
  {
    name: 'simCardsInStock',
    labelKey: 'indicators.getparc.lines.availableSIMCards',
    color: 'text-success',
    clickable: true,
    total: '-',
    roles: ['PARTNER'],
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
    fetch: async (indicator, contextFilters) => {
      return await fetchSingleIndicator(indicator.filters, contextFilters);
    },
  },
  {
    name: 'allocatedSIMCards',
    labelKey: 'indicators.getparc.lines.allocatedSIMCards',
    color: 'text-success',
    clickable: true,
    total: '-',
    roles: ['PARTNER'],
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
    fetch: async (indicator, contextFilters) => {
      return await fetchSingleIndicator(indicator.filters, contextFilters);
    },
  },
  {
    name: 'activatedSIMCards',
    labelKey: 'indicators.getparc.lines.activatedSIMCards',
    color: 'text-success',
    clickable: true,
    total: '-',
    roles: ['PARTNER'],
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
    fetch: async (indicator, contextFilters) => {
      return await fetchSingleIndicator(indicator.filters, contextFilters);
    },
  },
  {
    name: 'suspended',
    labelKey: 'indicators.getparc.lines.suspended',
    color: 'text-warning',
    clickable: true,
    total: '-',
    roles: ['BO', 'PARTNER'],
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
    fetch: async (indicator, contextFilters) => {
      return await fetchSingleIndicator(indicator.filters, contextFilters);
    },
  },
  {
    name: 'traffic',
    labelKey: 'indicators.getparc.lines.traffic',
    color: 'text-warning',
    clickable: true,
    total: '-',
    roles: ['BO'],
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
    fetch: async (indicator, contextFilters) => {
      return await fetchSingleIndicator(indicator.filters, contextFilters);
    },
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
