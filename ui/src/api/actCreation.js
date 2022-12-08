import { query, boolStr, formatServicesForGQL } from './utils';
import { formatFilters } from './linesActions';
import moment from 'moment';

async function actCreationMutation(filters, lines, creationActFn) {
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map((l) => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }
  return await creationActFn(gqlFilter, lineIds);
}

export async function updateCustomFields(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
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
      spec1,
      spec2,
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
          dueDate: "${dueDate}",
          custom1: "${custom1}",
          custom2: "${custom2}",
          custom3: "${custom3}",
          custom4: "${custom4}",
          custom5: "${custom5}",
          custom6: "${custom6}",
          spec1: "${spec1}",
          spec2: "${spec2}",
          ${gqlTempDataUuid}
        }
        ){
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }

    return response.data.changeCustomFieldsV2;
  });
}

export async function updateCustomAndSpecificFieldsByFile(
  tempDataUuid,
  date,
  partnerId,
  fieldsType
) {
  const queryStr = `
  mutation {
    change${fieldsType}ByFile(
      input: {
        partyId: ${partnerId}
        dueDate: "${date}"
        tempDataUuid: "${tempDataUuid}"
        notification: false
      }
    ) {
      tempDataUuid
      validated
      errors {
        key
        number
        message
      }
    }
  }
 `;

  const response = await query(queryStr, undefined, true);

  return response.data;
}

export async function changeSingleCustomFields(params) {
  const {
    partyId,
    simCardId,
    notifEmail,
    dueDate,
    custom1,
    custom2,
    custom3,
    custom4,
    custom5,
    custom6,
    spec1,
    spec2,
  } = params;

  const queryStr = `
    mutation {
      changeCustomFieldsV2(
        input: {
          partyId: ${partyId},
          simCardInstanceIds: ${simCardId},
          notification: ${boolStr(notifEmail)},
          dueDate: "${dueDate}",
          custom1: "${custom1}",
          custom2: "${custom2}",
          custom3: "${custom3}",
          custom4: "${custom4}",
          custom5: "${custom5}",
          custom6: "${custom6}",
          spec1: "${spec1}",
          spec2: "${spec2}",
        }
        ){
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;

  const response = await query(queryStr, undefined, true);

  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.changeCustomFieldsV2;
}

export async function suspendLines(filters, lines, params) {
  return suspendReactivateLines(filters, lines, params, true);
}

export async function reactivateLines(filters, lines, params) {
  return suspendReactivateLines(filters, lines, params, false);
}

async function suspendReactivateLines(filters, lines, params, suspension) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
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
          dueDate: "${dueDate}",
          ${gqlTempDataUuid}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.suspendReactivateLinesV2;
  });
}

export async function changeCustomerAccount(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
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
          dueDate: "${dueDate}",
          targetCustomerAccountId: ${targetCustomerAccount},
          ${gqlTempDataUuid}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;
    const response = await query(queryStr, undefined, true);

    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.changeCustomerAccountV2;
  });
}

export async function transferSIMCards(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      partyId,
      dueDate,
      toPartyId,
      toCustomerAccountId,
      fromCustomerAccountId,
      toWorkflowId,
      tempDataUuid,
      servicesChoice,
    } = params;
    let gqlWorkflowId = '';
    if (toWorkflowId) {
      gqlWorkflowId = `toWorkflowId: "${toWorkflowId}",`;
    }
    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}",`;
    }

    let gqlFromCustomerAccountId = '';
    if (fromCustomerAccountId) {
      gqlFromCustomerAccountId = `fromCustomerAccountId: ${fromCustomerAccountId},`;
    }

    let changeServicesParamsGql = '';

    if (servicesChoice) {
      changeServicesParamsGql = formatServicesForGQL({
        data: servicesChoice.dataService,
        services: servicesChoice.services,
      });
    }

    const queryStr = `
      mutation {
        transferSIMCardsV2(
          input: {
            filter: {${gqlFilter}},
            partyId: ${partyId},
            simCardInstanceIds: [${gqlLines}],
            notification: false,
            dueDate: "${dueDate}",
            toPartyId: ${toPartyId},
            toCustomerAccountId: ${toCustomerAccountId},
            ${gqlFromCustomerAccountId}
            ${gqlWorkflowId}
            ${gqlTempDataUuid}
            ${changeServicesParamsGql}
          })
          {
            tempDataUuid
            validated
            errors{
              key
              number
              message
            }
          }
      }
      `;

    const response = await query(queryStr, undefined, true);

    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.transferSIMCardsV2;
  });
}

export async function manageCancellation(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { dueDate, partyId, validate, tempDataUuid } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    let gqlDueDate = '';
    if (dueDate) {
      gqlDueDate = moment(dueDate, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss Z');
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
            dueDate: "${gqlDueDate}",
            ${gqlTempDataUuid}
          }
      )
      {
        tempDataUuid
        validated
        errors{
          key
          number
          message
        }
      }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.validateRefuseLinesV2;
  });
}

export async function endPhaseTest(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
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
        dueDate: "${dueDate}",
        ${gqlTempDataUuid}
      })
       {
        tempDataUuid
        validated
        errors{
          key
          number
          message
        }
       }
      }

      `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.terminatePhaseTest;
  });
}

export async function sendSMS(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
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
          dueDate: "${dueDate}"
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
            message
          }
         }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.sendSMSV2;
  });
}

export async function terminateLines(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { notifEmail, dueDate, partyId, tempDataUuid } = params;

    let gqlDueDate = '';
    if (dueDate) {
      gqlDueDate = moment(dueDate, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss Z');
    }

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
          dueDate: "${gqlDueDate}"
          ${gqlTempDataUuid}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
         }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.terminateLinesV2;
  });
}

export async function fetchShortCodes(partnerId) {
  const queryStr = `
  query{
    party(id: ${partnerId}) {
      shortCodes
    }
  }
  `;
  const response = await query(queryStr, undefined, true);
  return response.data.party.shortCodes;
}

function getDataParams(parameters) {
  let paramsAdd;
  let paramsRemove;

  const params = parameters.reduce(
    (all, item) => {
      if (item.selected === true) {
        all.paramsToAdd.push(item.code);
      }
      if (item.selected === false) {
        all.paramsToDelete.push(item.code);
      }
      return all;
    },
    {
      paramsToAdd: [],
      paramsToDelete: [],
    }
  );

  paramsAdd = params.paramsToAdd.map((p) => `{parameterCode: "${p}", action: ADD}`);
  paramsRemove = params.paramsToDelete.map((p) => `{parameterCode: "${p}", action: DELETE}`);

  const ret = [];

  if (paramsAdd && paramsAdd.length) {
    ret.push(paramsAdd.join(','));
  }
  if (paramsRemove && paramsRemove.length) {
    ret.push(paramsRemove.join(','));
  }
  if (ret.length === 2) return ret.join(',');
  if (ret.length === 1) return ret[0];

  return '';
}

export async function changeService(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      notifEmail,
      dueDate,
      partyId,
      tempDataUuid,
      servicesToEnable,
      servicesToDisable,
      dataService,
      offerCode,
      newCommunityChange,
    } = params;
    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    let codesToEnable = [];
    let codesToDisable = [];
    let dataCodeParams = '';
    let roamingCodeParams = '';

    if (servicesToEnable && servicesToEnable.length) {
      codesToEnable = servicesToEnable.map((s) => {
        return `{serviceCode: "${s.code}", action: ADD}`;
      });
    }

    if (servicesToDisable && servicesToDisable.length) {
      codesToDisable = servicesToDisable.map((s) => `{serviceCode: "${s.code}", action: DELETE}`);
    }

    let codesToaddToGqlQuery = [...codesToEnable, ...codesToDisable];
    // console.log('🚀 > servicesToEnable ', servicesToEnable);

    if (dataService) {
      if (dataService.checked) {
        const dataParams = getDataParams(dataService.parameters);

        dataCodeParams = `{serviceCode: "${dataService.code}", action: ADD, catalogServiceParameters: [${dataParams}]}`;
      } else {
        dataCodeParams = `{serviceCode: "${dataService.code}", action: DELETE}`;
      }

      codesToaddToGqlQuery.push(dataCodeParams);
    }

    if (newCommunityChange) {
      let roamingParam = '';
      if (newCommunityChange.id === 'europe') {
        roamingParam = `, roamingValue: true`;
      } else if (newCommunityChange.id === 'world') {
        roamingParam = `, roamingValue: false`;
      } else {
        roamingParam = '';
      }
      roamingCodeParams =
        roamingParam === ''
          ? `{serviceCode: "ROAMING", action: DELETE}`
          : `{serviceCode: "ROAMING", action: ADD${roamingParam}}`;
      codesToaddToGqlQuery.push(roamingCodeParams);
    }

    let changeServicesParamsGql = '';

    if (codesToaddToGqlQuery && codesToaddToGqlQuery.length) {
      changeServicesParamsGql = `changeServices: [${codesToaddToGqlQuery.join(',')}]`;
    }

    const queryStr = `
    mutation {
      changeServices(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${dueDate}",
          offerCode: "${offerCode}"
          ${gqlTempDataUuid}${changeServicesParamsGql}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.changeServices;
  });
}

export async function createRechargeLVOffer(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { dueDate, partyId, workflowId, packageLabel, tempDataUuid } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
    mutation {
      topUpOffer(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          dueDate: "${dueDate}",
          workflowId: ${workflowId},
          packageLabel: "${packageLabel}",
          ${gqlTempDataUuid},
          type:LONG_LIFE
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;

    try {
      const response = await query(queryStr, undefined, true);

      if (!response || response.errors) {
        return {
          errors: response.errors,
        };
      }
      return response.data.topUpOffer;
    } catch (e) {
      return {
        errors: [
          {
            message: 'Erreur technique',
          },
        ],
      };
    }
  });
}

export async function preactivateAndActivateSImcardInstance(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      notifEmail,
      dueDate,
      partyId,
      tempDataUuid,
      servicesChoice,
      customerAccountID,
      workflowCode,
      allCustomFields,
      userRef,
    } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    let changeServicesParamsGql = '';

    if (servicesChoice) {
      changeServicesParamsGql = formatServicesForGQL({
        data: servicesChoice.dataService,
        services: servicesChoice.services,
      });
    }

    let customfields = '';
    allCustomFields.forEach((e) => {
      customfields = `${customfields}, ${e.code}: "${e.enteredValue}"`;
    });

    const queryStr = `
    mutation {
      preactivateAndActivateSImcardInstanceV2(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${dueDate}",
          customerAccountID: ${customerAccountID},
          workflowCode: "${workflowCode}",
          ${gqlTempDataUuid}
          ${changeServicesParamsGql}
          ${customfields},
          userRef: "${userRef}"
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.preactivateAndActivateSImcardInstanceV2;
  });
}

export async function preactivateSimCardInstance(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { notifEmail, dueDate, partyId, tempDataUuid, customerAccountID, userRef } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
    mutation {
      preactivateSimCardInstanceV2(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${dueDate}",
          customerAccountId: ${customerAccountID},
          userRef: "${userRef}",
          ${gqlTempDataUuid}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
         }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.preactivateSimCardInstanceV2;
  });
}

export async function changeOffer(filters, lines, params, keepServices) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      notifEmail,
      dueDate,
      partyId,
      tempDataUuid,
      servicesChoice,
      customerAccountID,
      sourceWorkflowID,
      targetWorkflowID,
    } = params;

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `,tempDataUuid: "${tempDataUuid}"`;
    }

    let changeServicesParamsGql = '';

    if (servicesChoice) {
      changeServicesParamsGql = formatServicesForGQL({
        data: servicesChoice.dataService,
        services: servicesChoice.services,
      });
    }

    const queryStr = `
    mutation {
      changeOfferV2(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          keepServices: ${keepServices},
          dueDate: "${dueDate}",
          customerAccountID: ${customerAccountID},
          sourceWorkflowID: ${sourceWorkflowID},
          targetWorkflowID: ${targetWorkflowID}
          ${gqlTempDataUuid}
          ${changeServicesParamsGql}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;

    const response = await query(queryStr, undefined, true);
    if (!response || !response.data) {
      return {
        // errors: ['unknown'],
        errors: [
          {
            message: 'Request failed with status code unknown',
            extensions: {
              BAD_REQUEST: 'unknown',
              classification: 'ExecutionAborted',
            },
          },
        ],
      };
    }
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.changeOfferV2;
  });
}

export async function changeMSISDN(params) {
  const { tempDataUuid, notifEmail, dueDate, partyId } = params;

  const queryStr = `
  mutation{
    changeMSISDN(input:{
      partyId:${partyId}
      dueDate: "${dueDate}"
      notification:${boolStr(notifEmail)}
      adminSkipGDM:false
      tempDataUuid: "${tempDataUuid}"
    })
    {
      tempDataUuid
      validated
      errors{
        key
        number
        message
      }
    }
   }
  `;

  return query(queryStr);
}

export async function changeSingleMSISDN(params) {
  const { notifEmail, dueDate, partyId, msisdn, newMsisdn } = params;
  const queryStr = `
  mutation{
    changeMSISDN(input:{
      partyId:${partyId}
      dueDate: "${dueDate}"
      notification:${boolStr(notifEmail)}
      adminSkipGDM:false
      msisdnInput: {msisdn: "${msisdn}", newMsisdn: "${newMsisdn}"}
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

  return query(queryStr);
}

export async function changeICCID(params) {
  const { tempDataUuid, notifEmail, dueDate, partyId } = params;

  const queryStr = `
  mutation{
    changeICCID(input:{
      partyId:${partyId}
      dueDate: "${dueDate}"
      notification:${boolStr(notifEmail)}
      adminSkipGDM:false
      tempDataUuid: "${tempDataUuid}"
    })
    {
      tempDataUuid
      errors {
        key
        number
      }
    }
   }
  `;

  return query(queryStr);
}

export async function changeSingleICCID(params) {
  const { notifEmail, dueDate, partyId, iccid, newIccid } = params;

  const queryStr = `
  mutation{
    changeICCID(input:{
      partyId:${partyId}
      dueDate: "${dueDate}"
      notification:${boolStr(notifEmail)}
      adminSkipGDM:false
      iccidInput: {iccid: "${iccid}", newIccid: "${newIccid}"}
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

  return query(queryStr);
}

export async function changeSingleCustomerAccount(params) {
  const { partyId, dueDate, notifEmail, simCardInstanceId, targetCustomerAccount } = params;

  const queryStr = `
  mutation {
    changeCustomerAccountV2(
      input: {
        partyId: ${partyId},
        simCardInstanceIds: [${simCardInstanceId}],
        notification: ${boolStr(notifEmail)},
        dueDate: "${dueDate}",
        targetCustomerAccountId: ${targetCustomerAccount}
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

  return query(queryStr);
}

export async function changeSingleOffer(params) {
  const {
    notifEmail,
    dueDate,
    partyId,
    simCardInstanceId,
    customerAccountID,
    sourceWorkflowID,
    targetWorkflowID,
  } = params;

  const queryStr = `
    mutation {
      changeOfferV2(
        input: {
          partyId: ${partyId},
          simCardInstanceIds: [${simCardInstanceId}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${dueDate}",
          customerAccountID: ${customerAccountID},
          sourceWorkflowID: ${sourceWorkflowID},
          targetWorkflowID: ${targetWorkflowID}
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
  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.changeOfferV2;
}

export async function createGeoLocationMassAction(simCardId) {
  return query(`
  mutation {
    createGeoLocationMassAction(simCardInstanceId: ${simCardId})
  }
  `);
}

export async function createRadiusAdmin(params, action, resetEmptyField) {
  const { tempDataUuid, partyId, customerAccountId, workflowId, apnCode } = params;

  const queryStr = `
  mutation{
    radiusAdministration(
      input: {
        tempDataUuid: "${tempDataUuid}",
        partyId: ${partyId},
        customerAccountId: ${customerAccountId},
        workflowId: ${workflowId},
        apnCode: "${apnCode}",
        resetEmptyField: ${resetEmptyField},
        action: ${action}
      }
    )
    {
      tempDataUuid
      validated
      errors {
        key
        number
        message
      }
    }
  }
`;

  const response = await query(queryStr);
  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.radiusAdministration;
}

export async function fetchApn(partyId, workflowId) {
  const queryStr = `
  query {
    radiusConfigurations(
      input: {
        partyId: ${partyId},
        workflowId: ${workflowId}
        }
      )
      {
      apnCode
      partyId
      apnType
    }
  }`;

  const response = await query(queryStr);

  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.radiusConfigurations;
}

export async function resetNetwork(filters, lines, params) {
  return actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { partyId, dueDate, notifEmail, customerAccountId, tempDataUuid } = params;
    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }
    const queryStr = `
    mutation {
      networkReset(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${dueDate}",
          customerAccountID: ${customerAccountId},
          ${gqlTempDataUuid}
        })
        {
          tempDataUuid
          validated
          errors{
            key
            number
            message
          }
        }
    }
    `;
    const response = await query(queryStr, undefined, true);

    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.networkReset;
  });
}
