import * as filterUtils from '@/store/filterUtils';
import { fetchCustomFields } from '@/api/customFields';
import { searchLines } from '@/api/linesActions';

const selectedFilterValuesById = filterUtils.selectedFilterValuesById;
const findFilterValuesById = filterUtils.findFilterValuesById;
const findFilterById = filterUtils.findFilterById;
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
  filterCustomFieldsList: [],

  selectedLinesForActCreation: [],
  actToCreate: null,
};

export const getters = {
  ...filterUtils.initGetters(),
  linePage: state => state.linePage,
  linesActionsResponse: state => state.linesActionsResponse,
  selectedPartnersValues: findFilterValuesById('filters.partners'),
  selectedSimStatusesValues: findFilterValuesById('filters.lines.SIMCardStatus'), // deprecated
  selectedSimStatuses: findFilterById('filters.lines.SIMCardStatus'),
  selectedBillingAccountsValues: findFilterValuesById('filters.billingAccounts'),
  selectedNetworkStatusesValues: findFilterValuesById('filters.lines.networkStatus'),
  selectedBilligStatusesValues: findFilterValuesById('filters.lines.billingStatus'),
  selectedTypeSimCardValues: state => {
    return selectedFilterValuesById(state)('filters.lines.typeSIMCard');
  },
  selectedCommercialStatusesValues: state => {
    return selectedFilterValuesById(state)('filters.lines.commercialStatus');
  },
  selectedOrderIdValue: findFilterValueById('filters.lines.orderID'),
  selectedOrderRefValue: findFilterValueById('filters.orderReference'),
  selectedPostalCodeValue: findFilterValueById('filters.postalCode'),
  selectedSirensValue: findFilterValueById('filters.lines.siren'),
  selectedActionIDValue: findFilterValueById('filters.lines.actionId'),
  selectedOffersValues: state => {
    return selectedFilterValuesById(state)('filters.lines.associatedOffer');
  },
  selectedProfileStatesValues: state => {
    return selectedFilterValuesById(state)('filters.lines.states');
  },
  selectedLigneTrafiquanteValue: state => {
    return selectedFilterValuesById(state)('filters.lines.traffic');
  },

  selectedDate: state => filterKey => state.currentFilters.find(f => f.id === filterKey),
  selectedDeliveryCountries: state => selectedFilterValuesById(state)('filters.countries'),
  filterCustomFieldsList: state => state.filterCustomFieldsList,
  selectedCustomFieldsValues: state => selectedFilterValuesById(state)('filters.customFields'),
  selectedICCIDValue: findFilterValueById('filters.lines.rangeICCID'),
  selectedIMSIValue: findFilterValueById('filters.lines.rangeIMSI'),
  selectedMSISDNValue: findFilterValueById('filters.lines.rangeMSISDN'),
  selectedIMEIValue: findFilterValueById('filters.lines.rangeIMEI'),
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
  await refreshCustomFilters({ commit }, partners);
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

async function refreshCustomFilters({ commit }, partners) {
  if (partners.length === 1) {
    // appel api pour charger les custom fields
    const customFields = await fetchCustomFields(partners[0].id);
    commit('setFilterCustomFieldsList', customFields);
  } else {
    commit('setFilterCustomFieldsList', []);
  }

  // enlever les filtres séléctionnés de la synthèse
  commit('setCustomFieldsFilter', []);
}

// Actions
import differenceWith from 'lodash.differencewith';

export const actions = {
  setPartnersFilter,
  initFilterForContext,
  refreshCustomFilters,

  mergeCurrentFiltersWith(store, actFilters) {
    const currentFiltersWithoutActFilters = differenceWith(
      store.state.currentFilters,
      actFilters,
      (c, a) => c.id === a.id
    );
    const newCurrentFilters = [...currentFiltersWithoutActFilters, ...actFilters];
    store.commit('setCurrentFilters', newCurrentFilters);
    store.commit('applyFilters');
  },

  addLineForActCreation(store, line) {
    // check if line is already there
    const isLinePresent = store.state.selectedLinesForActCreation.find(l => l.id === line.id);

    if (!isLinePresent) {
      store.commit('setSelectedLinesForActCreation', [
        ...store.state.selectedLinesForActCreation,
        line,
      ]);
    }
  },
  removeLineFromActCreation(store, line) {
    const isLinePresent = store.state.selectedLinesForActCreation.find(l => l.id === line.id);
    if (isLinePresent) {
      store.commit('setSelectedLinesForActCreation', [
        ...store.state.selectedLinesForActCreation.filter(l => l.id !== line.id),
      ]);
    }
  },
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
    commit('startLoading');
    commit('setLinesActionsResponse', await searchLines(orderBy, pageInfo, appliedFilters));
    commit('stopLoading');
  },
};

// Mutations

export const mutations = {
  ...filterUtils.initMutations(),
  clearAllFilters(state) {
    state.currentFilters = [];
    state.filterCustomFieldsList = [];
    filterUtils.clearAppliedFilters(state);
  },
  setFilterCustomFieldsList: (state, data) => {
    state.filterCustomFieldsList = data;
  },
  setCustomFieldsFilter(state, customFields) {
    selectFilterValue(state, {
      id: 'filters.customFields',
      values: customFields,
    });
  },
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
  setCommercialStatusesFilter(state, types) {
    selectFilterValue(state, {
      id: 'filters.lines.commercialStatus',
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
  setActionIdFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.lines.actionId',
      value,
    });
  },
  setOffersFilter(state, offers) {
    selectFilterValue(state, {
      id: 'filters.lines.associatedOffer',
      values: offers,
    });
  },
  setProfileStatesFilter(state, statuses) {
    selectFilterValue(state, {
      id: 'filters.lines.states',
      values: statuses,
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
  setLligneTrafiquanteFilter(state, statuses) {
    selectFilterValue(state, {
      id: 'filters.lines.traffic',
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

  setDeliveryCountriesFilter(state, countries) {
    selectFilterValue(state, {
      id: 'filters.countries',
      values: countries,
    });
  },
  selectICCIDFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.lines.rangeICCID',
      value,
    });
  },
  selectIMSIFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.lines.rangeIMSI',
      value,
    });
  },
  selectMSISDNFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.lines.rangeMSISDN',
      value,
    });
  },
  selectIMEIFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.lines.rangeIMEI',
      value,
    });
  },
  // to refactor, duplicated
  updateSelectedDeliveryCountriesLabels(state, countries) {
    const countryDict = countries.reduce((dict, country) => {
      dict[country.code] = country.name;
      return dict;
    }, {});

    selectFilterValue(state, {
      id: 'filters.countries',
      values: selectedFilterValuesById(state)('filters.countries').map(country => ({
        ...country,
        label: countryDict[country.id],
      })),
    });
  },

  setSelectedLinesForActCreation(state, selectedLines) {
    state.selectedLinesForActCreation = selectedLines;
  },

  setActToCreate(state, act) {
    state.actToCreate = act;
  },
};
