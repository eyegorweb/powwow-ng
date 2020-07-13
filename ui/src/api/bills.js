import { query, getFilterValue } from './utils';

export async function fetchBills(filters = []) {
  const queryStr = `
    {
      getBills(billsFilter: {${formatFilters(filters)}}) {
        date
        reference
        customerAccountCode
        amount
        amountExclTaxes
        headings {
          label
          amountExcTaxe
          headingTypeEnum
          usage
          nbSim
        }
      }
    }
      `;
  const response = await query(queryStr);

  return {
    total: 90,
    items: response.data.getBills,
  };
}
export function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addPartyIdFilter(gqlFilters, selectedFilters);
  addCF(gqlFilters, selectedFilters);
  addPeriod(gqlFilters, selectedFilters);
  addReference(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addPartyIdFilter(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(f => f.id === 'getadmin.users.filters.partners');

  if (foundFilter) {
    gqlFilters.push(`partnerId: ${foundFilter.data.id}`);
  }
}

function addCF(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(f => f.id === 'filters.billingAccounts');

  if (foundFilter) {
    gqlFilters.push(`customerAccountId: ${foundFilter.data.id}`);
  }
}

function addPeriod(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(f => f.id === 'common.period');

  if (foundFilter) {
    gqlFilters.push(`startPeriod: "${foundFilter.startDate}", endPeriod: "${foundFilter.endDate}"`);
  }
}

function addReference(gqlFilters, selectedFilters) {
  const reference = getFilterValue(selectedFilters, 'reference');
  if (reference) {
    gqlFilters.push(`reference: "${reference}"`);
  }
}
