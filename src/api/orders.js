import { query } from './utils';
import moment from 'moment';
import get from 'lodash.get';

// TODO: Optimiser cette requette, il faudra appeler les fields au besoin
export async function searchOrders(orderBy, pagination, filters = []) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';

  const queryStr = `
  query {
    orders(filter: {${formatFilters(filters)}}${paginationInfo}${orderingInfo}) {
      total
      items {
        id
        creationDate
        activationAsked
        status
        externalId
        preActivationAsked
        importedQuantity
        contactInformation {
          email
          phone
          mobile
        }
        name {
          title
          firstName
          lastName
        }
        orderedSimcard {
          description
          code
          buyingPriceInEuroCentHT
          recurringPriceInEuroCentHT
          buyingPriceInEuroCentTTC
          recurringPriceInEuroCentTTC
          groupCode
          groupName
        }
        auditable {
          creator {
            name {
              title
              firstName
              lastName
            }
            email
          }
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
        customerAccount {
          code
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
        party {
          name
          code
          custom1FieldLabel
          custom2FieldLabel
          custom3FieldLabel
          custom4FieldLabel
          custom5FieldLabel
          custom6FieldLabel
        }
        quantity
        customFields {
          custom1
          custom2
          custom3
          custom4
          custom5
          custom6
        }
        orderedMarketingOffer {
          description
          code
          buyingPriceInEuroCentHT
          recurringPriceInEuroCentHT
          buyingPriceInEuroCentTTC
          recurringPriceInEuroCentTTC
          groupCode
          groupName
          servicesLabel
          servicesGroup
        }
        orderStatusHistories{
          status
          statusDate
        }
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.orders;
}

function formatFilters(filters) {
  const allFilters = [];
  const partyIds = getValuesIds(filters, 'filters.partners');
  if (partyIds) {
    allFilters.push(`partyId: {in:[${partyIds}]}`);
  }

  const customerAccountIds = getValuesIds(filters, 'filters.billingAccounts');
  if (customerAccountIds) {
    allFilters.push(`customerAccountId: {in:[${customerAccountIds}]}`);
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

  addQuantityFilter(allFilters, filters);
  addDateFilter(allFilters, filters);
  addCityFilter(allFilters, filters);
  addZipCodeFilter(allFilters, filters);
  orderStatus(allFilters, filters);
  addaction(allFilters, filters);
  addCountries(allFilters, filters);

  return allFilters.join(',');
}

function addDateFilter(gqlFilters, selectedFilters) {
  const dateFilter = selectedFilters.find(f => f.id === 'filters.orderDate');
  if (dateFilter && dateFilter.startDate && dateFilter.endDate) {
    const formattedStartDate = `${dateFilter.startDate.replace(/\//g, '-')} 00:00:00`;
    const modifiedEndDate = moment(dateFilter.endDate, 'DD/MM/YYYY').add(1, 'days');
    const formattedEndDate = `${modifiedEndDate.format('DD-MM-YYYY')} 00:00:00`;

    gqlFilters.push(
      `orderDate: {between: {startDate: "${formattedStartDate}", endDate: "${formattedEndDate}"}}`
    );
  }
}

function addQuantityFilter(gqlFilters, selectedFilters) {
  const quantityFilter = selectedFilters.find(f => f.id === 'filters.quantity');
  if (quantityFilter) {
    if (quantityFilter.from && !quantityFilter.to) {
      gqlFilters.push(`quantity: {goe: ${quantityFilter.from}}`);
    }
    if (!quantityFilter.from && quantityFilter.to) {
      gqlFilters.push(`quantity: {loe: ${quantityFilter.to}}`);
    }
    if (quantityFilter.from && quantityFilter.to) {
      gqlFilters.push(`quantity: {goe: ${quantityFilter.from}, loe: ${quantityFilter.to}}`);
    }
  }
}

function addCityFilter(gqlFilters, selectedFilters) {
  const city = selectedFilters.find(f => f.id === 'filters.city');
  city && gqlFilters.push(`city: {startsWith: "${city.value.toUpperCase()}"}`);
}

function addZipCodeFilter(gqlFilters, selectedFilters) {
  const zipCode = selectedFilters.find(f => f.id === 'filters.postalCode');
  zipCode && gqlFilters.push(`zipCode: {startsWith: "${zipCode.value.toString()}"}`);
}

function orderStatus(gqlFilters, selectedFilters) {
  const orderStatuses = selectedFilters.find(f => f.id === 'filters.orderStatus');
  orderStatuses && gqlFilters.push(`status: {in: [${orderStatuses.values.map(o => o.id)}]}`);
}

function addaction(gqlFilters, selectedFilters) {
  const action = selectedFilters.find(f => f.id === 'filters.action');
  const activationAsked = action && action.values.find(f => f.id === 'action.active');
  const preactivationAsked = action && action.values.find(f => f.id === 'action.PreActive');
  if (activationAsked) {
    gqlFilters.push(`activationAsked: {eq: ${activationAsked.value}}`);
  }
  if (preactivationAsked) {
    gqlFilters.push(`preactivationAsked: {eq: ${preactivationAsked.value}}`);
  }
}

function addCountries(gqlFilters, selectedFilters) {
  const countries = getValuesIds(selectedFilters, 'filters.countries');
  if (countries) {
    gqlFilters.push(`country: {in: [${countries.toLowerCase()}]}`);
  }
}

function getFilterValues(filters, filterId) {
  if (!filters) return;

  const foundFilter = filters.find(f => f.id === filterId);
  if (foundFilter) {
    return foundFilter.values;
  }
}

function getValuesIds(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `"${i.id}"`).join(',');
  }
}

/**
 * Finds a date filter based on filterId and formats it to be used by a gql
 * query. In the future, this function could have moer arguments to handle different
 * kind of date ranges (DateTimeFilterInput type in gql).
 * Exported to test it.
 * @param {Array} filters array of filters
 * @param {string} filterId id of the filter to extract and format
 * @returns {string?}
 */
export function formatDateRangeFilter(filters, filterId) {
  const filter = filters.find(f => f.id === filterId);
  if (!filter) return null;
  // NOTE: could handle specific dates, before or after dates in the future
  return `{between: {startDate: ${JSON.stringify(
    filter.startDate.toISOString().slice(0, 10)
  )}, endDate: ${JSON.stringify(filter.endDate.toISOString().slice(0, 10))}}}`;
}

export async function createOrder(synthesis) {
  let address1 = '';
  let address2 = '';
  let address3 = '';
  if (synthesis.delivery.value.detail.address) {
    address1 = get(synthesis, 'delivery.value.detail.address.address1');
    address1 = address1 !== 'null' && address1 !== 'undefined' ? address1 : '';

    address2 = get(synthesis, 'delivery.value.detail.address.address2');
    address2 = address2 !== 'null' && address2 !== 'undefined' ? address2 : '';

    address3 = get(synthesis, 'delivery.value.detail.address.address3');
    address3 = address3 !== 'null' && address3 !== 'undefined' ? address3 : '';
  }

  const firstName = get(synthesis, 'delivery.value.detail.name.firstName', '');
  const lastName = get(synthesis, 'delivery.value.detail.name.lastName', '');
  const title = get(synthesis, 'delivery.value.detail.name.title', '');

  const email = get(synthesis, 'delivery.value.detail.contactInformation.email', '');
  const phone = get(synthesis, 'delivery.value.detail.contactInformation.phone', '');

  let customFieldsDTO = '{}';
  if (
    synthesis.customFields &&
    synthesis.customFields.selection &&
    synthesis.customFields.selection.length > 0
  ) {
    const values = synthesis.customFields.selection
      .map((c, index) => `custom${index + 1}:"${c.value}"`)
      .join(',');
    customFieldsDTO = `{
      ${values}
    }`;
  }
  const queryStr = `
  mutation {
    createOrder(orderInput: {
      customerAccountId: ${get(synthesis, 'billingAccount.value.id')},
      shippingAddress: {
        company: "${get(synthesis, 'delivery.value.detail.company')}",
        address: {
          address1: "${address1}",
          address2: "${address2}",
          address3: "${address3}",
          zipCode: "${get(synthesis, 'delivery.value.detail.address.zipCode')}",
          city: "${get(synthesis, 'delivery.value.detail.address.city')}",
          country: "${get(synthesis, 'delivery.value.detail.address.country')}",
          state: "${get(synthesis, 'delivery.value.detail.address.state')}"
        },
        name: {
          title: ${title || 'MR'},
          firstName: "${firstName}",
          lastName: "${lastName}"
        },
        contactInformation: {
          email: "${email}",
          phone: "${phone}",
          mobile: ""
        }
      }
      simCardQuantity: ${get(synthesis, 'quantity.value.content')},
      preActivationAsked: ${get(synthesis, 'services.value.preActivation') ? 'true' : 'false'},
      activationAsked: false,
      simCardId: ${get(synthesis, 'product.value.id')}
      customFieldsDTO: ${customFieldsDTO}
    }) {
      id
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.createOrder;
}

export async function cancelOrder(orderId) {
  return await updateOrderStatus(orderId, 'CANCELED');
}

export async function validateOrder(orderId) {
  return await updateOrderStatus(orderId, 'VALIDATED');
}

export async function updateOrderStatus(orderId, newStatus) {
  const response = await query(
    `
    mutation {
      updateOrder(orderId: ${orderId}, status: ${newStatus}) {
        id
        status
      }
    }
    `
  );
  return response.data.updateOrder;
}

export async function exportFile(columns, orderBy, filters = []) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const response = await query(
    `
    query {
      ordersExport(filter: {${formatFilters(
        filters
      )}}, ${orderingInfo}, columns: [${columnsParam}], exportFormat: EXCEL) {
        downloadUri
      }
    }
    `
  );
  return response.data.ordersExport;
}
