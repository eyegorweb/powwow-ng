import * as filterUtils from '@/store/filterUtils';
import { searchLines } from '@/api/linesActions';

const selectedFilterValuesById = filterUtils.selectedFilterValuesById;
const findFilterValuesById = filterUtils.findFilterValuesById;
const selectFilterValue = filterUtils.selectFilterValue;
const findFilterValueById = filterUtils.findFilterValueById;

const initFilterForContext = store => {
  filterUtils.initFilterForContext(store, setPartnersFilter);
};

export const namespaced = true;

export const state = {
  ...filterUtils.initState(),
  linePage: 1,
  linesActionsResponse: [],
};

export const getters = {
  ...filterUtils.initGetters(),
  linePage: state => state.linePage,
  linesActionsResponse: state => state.linesActionsResponse,
  selectedPartnersValues: findFilterValuesById('filters.partners'),
  selectedSimStatusesValues: findFilterValuesById('filters.lines.SIMCardStatus'),
  selectedBillingAccountsValues: findFilterValuesById('filters.billingAccounts'),
  selectedNetworkStatusesValues: findFilterValuesById('filters.lines.networkStatus'),
  selectedBilligStatusesValues: findFilterValuesById('filters.lines.billingStatus'),
  selectedTypeSimCardValues: state => {
    return selectedFilterValuesById(state)('filters.lines.typeSIMCard');
  },
  selectedOrderIdValue: findFilterValueById('filters.lines.orderID'),
  selectedOrderRefValue: findFilterValueById('filters.orderReference'),
  selectedPostalCodeValue: findFilterValueById('filters.postalCode'),
  selectedSirensValue: findFilterValueById('filters.lines.siren'),
  selectedOffersValues: state => {
    return selectedFilterValuesById(state)('filters.lines.associatedOffer');
  },

  selectedDate: state => filterKey => state.currentFilters.find(f => f.id === filterKey),
};

// Actions
/**
 * Met à jour les partenaires selectionnées
 * enlève les Comptes de facturations et Offres de partenaires non séléctionnés
 * met à jour les champs libres
 */
async function setPartnersFilter({ commit, getters }, partners, isHidden) {
  commit('selectFilterValue', {
    id: 'filters.partners',
    values: partners,
    hidden: isHidden,
  });
  removeSelectedBillingAccountWithNoSelectedPartners({ commit, getters }, partners);
  removeSelectedOffersWithNoSelectedPartners({ commit, getters }, partners);
}

function removeSelectedBillingAccountWithNoSelectedPartners({ commit, getters }, partners) {
  const baWithPartnersSelected = getters.selectedBillingAccountsValues.filter(a =>
    partners.find(p => p.id === a.partnerId)
  );
  commit('setBillingAccountsFilter', baWithPartnersSelected);
}

function removeSelectedOffersWithNoSelectedPartners({ commit, getters }, partners) {
  const withPartnersSelected = getters.selectedOffersValues.filter(a =>
    partners.find(p => p.id === a.partnerId)
  );
  commit('setOffersFilter', withPartnersSelected);
}

// Mutation

export const actions = {
  setPartnersFilter,
  initFilterForContext,
  clearFilter(store, filterId) {
    /**
     * Le cas partenaire est spécial, car à chaque modification on doit mettre à jour les valeurs qui en dépendent
     */
    const filteredFilters = store.state.currentFilters.filter(f => f.id !== filterId);
    if (filterId === 'filters.partners') {
      setPartnersFilter(store, []);
    } else {
      store.commit('setCurrentFilters', filteredFilters);
    }
    // déclencher une recherche si plus aucun filtre n'est selectionné
    if (!store.getters.canShowSelectedFilter) {
      store.commit('applyFilters');
    }
  },
  async fetchLinesActionsFromApi({ commit }, { orderBy, pageInfo, appliedFilters }) {
    // commit('startLoading');
    commit('setLinesActionsResponse', await searchLines(orderBy, pageInfo, appliedFilters));
    // commit('stopLoading');
  },
};

// Mutations

export const mutations = {
  ...filterUtils.initMutations(),
  setPage(state, newPage) {
    state.linePage = newPage;
  },
  setLinesActionsResponse(state, actLines) {
    state.linesActionsResponse = actLines;
  },
  selectFilterValue,
  setCurrentFilters: (state, currentFilters) => {
    state.currentFilters = currentFilters;
  },
  setBillingAccountsFilter(state, billingAccounts) {
    selectFilterValue(state, {
      id: 'filters.billingAccounts',
      values: billingAccounts,
    });
  },
  setTypeSimCardFilter(state, types) {
    selectFilterValue(state, {
      id: 'filters.lines.typeSIMCard',
      values: types,
    });
  },
  selectOrderIdFilter(state, orderId) {
    selectFilterValue(state, {
      id: 'filters.lines.orderID',
      value: orderId,
    });
  },
  selectOrderRefFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.orderReference',
      value,
    });
  },
  selectPostalCodeFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.postalCode',
      value,
    });
  },
  selectSirensFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.lines.siren',
      value,
    });
  },
  setOffersFilter(state, offers) {
    selectFilterValue(state, {
      id: 'filters.lines.associatedOffer',
      values: offers,
    });
  },

  setSimStatusesFilter(state, statuses) {
    selectFilterValue(state, {
      id: 'filters.lines.SIMCardStatus',
      values: statuses,
    });
  },

  setBilligStatusesFilter(state, statuses) {
    selectFilterValue(state, {
      id: 'filters.lines.billingStatus',
      values: statuses,
    });
  },
  setNetworkStatusesFilter(state, statuses) {
    selectFilterValue(state, {
      id: 'filters.lines.networkStatus',
      values: statuses,
    });
  },

  setDateFilter(state, { filterKey, startDate, endDate }) {
    if (!startDate || !endDate) return;

    selectFilterValue(state, {
      id: filterKey,
      startDate,
      endDate,
    });
  },
};
