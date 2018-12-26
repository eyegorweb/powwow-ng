import { fetchCurrentUserInfos } from '@/api/user';
import axios from 'axios';

export const state = {
  token: undefined,
  accessToken: undefined,
  userInfos: undefined,
  refreshingToken: false,
};

export const getters = {
  token: state => state.token,
  accessToken: state => state.accessToken,
  refreshingToken: state => state.refreshingToken,
  userName: state => (state.token ? state.token.user_name : ''),
  userInfos: state => state.userInfos,
};

export const actions = {
  async fetchUserInfos({ commit }) {
    commit('setCurrentUser', await fetchCurrentUserInfos());
  },
};

export const mutations = {
  setAuthToken(state, tokenStr) {
    function parseJwt(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
    state.accessToken = tokenStr;
    state.token = parseJwt(tokenStr);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokenStr;
  },
  startRefreshingToken(state) {
    state.refreshingToken = true;
  },
  stopRefreshingToken(state) {
    state.refreshingToken = false;
  },
  setCurrentUser(state, userInfos) {
    state.userInfos = userInfos;
  },
};
