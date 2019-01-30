// TODO: réfactorer / séparer ce fichier après le merge des autres filtres
import { fetchCustomFields } from '@/api/customFields';

export const state = {
  allAvailableFilters: [],
  currentFilters: [],
  filterCustomFieldsList: [],
  appliedFilters: [],
};

// Getters

const selectedFilterValuesById = state => id => {
  const foundFilters = state.currentFilters.filter(c => c.id === id);
  if (foundFilters && foundFilters.length) {
    return foundFilters[0].values;
  }
  return [];
};

export const getters = {
  allAvailableFilters: state => state.allAvailableFilters,
  currentFilters: state => state.currentFilters,
  appliedFilters: state => state.appliedFilters,
  canShowSelectedFilter: state => {
    const filtersFound = state.currentFilters.filter(
      f => (f.values && f.values.length > 0) || !!f.value || f.startDate
    );
    return !!filtersFound && !!filtersFound.length;
  },
  filterCustomFieldsList: state => state.filterCustomFieldsList,
  selectedPartnersValues: state => {
    return selectedFilterValuesById(state)('filters.partners');
  },
  selectedBillingAccountsValues: state => {
    return selectedFilterValuesById(state)('filters.billingAccounts');
  },
  selectedOffersValues: state => {
    return selectedFilterValuesById(state)('filters.offers');
  },
  selectedOrderCreatorValues: state => {
    return selectedFilterValuesById(state)('filters.orderCreator');
  },
  selectedCustomFieldsValues: state => {
    return selectedFilterValuesById(state)('filters.customFields');
  },
  selectedQuantityValues: state => {
    return state.currentFilters.find(c => c.id === 'filters.quantity');
  },

  selectedOrderDate: state => state.currentFilters.find(f => f.id === 'filters.orderDate'),
};

// Actions
/**
 * Met à jour les partenaires selectionnées
 * enlève les Comptes de facturations et Offres de partenaires non séléctionnés
 * met à jour les champs libres
 */
async function setPartnersFilter({ commit, getters }, partners) {
  commit('selectFilterValueNEW', {
    id: 'filters.partners',
    values: partners,
  });

  removeSelectedBillingAccountWithNoSelectedPartners({ commit, getters }, partners);
  removeSelectedOffersWithNoSelectedPartners({ commit, getters }, partners);
  removeSelectedOrderCreatorPartners({ commit, getters }, partners);
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

function removeSelectedOrderCreatorPartners({ commit, getters }, partners) {
  const creatorWithPartnerSelected = getters.selectedOrderCreatorValues.filter(a =>
    partners.find(p => p.id === a.partnerId)
  );
  commit('setOrderCreatorFilter', creatorWithPartnerSelected);
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

function resetSearchWhenCurrentFiltersAreEmpty(state) {
  const filtersWithArrayValues = state.currentFilters.filter(f => f.values && f.values.length > 0);
  const filtersWithSimpleValue = state.currentFilters.filter(f => f.value);
  const filtersWithDateValues = state.currentFilters.filter(f => f.startDate && f.endDate);
  const filtersWithRangeValues = state.currentFilters.filter(f => f.from && f.to);

  if (
    filtersWithArrayValues.length === 0 &&
    filtersWithSimpleValue.length === 0 &&
    filtersWithDateValues.length === 0 &&
    filtersWithRangeValues.length === 0
  ) {
    state.appliedFilters = [];
  }
}

/**
 * DEPRECATED remove this after all others branches are merged
 */
function selectFilterValue(state, { id, newValue }) {
  const isFilterFound = state.currentFilters.find(f => f.id === id);
  if (isFilterFound) {
    state.currentFilters = state.currentFilters.map(f => {
      if (f.id === id) {
        f.values = newValue;
      }
      return f;
    });
  } else {
    state.currentFilters.push({
      id,
      values: newValue,
    });
  }

  resetSearchWhenCurrentFiltersAreEmpty(state);
}

function selectFilterValueNEW(state, { id, ...rest }) {
  const isFilterFound = state.currentFilters.find(f => f.id === id);
  if (isFilterFound) {
    state.currentFilters = state.currentFilters.map(f => {
      if (f.id === id) {
        return { id, ...rest };
      }
      return f;
    });
  } else {
    state.currentFilters.push({
      id,
      ...rest,
    });
  }

  resetSearchWhenCurrentFiltersAreEmpty(state);
}

export const actions = {
  setPartnersFilter,

  clearFilter(store, filterId) {
    /**
     * Le cas partenaire est spécial, car à chaque modification on doit mettre à jour les valeurs qui en dépendent
     */
    if (filterId === 'filters.partners') {
      setPartnersFilter(store, []);
    } else {
      store.commit('setCurrentFilters', store.state.currentFilters.filter(f => f.id !== filterId));
    }
    store.commit('applyFilters');
  },
};

// Mutations

export const mutations = {
  selectFilterValue,
  selectFilterValueNEW,
  setCurrentFilters: (state, currentFilters) => {
    state.currentFilters = currentFilters;
  },
  setAvailableFilters: (state, data) => {
    state.allAvailableFilters = data;
  },
  setFilterCustomFieldsList: (state, data) => {
    state.filterCustomFieldsList = data;
  },
  setBillingAccountsFilter(state, billingAccounts) {
    selectFilterValue(state, {
      id: 'filters.billingAccounts',
      newValue: billingAccounts,
    });
  },
  setOffersFilter(state, offers) {
    selectFilterValue(state, {
      id: 'filters.offers',
      newValue: offers,
    });
  },
  setOrderCreatorFilter(state, creators) {
    selectFilterValue(state, {
      id: 'filters.orderCreator',
      newValue: creators,
    });
  },
  applyFilters(state) {
    state.appliedFilters = [...state.currentFilters];
  },
  setCustomFieldsFilter(state, customFields) {
    selectFilterValue(state, {
      id: 'filters.customFields',
      newValue: customFields,
    });
  },

  /**
   * Set the date range filter for an order. Do not set the date if
   * startDate or endDate is missing
   * @param {*} state
   * @param {{startDate: string, endDate: string}} payload
   */
  setOrderDateFilter(state, { startDate, endDate }) {
    if (!startDate || !endDate) return;

    selectFilterValueNEW(state, {
      id: 'filters.orderDate',
      startDate,
      endDate,
    });
  },
  setQuantityFilter(state, { value, from, to }) {
    selectFilterValueNEW(state, {
      id: 'filters.quantity',
      value: value,
      from,
      to,
    });
  },
};
