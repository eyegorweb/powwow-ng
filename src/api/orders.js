import { query } from './utils';
import moment from 'moment';

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
        orderItems {
          quantity
          orderedProduct {
            description
            code
          }
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

  const customFields = getFilterValues(filters, 'filters.customFields');
  if (customFields && customFields.length > 0) {
    const customFeldsGQLparams = customFields
      .map(c => `${c.id}: {contains: "${c.value}"}`)
      .join(',');

    allFilters.push(customFeldsGQLparams);
  }

  addQuantityFilter(allFilters, filters);
  addDateFilter(allFilters, filters);

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
