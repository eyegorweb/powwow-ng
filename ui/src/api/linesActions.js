import { query } from './utils';

export async function fetchCardTypes() {
  const queryStr = `
  query {
    getTypeSimcards
  }
  `;
  const response = await query(queryStr);
  return response.data.getTypeSimcards;
}

export async function searchLines(orderBy, pagination, filters = []) {
  // const orderingInfo = orderBy
  //   ? `, sorting: {field: ${orderBy.key}, preactivationDate:${orderBy.direction}}`
  //   : '';
  const orderingInfo = orderBy ? `, sorting: {}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    lines(
      filter: {
        ${formatFilters(filters)}
      }
      ${paginationInfo}
      ${orderingInfo}
    ) {
      total
      items {
        id
        msisdn
        imsi
        accessPoint {
          commercialStatus
          lastPLMN
          preactivationDate
          activationDate
          commercialStatusDate
          networkStatus
          customFields {
            custom1
            custom2
            custom3
            custom4
          }
          offer {
            marketingOffer {
              code
              description
            }
          }
          simCardInstance {
            party{
              id
              name
             }
            id
            iccid
            type
            statuts
            auditable {created}
            deviceInstance {
              manufacturer
              deviceReference
            }
          }
        }
      }
    }
  }`;

  const response = await query(queryStr);
  return response.data.lines;
}

function formatFilters(filters) {
  const allFilters = [];
  const partyIds = getValuesIdsForInt(filters, 'filters.partners');
  if (partyIds) {
    allFilters.push(`idParty: {in: [${partyIds}]}`);
  }

  const offers = getValuesIds(filters, 'filters.offers');
  if (offers) {
    allFilters.push(`workflowCode: {in: [${offers}]}`);
  }

  const customFields = getFilterValues(filters, 'filters.customFields');
  if (customFields && customFields.length > 0) {
    const customFeldsGQLparams = customFields
      .map(c => `${c.id}: {contains: "${c.value}"}`)
      .join(',');

    allFilters.push(customFeldsGQLparams);
  }

  const customerAccountIds = getValuesIds(filters, 'filters.billingAccounts');
  if (customerAccountIds) {
    allFilters.push(`customerAccountId: {in:[${customerAccountIds}]}`);
  }

  // addQuantityFilter(allFilters, filters);
  addActionTypeFilter(allFilters, filters);
  addOfferFilterFilter(allFilters, filters);
  addOrderId(allFilters, filters);
  addOrderRef(allFilters, filters);
  addSimStatuses(allFilters, filters);
  addBillingStatuses(allFilters, filters);

  return allFilters.join(',');
}

function addSimStatuses(gqlFilters, selectedFilters) {
  const simStatus = getValuesIds(selectedFilters, 'filters.lines.SIMCardStatus');
  if (simStatus) {
    gqlFilters.push(`simStatus: {in:[${simStatus}]}`);
  }
}

function addBillingStatuses(gqlFilters, selectedFilters) {
  const values = getValuesIds(selectedFilters, 'filters.lines.billingStatus');
  if (values) {
    gqlFilters.push(`billingStatus: {in:[${values}]}`);
  }
}

function addOrderId(gqlFilters, selectedFilters) {
  const orderId = getFilterValue(selectedFilters, 'filters.lines.orderID');
  if (orderId) {
    gqlFilters.push(`idOrder: {eq: "${orderId}"}`);
  }
}

function addOrderRef(gqlFilters, selectedFilters) {
  const orderRef = getFilterValue(selectedFilters, 'filters.orderReference');
  if (orderRef) {
    gqlFilters.push(`orderReference: {eq: "${orderRef}"}`);
  }
}

function addOfferFilterFilter(gqlFilters, selectedFilters) {
  const offers = getValuesIds(selectedFilters, 'filters.lines.associatedOffer');
  if (offers) {
    gqlFilters.push(`productCode: {in: [${offers}]}`);
  }
}

function addActionTypeFilter(gqlFilters, selectedFilters) {
  const actionTypes = selectedFilters.find(f => f.id === 'filters.actTypes');
  if (actionTypes) {
    const actionTypesValues = actionTypes.values.map(a => a.id);
    gqlFilters.push(`actionTypes: [ ${[...actionTypesValues]} ]`);
  }
}

function getValuesIds(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `"${i.id}"`).join(',');
  }
}

function getValuesIdsForInt(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `${i.id}`).join(',');
  }
}

function getFilterValues(filters, filterId) {
  if (!filters) return;

  const foundFilter = filters.find(f => f.id === filterId);
  if (foundFilter) {
    return foundFilter.values;
  }
}

function getFilterValue(filters, filterId) {
  if (!filters) return;

  const foundFilter = filters.find(f => f.id === filterId);
  if (foundFilter) {
    return foundFilter.value;
  }
}
