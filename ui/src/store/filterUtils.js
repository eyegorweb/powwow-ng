import get from 'lodash.get';

export function initState() {
  return {
    currentFilters: [], // Filtres choisis
    appliedFilters: [], // Filtres appliqués
    routeParamsFilters: [],
    defaultAppliedFilters: [], // Filtres par défaut, utile quand on limite le contexte de l'appli à certains partenaires ( voir components/Navbar/Backoffice)
    isLoading: false,
    /**
     *  Ouverture du réultat dans le panel de détail si le résultat est unique
     */
    openResultInDetailPanel: false,

    searchResponse: undefined,
    searchPage: 1,
    limitPerPage: 20,
  };
}

export function resetState(state) {
  state.currentFilters = [];
  resetAfterFilterClear(state);
}

export function resetAfterFilterClear(state) {
  state.appliedFilters = [];
  state.routeParamsFilters = [];
  state.isLoading = false;
  state.openResultInDetailPanel = false;
  state.searchResponse = undefined;
  state.searchPage = 1;
  state.limitPerPage = 20;
}

export function clearResultsForActCreation(state) {
  state.appliedFilters = [];
  state.routeParamsFilters = [];
  state.isLoading = false;
  state.openResultInDetailPanel = false;
  state.searchResponse = undefined;
  state.searchPage = 1;
  state.limitPerPage = 20;
}

export function initGetters() {
  return {
    currentFilters: state => state.currentFilters,
    appliedFilters: state => state.appliedFilters,
    defaultAppliedFilters: state => state.defaultAppliedFilters,
    isLoading: state => state.isLoading,
    searchPage: state => state.searchPage,

    canShowSelectedFilter: state =>
      !!state.currentFilters.find(
        f =>
          !f.hidden &&
          ((f.values && f.values.length > 0) || !!f.value || f.startDate || f.from || f.to)
      ),
  };
}

export const selectedFilterValuesById = state => id => {
  const found = state.currentFilters.find(c => c.id === id);
  if (found) return found.values;
  return [];
};

// NOTE: en inversant l'ordre de paramètres on peut passer
// direcment le résultat de la fonction au getter
export const findFilterValuesById = id => state => {
  const found = state.currentFilters.find(c => c.id === id);
  return found ? found.values : [];
};

export const findFilterById = id => state => {
  return state.currentFilters.find(c => c.id === id);
};

export const findFilterValueById = id => state => {
  const found = state.currentFilters.find(c => c.id === id);
  if (found) return found.value;
};

export function clearAppliedFilters(state) {
  state.appliedFilters = [...state.defaultAppliedFilters, ...state.routeParamsFilters];
}

export function resetSearchWhenCurrentFiltersAreEmpty(state) {
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

export function selectFilterValue(state, { id, ...rest }) {
  const isFilterFound = state.currentFilters.find(f => f.id === id);
  if (isFilterFound) {
    // Mise à jour d'un filtre

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

export function initFilterForPartnerUser(store, setPartnersFilter) {
  if (store.rootGetters.userIsPartner) {
    const partnerFilterValues = [
      {
        ...store.rootGetters.userInfos.partners[0],
        id: store.rootGetters.userInfos.partners[0].id,
        label: store.rootGetters.userInfos.partners[0].name,
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

    if (setPartnersFilter)
      setPartnersFilter(store, {
        partners: partnerFilterValues,
        isHidden: true,
      });
  }
  // store.commit('applyFilters');
  store.commit('setQueryFilterAndSearch');
}

export function initFilterForContext(store, setPartnersFilter) {
  if (store.rootGetters.userIsPartner) {
    initFilterForPartnerUser(store, setPartnersFilter);
    return;
  }
  const defaultFilters = [];
  const defaultPartnersValues = get(store, 'rootState.userContext.contextPartners', []);
  if (defaultPartnersValues.length) {
    defaultFilters.push({
      id: 'filters.partners',
      values: defaultPartnersValues,
      hidden: true,
    });
  }

  const defaultPartnerTypesValue = get(store, 'rootState.userContext.contextPartnersType');

  if (defaultPartnerTypesValue) {
    defaultFilters.push({
      id: 'filters.partnerType',
      value: defaultPartnerTypesValue,
      hidden: true,
    });
  }

  store.commit('setDefaultFilter', defaultFilters);
  store.commit('setQueryFilterAndSearch');
}

export function setQueryFilterAndSearch(state) {
  state.currentFilters = [...state.routeParamsFilters];
  state.appliedFilters = [...state.defaultAppliedFilters, ...state.currentFilters];
  state.routeParamsFilters = [];
}

export function applyFilters(state) {
  let currentFilters = state.currentFilters;
  // Décider si on ajoute les partenaires choisis par défaut
  const defaultPartnerType = state.defaultAppliedFilters.find(f => f.id === 'filters.partnerType');
  const additionalFilters = [];

  if (defaultPartnerType) {
    additionalFilters.push(defaultPartnerType);
  }

  // Ajouter les partenaires par défaut si aucun partenaire n'est choisi
  const selectedPartners = currentFilters.find(f => f.id === 'filters.partners');
  if (!selectedPartners || !selectedPartners.values || selectedPartners.values.length === 0) {
    const defaultPartners = state.defaultAppliedFilters.find(f => f.id === 'filters.partners');
    // Enlever le partenaire vide, necessaire pour appliquer les partenaires par défaut
    currentFilters = currentFilters.filter(f => f.id !== 'filters.partners');
    if (defaultPartners && defaultPartners.values && defaultPartners.values.length) {
      additionalFilters.push(defaultPartners);
    }
  }

  state.appliedFilters = [...currentFilters, ...additionalFilters];
}

export function initMutations() {
  return {
    setQueryFilterAndSearch,
    applyFilters,

    setPage(state, newPage) {
      state.searchPage = newPage;
    },

    setPageLimit(state, limit) {
      state.limitPerPage = limit;
    },

    setSearchResponse(state, res) {
      state.searchResponse = res;
    },

    setOpenDetailPanel(state, value) {
      state.openResultInDetailPanel = value;
    },

    setCurrentFilters: (state, currentFilters) => {
      state.currentFilters = currentFilters;
    },
    setDefaultFilter(state, defaultFilter) {
      state.defaultAppliedFilters = [...defaultFilter];
    },
    clearAllFilters(state) {
      state.currentFilters = [...state.routeParamsFilters];
      clearAppliedFilters(state);
    },
    forceAppliedFilters(state, values) {
      state.appliedFilters = [...values];
      state.currentFilters = [];
    },

    restartFilters(state) {
      state.currentFilters = [];
      state.appliedFilters = [...state.defaultAppliedFilters];
    },

    setRouteParamsFilters(state, filters) {
      state.routeParamsFilters = [...filters];
    },

    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
  };
}
