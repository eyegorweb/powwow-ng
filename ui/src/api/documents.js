import { query, getFilterValue, getValuesIdsWithoutQuotes } from './utils';

export async function fetchAllDocumentsCategory() {
  const queryStr = `
  query {
    documentTypes {
      name
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.documentTypes;
}

export async function fetchAllDocuments(orderBy, pagination, filters = []) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
    query{
      documents(documentFilterInput:{${formatFilters(filters)}} ${paginationInfo} ${orderingInfo}) {
        total
        items {
        documentName
        creationDate
        category {
          name
        }
        party {
          id
          name
          }
        }
      }
    }
  `;
  const response = await query(queryStr);
  return response.data.documents;
}

export function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addPartyIdFilter(gqlFilters, selectedFilters);
  addDocumentNameFilter(gqlFilters, selectedFilters);
  addCategoryFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addPartyIdFilter(gqlFilters, selectedFilters) {
  const partyIds = getValuesIdsWithoutQuotes(selectedFilters, 'getadmin.users.filters.partners');

  if (partyIds) {
    gqlFilters.push(`partyId: {in: [${partyIds}]}`);
  }
}

function addDocumentNameFilter(gqlFilters, selectedFilters) {
  const documentName = getFilterValue(selectedFilters, 'documents.name');

  if (documentName) {
    gqlFilters.push(`name: {startsWith: "${documentName}"}`);
  }
}

function addCategoryFilter(gqlFilters, selectedFilters) {
  const categories = getValuesIdsWithoutQuotes(selectedFilters, 'documents.category');

  if (categories) {
    gqlFilters.push(`category: {in: ["${categories}"]}`);
  }
}
