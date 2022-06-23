import { query, getFilterValue, getValuesIdsWithoutQuotes, addDateFilter } from './utils';

export async function fetchAlarmTriggersFor2Months(orderBy, pagination, filters = []) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  {
    alarmsWithTriggers(
      linesWithTriggersFilterInput: { ${formatFilters(filters)} },
      ${paginationInfo}
    ) {
      total
      items {
        simCardInstanceId
        iccid
        activationDate
        lastTriggerThisMonth {
          triggerDate
          reasonAndValue {
            reason
            value
          }
        }
        lastTriggerPastMonth {
          triggerDate
          reasonAndValue {
            reason
            value
          }
        }
      }
    }
  }
  `;

  const response = await query(queryStr);
  if (response.data) return response.data.alarmsWithTriggers;
}

export async function exportlinesBoundTable(
  columns,
  orderBy,
  alarmId,
  exportFormat,
  operator,
  asyncExportRequest = false,
  lastUsedFilters
) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';

  let asyncExportRequestParam = '';
  if (asyncExportRequest) {
    asyncExportRequestParam = `, asyncExportRequest: ${asyncExportRequest}`;
  }

  const queryStr = `
  {
    linesBoundToAlarmExport(
      alarmsToLinesFilterInput: {
        alarmId: { ${operator}: ${alarmId}}
        ${formatFilters(lastUsedFilters)}
       }
      columns: [${columnsParam}]${orderingInfo}
      exportFormat: ${exportFormat}
      ${asyncExportRequestParam}
    ) {
      downloadUri
      total
      asyncRequired
    }
  }
  `;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.linesBoundToAlarmExport;
}
export async function fetchLinesBoundToAlarm(orderBy, pagination, filters = []) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  {
    linesBoundToAlarm(alarmsToLinesFilterInput: {${formatFilters(filters)}}${paginationInfo}) {
      total
      items {
        id
        iccid
        triggerReasonAndDate {
          triggerDate
          reasonAndValue {
            reason
            value
          }
        }

        activationDate

        accessPoint {
          id
          offerGroup{
            customerAccount {
              code
              name
            }
          }
          offer {
            marketingOffer {
              code
              description
            }
          }
        }
        boundAlarms {
          id
          type
          alarm {
            id
            name
          }
        }
      }
    }
  }

  `;

  const response = await query(queryStr);

  if (!response) {
    return { errors: 'unknown' };
  }

  return response.data.linesBoundToAlarm;
}

function formatFilters(selectedFilters) {
  if (selectedFilters) {
    const gqlFilters = [];
    addPartyId(gqlFilters, selectedFilters);
    addAlarmId(gqlFilters, selectedFilters);
    addThreshold(gqlFilters, selectedFilters);
    addLineId(gqlFilters, selectedFilters);
    addDateFilter(gqlFilters, selectedFilters, 'lastTriggerDate', 'getvsion.alarm.trigger_date');
    addBillingAccount(gqlFilters, selectedFilters);
    addOffer(gqlFilters, selectedFilters);
    addFileFilter(gqlFilters, selectedFilters);

    return gqlFilters.join(',');
  }
  return '';
}

function addFileFilter(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'filters.lines.fromFile.title');
  if (foundFilter && foundFilter.values && foundFilter.values.length) {
    gqlFilters.push(`tempDataUuid: "${foundFilter.values[0].tempDataUuid}"`);
  }
}

function addOffer(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'filters.offers');
  if (foundFilter) {
    const ids = foundFilter.values.map((v) => v.data.initialOffer.id).join(',');

    gqlFilters.push(`offerId: {in: [${ids}]}`);
  }
}

function addBillingAccount(gqlFilters, selectedFilters) {
  const ids = getValuesIdsWithoutQuotes(selectedFilters, 'common.billingAccount');
  if (ids) {
    gqlFilters.push(`customerAccount: {in: [${ids}]}`);
  }
}

function addAlarmId(gqlFilters, selectedFilters) {
  let alarmId;
  let condition = 'eq';
  const foundFilter = selectedFilters.find((f) => f.id === 'filters.alarmId');
  if (foundFilter) {
    alarmId = foundFilter.value;
    if (foundFilter.notEqual) {
      condition = 'ne';
    }
  }

  if (alarmId) {
    gqlFilters.push(`alarmId: {${condition}: ${alarmId}}`);
  }
}

function addPartyId(gqlFilters, selectedFilters) {
  const partyId = getFilterValue(selectedFilters, 'filters.partyId');
  if (partyId) {
    gqlFilters.push(`partyId: {eq: ${partyId}}`);
  }
}

function addThreshold(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'getvsion.alarm.trigger_reason');

  if (foundFilter) {
    gqlFilters.push(`threshold: ${foundFilter.data.value}`);
  }
}

export function addLineId(gqlFilters, selectedFilters) {
  const idsFilters = [];

  const _id = selectedFilters.find((f) => f.id === 'filters.id');
  const accessPointId = selectedFilters.find((f) => f.id === 'filters.accessPointId');
  const iccid = selectedFilters.find((f) => f.id === 'filters.iccid');
  const imsi = selectedFilters.find((f) => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find((f) => f.id === 'filters.msisdn');
  const imei = selectedFilters.find((f) => f.id === 'filters.imei');
  const msisdnA = selectedFilters.find((f) => f.id === 'filters.msisdnA');

  if (_id && _id.value && _id.value.length) {
    idsFilters.push(`id: "${_id.value}"`);
  }
  if (iccid && iccid.value && iccid.value.length) {
    idsFilters.push(`iccid: "${iccid.value}"`);
  }
  if (imsi && imsi.value && imsi.value.length) {
    idsFilters.push(`imsi: "${imsi.value}"`);
  }
  if (msisdn && msisdn.value && msisdn.value.length) {
    idsFilters.push(`msisdn: "${msisdn.value}"`);
  }
  if (imei && imei.value && imei.value.length) {
    idsFilters.push(`imei: "${imei.value}"`);
  }
  if (msisdnA && msisdnA.value && msisdnA.value.length) {
    idsFilters.push(`msisdnA: "${msisdnA.value}"`);
  }
  if (accessPointId && accessPointId.value && accessPointId.value.length) {
    idsFilters.push(`accessPointId: "${accessPointId.value}"`);
  }

  if (idsFilters && idsFilters.length) gqlFilters.push(`lineIdentifier: {${idsFilters.join(',')}}`);
}
