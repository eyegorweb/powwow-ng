import { query, formatDateForGql } from './utils';
import { formatFilters } from './linesActions';

async function suspendReactivateLines(filters, lines, params, suspension) {
  const { suspendreFacturation, notifEmail, dueDate, nonModifiableParClient, partyId } = params;
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const queryStr = `
  mutation {
    suspendReactivateLines(
      input: {
        filter: {${gqlFilter}},
        partyId: ${partyId},
        simCardInstanceIds: [${lineIds}],
        suspendBilling: ${boolStr(suspendreFacturation)},
        notification: ${boolStr(notifEmail)},
        suspend: ${suspension},
        nonModifiableByCustomer: ${boolStr(nonModifiableParClient)},
        dueDate: "${formatDateForGql(dueDate)}"
      })
  }
  `;

  return await query(queryStr);
}

function boolStr(value) {
  return value ? 'true' : 'false';
}

export async function suspendLines(filters, lines, params) {
  return await suspendReactivateLines(filters, lines, params, true);
}

export async function reactivateLines(filters, lines, params) {
  return await suspendReactivateLines(filters, lines, params, false);
}

export async function sendSMS(filters, lines, params) {
  const { partyId, notifEmail, dueDate, texMessage, numberOfSMS, shortCode } = params;
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const queryStr = `
  mutation {
    sendSMS(
      input: {
        filter: {${gqlFilter}},
        partyId: ${partyId},
        simCardInstanceIds: [${lineIds}],
        notification: ${boolStr(notifEmail)},
        dueDate: "${formatDateForGql(dueDate)}"
        textMessage: "${texMessage}",
        numberOfSMS: ${numberOfSMS},
        shortCode: "${shortCode}"
        }
      )
  }
  `;

  return await query(queryStr);
}

export async function endPhaseTest(filters, lines, params) {
  const { notifEmail, dueDate, partyId } = params;
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const queryStr = `
    mutation {
        terminateLines(input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${lineIds}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}"
        })
    }
    `;

  return await query(queryStr);
}

export async function updateCustomFields(filters, lines, params) {
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

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
  } = params;

  const queryStr = `
    mutation {
      changeCustomFields(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${lineIds}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}",
          custom1: "${custom1}",
          custom2: "${custom2}",
          custom3: "${custom3}",
          custom4: "${custom4}",
          custom5: "${custom5}",
          custom6: "${custom6}"
        }
        )
    }
    `;

  return await query(queryStr);
}

export async function transferSIMCards(filters, lines, params) {
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const { partyId, dueDate, toPartyId, toCustomerAccountId, toWorkflowId } = params;

  const queryStr = `
    mutation {
      transferSIMCards(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${lineIds}],
          notification: false,
          dueDate: "${formatDateForGql(dueDate)}",
          toPartyId: ${toPartyId},
          toCustomerAccountId: ${toCustomerAccountId},
          toWorkflowId: "${toWorkflowId}",
        })
    }
    `;

  return await query(queryStr);
}

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

export async function changeCustomerAccount(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const { partyId, dueDate, notifEmail, targetCustomerAccount } = params;

    const queryStr = `
    mutation {
      changeCustomerAccount(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${gqlLines}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}",
          targetCustomerAccountId: ${targetCustomerAccount}
        })
    }
    `;

    return await query(queryStr);
  });
}

export async function addServices(filters, lines, params) {
  return await actCreationMutation(filters, lines, async (gqlFilter, gqlLines) => {
    const {
      partyId,
      dueDate,
      notifEmail,
      offer,
      servicesToActivate,
      servicesToDesactivate,
      tempDataUuid,
    } = params;
    const gqlServicesAddParam = servicesToActivate.map(
      id => `{
      serviceCode:"${id}",
      action: ADD
    }`
    );

    const gqlServicesDeleteParam = servicesToDesactivate.map(
      id => `{
      serviceCode:"${id}",
      action: DELETE
    }`
    );

    const gqlChangeServicesParam = [...gqlServicesAddParam, ...gqlServicesDeleteParam].join(',');

    let gqlTempDataUuid = '';
    if (tempDataUuid) {
      gqlTempDataUuid = `tempDataUuid: "${tempDataUuid}"`;
    }

    const queryStr = `
    mutation {
      changeServices (
      input: {
        filter: {${gqlFilter}},
        partyId: ${partyId},
        simCardInstanceIds: [${gqlLines}],
        notification: ${boolStr(notifEmail)},
        dueDate: "${formatDateForGql(dueDate)}",
        marketingOfferCode: "${offer}",
        adminSkipGDM: false,
        changeServices: [${gqlChangeServicesParam}],
        ${gqlTempDataUuid}
      }
      ) {
          tempDataUuid
          successful
          containsErrors
          invalidFormat
          alreadyExists
          notFound
        }
      }
    `;

    return await query(queryStr);
  });
}

export async function terminateLines(filters, lines, params) {
  const { notifEmail, dueDate, partyId } = params;
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const queryStr = `
  mutation {
    terminateLines(
      input: {
        filter: {${gqlFilter}},
        partyId: ${partyId},
        simCardInstanceIds: [${lineIds}],
        notification: ${boolStr(notifEmail)},
        dueDate: "${formatDateForGql(dueDate)}"
      })
  }
  `;

  return await query(queryStr);
}
