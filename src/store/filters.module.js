import { fetchPossibleFilters } from '@/api/filters';

const state = {
  allAvailableFilters: [],
  currentFilters: [],
};
const getters = {
  allAvailableFilters: state => state.allAvailableFilters,
  currentFilters: state => state.currentFilters,
  canShowSelectedFilter: state => {
    return !!state.currentFilters.filter(f => f.values.length > 0).length;
  },
};

const actions = {
  async loadPossibleFilters({ commit }) {
    commit('setAvailableFilters', await fetchPossibleFilters());
  },
};

const mutations = {
  setAvailableFilters: (state, data) => {
    state.allAvailableFilters = data;
  },
  selectFilterValue(state, { name, newValue }) {
    const isFilterFound = state.currentFilters.find(f => f.name === name);
    if (isFilterFound) {
      state.currentFilters = state.currentFilters.map(f => {
        if (f.name === name) {
          f.values = newValue;
        }
        return f;
      });
    } else {
      state.currentFilters.push({
        name,
        values: newValue,
      });
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
