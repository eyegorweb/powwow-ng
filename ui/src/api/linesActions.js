import { query, addDateFilter } from './utils';

export async function fetchCardTypes() {
  const queryStr = `
  query {
    getTypeSimcards
  }
  `;
  const response = await query(queryStr);
  return response.data.getTypeSimcards;
}

export async function fetchCommercialStatuses() {
  const queryStr = `
  query {
    commercialStatus
  }
  `;
  const response = await query(queryStr);
  return response.data.commercialStatus;
}

export async function fetchIndicators(metadata) {
  const queryParts = metadata.map(
    i => `${i.name}: lines(filter: 	{ ${formatFilters(i.filters)} }) { total }`
  );

  const queryStr = `
  query {
    ${queryParts.join(',')}
  }
  `;
  const response = await query(queryStr);
  return response.data;
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
  const partyIds = getValuesIdsWithoutQuotes(filters, 'filters.partners');
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

  const customerAccountIds = getValuesIdsWithoutQuotes(filters, 'filters.billingAccounts');
  if (customerAccountIds) {
    allFilters.push(`idCF: {in:[${customerAccountIds}]}`);
  }

  // addQuantityFilter(allFilters, filters);
  addActionTypeFilter(allFilters, filters);
  addOfferFilterFilter(allFilters, filters);
  addOrderId(allFilters, filters);
  addOrderRef(allFilters, filters);
  valuesFromMutiselectFilter(allFilters, filters, 'simStatus', 'filters.lines.SIMCardStatus');
  valuesFromMutiselectFilter(allFilters, filters, 'billingStatus', 'filters.lines.billingStatus');
  valuesFromMutiselectFilter(allFilters, filters, 'networkStatus', 'filters.lines.networkStatus');
  valuesFromMutiselectFilter(
    allFilters,
    filters,
    'commercialStatus',
    'filters.lines.commercialStatus',
    true
  );
  addDateFilter(allFilters, filters, 'orderDate', 'filters.orderDate');
  addDateFilter(allFilters, filters, 'simCardCreatedDate', 'filters.lines.importDate');
  addDateFilter(allFilters, filters, 'commitmentEnd', 'filters.lines.endCommitmentDate');
  addDateFilter(allFilters, filters, 'activationDate', 'filters.lines.activationDate');
  addDateFilter(allFilters, filters, 'preactivationDate', 'filters.lines.preActivationDate');
  // addDateFilter(allFilters, filters, 'todo', 'filters.lines.statusDate');
  addTrafficFilter(allFilters, filters);
  addDateFilter(allFilters, filters, 'commercialStatusDate', 'filters.lines.statusDate');
  addCountries(allFilters, filters);
  addZipCodeFilter(allFilters, filters);
  addEUICCProfileFilter(allFilters, filters);
  addSirenFilter(allFilters, filters);
  addRangeFilter(allFilters, filters, 'iccid', 'filters.lines.rangeICCID');
  addRangeFilter(allFilters, filters, 'imsi', 'filters.lines.rangeIMSI');
  addRangeFilter(allFilters, filters, 'msisdn', 'filters.lines.rangeMSISDN');
  addRangeFilter(allFilters, filters, 'imei', 'filters.lines.rangeIMEI');
  addTerminationValidated(allFilters, filters);

  return allFilters.join(',');
}

function addTerminationValidated(gqlFilters, selectedFilters) {
  const terminationFilter = selectedFilters.find(
    f => f.id === 'filters.lines.terminationValidated'
  );
  if (terminationFilter && terminationFilter.value) {
    gqlFilters.push(`terminationValidated: true`);
  }
}

function addRangeFilter(gqlFilters, selectedFilters, gqlParamName, keyInCurrentFilter) {
  const filterValue = selectedFilters.find(f => f.id === keyInCurrentFilter);
  if (!filterValue) return;
  const containsSearch = filterValue.value.includes('*');
  if (containsSearch) {
    gqlFilters.push(`${gqlParamName}: {contains: "${filterValue.value.replace('*', '')}" }`);
  } else {
    gqlFilters.push(`${gqlParamName}: {eq: "${filterValue.value}" }`);
  }
}

function addZipCodeFilter(gqlFilters, selectedFilters) {
  const zipCode = selectedFilters.find(f => f.id === 'filters.postalCode');
  zipCode && gqlFilters.push(`zipCode: {startsWith: "${zipCode.value.toString()}"}`);
}

function addCountries(gqlFilters, selectedFilters) {
  const countries = getValuesIds(selectedFilters, 'filters.countries');
  if (countries) {
    gqlFilters.push(`country: {in: [${countries.toLowerCase()}]}`);
  }
}

function valuesFromMutiselectFilter(
  gqlFilters,
  selectedFilters,
  gqlParamName,
  keyInCurrentFilter,
  valuesWithQuotes = false
) {
  const values = valuesWithQuotes
    ? getValuesIds(selectedFilters, keyInCurrentFilter)
    : getValuesIdsWithoutQuotes(selectedFilters, keyInCurrentFilter);
  if (values) {
    gqlFilters.push(`${gqlParamName}: {in:[${values}]}`);
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

function getValuesIdsWithoutQuotes(filters, filterId) {
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

function addTrafficFilter(gqlFilters, selectedFilters) {
  const isTraffic = selectedFilters.find(f => f.id === 'filters.lines.traffic');
  if (isTraffic) {
    gqlFilters.push(`isLignesTrafiquantes: true`);
  }
}

function addEUICCProfileFilter(gqlFilters, selectedFilters) {
  const currentStates = selectedFilters.find(f => f.id === 'filters.lines.states');
  if (currentStates) {
    const currentStatesValues = currentStates.values.map(i => i.id);
    gqlFilters.push(`profileEUICC: {in: [${currentStatesValues}]}`);
  }
}

function addSirenFilter(gqlFilters, selectedFilters) {
  const siren = selectedFilters.find(f => f.id === 'filters.lines.siren');
  if (siren) {
    gqlFilters.push(`siren: {eq: "${siren.value}"}`);
  }
}
