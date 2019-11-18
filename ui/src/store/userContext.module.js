import get from 'lodash.get';

export const namespaced = true;
export const state = {
  contextPartnersType: undefined,
  contextPartners: [],
};

export const mutations = {
  setPartnerType(state, value) {
    state.contextPartnersType = value;
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

    const defaultPartnerTypesValue = get(rootState, 'userContext.contextPartnersType');
    if (defaultPartnerTypesValue) {
      defaultFilters.push({
        id: 'filters.partnerType',
        value: defaultPartnerTypesValue,
        hidden: true,
      });
    }

    return defaultFilters;
  },
};
