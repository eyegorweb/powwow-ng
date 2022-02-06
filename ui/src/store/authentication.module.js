import { fetchCurrentUserInfos } from '@/api/user.js';
import { isFeatureAvailable, getPartyOptions } from '@/api/partners';
import { api } from '@/api/utils';
import cloneDeep from 'lodash.clonedeep';
// import moment from 'moment';
import { checkLocalStorageProfile } from '@/utils/localstorage.js';

const MAX_TIME_FOR_REFRESHING_TOKEN_IN_MS = 4000;

export const state = {
  token: undefined,
  accessToken: undefined,
  userInfos: undefined,
  refreshingToken: false,
  appIsReady: false,
};

export const getters = {
  token: (state) => state.token,
  appIsReady: (state) => state.appIsReady,
  accessToken: (state) => state.accessToken,
  refreshingToken: (state) => state.refreshingToken,
  userName: (state) => (state.token ? state.token.user_name : ''),
  userInfos: (state) => state.userInfos,
  haveRole: (state) => (role) => {
    if (state.userInfos) {
      return !!state.userInfos.roles.find((r) => r.name === role);
    }
    return false;
  },
  havePermission: (state) => (domain, action) => {
    if (state.userInfos) {
      return !!state.userInfos.permissions.find((p) => p.domain === domain && p.action === action);
    }
    return false;
  },
  havePermissionDomain: (state) => (domain) => {
    if (state.userInfos) {
      return !!state.userInfos.permissions.find((p) => p.domain === domain);
    }
    return false;
  },
  userLanguage: (state) => {
    return state.userInfos && state.userInfos.preferredLocale
      ? state.userInfos.preferredLocale
      : undefined;
  },
  userIsPartner: (state) => {
    return state.userInfos && state.userInfos.type === 'PARTNER';
  },
  userIsCustomer: (state, getters) => {
    return getters.singlePartner && getters.singlePartner.partyType === 'CUSTOMER';
  },
  userIsM2MLight: (state) => {
    return (
      state.userInfos &&
      state.userInfos.type === 'PARTNER' &&
      state.userInfos.partners &&
      state.userInfos.partners[0].partyType === 'M2M_LIGHT'
    );
  },
  userIsAdmin: (state) => {
    // Admin docapost
    if (state.userInfos) {
      return !!state.userInfos.roles.find(
        (r) => r.name === 'ADMINISTRATEUR' || r.name === 'ADMINISTRATOR' || r.name === 'admin'
      );
    }
    return false;
  },
  userIsSuperAdmin: (state) => {
    // Admin docapost
    if (state.userInfos) {
      return !!state.userInfos.roles.find((r) => r.name === 'admin');
    }
    return false;
  },
  userIsGroupPartner: (state) => {
    return state.userInfos && state.userInfos.type === 'PARTNER_GROUP';
  },
  userIsOperator: (state) => {
    return state.userInfos && state.userInfos.type === 'OPERATOR';
  },
  userHaveEsimEnabled: (state) => {
    return state.userInfos && state.userInfos.esimEnabled;
  },
  userIsMVNO: (state, getters) => {
    return getters.singlePartner && getters.singlePartner.partyType === 'MVNO';
  },
  userIsMultiCustomer: (state, getters) => {
    return getters.singlePartner && getters.singlePartner.partyType === 'MULTI_CUSTOMER';
  },
  singlePartner: (state, getters) => {
    if (getters.userIsPartner) {
      return state.userInfos && state.userInfos.partners && state.userInfos.partners.length
        ? state.userInfos.partners[0]
        : undefined;
    }
    return undefined;
  },
  userPartyGroup: (state) => {
    return state.userInfos && state.userInfos.partyGroup;
  },
  userIsBO: (state) => {
    return state.userInfos && state.userInfos.isAdminOrBackOffice;
  },
  userIsMultiPartner: (state) => {
    return state.userInfos && state.userInfos.partners && state.userInfos.partners.length > 1;
  },
  userIsGroupAccount: (state) => {
    return (
      state.userInfos &&
      state.userInfos.type === 'PARTNER' &&
      state.userInfos.partners &&
      state.userInfos.partners.length > 1
    );
  },
  userPartnerOptions: (state) => {
    if (state.userInfos && state.userInfos.partnerOptions) {
      return state.userInfos.partnerOptions;
    }

    return {};
  },
};

export const actions = {
  async fetchUserInfos({ commit }) {
    const currenUser = await fetchCurrentUserInfos();
    try {
      currenUser.isFleetEnabled = await isFeatureAvailable('FLEET_ENABLED');
      if (currenUser.partners && currenUser.partners.length) {
        currenUser.partnerOptions = await getPartyOptions(currenUser.partners[0].id);
      }
    } catch (e) {
      console.log(e);
      console.warn('erreur party subscription');
    }

    commit('setCurrentUser', currenUser);
  },
  setAuthToken({ commit }, tokenStr) {
    function parseJwt(tokenSt) {
      var base64Url = tokenSt.split('.')[1];
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
  },
  startRefreshingToken(state) {
    console.log('startRefreshingToken module.js');
    if (!state.refreshingToken) {
      console.log('startRefreshingToken module.js:', state.refreshingToken);
      console.log('startRefreshingToken module.js timeout:', MAX_TIME_FOR_REFRESHING_TOKEN_IN_MS);
      state.refreshingToken = true;
      refreshTokenClearTimeout = setTimeout(() => {
        console.log('refreshTokenClearTimeout setTimeout');
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
    checkLocalStorageProfile();
    state.userInfos = userInfos;
    if (userInfos) {
      localStorage.setItem('username', userInfos.username);
    }
  },
  appIsReady(state) {
    state.appIsReady = true;
  },
};
