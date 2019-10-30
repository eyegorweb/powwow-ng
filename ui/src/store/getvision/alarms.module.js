import * as filterUtils from '@/store/filterUtils';

export const namespaced = true;

// const selectedFilterValuesById = filterUtils.selectedFilterValuesById;
const findFilterValuesById = filterUtils.findFilterValuesById;
// const findFilterById = filterUtils.findFilterById;
const selectFilterValue = filterUtils.selectFilterValue;
// const findFilterValueById = filterUtils.findFilterValueById;

const initFilterForContext = store => {
  filterUtils.initFilterForContext(store, setPartnersFilter);
};

export const state = {
  ...filterUtils.initState(),
};

export const getters = {
  ...filterUtils.initGetters(),
  selectedPartnersValues: findFilterValuesById('filters.partners'),
};

// Actions
/**
 * Met à jour les partenaires selectionnées
 * enlève les Comptes de facturations et Offres de partenaires non séléctionnés
 * met à jour les champs libres
 */
async function setPartnersFilter({ commit }, { partners, isHidden }) {
  commit('selectFilterValue', {
    id: 'filters.partners',
    values: partners,
    hidden: isHidden,
  });
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
      setPartnersFilter(store, { partners: [] });
    } else {
      store.commit('setCurrentFilters', filteredFilters);
    }
    // déclencher une recherche si plus aucun filtre n'est selectionné
    if (!store.getters.canShowSelectedFilter) {
      store.commit('applyFilters');
    }
  },
  async fetchAlarmsFromApi(store, { orderBy, pageInfo, appliedFilters }) {
    store.commit('startLoading');

    console.log('Fetch alarms here > ', orderBy, pageInfo, appliedFilters);

    store.commit('setSearchResponse', {
      total: 1,
      items: [
        {
          id: 1,
          name: 'Alarme 1',
          thresholds: 'Seuils',
          targetedLines: 1234,
          triggers: '6 lignes',
        },
      ],
    });
    store.commit('stopLoading');
  },
};

export const mutations = {
  ...filterUtils.initMutations(),
  selectFilterValue,

  setCurrentFilters: (state, currentFilters) => {
    state.currentFilters = currentFilters;
  },
};
