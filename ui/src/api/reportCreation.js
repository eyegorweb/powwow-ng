import { query, boolStr } from './utils';

export async function reportModels(partnerId) {
  const queryStr = `
  query {
    reportModels( partyId: ${partnerId}) {
      modelType
      fields
      }
    }
  `;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.reportModels;
}

export async function updateReport(params) {
  const columns = formatColumns(params.columns);
  const optionalParams = [];

  if (params.notification) {
    optionalParams.push(`notification: ${boolStr(params.notification)}`);
  }

  if (params.mailingListId) {
    // optionalParams.push(`mailingListId: ${params.mailingListId}`);
  }

  const queryStr = `mutation {
    updateReportDefinition( reportDefinition: {
      id: ${params.id}
      frequency: ${params.frequency}
      reportExportColumns: [${columns.join(',')}]
      exportFormat: ${params.exportFormat}
      generationDate: "${params.generationDate}"
      disabled: ${params.isDisabled}
      ${optionalParams.join(',')}
    }) { id }
  }`;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.updateReportDefinition;
}

export async function createReport(params) {
  const columns = formatColumns(params.columns);
  const optionalParams = [];

  if (params.notification) {
    optionalParams.push(`notification: ${boolStr(params.notification)}`);
  }

  if (params.mailingListId) {
    optionalParams.push(`mailingListId: ${params.mailingListId}`);
  }

  const queryStr = `mutation {
    createReport( createReportDefinitionInput: {
      frequency: ${params.frequency}
      reportExportColumns: [${columns.join(',')}]
      exportFormat: ${params.exportFormat}
      generationDate: "${params.generationDate}"
      disabled: ${params.isDisabled}
      partyId: ${params.partyId}
      name: "${params.name}",
      ${optionalParams.join(',')}
    }) { id }
  }`;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.createReport;
}

function formatColumns(inputColumns) {
  return inputColumns.reduce((all, item) => {
    if (item.code.includes('GRP_')) {
      if (item.code === 'GRP_DEVICE_INFO') {
        all.push('DEVICE_REFERENCE', 'MANUFACTURER');
      }
      if (item.code === 'GRP_CUSTOM_FIELDS') {
        all.push('CUSTOM1', 'CUSTOM2', 'CUSTOM3', 'CUSTOM4', 'CUSTOM5', 'CUSTOM6');
      }

      if (item.code === 'GRP_SPECIFIC_FIELDS') {
        all.push('SPECIFIC_FIELD1', 'SPECIFIC_FIELD2');
      }

      if (item.code === 'GRP_SERVICES_APN') {
        all.push(
          'OFFER_ROAMING',
          'OFFER_SMS_IN',
          'OFFER_SMS_OUT',
          'OFFER_VOICE_IN',
          'OFFER_VOICE_OUT',
          'OFFER_CSD_DATA_IN',
          'OFFER_CSD_DATA_OUT',
          'OFFER_DATA_4G',
          'OFFER_DATA_2G_3G',
          'OFFER_APN'
        );
      }

      if (item.code === 'GRP_PREACTIVATE_ACTIVATE') {
        all.push('PREACTIVATION', 'ACTIVATION');
      }

      if (item.code === 'GRP_DELIVERY_CONTACT') {
        all.push(
          'FIRSTNAME_DELIVERY',
          'LASTNAME_DELIVERY',
          'EMAIL_DELIVERY',
          'PHONE_DELIVERY',
          'MOBILE_DELIVERY',
          'FAX_DELIVERY'
        );
      }

      if (item.code === 'GRP_DELIVERY_ADRESS') {
        all.push(
          'ADDRESS1_DELIVERY',
          'ADDRESS2_DELIVERY',
          'ADDRESS3_DELIVERY',
          'ZIPCODE_DELIVERY',
          'CITY_DELIVERY',
          'COUNTRY_DELIVERY',
          'STATE_DELIVERY'
        );
      }

      if (item.code === 'GRP_BILLING_ADRESS') {
        all.push(
          'ADDRESS1_BILL',
          'ADDRESS2_BILL',
          'ADDRESS3_BILL',
          'ZIP_CODE_BILL',
          'CITY_BILL',
          'COUNTRY_BILL',
          'STATE_BILL'
        );
      }
    } else {
      all.push(item.code);
    }

    return all;
  }, []);
}
