import { query } from './utils';

export async function fetchpartners(q, { page, limit }) {
  const queryStr = `
  query{
    partys(filter:{name: {contains: "${q}"}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {name: ASC}) {
      total,
      items {
        id
        code
        name
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.partys.items;
}

export async function fetchpartnerAddresses(id) {
  const queryStr = `
  query {
    orders(filter: {partyId: {eq: "${id}"}}, pagination: {page: 0, limit: 1}, sorting: {creationDate: DESC}) {
      total
      items {
        id
        address {
          address1
          address2
          address3
          zipCode
          city
          country
          state
        }
        party {
          partyShippingAddresses (
          adressSorting: {id: ASC},
          addressPagination: {limit: 100, page: 0},
        	addressFilter: {stringToFind: {contains: ""}}
        ) {
          items {
            id
            address {
              address1
              address2
              address3
              zipCode
              city
              country
              state
            }
          }
        }
        }
      }
    }
  }
  `;
  const response = await query(queryStr);
  if (response && response.data.orders.items.length > 0) {
    const last = response.data.orders.items[0].address;
    const all = response.data.orders.items[0].party.partyShippingAddresses.items;
    return { last, all };
  }
}
