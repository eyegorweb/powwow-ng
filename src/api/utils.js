import axios from 'axios';

export async function query(q) {
  const response = await axios.post('http://localhost:4000/graphql', { query: q });
  return response.data;
}
