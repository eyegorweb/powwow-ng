import axios from 'axios';
// import store from '@/store';

export async function query(q) {
  try {
    const response = await axios.post(process.env.VUE_APP_GQL_SERVER_URL, { query: q });
    return response.data;
  } catch (e) {
    // TODO: COrrectly test this
    // store.commit('startRefreshingToken');
  }
}
