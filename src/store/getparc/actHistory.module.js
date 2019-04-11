import { searchMassActions } from '@/api/massActions';
import * as filterUtils from '@/store/filterUtils';

const selectedFilterValuesById = filterUtils.selectedFilterValuesById;
const findFilterValuesById = filterUtils.findFilterValuesById;
const selectFilterValue = filterUtils.selectFilterValue;

const initFilterForContext = store => {
  filterUtils.initFilterForContext(store, setPartnersFilter);
};

export const namespaced = true;

export const state = {
  ...filterUtils.initState(),
  massActionsResponse: [],
};

export const getters = {
  ...filterUtils.initGetters(),
  massActionsResponse: state => state.massActionsResponse,
  selectedPartnersValues: findFilterValuesById('filters.partners'),
  selectedOrderCreatorValues: state => {
    return selectedFilterValuesById(state)('filters.orderCreator');
  },
  selectedTypesValues: state => {
    return selectedFilterValuesById(state)('filters.actTypes');
  },
  selectedStatusValues: state => {
    return selectedFilterValuesById(state)('filters.actStatus');
  },
  selectedServicesValues: state => {
    return selectedFilterValuesById(state)('filters.services');
  },
  selectedActDateCreation: state =>
    state.currentFilters.find(f => f.id === 'filters.actDateCreation'),
  selectedActDateStart: state => state.currentFilters.find(f => f.id === 'filters.actDateStart'),
  selectedActDateEnd: state => state.currentFilters.find(f => f.id === 'filters.actDateEnd'),
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

function removeSelectedOrderCreatorPartners({ commit, getters }, partners) {
  const creatorWithPartnerSelected = getters.selectedOrderCreatorValues.filter(a =>
    partners.find(p => p.id === a.partnerId)
  );
  commit('setOrderCreatorFilter', creatorWithPartnerSelected);
}

export const actions = {
  setPartnersFilter,
  initFilterForContext,
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
  async fetchActionsFromApi({ commit }, { orderBy, pageInfo, appliedFilters }) {
    // commit('startLoading');
    commit('setActionsResponse', await searchMassActions(orderBy, pageInfo, appliedFilters));
    // commit('stopLoading');
  },
};

// Mutations

export const mutations = {
  ...filterUtils.initMutations(),
  setActionsResponse(state, massActions) {
    state.massActionsResponse = massActions;
  },
  selectFilterValue,

  setCurrentFilters: (state, currentFilters) => {
    state.currentFilters = currentFilters;
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
  setActStatusFilter(state, statuses) {
    selectFilterValue(state, {
      id: 'filters.actStatus',
      values: statuses,
    });
  },
  setServicesFilter(state, types) {
    selectFilterValue(state, {
      id: 'filters.services',
      values: types,
    });
  },
  setActDateCreationFilter(state, { startDate, endDate }) {
    if (!startDate || !endDate) return;

    selectFilterValue(state, {
      id: 'filters.actDateCreation',
      startDate,
      endDate,
    });
  },
  setActDateStartFilter(state, { startDate, endDate }) {
    if (!startDate || !endDate) return;

    selectFilterValue(state, {
      id: 'filters.actDateStart',
      startDate,
      endDate,
    });
  },
  setActDateEndFilter(state, { startDate, endDate }) {
    if (!startDate || !endDate) return;

    selectFilterValue(state, {
      id: 'filters.actDateEnd',
      startDate,
      endDate,
    });
  },
};
