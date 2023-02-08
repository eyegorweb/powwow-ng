import { cloneDeep } from 'lodash';
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
    currentFilters: (state) => state.currentFilters,
    appliedFilters: (state) => state.appliedFilters,
    defaultAppliedFilters: (state) => state.defaultAppliedFilters,
    isLoading: (state) => state.isLoading,
    searchPage: (state) => state.searchPage,

    canShowSelectedFilter: (state) =>
      !!state.currentFilters.find(
        (f) =>
          !f.hidden &&
          ((f.values && f.values.length > 0) || !!f.value || f.startDate || f.from || f.to)
      ),
  };
}

export const selectedFilterValuesById = (state) => (id) => {
  const found = state.currentFilters.find((c) => c.id === id);
  if (found) return found.values;
  return [];
};

// NOTE: en inversant l'ordre de paramètres on peut passer
// direcment le résultat de la fonction au getter
export const findFilterValuesById = (id) => (state) => {
  const found = state.currentFilters.find((c) => c.id === id);
  return found ? found.values : [];
};

/**
 * Helper function to structure object
 * @param {*} values object to structure
 * @returns structures object with id and label attributes
 */
export function formattedFilterValues(values) {
  // INTERDIT de passer d'autres attributs hormis id/label au risque de faire péter la liaison
  // entre le filtre Partenaire issu des prérequis et celui de la barre de filtres de recherche…
  return values.map((v) => {
    return {
      id: v.id,
      label: v.label,
    };
  });
}
export function formattedEsimEnabled(currentPartners, { partners, partnersEsimEnabledMap }) {
  let resultPartners = [];
  // Copy Current List
  if (currentPartners) {
    resultPartners = cloneDeep(currentPartners);
  }
  let partnerIds = [];
  partners.forEach((partner) => {
    // Add selected partner id
    partnerIds.push(partner.id);
    const havePartner = resultPartners.find((p) => p.id === partner.id);
    if (!havePartner) {
      // Add new partner
      resultPartners.push({
        id: partner.id,
        label: partner.label,
        esimEnabled: partnersEsimEnabledMap.get(partner.id),
      });
    }
  });
  // return selected partners
  return resultPartners.filter((p) => partnerIds.includes(p.id));
}

export const findFilterById = (id) => (state) => {
  return state.currentFilters.find((c) => c.id === id);
};

export const findFilterValueById = (id) => (state) => {
  const found = state.currentFilters.find((c) => c.id === id);
  if (found) return found.value;
};

export function clearAppliedFilters(state) {
  state.appliedFilters = [...state.defaultAppliedFilters, ...state.routeParamsFilters];
}

export function areFiltersEmpty(filters) {
  const filtersWithArrayValues = filters.filter((f) => f.values && f.values.length > 0);
  const filtersWithSimpleValue = filters.filter((f) => f.value);
  const filtersWithDateValues = filters.filter((f) => f.startDate || f.endDate);
  const filtersWithRangeValues = filters.filter((f) => f.from || f.to);

  if (
    filtersWithArrayValues.length === 0 &&
    filtersWithSimpleValue.length === 0 &&
    filtersWithDateValues.length === 0 &&
    filtersWithRangeValues.length === 0
  ) {
    return true;
  }

  return false;
}

export function areFiltersIdentical(selectedFilters, filtersToCheck) {
  if (selectedFilters && filtersToCheck && filtersToCheck.length && selectedFilters.length) {
    if (selectedFilters.length === 0 && filtersToCheck.length === 0) return true;

    const conformFilters = filtersToCheck.filter((filter) => {
      const foundInSelected = selectedFilters.find((f) => f.id === filter.id);

      if (foundInSelected) {
        return isFilterEq(filter, foundInSelected);
      }
    });

    return filtersToCheck.length === conformFilters.length;
  }
  return false;
}

export function isFilterEq(filter1, filter2) {
  if (filter1.values) {
    if (filter2.values && filter1.values.length === filter2.values.length) {
      if (filter1.values.length === 0 && filter2.values.length === 0) return true;

      const eqElements = filter1.values.filter((f1) => {
        return !!filter2.values.find((f2) => f2.id === f1.id);
      });
      return !!eqElements.length;
    }
  }

  if (filter1.value && filter2.value) {
    return filter1.value === filter2.value;
  }

  const filter1StartDate = filter1.startDate;
  const filter1EndDate = filter1.endDate;
  const filter2StartDate = filter2.startDate;
  const filter2EndDate = filter2.endDate;

  if (filter1StartDate || filter1EndDate || filter2StartDate || filter2EndDate) {
    return filter1StartDate === filter2StartDate && filter1EndDate === filter2EndDate;
  }

  if (filter1.from || filter1.to || filter2.from || filter2.to) {
    return filter1.from === filter2.from && filter2.to === filter1.to;
  }

  return false;
}

export function resetSearchWhenCurrentFiltersAreEmpty(state) {
  if (areFiltersEmpty(state.currentFilters)) {
    clearAppliedFilters(state);
  }
}

export function selectFilterValue(state, { id, ...rest }) {
  const isFilterFound = state.currentFilters.find((f) => f.id === id);

  if (isFilterFound) {
    // Mise à jour d'un filtre

    // TODO: à voir en terme de perf (si cela est vraiment un problème) si
    // une version avec un findIndex + splice est plus performante
    state.currentFilters = state.currentFilters.map((f) => {
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
  const defaultPartnerType = state.defaultAppliedFilters.find(
    (f) => f.id === 'filters.partnerType'
  );
  const additionalFilters = [];

  if (defaultPartnerType) {
    additionalFilters.push(defaultPartnerType);
  }

  // Ajouter les partenaires par défaut si aucun partenaire n'est choisi
  const selectedPartners = currentFilters.find((f) => f.id === 'filters.partners');
  if (!selectedPartners || !selectedPartners.values || selectedPartners.values.length === 0) {
    const defaultPartners = state.defaultAppliedFilters.find((f) => f.id === 'filters.partners');
    // Enlever le partenaire vide, necessaire pour appliquer les partenaires par défaut
    currentFilters = currentFilters.filter((f) => f.id !== 'filters.partners');
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
