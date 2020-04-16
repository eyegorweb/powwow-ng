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
  addReportModel(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

export function addReportModel(gqlFilters, selectedFilters) {
  const filterdItem = selectedFilters.find(f => f.id === 'documents.model');
  if (filterdItem) {
    gqlFilters.push(`reportId: {in: [${filterdItem.data.id}]}`);
  }
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
