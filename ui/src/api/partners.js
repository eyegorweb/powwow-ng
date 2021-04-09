import { query, getFilterValues, getValuesIds } from './utils';
import get from 'lodash.get';

export async function isEnabledPartySubscriptionOption(optionType, partners) {
  const queryStr = `
  query IsEnabledPartySubscriptionOption($optionType: SubscriptionOptionTypeEnum!, $partners: [Long]!) {
    isEnabledPartySubscriptionOption(optionType: $optionType, partyIds: $partners)
  }
  `;

  const response = await query(queryStr, { optionType, partners });

  return response.data.isEnabledPartySubscriptionOption;
}

export async function updatePartyOptions(params) {
  const queryStr = `
  mutation UpdatePartyOptions($partyOptions: PartyOptionsInput) {
    updatePartyOptions(partyOptions: $partyOptions)
    }`;
  const response = await query(queryStr, params);

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
    esimEnable
    smsAuthorized
    shortCodes
    mailOrder
    orderNumberRequired
    orderPreactivationMandatory
    orderActivationMandatory
    userReferenceEnabled
    crEmail
    switchRcard
    dualSimBilling
    diffusionList
    diffusionListEnabled
    flagBillingPDPCellHistory
    flagBillingIMEI
    controlDeactivateRCard
    offerChangeEnabled
    flagbillingNonActDelay
    billingNonActDelay
    exportComptaBSCSModeEnabled
    flagServicesAudit
    importCustomFieldsEnabled
    dashBoarDetailsPerCountry
    suspensionAuto
    optionViewCellId
    coachM2MAvailable
    coachM2MFleetpromotion
    coachM2m24h
    geolocViewLimit
    geolocViewCounter
    flagDefautWorkflowActication
    DefautWorkflowActicationDelay
    dailyOutstandingReporting
    msisdnFormatPreactivation
    consoReporting
    wsNotificationParam {
      notificationOption
      login
      url
    }
    defaultWorkflowForActivation {
      id
      code
      workflowDescription
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

export async function getOfferOption(id) {
  const queryStr = `
    {
      partys(filter:{id: {eq: ${id}}}) {
        items {
          offerTariffEnabled
        }
      }
    }
    `;
  const response = await query(queryStr);
  return response.data.partys.items[0].offerTariffEnabled;
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
  const queryStr = `
  mutation DeleteSecondaryAdministrator($partyId: Long!) {
    deleteSecondaryAdministrator(partyId: $partyId) {id}
    }`;
  const response = await query(queryStr, { partyId });
  if (response.data) return response.data.deleteSecondaryAdministrator;
}

// TO REFACTOR -----------------------
export async function fetchpartners(
  q,
  { page, limit, partnerType, partnerTypes, includeMailingLists, esim }
) {
  let partnerTypeGqlFilter = '';
  if (!partnerTypes && partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  } else if (partnerTypes && partnerTypes.length) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerTypes.join(', ')}]}`;
  }

  let esimGqlFilter = '';

  if (esim) {
    esimGqlFilter = `, esimEnable: {eq: true}`;
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
    partys(filter:{name: {startsWith: "${q}"}${partnerTypeGqlFilter}${esimGqlFilter}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {name: ASC}) {
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
        suspensionFree
        suspensionAuto
        wsNotificationParam {
          notificationOption
          login
          url
        }
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

  if (conf && conf.mvnoRanges) {
    extraFields.push(`
        flagMSISDNRangeEnabled
        flagMSISDNRangeLocked
        MSISDNRangeCode
        MSISDNRangeCounterAvailables
        MSISDNRangeCounterUsed
        MSISDNRangeCounterQuarantined
        MSISDNRangeCounterUnavailables
    `);
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
  language
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

function addCFMultiSearchFilter(gqlFilters, selectedFilters) {
  const code = selectedFilters.find(f => f.id === 'getadmin.partners.filters.multisearch');
  if (code) {
    gqlFilters.push(`multiSearch: {contains: "${code.value}"}`);
  }
}

export async function fetchCustomerAccountsByPartnerId(
  partnerId,
  orderBy,
  pagination,
  filters = []
) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';

  const queryStr = `query {
    customerAccounts(filter: { partyId:{eq:${partnerId}} ${formatFilters(
    filters
  )}} ${paginationInfo} ${orderingInfo} ){
      total
      items {
        id
        code
        name
        siret
        siren
        marketLine
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
        customerAccountShippingAddresses(addressFilter:{}) {
          total
          items {
            id
            address {
              address1
              zipCode
              city
            }
            company
            name {
              firstName
              lastName
            }
          }
        }
      }
    }
  }`;

  const response = await query(queryStr);
  return response.data.customerAccounts;
}

export async function fetchCustomerAccounts(id, orderBy) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const queryStr = `
  query {
    customerAccounts(filter: {partyId: {eq: ${id}}}, pagination: {limit: 999, page: 0} ${orderingInfo})  {
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

export async function exportCustomerAccounts(
  partnerId,
  filters,
  columns,
  orderBy,
  exportFormat,
  asyncExportRequest = false
) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const queryStr = `
  {
    exportCustomerAccounts(
      filter: {
        partyId:{eq:${partnerId}} ${formatFilters(filters)}
      }
      columns: [${columnsParam}]
      ${orderingInfo}
      exportFormat: ${exportFormat}
      asyncExportRequest: ${asyncExportRequest}
    )
    {
      downloadUri
      total
      asyncRequired
    }
  }
  `;

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
  return response.data.exportCustomerAccounts;
}

export async function getCustomerAccounts(filters) {
  const queryStr = `query CustomerAccounts($filters: CustomerAccountFilterInput) {
    customerAccounts(filter: $filters) {
      total
      items {
        id
        code
        name
        siret
        siren
        marketLine
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
        customerAccountShippingAddresses(addressFilter:{}) {
          total
          items {
            id
            address {
              address1
              zipCode
              city
            }
            company
            name {
              firstName
              lastName
            }
          }
        }
      }
    }
  }`;

  const response = await query(queryStr, { filters });
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
        siret
        siren
        marketLine
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
        customerAccountShippingAddresses(addressFilter:{}) {
          total
          items {
            id
            address {
              address1
              zipCode
              city
            }
            company
            name {
              firstName
              lastName
            }
          }
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
        contractReference
        partyGroups {
          name
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
          countryName
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
              countryName
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

export async function deleteDeliveryAddress(id) {
  const queryStr = `mutation {deleteShippingAddress(shippingAddressId:${id})}`;
  const response = await query(queryStr);
  return response.data.deleteShippingAddress;
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

export async function fetchOrderState(id) {
  const queryStr = `
  query {
    partys(filter: {id: {eq: ${id}} })
    {
      items {
        orderPreactivationMandatory
        orderActivationMandatory
      }
    }
  }


  `;
  const response = await query(queryStr);
  return response.data.partys.items;
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

  addPartnerIdFilter(gqlFilters, selectedFilters);
  addPartnerTypeFilter(gqlFilters, selectedFilters);
  addPartnerGroupFilter(gqlFilters, selectedFilters);
  addTypeSimCardFilter(gqlFilters, selectedFilters);
  addCFMultiSearchFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addPartnerIdFilter(gqlFilters, selectedFilters) {
  const partyIds = getValuesIds(selectedFilters, 'getadmin.partners.name');
  if (partyIds) {
    gqlFilters.push(`id: {in:[${partyIds}]}`);
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

function addTypeSimCardFilter(gqlFilters, selectedFilters) {
  const values = getValuesIds(selectedFilters, 'getadmin.users.filters.typeSIMCard');
  if (values) {
    gqlFilters.push(`simcardCode: {in: [${values}]}`);
  }
}
