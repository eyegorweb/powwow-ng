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
