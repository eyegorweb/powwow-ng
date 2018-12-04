import axios from 'axios';

export async function query(q) {
  const response = await axios.post(process.env.VUE_APP_GQL_SERVER_URL, { query: q });
  return response.data;
}
