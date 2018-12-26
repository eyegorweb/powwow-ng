import { fetchPossibleFilters } from '@/api/filters';

export const state = {
  allAvailableFilters: [],
  currentFilters: [],
};

export const getters = {
  allAvailableFilters: state => state.allAvailableFilters,
  currentFilters: state => state.currentFilters,
  canShowSelectedFilter: state => {
    return !!state.currentFilters.filter(f => f.values.length > 0).length;
  },
};

export const actions = {
  async loadPossibleFilters({ commit }) {
    commit('setAvailableFilters', await fetchPossibleFilters());
  },
};

export const mutations = {
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
