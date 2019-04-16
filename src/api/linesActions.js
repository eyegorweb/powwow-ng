import { query } from './utils';

// TODO: Optimiser cette requette, il faudra appeler les fields au besoin
export async function searchLinesActions(orderBy, pagination, filters = []) {
  /*
  const orderingInfo = orderBy
    ? `, sorting: {field: ${orderBy.key},order:${orderBy.direction}}`
    : '';
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
            party{id }
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
  //*/

  // const response = await query(queryStr);
  // return response.data.lines;

  const rows = [
    {
      partner: 'Toto',
      action: 'Pré-activation',
      actDate: '01/11/2018',
      details: 'Partner toto',
      target: 6,
      success: 0,
      ongoing: 0,
      fail: 0,
    },
  ];

  const response = {
    data: {
      lines: {
        total: 1,
        items: [
          {
            // id: '122',
            parner: '122',
            msisdn: '33624389606',
            imsi: '208206711887999',
            accessPoint: {
              commercialStatus: 'test',
              lastPLMN: null,
              preactivationDate: null,
              activationDate: '27-02-2018 16:13:31',
              commercialStatusDate: '27-02-2018 16:19:18',
              customFields: {
                custom1: null,
                custom2: null,
                custom3: null,
                custom4: null,
              },
              offer: {
                marketingOffer: {
                  code: 'LYRA_PARC1_COMPTEUR',
                  description: 'Parc 1 compteur',
                },
              },
              simCardInstance: {
                party: {
                  id: '2',
                },
                id: '143',
                iccid: '2999216721118879501',
                type: 'M2M sim sans code pin',
                statuts: 'ALLOCATED',
                auditable: {
                  created: '21-04-2017',
                },
                deviceInstance: null,
              },
            },
          },
        ],
      },
    },
  };

  console.log('response act lines', response.data.lines.items);

  return response.data.lines.items;
}

function formatFilters(filters) {
  const allFilters = [];
  const partyIds = getValuesIdsForInt(filters, 'filters.partners');
  if (partyIds) {
    allFilters.push(`partyIds: [${partyIds}]`);
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

  // addQuantityFilter(allFilters, filters);
  addActionTypeFilter(allFilters, filters);

  return allFilters.join(',');
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
