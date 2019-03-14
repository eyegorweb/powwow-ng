import { fetchCurrentUserInfos } from '@/api/user';
import { isDevMode } from '@/utils';
import { api } from '@/api/utils';
import cloneDeep from 'lodash.clonedeep';

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
  userIsPartner: state => {
    return state.userInfos && !!state.userInfos.party
  }
};

export const actions = {
  async fetchUserInfos({ commit }) {
    commit('setCurrentUser', await fetchCurrentUserInfos());
  },
  setAuthToken({ commit }, tokenStr) {
    function parseJwt(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
    const token = parseJwt(tokenStr);
    commit('setAuthToken', { token, tokenStr });

    const headers = cloneDeep(api.defaults.headers);
    headers.common.Authorization = `Bearer ${tokenStr}`;
    api.defaults.headers = headers;

    if (!isDevMode()) {
      const expireDate = new Date(state.token.exp * 1000);
      const now = new Date();

      const secondsToExpire = (expireDate.getTime() - now.getTime()) / 1000;
      const waitBeforeRefresh = Math.abs(secondsToExpire);

      if (waitBeforeRefresh > 0) {
        setTimeout(() => {
          commit('startRefreshingToken');
        }, waitBeforeRefresh * 1000);
      }
    }
  },
};

export const mutations = {
  setAuthToken(state, { token, tokenStr }) {
    state.accessToken = tokenStr;
    state.token = token;
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
