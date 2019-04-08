// TODO: réfactorer / séparer ce fichier après le merge des autres filtres
import { fetchCustomFields } from '@/api/customFields';
import { searchOrders } from '@/api/orders';
import get from 'lodash.get';

export const namespaced = true;

export const state = {
  allAvailableFilters: [],
  currentFilters: [],
  filterCustomFieldsList: [],
  appliedFilters: [],
  ordersResponse: [],
  orderPage: 1,
  orderIsLoading: false,
  defaultAppliedFilters: [],
};

// Getters

const selectedFilterValuesById = state => id => {
  const found = state.currentFilters.find(c => c.id === id);
  if (found) return found.values;
  return [];
};

// NOTE: en inversant l'ordre de paramètres on peut passer
// direcment le résultat de la fonction au getter
const findFilterValuesById = id => state => {
  const found = state.currentFilters.find(c => c.id === id);
  return found ? found.values : [];
};

export const getters = {
  allAvailableFilters: state => state.allAvailableFilters,
  orderPage: state => state.orderPage,
  currentFilters: state => state.currentFilters,
  ordersResponse: state => state.ordersResponse,
  appliedFilters: state => state.appliedFilters,
  orderIsLoading: state => state.orderIsLoading,
  canShowSelectedFilter: state =>
    !!state.currentFilters.find(
      f =>
        !f.hidden &&
        ((f.values && f.values.length > 0) || !!f.value || f.startDate || f.from || f.to)
    ),
  filterCustomFieldsList: state => state.filterCustomFieldsList,
  // TODO: utiliser findFilterValuesById au lieu de selectedFilterValuesById
  // -> ne crée pas de fonction à chaque get
  selectedPartnersValues: findFilterValuesById('filters.partners'),
  selectedBillingAccountsValues: findFilterValuesById('filters.billingAccounts'),
  // TODO: à faire pour les autres
  selectedOffersValues: state => {
    return selectedFilterValuesById(state)('filters.offers');
  },
  selectedOrderCreatorValues: state => {
    return selectedFilterValuesById(state)('filters.orderCreator');
  },
  selectedCustomFieldsValues: state => {
    return selectedFilterValuesById(state)('filters.customFields');
  },
  // TODO: values dans le nom mais retourne l'objet entier
  selectedQuantityValues: state => {
    return state.currentFilters.find(c => c.id === 'filters.quantity');
  },
  selectedPostalCodeValue: state => {
    const found = state.currentFilters.find(c => c.id === 'filters.postalCode');
    return found ? found.value : '';
  },
  selectedCityValue: state => {
    const found = state.currentFilters.find(c => c.id === 'filters.city');
    return found ? found.value : '';
  },
  selectedOrderStatus: state => {
    return selectedFilterValuesById(state)('filters.orderStatus');
  },
  selectedAction: state => {
    return selectedFilterValuesById(state)('filters.action');
  },
  selectedOrderDate: state => state.currentFilters.find(f => f.id === 'filters.orderDate'),
  selectedDeliveryCountries: state => selectedFilterValuesById(state)('filters.countries'),
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

function clearAppliedFilters(state) {
  state.appliedFilters = [...state.defaultAppliedFilters];
}

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

function selectFilterValue(state, { id, ...rest }) {
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

function initFilterForPartnerUser(store) {
  if (store.rootGetters.userIsPartner) {
    const partnerFilterValues = [
      {
        id: store.rootGetters.userInfos.party.id,
        label: store.rootGetters.userInfos.party.name,
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
}

export const actions = {
  setPartnersFilter,
  initFilterForPartnerUser,
  initFilterForContext(store) {
    if (store.rootGetters.userIsPartner) {
      initFilterForPartnerUser(store);
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

    const defaultPartnerTypesValues = get(store, 'rootState.userContext.contextPartnersTypes', []);

    if (defaultPartnerTypesValues.length) {
      defaultFilters.push({
        id: 'filters.partnerTypes',
        values: defaultPartnerTypesValues,
        hidden: true,
      });
    }

    store.commit('setDefaultFilter', defaultFilters);
    store.commit('clearAllFilters');
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
      store.commit('clearAllFilters');
    }
  },

  async fetchOrdersFromApi({ commit }, { orderBy, pageInfo, appliedFilters }) {
    commit('startLoading');
    commit('setOrdersResponse', await searchOrders(orderBy, pageInfo, appliedFilters));
    commit('stopLoading');
  },
};

// Mutations

export const mutations = {
  selectFilterValue,
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
      values: billingAccounts,
    });
  },
  setOffersFilter(state, offers) {
    selectFilterValue(state, {
      id: 'filters.offers',
      values: offers,
    });
  },
  setPostalCodeFilter(state, postal) {
    selectFilterValue(state, {
      id: 'filters.postalCode',
      value: postal,
    });
  },
  setCityFilter(state, city) {
    selectFilterValue(state, {
      id: 'filters.city',
      value: city,
    });
  },

  setOrderStatusFilter(state, values) {
    selectFilterValue(state, {
      id: 'filters.orderStatus',
      values,
    });
  },

  setActionFilter(state, values) {
    selectFilterValue(state, {
      id: 'filters.action',
      values,
    });
  },

  setOrderCreatorFilter(state, creators) {
    selectFilterValue(state, {
      id: 'filters.orderCreator',
      values: creators,
    });
  },
  applyFilters(state) {
    let currentFilters = state.currentFilters;
    // Décider si on ajoute les partenaires choisis par défaut
    const defaultPartnerTypes = state.defaultAppliedFilters.find(
      f => f.id === 'filters.partnerTypes'
    );
    const additionalFilters = [];

    if (defaultPartnerTypes) {
      additionalFilters.push(defaultPartnerTypes);
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
  },
  forceAppliedFilters(state, values) {
    state.appliedFilters = [...values];
    state.currentFilters = [];
  },
  setCustomFieldsFilter(state, customFields) {
    selectFilterValue(state, {
      id: 'filters.customFields',
      values: customFields,
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

    selectFilterValue(state, {
      id: 'filters.orderDate',
      startDate,
      endDate,
    });
  },
  setQuantityFilter(state, { from, to }) {
    selectFilterValue(state, {
      id: 'filters.quantity',
      // value: value,
      from,
      to,
    });
  },

  setDeliveryCountriesFilter(state, countries) {
    selectFilterValue(state, {
      id: 'filters.countries',
      values: countries,
    });
  },

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

  setOrdersResponse(state, ordersResponse) {
    state.ordersResponse = ordersResponse;
  },
  setPage(state, newPage) {
    state.orderPage = newPage;
  },

  setDefaultFilter(state, defaultFilter) {
    state.defaultAppliedFilters = [...defaultFilter];
  },

  clearAllFilters(state) {
    state.currentFilters = [];
    clearAppliedFilters(state);
  },

  restartFilters(state) {
    state.currentFilters = [];
    state.appliedFilters = [...state.defaultAppliedFilters];
  },

  startLoading(state) {
    state.orderIsLoading = true;
  },
  stopLoading(state) {
    state.orderIsLoading = false;
  },
};
