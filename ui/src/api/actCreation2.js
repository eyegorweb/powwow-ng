import { query, formatDateForGql, boolStr } from './utils';
import { formatFilters } from './linesActions';

async function actCreationMutation(filters, lines, creationActFn) {
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }
  return await creationActFn(gqlFilter, lineIds);
}

export async function updateCustomFields(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      partyId,
      notifEmail,
      dueDate,
      custom1,
      custom2,
      custom3,
      custom4,
      custom5,
      custom6,
      tempDataUuid,
    } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
    mutation {
      changeCustomFieldsV2(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}",
          custom1: "${custom1}",
          custom2: "${custom2}",
          custom3: "${custom3}",
          custom4: "${custom4}",
          custom5: "${custom5}",
          custom6: "${custom6}",
          ${gqlTempDataUuid}
        }
        ){
          tempDataUuid
          validated
          errors{
            key
            number
          }
        }
    }
    `;

    const response = await query(queryStr);

    return response.data.changeCustomFieldsV2;
  });
}

export async function suspendLines(filters, lines, params) {
  return await suspendReactivateLines(filters, lines, params, true);
}

export async function reactivateLines(filters, lines, params) {
  return await suspendReactivateLines(filters, lines, params, false);
}

async function suspendReactivateLines(filters, lines, params, suspension) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      suspendreFacturation,
      notifEmail,
      dueDate,
      nonModifiableParClient,
      tempDataUuid,
      partyId,
    } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
    mutation {
      suspendReactivateLinesV2(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          suspendBilling: ${boolStr(suspendreFacturation)},
          notification: ${boolStr(notifEmail)},
          suspend: ${suspension},
          nonModifiableByCustomer: ${boolStr(nonModifiableParClient)},
          dueDate: "${formatDateForGql(dueDate)}",
          ${gqlTempDataUuid}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
          }
        }
    }
    `;

    const response = await query(queryStr);
    return response.data.suspendReactivateLinesV2;
  });
}

export async function changeCustomerAccount(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { partyId, dueDate, notifEmail, targetCustomerAccount, tempDataUuid } = params;
    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }
    const queryStr = `
    mutation {
      changeCustomerAccountV2(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}",
          targetCustomerAccountId: ${targetCustomerAccount},
          ${gqlTempDataUuid}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
          }
        }
    }
    `;

    const response = await query(queryStr);
    return response.data.changeCustomerAccountV2;
  });
}

export async function transferSIMCards(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { partyId, dueDate, toPartyId, toCustomerAccountId, toWorkflowId, tempDataUuid } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
      mutation {
        transferSIMCardsV2(
          input: {
            filter: {${gqlFilter}},
            partyId: ${partyId},
            simCardInstanceIds: [${gqlLines}],
            notification: false,
            dueDate: "${formatDateForGql(dueDate)}",
            toPartyId: ${toPartyId},
            toCustomerAccountId: ${toCustomerAccountId},
            toWorkflowId: "${toWorkflowId}",
            ${gqlTempDataUuid}
          })
          {
            tempDataUuid
            validated
            errors{
              key
              number
            }
          }
      }
      `;

    const response = await query(queryStr);
    return response.data.transferSIMCardsV2;
  });
}

export async function manageCancellation(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { dueDate, partyId, validate, tempDataUuid } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
    mutation{
      validateRefuseLinesV2(
          input :{
            filter: {${gqlFilter}},
            simCardInstanceIds: [${gqlLines}],
            notification: false,
            validate: ${validate},
            partyId: ${partyId},
            dueDate: "${formatDateForGql(dueDate)}",
            ${gqlTempDataUuid}
          }
      )
      {
        tempDataUuid
        validated
        errors{
          key
          number
        }
      }
    }
    `;

    const response = await query(queryStr);
    return response.data.validateRefuseLinesV2;
  });
}

export async function endPhaseTest(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { notifEmail, dueDate, partyId, tempDataUuid } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
    mutation {
      terminatePhaseTest(input: {
        adminSkipGDM: false,
        filter: {${gqlFilter}},
        partyId: ${partyId},
        simCardInstanceIds: [${gqlLines}],
        notification: ${boolStr(notifEmail)},
        dueDate: "${formatDateForGql(dueDate)}",
        ${gqlTempDataUuid}
      })
       {
        tempDataUuid
        validated
        errors{
          key
          number
        }
       }
      }

      `;

    const response = await query(queryStr);
    return response.data.terminatePhaseTest;
  });
}

export async function sendSMS(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      partyId,
      notifEmail,
      dueDate,
      texMessage,
      numberOfSMS,
      shortCode,
      tempDataUuid,
    } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }
    const queryStr = `
    mutation {
      sendSMSV2(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}"
          textMessage: "${texMessage}",
          numberOfSMS: ${numberOfSMS},
          shortCode: "${shortCode}",
          ${gqlTempDataUuid}
          }
        )
        {
          tempDataUuid
          validated
          errors{
            key
            number
          }
         }
    }
    `;

    const response = await query(queryStr);
    return response.data.sendSMSV2;
  });
}

export async function terminateLines(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { notifEmail, dueDate, partyId, tempDataUuid } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
    mutation {
      terminateLinesV2(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}"
          ${gqlTempDataUuid}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
          }
         }
    }
    `;

    const response = await query(queryStr);
    return response.data.terminateLinesV2;
  });
}

export async function changeService(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      notifEmail,
      dueDate,
      partyId,
      tempDataUuid,
      servicesToEnable,
      servicesToDisable,
      dataService,
      offerCode,
    } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    let codesToEnable = [];
    let codesToDisable = [];
    let dataCodeParams = '';

    if (servicesToEnable && servicesToEnable.length) {
      codesToEnable = servicesToEnable.map(s => `{serviceCode: "${s.code}", action: ADD}`);
    }

    if (servicesToDisable && servicesToDisable.length) {
      codesToDisable = servicesToDisable.map(s => `{serviceCode: "${s.code}", action: DELETE}`);
    }

    if (dataService) {
      const apnToAddParams = dataService.apns
        .filter(a => a.selected)
        .map(a => `{parameterCode: "${a.code}", action: ADD}`);

      const apnsToDeleteParams = dataService.apns
        .filter(a => !a.selected)
        .map(a => `{parameterCode: "${a.code}", action: DELETE}`);

      const catalogServiceParameters = `${[...apnToAddParams, ...apnsToDeleteParams].join(',')}`;

      dataCodeParams = `{serviceCode: "${
        dataService.code
      }", action: ADD, catalogServiceParameters: [${catalogServiceParameters}]}`;
    } else {
      dataCodeParams = `{serviceCode: "DATA", action: DELETE}`;
    }
    let changeServicesParamsGql = '';

    if (dataCodeParams || codesToDisable || codesToDisable) {
      changeServicesParamsGql = `, changeServices: [${[
        ...codesToEnable,
        ...codesToDisable,
        dataCodeParams,
      ].join(',')}]`;
    }

    const queryStr = `
    mutation {
      changeServices(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}",
          marketingOfferCode: "${offerCode}"
          ${gqlTempDataUuid}
          ${changeServicesParamsGql}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
          }
         }
    }
    `;

    const response = await query(queryStr);
    if (response) return response.data.changeServices;
  });
}
