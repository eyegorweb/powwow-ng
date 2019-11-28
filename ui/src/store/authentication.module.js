import { fetchCurrentUserInfos } from '@/api/user';
import { log } from '@/utils';
import { api } from '@/api/utils';
import cloneDeep from 'lodash.clonedeep';
import moment from 'moment';

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

    const expirationDate = moment(state.token.exp * 1000);
    const waitBeforeRefresh = expirationDate.diff(moment(), 'seconds');
    console.log('Wait before refresh = ', waitBeforeRefresh);
    console.log('expiration date = ', expirationDate.format('DD/MM/YYYY HH:mm:ss'));
    console.log('Now = ', moment().format('DD/MM/YYYY HH:mm:ss'));
    console.log('Token = ', tokenStr);
    console.log('-------------------------');

    if (waitBeforeRefresh > 0) {
      const waitInMs = waitBeforeRefresh * 1000;
      // 2147483647 valeur maximale authorisée pour le setTimeout
      if (waitInMs < 2147483647) {
        setTimeout(() => {
          commit('startRefreshingToken');
        }, waitInMs);
      }
    } else {
      setTimeout(() => {
        commit('startRefreshingToken');
      }, 2000);
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
  appIsReady(state) {
    state.appIsReady = true;
  },
};
