import { fetchPossibleFilters } from '@/api/filters';

export const state = {
  allAvailableFilters: [],
  currentFilters: [],
};

// Getteres

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
  canShowSelectedFilter: state => {
    const filtersFound = state.currentFilters.filter(f => f.values && f.values.length > 0);
    return !!filtersFound && !!filtersFound.length;
  },
  selectedFilterValuesById,
  selectedPartnersValues: state => {
    return selectedFilterValuesById(state)('filters.partners');
  },
  selectedBillingAccountsValues: state => {
    return selectedFilterValuesById(state)('filters.billingAccounts');
  },
};

// Actions

function setPartnersFilter({ commit, getters }, partners) {
  commit('selectFilterValue', {
    id: 'filters.partners',
    newValue: partners,
  });
  const baWithPartnersSelected = getters.selectedBillingAccountsValues.filter(a =>
    partners.find(p => p.id === a.partnerId)
  );

  commit('setBillingAccountsFilter', baWithPartnersSelected);
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
}

export const actions = {
  async loadPossibleFilters({ commit }) {
    commit('setAvailableFilters', await fetchPossibleFilters());
  },

  setPartnersFilter,

  clearFilter(store, filterId) {
    if (filterId === 'filters.partners') {
      setPartnersFilter(store, []);
    } else {
      store.commit('selectFilterValue', {
        id: filterId,
        newValue: [],
      });
    }
  },
};

// Mutations

export const mutations = {
  setAvailableFilters: (state, data) => {
    state.allAvailableFilters = data;
  },
  selectFilterValue,

  setBillingAccountsFilter(state, billingAccounts) {
    selectFilterValue(state, {
      id: 'filters.billingAccounts',
      newValue: billingAccounts,
    });
  },
};
