import * as filterUtils from '@/store/filterUtils';
import { searchAlarms } from '@/api/alarms';

export const namespaced = true;

const selectedFilterValuesById = filterUtils.selectedFilterValuesById;
const findFilterValuesById = filterUtils.findFilterValuesById;
// const findFilterById = filterUtils.findFilterById;
const selectFilterValue = filterUtils.selectFilterValue;
const findFilterValueById = filterUtils.findFilterValueById;

const initFilterForContext = store => {
  filterUtils.initFilterForContext(store, setPartnersFilter);
};

export const state = {
  ...filterUtils.initState(),
};

export const getters = {
  ...filterUtils.initGetters(),
  selectedPartnersValues: findFilterValuesById('filters.partners'),
  selectedBillingAccountsValues: findFilterValuesById('filters.billingAccounts'),
  selectedAlarmRange: findFilterValuesById('getvsion.filters.ALARMS_OFFER'),
  selectedAlarmType: findFilterValueById('getvsion.filters.ALARM_TYPE'),
  selectedOffersValues: state => {
    return selectedFilterValuesById(state)('filters.alarms.associatedOffer');
  },
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
    const { commit } = store;
    commit('startLoading');

    let response = { total: 0, items: [] };

    try {
      response = await searchAlarms(orderBy, pageInfo, appliedFilters);
    } catch (e) {
      commit(
        'flashMessage',
        {
          level: 'danger',
          message: "Erreur lors de l'éxécution de la requette ",
        },
        { root: true }
      );
    }

    commit('setSearchResponse', response);
    commit('stopLoading');
  },
};

export const mutations = {
  ...filterUtils.initMutations(),
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

  setOffersFilter(state, offers) {
    selectFilterValue(state, {
      id: 'filters.alarms.associatedOffer',
      values: offers,
    });
  },
  setAlarmRange(state, values) {
    selectFilterValue(state, {
      id: 'getvsion.filters.ALARMS_OFFER',
      values,
    });
  },
  setAlarmType(state, value) {
    selectFilterValue(state, {
      id: 'getvsion.filters.ALARM_TYPE',
      ...value,
    });
  },
};
