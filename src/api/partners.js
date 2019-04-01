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
        orderNumberRequired
      },
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.partys.items;
}

export async function fetchpartnerAddresses(id) {
  const queryForLastAdress = `
  query {
    orders(filter: {partyId: {eq: "${id}"}}, pagination: {page: 0, limit: 1}, sorting: {creationDate: DESC}) {
      total
      items {
        id
        company
        name {
          title
          firstName
          lastName
        }
        contactInformation {
          email
          phone
          mobile
        }
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
  `;

  const queryForAddresses = `
  query {
    party(id:${id}) {
      partyShippingAddresses(
        addressFilter:{stringToFind:{contains:""}},
        adressSorting: {id: ASC},
        addressPagination: {limit: 999, page: 0}){
          total
          items{
            id
            company
            name {
              title
              firstName
              lastName
            }
            contactInformation {
              email
              phone
              mobile
            }
            address {
              address1
              address2
              address3
              zipCode
              city
              state
              country
              }
          }
      }
    }
  }`;

  const lastAddressResp = await query(queryForLastAdress);
  const allAddressesResp = await query(queryForAddresses);
  let last, all;
  if (lastAddressResp && lastAddressResp.data.orders.items.length > 0) {
    last = lastAddressResp.data.orders.items[0];
  }

  if (allAddressesResp && allAddressesResp.data.party.partyShippingAddresses.items.length > 0) {
    all = allAddressesResp.data.party.partyShippingAddresses.items;
  }

  return { last, all };
}

export async function addPartyShippingAddress(formData, partnerId) {
  const queryStr = `
    mutation {
      addPartyShippingAddress (shippingAddress: {
        company: "${formData.company}",
        address: {
          address1:"${formData.address}",
          address2:"${formData.extraInfos}",
          address3: "${formData.extraInfos2}",
          zipCode: "${formData.zipCode}",
          city: "${formData.city}",
          country: "${formData.country}",
          state: ""
        },
        name: {
          firstName: "${formData.firstName}",
          title: ${formData.title},
          lastName: "${formData.lastName}"
        },
        contactInformation: {
          email: "${formData.email}",
          phone: "${formData.phone}"
        }
      },
      partyId: ${partnerId}){
        id
      }
    }
  `;

  const response = await query(queryStr);
  return response.data.addPartyShippingAddress;
}

export async function updatePartyShippingAddress(formData, shippingAddressId) {
  const queryStr = `
    mutation {
      updatePartyShippingAddress (shippingAddress: {
        company: "${formData.company}",
        address: {
          address1:"${formData.address}",
          address2:"${formData.extraInfos}",
          address3: "${formData.extraInfos2}",
          zipCode: "${formData.zipCode}",
          city: "${formData.city}",
          country: "${formData.country}",
          state: ""
        },
        name: {
          firstName: "${formData.firstName}",
          title: ${formData.title},
          lastName: "${formData.lastName}"
        },
        contactInformation: {
          email: "${formData.email}",
          phone: "${formData.phone}"
        }
      },
      shippingAddressId: ${shippingAddressId}){
        id
      }
    }
  `;

  const response = await query(queryStr);
  return response.data.updatePartyShippingAddress;
}
