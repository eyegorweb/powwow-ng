import * as filterUtils from '@/store/filterUtils';
import { searchLinesActions } from '@/api/linesActions';

const selectedFilterValuesById = filterUtils.selectedFilterValuesById;
const findFilterValuesById = filterUtils.findFilterValuesById;
const selectFilterValue = filterUtils.selectFilterValue;

const initFilterForContext = store => {
  filterUtils.initFilterForContext(store, setPartnersFilter);
};

export const namespaced = true;

export const state = {
  ...filterUtils.initState(),
  linesActionsResponse: [],
};

export const getters = {
  ...filterUtils.initGetters(),
  linesActionsResponse: state => state.linesActionsResponse,
  selectedPartnersValues: findFilterValuesById('filters.partners'),
};

// Actions
/**
 * Met à jour les partenaires selectionnées
 * enlève les Comptes de facturations et Offres de partenaires non séléctionnés
 * met à jour les champs libres
 */
async function setPartnersFilter({ commit }, partners, isHidden) {
  commit('selectFilterValue', {
    id: 'filters.partners',
    values: partners,
    hidden: isHidden,
  });
}

// Mutation

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
    // déclencher une recherche si plus aucun filtre n'est selectionné
    if (!store.getters.canShowSelectedFilter) {
      store.commit('applyFilters');
    }
  },
  async fetchLinesActionsFromApi({ commit }, { orderBy, pageInfo, appliedFilters }) {
    // commit('startLoading');
    commit('setLinesActionsResponse', await searchLinesActions(orderBy, pageInfo, appliedFilters));
    // commit('stopLoading');
  },
};

// Mutations

export const mutations = {
  ...filterUtils.initMutations(),
  setLinesActionsResponse(state, actLines) {
    state.linesActionsResponse = actLines;
  },
  selectFilterValue,
  setCurrentFilters: (state, currentFilters) => {
    state.currentFilters = currentFilters;
  },
};
