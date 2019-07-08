// TODO: réfactorer / séparer ce fichier après le merge des autres filtres
import { fetchCustomFields } from '@/api/customFields';
import { searchOrders } from '@/api/orders';

import * as filterUtils from './filterUtils';

const selectedFilterValuesById = filterUtils.selectedFilterValuesById;
const findFilterValuesById = filterUtils.findFilterValuesById;
const selectFilterValue = filterUtils.selectFilterValue;
const initFilterForPartnerUser = store => {
  filterUtils.initFilterForPartnerUser(store, setPartnersFilter);
};
const initFilterForContext = store => {
  filterUtils.initFilterForContext(store, setPartnersFilter);
};

export const namespaced = true;

export const state = {
  ...filterUtils.initState(),
  filterCustomFieldsList: [],
  ordersResponse: [],
  orderPage: 1,
  indicatorsVersion: 1,
};

// Getters

export const getters = {
  ...filterUtils.initGetters(),
  orderPage: state => state.orderPage,
  ordersResponse: state => state.ordersResponse,
  filterCustomFieldsList: state => state.filterCustomFieldsList,
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
  selectedTypeSimCardValues: state => {
    return selectedFilterValuesById(state)('filters.lines.typeSIMCard');
  },
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

async function resetOrderFilters(store) {
  store.commit('clearAllFilters');
  initFilterForContext(store);
}

export const actions = {
  setPartnersFilter,
  refreshCustomFilters,
  initFilterForPartnerUser,
  initFilterForContext,
  resetOrderFilters,

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
  ...filterUtils.initMutations(),
  clearAllFilters(state) {
    state.currentFilters = [];
    state.filterCustomFieldsList = [];
    filterUtils.clearAppliedFilters(state);
  },
  selectFilterValue,

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
  setTypeSimCardFilter(state, types) {
    selectFilterValue(state, {
      id: 'filters.lines.typeSIMCard',
      values: types,
    });
  },

  refreshIndicators(state) {
    state.indicatorsVersion += 1;
  },
};
