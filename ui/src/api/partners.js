import { query, getFilterValue, getFilterValues, mutation } from './utils';
import get from 'lodash.get';

export async function editAdministrator(type, params) {
  const response = await mutation(
    'editAdministrator',
    {
      administratorType: { type: 'enum', value: type },
      administratorFieldInput: params,
    },
    '{id}'
  );

  if (response.data) return response.data.editAdministrator;
}

export async function deleteSecondaryAdministrator(partyId) {
  const response = await mutation('deleteSecondaryAdministrator', { partyId }, '{id}');
  if (response.data) return response.data.deleteSecondaryAdministrator;
}

// TO REFACTOR -----------------------
export async function fetchpartners(q, { page, limit, partnerType, includeMailingLists }) {
  let partnerTypeGqlFilter = '';
  if (partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  }
  const extraFields = [];
  if (includeMailingLists) {
    extraFields.push(`mailingLists {
      id
      name
    }`);
  }
  const queryStr = `
  query{
    partys(filter:{name: {startsWith: "${q}"}${partnerTypeGqlFilter}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {name: ASC}) {
      total,
      items {
        id
        code
        name
        orderNumberRequired
        shortCodes
        partyType
        flagMsisdnA
        optionViewCellId
        ${extraFields.join(',')}
      },
    }
  }
  `;
  const response = await query(queryStr);
  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.partys.items;
}
// ------------------------------------
export async function fetchpartnerById(id, conf) {
  const extraFields = [];
  if (conf && conf.includeMailingLists) {
    extraFields.push(`mailingLists {
      id
      name
    }`);
  }
  const queryStr = `
  query{
    partys(filter:{id: {eq: ${id}}}, pagination: {limit: 1, page: 0}, sorting: {name: ASC}) {
      total,
      items {
        id
        code
        name
        orderNumberRequired
        shortCodes
        partyType
        flagMsisdnA
        optionViewCellId
        ${extraFields.join(',')}
      },
    }
  }
  `;
  const response = await query(queryStr);
  if (response.errors) {
    return { errors: response.errors };
  }
  if (response.data.partys.items && response.data.partys.items.length) {
    return response.data.partys.items[0];
  }
  return response.data.partys.items;
}

export async function fetchAdminInfos(id) {
  const fields = `
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
  function
  address {
    address1
    address2
    address3
    zipCode
    city
    country
    state
  }
  auditable {
    created
    updated
  }`;

  const queryStr = `
  query{
    party(id: "${id}") {
      mainAdministrator {
        ${fields}
      }
      secondAdministator {
        ${fields}
      }
    }
  }`;
  const response = await query(queryStr);
  return response.data.party;
}

export async function fetchBroadcastLists(id) {
  const queryStr = `
  query{
    party(id: "${id}") {
      id
      mailingLists {
        id
        name
        emails
        __typename
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.party.mailingLists;
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
          country: "${get(formData, 'country.code')}",
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
          country: "${get(formData, 'country.code')}",
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

export async function fetchPartyTypes() {
  const queryStr = `query {
    __type(name: "PartyTypeEnum") {
      enumValues {
        name
      }
    }
  }`;
  const response = await query(queryStr);
  return response.data.__type.enumValues.map(e => e.name);
}

export async function fetchAllPartners(orderBy, pagination, filters = []) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
    query{
      partys(filter:{${formatFilters(filters)}} ${paginationInfo} ${orderingInfo}) {
        total,
        items {
          id
          name
          code
          partyType
          disabled
          partyGroups {
            name
          }
        },
      }
    }
  `;
  const response = await query(queryStr);
  return response.data.partys;
}

export async function fetchPartnerGroups(q = '') {
  const queryStr = `
  query {
    partyGroups(name: {contains: "${q}"}) {
      name
      id
      parties {
        id
        name
        partyType
        code
      }
      roles {
        category
        name
      }
      flagStatisticsEnabled
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.partyGroups;
}

export function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addPartnerNameFilter(gqlFilters, selectedFilters);
  addPartnerTypeFilter(gqlFilters, selectedFilters);
  addPartnerGroupFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addPartnerNameFilter(gqlFilters, selectedFilters) {
  const partnerName = getFilterValue(selectedFilters, 'getadmin.partners.name');

  if (partnerName) {
    gqlFilters.push(`name: {startsWith: "${partnerName}"}`);
  }
}

function addPartnerTypeFilter(gqlFilters, selectedFilters) {
  const partnerType = selectedFilters.find(f => f.id === 'partnerType');

  if (partnerType) {
    gqlFilters.push(`partyType: {eq: ${partnerType.data.value}}`);
  }
}

function addPartnerGroupFilter(gqlFilters, selectedFilters) {
  const values = getFilterValues(selectedFilters, 'getadmin.users.partnerGroup');
  if (values && values.length) {
    const partnerGroups = values.map(p => `${p.id}`).join(',');
    gqlFilters.push(`groupId: {in: [${partnerGroups}]}`);
  }
}
