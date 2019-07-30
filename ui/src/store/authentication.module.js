import { fetchCurrentUserInfos } from '@/api/user';
import { log } from '@/utils';
import { api } from '@/api/utils';
import cloneDeep from 'lodash.clonedeep';

const MAX_TIME_FOR_REFRESHING_TOKEN_IN_MS = 2000;

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
    return state.userInfos && !!state.userInfos.party;
  },
  userIsBO: state => {
    return !(state.userInfos && !!state.userInfos.party);
  },
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

    const expireDate = new Date(state.token.exp * 1000);
    const now = new Date();

    const secondsToExpire = (expireDate.getTime() - now.getTime()) / 1000;
    const waitBeforeRefresh = Math.abs(secondsToExpire);

    if (waitBeforeRefresh > 0) {
      setTimeout(() => {
        commit('startRefreshingToken');
      }, waitBeforeRefresh * 1000);
    }
  },
};

export const mutations = {
  setAuthToken(state, { token, tokenStr }) {
    state.accessToken = tokenStr;
    state.token = token;
    log('New Token ', state.accessToken);
  },
  startRefreshingToken(state) {
    if (!state.refreshingToken) {
      state.refreshingToken = true;
      setTimeout(() => {
        state.refreshingToken = false;
      }, MAX_TIME_FOR_REFRESHING_TOKEN_IN_MS);
    }
  },
  stopRefreshingToken(state) {
    state.refreshingToken = false;
  },
  setCurrentUser(state, userInfos) {
    state.userInfos = userInfos;
  },
};
