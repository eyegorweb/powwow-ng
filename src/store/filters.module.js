// TODO: réfactorer / séparer ce fichier après le merge des autres filtres
import { fetchCustomFields } from '@/api/customFields';

export const state = {
  allAvailableFilters: [],
  currentFilters: [],
  filterCustomFields: [],
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
    const filtersFound = state.currentFilters.filter(f => f.values && f.values.length > 0);
    return !!filtersFound && !!filtersFound.length;
  },
  filterCustomFields: state => state.filterCustomFields,
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
};

// Actions
/**
 * Met à jour les partenaires selectionnées
 * enlève les Comptes de facturations et Offres de partenaires non séléctionnés
 * met à jour les champs libres
 */
async function setPartnersFilter({ commit, getters }, partners) {
  commit('selectFilterValue', {
    id: 'filters.partners',
    newValue: partners,
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
    const customFields = await fetchCustomFields(partners);
    commit('setFilterCustomFields', customFields);
  } else {
    commit('setFilterCustomFields', []);
  }
}

function resetSearchWhenCurrentFiltersAreEmpty(state) {
  const filtersWithValues = state.currentFilters.filter(f => f.values && f.values.length > 0);
  if (filtersWithValues.length === 0) {
    state.appliedFilters = [];
  }
}

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

export const actions = {
  setPartnersFilter,

  clearFilter(store, filterId) {
    /**
     * Le cas partenaire est spécial, car à chaque modification on doit mettre à jour les valeurs qui en dépendent
     */
    if (filterId === 'filters.partners') {
      setPartnersFilter(store, []);
    } else {
      store.commit('selectFilterValue', {
        id: filterId,
        newValue: [],
      });
    }
    store.commit('applyFilters');
  },
};

// Mutations

export const mutations = {
  setAvailableFilters: (state, data) => {
    state.allAvailableFilters = data;
  },
  setFilterCustomFields: (state, data) => {
    state.filterCustomFields = data;
  },
  selectFilterValue,

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
};
