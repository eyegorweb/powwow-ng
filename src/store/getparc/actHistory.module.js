export const namespaced = true;

export const state = {
  currentFilters: [],
  appliedFilters: [],
  ordersResponse: [],
  orderPage: 1,
  defaultAppliedFilters: [],
};

// NOTE: en inversant l'ordre de paramètres on peut passer
// direcment le résultat de la fonction au getter
const findFilterValuesById = id => state => {
  const found = state.currentFilters.find(c => c.id === id);
  return found ? found.values : [];
};

const selectedFilterValuesById = state => id => {
  const found = state.currentFilters.find(c => c.id === id);
  if (found) return found.values;
  return [];
};

export const getters = {
  selectedPartnersValues: findFilterValuesById('filters.partners'),
  currentFilters: state => state.currentFilters,
  canShowSelectedFilter: state =>
    !!state.currentFilters.find(
      f =>
        !f.hidden &&
        ((f.values && f.values.length > 0) || !!f.value || f.startDate || f.from || f.to)
    ),
  selectedOrderCreatorValues: state => {
    return selectedFilterValuesById(state)('filters.orderCreator');
  },
  selectedTypesValues: state => {
    return selectedFilterValuesById(state)('filters.actTypes');
  },
  selectedServicesValues: state => {
    return selectedFilterValuesById(state)('filters.services');
  },
  selectedActDate: state => state.currentFilters.find(f => f.id === 'filters.actDate'),
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

  removeSelectedOrderCreatorPartners({ commit, getters }, partners);
}

// Mutation

function resetSearchWhenCurrentFiltersAreEmpty(state) {
  const filtersWithArrayValues = state.currentFilters.filter(f => f.values && f.values.length > 0);
  const filtersWithSimpleValue = state.currentFilters.filter(f => f.value);
  const filtersWithDateValues = state.currentFilters.filter(f => f.startDate && f.endDate);
  const filtersWithRangeValues = state.currentFilters.filter(f => f.from || f.to);

  if (
    filtersWithArrayValues.length === 0 &&
    filtersWithSimpleValue.length === 0 &&
    filtersWithDateValues.length === 0 &&
    filtersWithRangeValues.length === 0
  ) {
    clearAppliedFilters(state);
  }
}

function clearAppliedFilters(state) {
  state.appliedFilters = [...state.defaultAppliedFilters];
}

function selectFilterValue(state, { id, ...rest }) {
  const isFilterFound = state.currentFilters.find(f => f.id === id);
  if (isFilterFound) {
    // TODO: à voir en terme de perf (si cela est vraiment un problème) si
    // une version avec un findIndex + splice est plus performante
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

function removeSelectedOrderCreatorPartners({ commit, getters }, partners) {
  const creatorWithPartnerSelected = getters.selectedOrderCreatorValues.filter(a =>
    partners.find(p => p.id === a.partnerId)
  );
  commit('setOrderCreatorFilter', creatorWithPartnerSelected);
}

export const actions = {
  setPartnersFilter,
  initFilterForPartnerUser(store) {
    if (store.getters.userIsPartner) {
      const partnerFilterValues = [
        {
          id: store.getters.userInfos.party.id,
          label: store.getters.userInfos.party.name,
        },
      ];
      const defaultFilters = [
        {
          id: 'filters.partners',
          values: partnerFilterValues,
          hidden: true,
        },
      ];
      store.commit('setDefaultFilter', defaultFilters);
      setPartnersFilter(store, partnerFilterValues, true);
    }
    store.commit('applyFilters');
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
    // déclencher une recherche su plus aucun filtre n'est selectionné
    if (!store.getters.canShowSelectedFilter) {
      store.commit('applyFilters');
    }
  },
};
export const mutations = {
  selectFilterValue,
  applyFilters(state) {
    state.appliedFilters = [...state.currentFilters];
  },
  setDefaultFilter(state, defaultFilter) {
    state.defaultAppliedFilters = [...defaultFilter];
  },
  setCurrentFilters: (state, currentFilters) => {
    state.currentFilters = currentFilters;
  },
  clearAllFilters(state) {
    state.currentFilters = [];
    clearAppliedFilters(state);
  },
  setOrderCreatorFilter(state, creators) {
    selectFilterValue(state, {
      id: 'filters.orderCreator',
      values: creators,
    });
  },
  setActTypesFilter(state, types) {
    selectFilterValue(state, {
      id: 'filters.actTypes',
      values: types,
    });
  },
  setServicesFilter(state, types) {
    selectFilterValue(state, {
      id: 'filters.services',
      values: types,
    });
  },
  setActDateFilter(state, { startDate, endDate }) {
    if (!startDate || !endDate) return;

    selectFilterValue(state, {
      id: 'filters.actDate',
      startDate,
      endDate,
    });
  },
};
