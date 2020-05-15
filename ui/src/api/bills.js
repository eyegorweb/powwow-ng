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

  /*
  const response = {
    data: {
      getBills: [
        {
          date: '07/05/2020',
          reference: '96000002700520',
          customerAccountCode: '6.42661.2',
          amount: 75943.12,
          amountExclTaxes: 63285.93,
          headings: [
            {
              label: 'Abonnement M2M',
              amountExcTaxe: 256.55,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 1482,
            },
            {
              label: 'Abonnement M2M',
              amountExcTaxe: -308.91,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 1887,
            },
            {
              label: 'Forfait 2 Mo Maghreb',
              amountExcTaxe: 17.2,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 8,
            },
            {
              label: 'Forfait 2 Mo Maghreb',
              amountExcTaxe: 1,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 1,
            },
            {
              label: 'Abonnement M2M',
              amountExcTaxe: 38528.13,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 180038,
            },
            {
              label: 'Abonnement M2M',
              amountExcTaxe: 179.11,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 2379,
            },
            {
              label: 'Abonnement M2M',
              amountExcTaxe: -19.82,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 159,
            },
            {
              label: 'Forfait 2 Mo Maroc_Algérie',
              amountExcTaxe: 7.56,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 14,
            },
            {
              label: 'Forfait 2 Mo Tunisie',
              amountExcTaxe: 0.56,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 1,
            },
            {
              label: 'Abonnement M2M',
              amountExcTaxe: 23526.8,
              headingTypeEnum: 'SUBSCRIPTION',
              usage: null,
              nbSim: 157898,
            },
            {
              label: 'Consommations Voix Roaming ',
              amountExcTaxe: 25.35,
              headingTypeEnum: 'USAGE',
              usage: 'VOICE',
              nbSim: null,
            },
            {
              label: 'Dans les forfaits Data ',
              amountExcTaxe: 0,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Hors forfaits Data Roaming ',
              amountExcTaxe: 1048.19,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Dont dépassement Data 2Mo EU + Turquie',
              amountExcTaxe: 0,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Dépassement Data ',
              amountExcTaxe: 9.32,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Dans les forfaits Data ',
              amountExcTaxe: 0,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Hors forfaits Data Roaming ',
              amountExcTaxe: 8.88,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Dont dépassement Data 2Mo EU + Turquie',
              amountExcTaxe: 0,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Dépassement Data ',
              amountExcTaxe: 6.02,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Consommations Data ',
              amountExcTaxe: 0,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Consommations Data ',
              amountExcTaxe: 0,
              headingTypeEnum: 'USAGE',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Pool Data Trimestriel ',
              amountExcTaxe: 0,
              headingTypeEnum: 'MUT',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Pool Data Trimestriel consommé ',
              amountExcTaxe: 0,
              headingTypeEnum: 'MUT',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Pool Data Trimestriel ',
              amountExcTaxe: 0,
              headingTypeEnum: 'MUT',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'Pool Data Trimestriel consommé ',
              amountExcTaxe: 0,
              headingTypeEnum: 'MUT',
              usage: 'DATA',
              nbSim: null,
            },
            {
              label: 'RSC premium',
              amountExcTaxe: 1000,
              headingTypeEnum: 'EXCEPT',
              usage: null,
              nbSim: null,
            },
            {
              label: 'Remise 100% RSC',
              amountExcTaxe: -1000,
              headingTypeEnum: 'EXCEPT',
              usage: null,
              nbSim: null,
            },
          ],
        },
      ],
    },
  };
  //*/

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
