import get from 'lodash.get';

export const namespaced = true;
export const state = {
  contextPartnersTypes: [],
  contextPartners: [],
};

export const mutations = {
  setPartnerTypes(state, types) {
    state.contextPartnersTypes = types;
  },
  setPartners(state, contextPartners) {
    state.contextPartners = contextPartners;
  },
};

export const getters = {
  contextFilters: (state, getters, rootState, rootGetters) => {
    if (rootGetters.userIsPartner) {
      const partnerFilterValues = [
        {
          id: rootGetters.userInfos.party.id,
          label: rootGetters.userInfos.party.name,
        },
      ];
      const defaultFilters = [
        {
          id: 'filters.partners',
          values: partnerFilterValues,
          hidden: true,
        },
      ];
      return defaultFilters;
    }

    const defaultFilters = [];
    const defaultPartnersValues = get(rootState, 'userContext.contextPartners', []);

    if (defaultPartnersValues.length) {
      defaultFilters.push({
        id: 'filters.partners',
        values: defaultPartnersValues,
        hidden: true,
      });
    }

    const defaultPartnerTypesValues = get(rootState, 'userContext.contextPartnersTypes', []);
    if (defaultPartnerTypesValues.length) {
      defaultFilters.push({
        id: 'filters.partnerTypes',
        values: defaultPartnerTypesValues,
        hidden: true,
      });
    }

    return defaultFilters;
  },
};
