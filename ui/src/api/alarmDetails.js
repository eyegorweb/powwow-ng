import { query, getFilterValue, addDateFilter } from './utils';

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

  return response.data.alarmsWithTriggers;
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
        iccid
        alarmEvent {
          id
        }
        alarmInstance {
          id
          icv1
        }
        boundAlarms {
          id
          type
        }
      }
    }
  }

  `;

  // const response = await query(queryStr);

  const response = {
    data: {
      linesBoundToAlarm: {
        total: 1,
        items: [
          {
            iccid: '8933205805185151759',
            alarmEvent: {
              id: '2630',
              alarm: {},
              accessPoint: {},
              emissionDate: '01/01/2020',
              comments: 'vel',
              suspensionAuto: 'Proin 4856',
              suspensionDueDate: '01/01/2020',
              icv1: 2952,
              levelValue1: 4024,
              currentValue1: 6773,
              previousValue1: 8183,
              icv2: 5043,
              levelValue2: 2270,
              currentValue2: 5851,
              previousValue2: 1273,
              icv3: 8368,
              levelValue3: 5712,
              currentValue3: 5929,
              previousValue3: 4501,
              icv1Up: 2072,
              levelValue1Up: 757,
              currentValue1Up: 6876,
              previousValue1Up: 5510,
              icv2Up: 9905,
              levelValue2Up: 8340,
              currentValue2Up: 440,
              previousValue2Up: 5500,
              icv3Up: 4894,
              levelValue3Up: 1410,
              currentValue3Up: 8720,
              previousValue3Up: 1062,
              icv1Down: 6806,
              levelValue1Down: 633,
              currentValue1Down: 163,
              previousValue1Down: 9376,
              icv2Down: 2915,
              levelValue2Down: 4217,
              currentValue2Down: 3411,
              previousValue2Down: 3390,
              icv3Down: 573,
              levelValue3Down: 6844,
              currentValue3Down: 2829,
              previousValue3Down: 7383,
              fromStatus: 'consectetur',
              toStatus: 'consectetur',
              statusUpdated: 'leo 2669',
              oldIMEI: 'purus',
              newIMEI: 'Adipiscing',
            },
            alarmInstance: {
              id: '2010',
              accessPoint: {},
              type: 'OVER_CONSUMPTION_VOLUME_ROUNDED',
              expiryDate: '01/01/2020',
              nextResetDate: '01/01/2020',
              nextAlertMinDate: '01/01/2020',
              firstTicketDate: '01/01/2020',
              icv1: 7495,
              icv1Up: 7526,
              icv1Down: 5805,
              lv1: 6398,
              lv1Up: 8198,
              lv1Down: 6967,
              ccv1: 8858,
              ccv1Up: 831,
              ccv1Down: 9410,
              pcv1: 3823,
              pcv1Up: 2891,
              pcv1Down: 1558,
              icv2: 3443,
              icv2Up: 5902,
              icv2Down: 3607,
              lv2: 8285,
              lv2Up: 9868,
              lv2Down: 1887,
              ccv2: 3176,
              ccv2Up: 1306,
              ccv2Down: 4736,
              pcv2: 6115,
              pcv2Up: 3767,
              pcv2Down: 7784,
              icv3: 4090,
              icv3Up: 6611,
              icv3Down: 3098,
              lv3: 411,
              lv3Up: 20,
              lv3Down: 6858,
              ccv3: 2341,
              ccv3Up: 1316,
              ccv3Down: 9768,
              pcv3: 2402,
              pcv3Up: 5246,
              pcv3Down: 1881,
              disabled: 'vel 7522',
              created: '01/01/2020',
              updated: 'purus 6573',
              fromStatus: 'commodo',
              toStatus: 'accumsan',
              statusUpdated: 'leo 1323',
              triggerStatus: 'elit',
              oldIMEI: 'vel',
              newIMEI: 'amet',
              resettable: 'commodo 7808',
            },
            boundAlarms: [
              {
                id: '5390',
                alarm: {
                  name: 'Sur-Conso Linky Prod',
                },
                accessPoint: {
                  id: '11008',
                  lastPLMN: 'commodo',
                  commercialStatus: 'accumsan',
                  preactivationDate: '01/01/2020',
                  activationDate: '01/01/2020',
                  commercialStatusDate: '01/01/2020',
                  networkStatusTranslated: 'amet',
                  lines: [],
                  workflowCode: 'imperdiet',
                  alarmInstance: [],
                  commitmentDuration: 8195,
                  commitmentBegin: 'purus 172',
                  commitmentEnd: 'fermentum 6566',
                  billingStatusTranslated: 'leo',
                  billingStatusChangeDate: '01/01/2020',
                  remainingSuspension: 3260,
                  spec1: 'purus',
                  spec2: 'dui',
                },
                type: 'OVER_CONSUMPTION_VOLUME_FLOTTE',
                expiryDate: '01/01/2020',
                nextResetDate: '01/01/2020',
                nextAlertMinDate: '01/01/2020',
                firstTicketDate: '01/01/2020',
                icv1: 3461,
                icv1Up: 1054,
                icv1Down: 2370,
                lv1: 4402,
                lv1Up: 4997,
                lv1Down: 6561,
                ccv1: 5884,
                ccv1Up: 8511,
                ccv1Down: 9046,
                pcv1: 9968,
                pcv1Up: 1291,
                pcv1Down: 6052,
                icv2: 198,
                icv2Up: 1392,
                icv2Down: 9988,
                lv2: 6892,
                lv2Up: 6641,
                lv2Down: 122,
                ccv2: 9654,
                ccv2Up: 9052,
                ccv2Down: 8722,
                pcv2: 8108,
                pcv2Up: 9095,
                pcv2Down: 2299,
                icv3: 8007,
                icv3Up: 2286,
                icv3Down: 4582,
                lv3: 3194,
                lv3Up: 3189,
                lv3Down: 9874,
                ccv3: 7477,
                ccv3Up: 3874,
                ccv3Down: 9018,
                pcv3: 5603,
                pcv3Up: 9939,
                pcv3Down: 2565,
                disabled: 'leo 2720',
                created: 'elit 918',
                updated: 'vel 3859',
                fromStatus: 'vel',
                toStatus: 'commodo',
                statusUpdated: 'orci 10838',
                triggerStatus: 'amet',
                oldIMEI: 'dui',
                newIMEI: 'at',
                resettable: 'ut. 8300',
              },
            ],
          },
        ],
      },
    },
  };

  return response.data.linesBoundToAlarm;
}

function formatFilters(selectedFilters) {
  const gqlFilters = [];
  addPartyId(gqlFilters, selectedFilters);
  addAlarmId(gqlFilters, selectedFilters);
  addThreshold(gqlFilters, selectedFilters);
  addLineId(gqlFilters, selectedFilters);
  addDateFilter(gqlFilters, selectedFilters, 'lastTriggerDate', 'getvsion.alarm.trigger_date');

  return gqlFilters.join(',');
}

function addAlarmId(gqlFilters, selectedFilters) {
  const alarmId = getFilterValue(selectedFilters, 'filters.alarmId');
  if (alarmId) {
    gqlFilters.push(`alarmId: {eq: ${alarmId}}`);
  }
}

function addPartyId(gqlFilters, selectedFilters) {
  const partyId = getFilterValue(selectedFilters, 'filters.partyId');
  if (partyId) {
    gqlFilters.push(`partyId: {eq: ${partyId}}`);
  }
}

function addThreshold(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(f => f.id === 'getvsion.alarm.trigger_reason');

  if (foundFilter) {
    gqlFilters.push(`threshold: ${foundFilter.data.value}`);
  }
}

function addLineId(gqlFilters, selectedFilters) {
  const idsFilters = [];

  const _id = selectedFilters.find(f => f.id === 'filters.id');
  const accessPointId = selectedFilters.find(f => f.id === 'filters.accessPointId');
  const iccid = selectedFilters.find(f => f.id === 'filters.iccid');
  const imsi = selectedFilters.find(f => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find(f => f.id === 'filters.msisdn');
  const imei = selectedFilters.find(f => f.id === 'filters.imei');
  const msisdnA = selectedFilters.find(f => f.id === 'filters.msisdnA');

  if (_id) {
    idsFilters.push(`id: {eq: "${_id.value}"}`);
  }
  if (iccid) {
    idsFilters.push(`iccid: {eq: "${iccid.value}"}`);
  }
  if (imsi) {
    idsFilters.push(`imsi: {eq: "${imsi.value}"}`);
  }
  if (msisdn) {
    idsFilters.push(`msisdn: {eq: "${msisdn.value}"}`);
  }
  if (imei) {
    idsFilters.push(`imei: {eq: "${imei.value}"}`);
  }
  if (msisdnA) {
    idsFilters.push(`msisdnA: {eq: "${msisdnA.value}"}`);
  }
  if (accessPointId) {
    idsFilters.push(`accessPointId: {eq: "${accessPointId.value}"}`);
  }

  if (idsFilters && idsFilters.length) gqlFilters.push(`lineIdentifier: ${idsFilters.join(',')}`);
}
