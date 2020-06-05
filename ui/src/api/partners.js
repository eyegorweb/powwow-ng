import { query, getFilterValue, getFilterValues, mutation } from './utils';
import get from 'lodash.get';

export async function updatePartyOptions(params) {
  const response = await mutation('updatePartyOptions', params, '');

  if (response.data) return response.data.updatePartyOptions;
}

export async function getPartyOptions(partyId) {
  const queryStr = `{
  getPartyOptions(partyId: ${partyId}) {
    flagMsisdnA
    euiccEnabled
    flagStatisticsEnabled
    resilationSecurityEnabled
    resilationSecurityDelay
    resilationSecurityNotificationEnabled
    resilationSecurityNotificationMails
    portabilityAcquittalsEmails
    dailyCdrEmails
    otaSensitive
    smsAuthorized
    shortCodes
    mailOrder
    orderNumberRequired
    orderPreactivationMandatory
    orderActivationMandatory
    userReferenceEnabled
    crEmail
    switchRcard
    smsAuthorized
    dualSimBilling
    diffusionList
    diffusionListEnabled
    dailyOutstandingReporting
    msisdnFormatPreactivation
    consoReporting
    wsNotificationParam {
      notificationOption
      login
      password
      url
    }
    msisdnFormatPreactivation
    defaultWorkflowForActivation {
      id
      code
    }
    defaultCustomerForActivation {
      id
      code
    }
  }
}`;

  const response = await query(queryStr);
  return response.data.getPartyOptions;
}

export async function editAdministrator(type, params) {
  const queryStr = `
  mutation {
    editAdministrator(administratorType: ${type}, administratorFieldInput: {
      partyId: ${params.partyId},
      firstName: "${params.firstName}",
      lastName: "${params.lastName}",
      email: "${params.email}",
      company: "${params.company}",
      language: ${params.language.value},
      title: ${params.title.value},
      contactInformation: {
        phone: "${params.contactInformation.phone}"
        email: "${params.contactInformation.email}"
      },
        address: {
          zipCode: "${params.address.zipCode}",
          address1: "${params.address.address1}",
          city: "${params.address.city}",
          country: "${params.address.country}",
          state: "${params.address.state}",
        }
      })
      {
      id
    }
  }


  `;

  const response = await query(queryStr);
  return response;
}

export async function deleteSecondaryAdministrator(partyId) {
  const response = await mutation('deleteSecondaryAdministrator', { partyId }, '{id}');
  if (response.data) return response.data.deleteSecondaryAdministrator;
}

// TO REFACTOR -----------------------
export async function fetchpartners(
  q,
  { page, limit, partnerType, partnerTypes, includeMailingLists }
) {
  let partnerTypeGqlFilter = '';
  if (!partnerTypes && partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  } else if (partnerTypes && partnerTypes.length) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerTypes.join(', ')}]}`;
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
  if (!response) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.party;
}

export async function fetchAccountDetail(id) {
  const queryStr = `
  query {
    partys(filter: {id: {eq : ${id}}}) {
      total
      items {
        tva
        id
        name
        code
        contractReference
        siren
        naf
        partyType
        partyGroups {
          id
          name
        }
        auditable {
          created
          updated
        }
        contactInformation {
          phone
          fax
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

  const response = await query(queryStr);
  return response.data.partys.items[0];
}

export async function fetchCustomerAccounts(id, orderBy) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const queryStr = `
  query {
    customerAccounts(filter: {partyId: {eq: ${id}}}, pagination: {limit: 10, page: 0} ${orderingInfo})  {
      total
      items {
        id
        code
        name
        siret
        siren
        company
        status
        massActionsDisabled
        auditable {
          created
        }
        party {
          id
        }
        bankAccount {
          name
          number
          establishmentCode
        }
        address {
          address1
          address2
          zipCode
          city
          country
          state
        }
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.customerAccounts.items;
}

export async function getCustomerAccount(code) {
  const queryStr = `
  query {
    customerAccounts(filter: {code: {eq: "${code}"}}) {
      total
      items {
        id
        code
        name
        company
        massActionsDisabled
        address {
          address1
          zipCode
          city
          country
          state
        }
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.customerAccounts.items;
}

export async function updatePartyDetail(params) {
  const queryStr = `
  mutation {
    updateDetailParty(

      detailsPartyInput:{
        partyId: ${params.id}

        generalInformationInput: {
          partyType:${params.partyType}
          code: "${params.code}"
          bscsRootAccount: "${params.bscsRootAccount}"
          defaultPreactivationOfferCode: "${params.defaultPreactivationOfferCode}"
          preactivationName: "${params.preactivationName}"
          defaultWorkflowCode: "${params.defaultWorkflowCode}"
        }
        legalInformationInput:{
          name: "${params.partnerName}"
          siren: "${params.siren}"
          naf: "${params.naf}"
          tva: "${params.tva}"
        }
        contractInput: {
          contractReference: "${params.contractReference}"
          contractDate: ${params.contractDate}
          contractExpiration: ${params.contractExpiration}
          salesEngineer: "${params.salesEngineer}"
          commercialName: "${params.commercialName}"
          commercialEmail: "${params.commercialEmail}"
        }
        contactInformation: {
          phone: "${params.phone}"
          address1: "${params.address}"
          address2: "${params.address2}"
          zipCode: "${params.zipCode}"
          city: "${params.city}"
          country: "${params.country}"
        }
      }

    ) {
      partyType
      code
    }
  }
  `;

  const response = await query(queryStr);
  return response;
}

export async function updateCustomerAccount(params) {
  const queryStr = `
  mutation {
    updateCustomerAccount(input: {
      id: ${params.id},
      code: "${params.code}",
      label: "${params.label}",
      actBlockade: ${params.actBlock},
      company: "${params.company}",
      address: "${params.address}",
      zipCode: "${params.zipCode}",
      city: "${params.city}",
      country: "${params.country}"
    })
  }
  `;

  const response = await query(queryStr);
  return response;
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

export async function fetchPartyDetail(id) {
  const queryStr = `
  query {
    detailParty(partyId: ${id}) {
      shippingAddressesCount
      usersCount
      mailingListsCount
      workflowsCount
      customerAccountsCount
      customFieldsCount
      availableSimCount
      lastBillingAmount {
        billDate
        amount
      }
      party {
        name
        siren
        salesEngineer
        mainAdministrator {
          id
        }
        bscsRootAccount
        defaultPreactivationOfferCode
        preactivationName
        defaultWorkflowCode
        portabilityCode
        tva
        contractDate
        contractExpiration
        salesEngineer
        commercialName
        commercialEmail
        defaultPreactivationOfferCode
        resilationSecurityNotificationMails
        diffusionList
        contactInformation {
          email
          phone
          mobile
          fax
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
        mailingLists {
          id
          name
          emails
        }
      }
    }
  }

  `;
  const response = await query(queryStr);
  return response.data.detailParty;
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

export async function deleteBroadcastList(id) {
  const queryStr = `mutation {deletMailingListById(mailingListId:${id})}`;
  const response = await query(queryStr);
  return response.data.deleteBroadcastList;
}

export async function updateBroadcastLists(params) {
  const queryStr = `
    mutation {
      updateMailingList(mailingInput:{
        id:"${params.id}",
        name:"${params.title}",
        emails: [${params.emails.map(e => `"${e}"`).join(',')}],
      }) {
        id
      }
    }

  `;
  const response = await query(queryStr);
  return response.data.updateMailingList;
}

export async function createBroadcastLists(params) {
  const queryStr = `
    mutation {
      createMailingList(mailingInput:{
        partyId:${params.partnerId},
        name:"${params.title}",
        emails: [${params.emails.map(e => `"${e}"`).join(',')}],

      }) {
        id
        name
        emails
      }
    }
  `;

  const response = await query(queryStr);
  return response.data.createMailingList;
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
  const values = getFilterValues(selectedFilters, 'getadmin.users.filters.partnerGroup');
  if (values && values.length) {
    const partnerGroups = values.map(p => `${p.id}`).join(',');
    gqlFilters.push(`groupId: {in: [${partnerGroups}]}`);
  }
}
