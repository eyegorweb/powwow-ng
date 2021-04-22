import * as filterUtils from '@/store/filterUtils';
import { fetchCustomFields } from '@/api/customFields';
import { searchLinesForTable } from '@/api/linesActions';

const selectedFilterValuesById = filterUtils.selectedFilterValuesById;
const findFilterValuesById = filterUtils.findFilterValuesById;
const findFilterById = filterUtils.findFilterById;
const selectFilterValue = filterUtils.selectFilterValue;
const findFilterValueById = filterUtils.findFilterValueById;

const removeFromCurrentById = (s, id) => {
  if (s.currentFilters && s.currentFilters.length) {
    s.currentFilters = s.currentFilters.filter((c) => c.id !== id);
  }
};

const initFilterForContext = (store) => {
  filterUtils.initFilterForContext(store, setPartnersFilter);
};

export const namespaced = true;

export const state = {
  ...filterUtils.initState(),
  linePage: 1,
  limitPerPage: 20,
  linesActionsResponse: undefined,
  filterCustomFieldsList: [],
  apiError: false,

  selectedLinesForActCreation: [],
  selectedFileForActCreation: undefined,
  actToCreate: null,
  actCreationPrerequisites: null,
  searchingById: false,

  // à incrémenter en cas de RAZ de la page
  formVersion: 0,
};

export const getters = {
  ...filterUtils.initGetters(),
  linePage: (state) => state.linePage,
  linesActionsResponse: (state) => state.linesActionsResponse,
  selectedPartnersValues: findFilterValuesById('filters.partners'),
  selectedFileImportValues: findFilterValuesById('filters.lines.fromFile.title'),
  selectedSimStatusesValues: findFilterValuesById('filters.lines.SIMCardStatus'), // deprecated
  selectedSimStatuses: findFilterById('filters.lines.SIMCardStatus'),
  selectedBillingAccountsValues: findFilterValuesById('filters.billingAccounts'),
  selectedNetworkStatusesValues: findFilterValuesById('filters.lines.networkStatus'),
  selectedBilligStatusesValues: findFilterValuesById('filters.lines.billingStatus'),
  selectedTypeSimCardValues: (state) => {
    return selectedFilterValuesById(state)('filters.lines.typeSIMCard');
  },
  selectedCommercialStatusesValues: (state) => {
    return selectedFilterValuesById(state)('filters.lines.commercialStatus');
  },
  selectedOrderIdValue: findFilterValueById('filters.lines.orderID'),
  selectedEsimIdValue: findFilterValueById('indicators.getparc.lines.esim.id'),
  selectedOrderRefValue: findFilterValueById('filters.orderReference'),
  selectedPostalCodeValue: findFilterValueById('filters.postalCode'),
  selectedSirensValue: findFilterValueById('filters.lines.siren'),
  selectedIPValue: findFilterValueById('filters.lines.ipFixe'),
  selectedActionIDValue: findFilterValueById('filters.lines.actionId'),
  selectedOffersValues: (state) => {
    return selectedFilterValuesById(state)('filters.lines.associatedOffer');
  },
  selectedProfileStatesValues: (state) => {
    return selectedFilterValuesById(state)('filters.lines.states');
  },
  selectedLigneTrafiquanteValue: (state) => {
    return selectedFilterValuesById(state)('filters.lines.traffic');
  },

  selectedDate: (state) => (filterKey) => state.currentFilters.find((f) => f.id === filterKey),
  selectedDeliveryCountries: (state) => selectedFilterValuesById(state)('filters.countries'),
  filterCustomFieldsList: (state) => state.filterCustomFieldsList,
  selectedCustomFieldsValues: (state) => selectedFilterValuesById(state)('filters.customFields'),
  selectedICCIDValue: findFilterById('filters.lines.rangeICCID'),
  selectedIMSIValue: findFilterById('filters.lines.rangeIMSI'),
  selectedMSISDNValue: findFilterById('filters.lines.rangeMSISDN'),
  selectedIMEIValue: findFilterById('filters.lines.rangeIMEI'),
  selectedEsimFamilyValue: findFilterValueById('indicators.getparc.lines.esim.family'),
  selectedEsimCategoryValue: findFilterValueById('indicators.getparc.lines.esim.category'),

  genericGetter: (state) => (filterKey) => state.currentFilters.find((f) => f.id === filterKey),
  selectedSmsRid: findFilterValueById('indicators.getparc.lines.esim.rid'),
};

// Actions
/**
 * Met à jour les partenaires selectionnées
 * enlève les Comptes de facturations et Offres de partenaires non séléctionnés
 * met à jour les champs libres
 */
async function setPartnersFilter({ commit, getters }, { partners, isHidden }) {
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
  const baWithPartnersSelected = getters.selectedBillingAccountsValues.filter((a) =>
    partners.find((p) => p.id === a.partnerId)
  );
  commit('setBillingAccountsFilter', baWithPartnersSelected);
}

function removeSelectedOffersWithNoSelectedPartners({ commit, getters }, partners) {
  const withPartnersSelected = getters.selectedOffersValues.filter((a) =>
    partners.find((p) => p.id === a.partnerId)
  );
  commit('setOffersFilter', withPartnersSelected);
}

async function refreshCustomFilters({ commit }, partners) {
  if (partners.length === 1) {
    // appel api pour charger les custom fields
    const customAndSpecificFields = await fetchCustomFields(partners[0].id);
    /*
     * Gros bug sur les custom fields qui ne s'initialisent pas bien pour les utilisateurs de type "Partenaire"
     */
    setTimeout(() => {
      commit('setFilterCustomFieldsList', customAndSpecificFields.customFields);
    });
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
  },

  addLineForActCreation(store, line) {
    // check if line is already there
    const isLinePresent = store.state.selectedLinesForActCreation.find((l) => l.id === line.id);

    if (!isLinePresent) {
      store.commit('setSelectedLinesForActCreation', [
        ...store.state.selectedLinesForActCreation,
        line,
      ]);
    }
  },
  removeLineFromActCreation(store, line) {
    const isLinePresent = store.state.selectedLinesForActCreation.find((l) => l.id === line.id);
    if (isLinePresent) {
      store.commit('setSelectedLinesForActCreation', [
        ...store.state.selectedLinesForActCreation.filter((l) => l.id !== line.id),
      ]);
    }
  },
  clearFilter(store, filterId) {
    /**
     * Le cas partenaire est spécial, car à chaque modification on doit mettre à jour les valeurs qui en dépendent
     */
    const filteredFilters = store.state.currentFilters.filter((f) => f.id !== filterId);
    if (filterId === 'filters.partners') {
      setPartnersFilter(store, { partners: [] });
    } else {
      store.commit('setCurrentFilters', filteredFilters);
    }
    // déclencher une recherche si plus aucun filtre n'est selectionné
    if (!store.getters.canShowSelectedFilter) {
      store.commit('applyFilters');
    }
  },
  async fetchLinesActionsFromApi(store, { orderBy, pageInfo, appliedFilters }) {
    const { commit } = store;
    commit('startLoading');
    commit('setLinesActionsResponse', undefined);

    let response = { total: 0, items: [] };
    try {
      commit('setApiError', false);
      response = await searchLinesForTable(orderBy, pageInfo, appliedFilters);
      commit('stopSearchById');
    } catch (e) {
      commit('setApiError', true);
      commit(
        'flashMessage',
        {
          level: 'danger',
          message: "Erreur lors de l'éxécution de la requête ",
        },
        { root: true }
      );
    }
    commit('setLinesActionsResponse', response);
    commit('stopLoading');
  },
};

// Mutations

export const mutations = {
  ...filterUtils.initMutations(),
  removeFromCurrentById,

  setApiError(state, value) {
    state.apiError = value;
  },

  clearAllFilters(state) {
    state.currentFilters = [];
    state.filterCustomFieldsList = [];
    filterUtils.clearAppliedFilters(state);
  },
  setQueryFilterAndSearch(state) {
    state.filterCustomFieldsList = [];
    filterUtils.setQueryFilterAndSearch(state);
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
  selectSMSRidFilter(state, id) {
    selectFilterValue(state, {
      id: 'indicators.getparc.lines.esim.rid',
      value: id,
    });
  },
  selectEsimIdFilter(state, id) {
    selectFilterValue(state, {
      id: 'indicators.getparc.lines.esim.id',
      value: id,
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
  setFileImportFilter(state, fileResponse) {
    selectFilterValue(state, {
      id: 'filters.lines.fromFile.title',
      values: [
        {
          id: fileResponse.uploadId,
          label: fileResponse.file.name,
          ...fileResponse,
        },
      ],
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
    // if (!startDate || !endDate) return;
    selectFilterValue(state, {
      id: filterKey,
      startDate,
      endDate,
    });
  },
  selectEsimFamilyFilter(state, meta) {
    selectFilterValue(state, {
      id: 'indicators.getparc.lines.esim.family',
      value: meta.label,
      meta,
    });
  },
  selectEsimCategoryFilter(state, meta) {
    console.log('🚀 ~ file: actLines.module.js ~ line 372 ~ selectEsimCategoryFilter ~ meta', meta);
    selectFilterValue(state, {
      id: 'indicators.getparc.lines.esim.category',
      value: meta.label,
      meta,
    });
    if (meta && meta.value !== 'ESIM') {
      // vider les valeurs dépendantes
      // removeFromCurrentById
      removeFromCurrentById(state, 'indicators.getparc.lines.esim.type');
      removeFromCurrentById(state, 'indicators.getparc.lines.esim.downloadStatus');
      removeFromCurrentById(state, 'indicators.getparc.lines.esim.pairedLine');
      removeFromCurrentById(state, 'indicators.getparc.lines.esim.rid');
    }
  },

  setDeliveryCountriesFilter(state, countries) {
    selectFilterValue(state, {
      id: 'filters.countries',
      values: countries,
    });
  },
  selectICCIDFilter(state, { from, to }) {
    selectFilterValue(state, {
      id: 'filters.lines.rangeICCID',
      from,
      to,
      type: 'regex',
    });
  },
  selectIMSIFilter(state, { from, to }) {
    selectFilterValue(state, {
      id: 'filters.lines.rangeIMSI',
      from,
      to,
    });
  },
  selectIPFilter(state, value) {
    selectFilterValue(state, {
      id: 'filters.lines.ipFixe',
      value,
    });
  },
  selectMSISDNFilter(state, { from, to }) {
    selectFilterValue(state, {
      id: 'filters.lines.rangeMSISDN',
      from,
      to,
    });
  },
  selectIMEIFilter(state, { from, to }) {
    selectFilterValue(state, {
      id: 'filters.lines.rangeIMEI',
      from,
      to,
    });
  },
  genericSetter(s, args) {
    selectFilterValue(s, args);
  },
  // to refactor, duplicated
  updateSelectedDeliveryCountriesLabels(state, countries) {
    const countryDict = countries.reduce((dict, country) => {
      dict[country.code] = country.name;
      return dict;
    }, {});

    selectFilterValue(state, {
      id: 'filters.countries',
      values: selectedFilterValuesById(state)('filters.countries').map((country) => ({
        ...country,
        label: countryDict[country.id],
      })),
    });
  },

  setSelectedLinesForActCreation(state, selectedLines) {
    state.selectedLinesForActCreation = selectedLines;
  },

  setSelectedFileForActCreation(state, file) {
    state.selectedFileForActCreation = file;
  },

  setActToCreate(state, act) {
    state.actToCreate = act;
  },

  setActCreationPrerequisites(state, prereqs) {
    state.actCreationPrerequisites = prereqs;
  },

  resetForm(state) {
    state.selectedLinesForActCreation = [];
    state.selectedFileForActCreation = undefined;
    state.actCreationPrerequisites = undefined;
  },

  setPageLimit(state, limit) {
    state.limitPerPage = limit;
  },

  resetState(state) {
    filterUtils.resetState(state);
    resetState(state);
  },

  resetAfterFilterClear(state) {
    filterUtils.resetAfterFilterClear(state);
    resetState(state);
  },
  clearResultsForActCreation(state) {
    filterUtils.clearResultsForActCreation(state);
  },

  startSearchingById(state, values) {
    state.appliedFilters = [...(state.currentFilters || []), ...values];
    //  state.currentFilters = [];
    state.searchingById = true;
  },

  stopSearchById(state) {
    state.searchingById = false;
  },
};

function resetState(state) {
  state.linePage = 1;
  state.limitPerPage = 20;
  state.linesActionsResponse = undefined;
  state.filterCustomFieldsList = [];
  state.selectedLinesForActCreation = [];
  state.selectedFileForActCreation = undefined;
  state.actToCreate = null;
  state.actCreationPrerequisites = null;

  state.formVersion += 1;
}
