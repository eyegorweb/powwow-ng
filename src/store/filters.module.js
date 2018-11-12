import { getDefaultClient } from '@/vue-apollo';
import gql from 'graphql-tag';

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
  async fetchFilters({ commit }) {
    const response = await getDefaultClient().query({
      query: gql`
        query {
          availableFilters {
            name
            type
            title
            values {
              label
              code
            }
          }
        }
      `,
    });

    commit('setAvailableFilters', response.data.availableFilters);
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
