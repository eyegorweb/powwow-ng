import { fetchCurrentUserInfos } from '@/api/user';
import { log } from '@/utils';
import { api } from '@/api/utils';
import cloneDeep from 'lodash.clonedeep';
// import moment from 'moment';

const MAX_TIME_FOR_REFRESHING_TOKEN_IN_MS = 2000;

export const state = {
  token: undefined,
  accessToken: undefined,
  userInfos: undefined,
  refreshingToken: false,
  appIsReady: false,
};

export const getters = {
  token: state => state.token,
  appIsReady: state => state.appIsReady,
  accessToken: state => state.accessToken,
  refreshingToken: state => state.refreshingToken,
  userName: state => (state.token ? state.token.user_name : ''),
  userInfos: state => state.userInfos,
  haveRole: state => role => {
    if (state.userInfos) {
      return !!state.userInfos.roles.find(r => r.name === role);
    }
    return false;
  },
  havePermission: state => (domain, action) => {
    if (state.userInfos) {
      return !!state.userInfos.permissions.find(p => p.domain === domain && p.action === action);
    }
    return false;
  },
  userIsPartner: state => {
    return state.userInfos && state.userInfos.type === 'PARTNER';
  },
  singlePartner: (state, getters) => {
    if (getters.userIsPartner) {
      return state.userInfos && state.userInfos.partners && state.userInfos.partners.length
        ? state.userInfos.partners[0]
        : undefined;
    }
    return undefined;
  },
  userPartyGroup: state => {
    return state.userInfos && state.userInfos.partyGroup;
  },
  userIsBO: state => {
    console.log(state.userInfos);
    return state.userInfos && state.userInfos.isAdminOrBackOffice;
  },
  userIsGroupAccount: state => {
    return (
      state.userInfos &&
      state.userInfos.type === 'PARTNER' &&
      state.userInfos.partners &&
      state.userInfos.partners.length > 1
    );
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

    const headers = cloneDeep(api.defaults.headers);
    headers.common.Authorization = `Bearer ${tokenStr}`;
    api.defaults.headers = headers;

    commit('setAuthToken', { token, tokenStr });
  },
};

let refreshTokenClearTimeout = undefined;

export const mutations = {
  setAuthToken(state, { token, tokenStr }) {
    state.accessToken = tokenStr;
    state.token = token;
    log('New Token ', state.accessToken);
  },
  startRefreshingToken(state) {
    if (!state.refreshingToken) {
      state.refreshingToken = true;
      refreshTokenClearTimeout = setTimeout(() => {
        state.refreshingToken = false;
      }, MAX_TIME_FOR_REFRESHING_TOKEN_IN_MS);
    }
  },
  stopRefreshingToken(state) {
    if (refreshTokenClearTimeout) {
      clearTimeout(refreshTokenClearTimeout);
      refreshTokenClearTimeout = undefined;
    }
    state.refreshingToken = false;
  },
  setCurrentUser(state, userInfos) {
    state.userInfos = userInfos;
    if (userInfos) {
      localStorage.setItem('username', userInfos.username);
    }
  },
  appIsReady(state) {
    state.appIsReady = true;
  },
};
