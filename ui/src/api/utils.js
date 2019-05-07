import axios from 'axios';
// import store from '@/store';

export const api = axios.create();

/**
 *  Besoin de gérer les erreurs
 */
export async function query(q) {
  try {
    const response = await api.post(process.env.VUE_APP_GQL_SERVER_URL, { query: q });
    return response.data;
  } catch (e) {
    // TODO: COrrectly test this
    // store.commit('startRefreshingToken');
  }
}

export async function queryHandleErros(q) {
  try {
    return await api.post(process.env.VUE_APP_GQL_SERVER_URL, { query: q });
  } catch (e) {
    // TODO: COrrectly test this
    // store.commit('startRefreshingToken');
  }
}

export function delay(t) {
  return new Promise(resolve => setTimeout(resolve, t));
}
