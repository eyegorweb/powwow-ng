import { query, getFilterValue, getValuesIds } from './utils';

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
        id
        fileName
        documentName
        created
        customerAccount{
          id
          code
          name
        }
        party {
          id
          name
        }
        report {
          name
        }
        category {
          name
          directoryName
        }
        partyGroupId
        auditable {
          created
          updated
          creator {
            id
            name {title firstName lastName}
          }
          updater {
            id
            name {title firstName lastName}
          }
        }
        party{
          id
          name
        }
        category{
          name
        }
      }
    }
  }
  `;
  const response = await query(queryStr);
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.documents;
}

export function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addPartyIdFilter(gqlFilters, selectedFilters);
  addCutomerAccountId(gqlFilters, selectedFilters);
  addDocumentNameFilter(gqlFilters, selectedFilters);
  addCategoryFilter(gqlFilters, selectedFilters);
  addReportModel(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

export function addReportModel(gqlFilters, selectedFilters) {
  const filterdItem = selectedFilters.find((f) => f.id === 'documents.model');
  if (filterdItem) {
    gqlFilters.push(`reportId: {in: [${filterdItem.data.id}]}`);
  }
}

function addPartyIdFilter(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'getadmin.users.filters.partners');

  if (foundFilter && foundFilter.data && foundFilter.id) {
    gqlFilters.push(`partyId: {eq: ${foundFilter.data.id}}`);
  }
}

function addCutomerAccountId(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'filters.billingAccounts');

  if (foundFilter && foundFilter.data && foundFilter.id) {
    gqlFilters.push(`idCF: { eq:${foundFilter.data.id}}`);
  }
}

function addDocumentNameFilter(gqlFilters, selectedFilters) {
  const documentName = getFilterValue(selectedFilters, 'documents.name');

  if (documentName) {
    gqlFilters.push(`name: {startsWith: "${documentName}"}`);
  }
}

function addCategoryFilter(gqlFilters, selectedFilters) {
  const categories = getValuesIds(selectedFilters, 'documents.category');

  if (categories) {
    gqlFilters.push(`category: {in: [${categories}]}`);
  }
}

export async function deleteDocument(id) {
  const queryStr = `
  mutation  {
    deleteDocument(idDocument:${id})
    }
  `;

  const response = await query(queryStr);

  return response.data.deleteDocument;
}
