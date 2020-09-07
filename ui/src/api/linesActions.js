import { query, addDateFilter, postFile, getFilterValue, getFilterValues } from './utils';

export async function fetchTransferSim() {
  const queryStr = `
  query {
    transferSimRequests(pagination: {limit: 999, page: 0}, sorting: { created: DESC})
    {
      transferId
      iccid
      fromPartner
      toPartner
      fromCustAccount
      toCustAccount
      created
      status
    }
  }
  `;

  const response = await query(queryStr);
  return response.data;
}

export async function updateTransferSim(ids, status) {
  const queryStr = `
    mutation {
      updateTransferSimRequests(input: {requestIds: [${ids}], status: ${status}})
    }
  `;

  const response = await query(queryStr);
  return response.data;
}

export async function fetchCardTypes(q, partners, { page, limit = 999, partnerType }) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners.map(i => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  let partnerTypeGqlFilter = '';
  if (partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  }
  const queryStr = `
    query {
      simcards(filter: { ${partnerGqlParam}${partnerTypeGqlFilter}} , sorting: { description: DESC }, pagination: {limit: ${limit}, page: ${page}} ) {
        total
        items {
          simCard {
            label
            id
            name
            code
            type
            number
            description
          }
        }
      }
    }
  `;
  const response = await query(queryStr);
  return response.data.simcards.items;
}

export async function fetchCommercialStatuses() {
  const queryStr = `
  query {
    commercialStatus
  }
  `;
  const response = await query(queryStr);
  return response.data.commercialStatus;
}

export async function fetchSingleIndicator(filters, contextFilters = []) {
  const filtersToUse = [...filters, ...contextFilters];
  const queryStr = `
  query {
    simCardInstances(filter: { ${formatFilters(filtersToUse)} }) { total }
  }
  `;
  const response = await query(queryStr);
  return response.data.simCardInstances;
}

export async function countLines(filters) {
  const queryStr = `
  query {
    simCardInstances(filter: {
      ${formatFilters(filters)}
    }){total}
  }`;

  const response = await query(queryStr);
  if (response && response.data.simCardInstances) return response.data.simCardInstances.total;
  return undefined;
}

export async function searchLineById(id) {
  const response = await searchLines({ key: 'id', direction: 'DESC' }, { page: 0, limit: 1 }, [
    {
      id: 'filters.id',
      value: '' + id,
    },
  ]);
  if (!response || !response.items || !response.items.length) return;
  return response.items[0];
}

export async function searchLines(orderBy, pagination, filters = []) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    simCardInstances(
      filter: {
        ${formatFilters(filters)}
      }
      ${paginationInfo}
      ${orderingInfo}
    ) {
      total
      items {
        party{
          id
          name
          partyType
          custom1FieldLabel
          custom2FieldLabel
          custom3FieldLabel
          custom4FieldLabel
          custom5FieldLabel
          custom6FieldLabel
          partyType
          spec1_label
          spec2_label
         }
        id
        iccid
        statusTranslated
        type
        statuts
        auditable {created}
        PIN1
        PIN2
        PUK1
        PUK2
        licence
        format
        dualSIMCardInstance {
          iccid
          msisdn
          imsi
        }
        order {
          id
        }
        deviceInstance {
          manufacturer
          manufacturerPrevious
          deviceReference
          deviceReferencePrevious
          imei
          imeiPrevious
          mac
          macPrevious
          imeiChangeDate
          auditable {
            created
            updated
          }
        }
        accessPoint {
          alarmInstance {
            id
            alarm {
              id
            }
            type
          }
          id
          commercialStatus
          lastPLMN
          preactivationDate
          activationDate
          commercialStatusDate
          networkStatus
          lines {
            msisdn
            imsi
            status
            statusTranslated
            auditable {
              created
              updated
            }
          }
          customFields {
            custom1
            custom2
            custom3
            custom4
            custom5
            custom6
          }
          offerGroup {
            customerAccount {
              id
              name
              code
            }
          }
          workflowCode
          commitmentEnd
          billingStatus
          billingStatusChangeDate
          offer {
            marketingOffer {
              code
              description
            }
          }
          usageCounter {
            counter1DownRounded
            counter1DownRoamingRounded
            counter1UpRounded
            counter1UpRoamingRounded
            counter1DownRoamingRounded
            counter1UpRoamingRounded
            counter2DownRounded
            counter2DownRoamingRounded
            counter2UpRounded
            counter2UpRoamingRounded
            counter2DownRoamingRounded
            counter2UpRoamingRounded
            counter3DownRounded
            counter3DownRoamingRounded
            counter3UpRounded
            counter3UpRoamingRounded
            counter3DownRoamingRounded
            counter3UpRoamingRounded
          }
          workflowCode
          remainingSuspension
          spec1
          spec2
        }
      }
    }
  }`;

  const response = await query(queryStr);
  return response.data.simCardInstances;
}

export function formatFilters(filters) {
  const allFilters = [];
  const partyIds = getValuesIdsWithoutQuotes(filters, 'filters.partners');
  if (partyIds) {
    allFilters.push(`idParty: {in: [${partyIds}]}`);
  }

  const partyTypeParam = getFilterValue(filters, 'filters.partnerType');
  if (partyTypeParam) {
    allFilters.push(`partyType: {in:[${partyTypeParam}]}`);
  }

  const customFields = getFilterValues(filters, 'filters.customFields');
  if (customFields && customFields.length > 0) {
    const customFeldsGQLparams = customFields
      .map(c => `${c.id}: {startsWith: "${c.value}"}`)
      .join(',');

    allFilters.push(customFeldsGQLparams);
  }

  const customerAccountIds = getValuesIdsWithoutQuotes(filters, 'filters.billingAccounts');
  if (customerAccountIds) {
    allFilters.push(`idCF: {in:[${customerAccountIds}]}`);
  }

  // addQuantityFilter(allFilters, filters);
  addActionTypeFilter(allFilters, filters);
  addOfferFilterFilter(allFilters, filters);
  addOrderId(allFilters, filters);
  addOrderRef(allFilters, filters);
  valuesFromMutiselectFilter(allFilters, filters, 'simStatus', 'filters.lines.SIMCardStatus');
  valuesFromMutiselectFilter(allFilters, filters, 'billingStatus', 'filters.lines.billingStatus');
  valuesFromMutiselectFilter(allFilters, filters, 'networkStatus', 'filters.lines.networkStatus');
  valuesFromMutiselectFilter(allFilters, filters, 'simCardName', 'filters.lines.typeSIMCard', true);
  valuesFromMutiselectFilter(
    allFilters,
    filters,
    'commercialStatus',
    'filters.lines.commercialStatus',
    true
  );
  addDateFilter(allFilters, filters, 'orderDate', 'filters.orderDate');
  addDateFilter(allFilters, filters, 'simCardCreatedDate', 'filters.lines.importDate');
  addDateFilter(allFilters, filters, 'commitmentEnd', 'filters.lines.endCommitmentDate');
  addDateFilter(allFilters, filters, 'activationDate', 'filters.lines.activationDate');
  addDateFilter(allFilters, filters, 'preactivationDate', 'filters.lines.preActivationDate');
  // addDateFilter(allFilters, filters, 'todo', 'filters.lines.statusDate');
  addTrafficFilter(allFilters, filters);
  addDateFilter(allFilters, filters, 'commercialStatusDate', 'filters.lines.statusDate');
  addCountries(allFilters, filters);
  addZipCodeFilter(allFilters, filters);
  addFileImportId(allFilters, filters);
  addEUICCProfileFilter(allFilters, filters);
  addSirenFilter(allFilters, filters);
  addRangeFilter(allFilters, filters, 'iccid', 'filters.lines.rangeICCID');
  addRangeFilter(allFilters, filters, 'imsi', 'filters.lines.rangeIMSI');
  addRangeFilter(allFilters, filters, 'msisdn', 'filters.lines.rangeMSISDN');
  addRangeFilter(allFilters, filters, 'imei', 'filters.lines.rangeIMEI');
  addTerminationValidated(allFilters, filters);
  addIdsFilter(allFilters, filters);

  return allFilters.join(',');
}

function addIdsFilter(gqlFilters, selectedFilters) {
  const _id = selectedFilters.find(f => f.id === 'filters.id');
  const accessPointId = selectedFilters.find(f => f.id === 'filters.accessPointId');
  const iccid = selectedFilters.find(f => f.id === 'filters.iccid');
  const imsi = selectedFilters.find(f => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find(f => f.id === 'filters.msisdn');
  const imei = selectedFilters.find(f => f.id === 'filters.imei');
  const msisdnA = selectedFilters.find(f => f.id === 'filters.msisdnA');

  if (_id && _id.value) {
    gqlFilters.push(`id: {eq: "${_id.value.trim()}"}`);
  }
  if (iccid && iccid.value) {
    gqlFilters.push(`iccid: {eq: "${iccid.value.trim()}"}`);
  }
  if (imsi && imsi.value) {
    gqlFilters.push(`imsi: {eq: "${imsi.value.trim()}"}`);
  }
  if (msisdn && msisdn.value) {
    gqlFilters.push(`msisdn: {eq: "${msisdn.value.trim()}"}`);
  }
  if (imei && imei.value) {
    gqlFilters.push(`imei: {eq: "${imei.value.trim()}"}`);
  }
  if (msisdnA && msisdnA.value) {
    gqlFilters.push(`msisdnA: {eq: "${msisdnA.value.trim()}"}`);
  }
  if (accessPointId && accessPointId.value) {
    gqlFilters.push(`accessPointId: {eq: "${accessPointId.value.trim()}"}`);
  }
}

function addTerminationValidated(gqlFilters, selectedFilters) {
  const terminationFilter = selectedFilters.find(
    f => f.id === 'filters.lines.terminationValidated'
  );
  if (terminationFilter && terminationFilter.value) {
    gqlFilters.push(`terminationValidated: true`);
  }
}

function addRangeFilter(gqlFilters, selectedFilters, gqlParamName, keyInCurrentFilter) {
  const filterValue = selectedFilters.find(f => f.id === keyInCurrentFilter);
  if (filterValue && filterValue.from && filterValue.to) {
    gqlFilters.push(
      `${gqlParamName}: {startsWith: "${filterValue.from}", endsWith: "${filterValue.to}"}`
    );
  } else if (filterValue && filterValue.from) {
    const containsSearch = filterValue.from.includes('*');
    if (containsSearch) {
      gqlFilters.push(`${gqlParamName}: {contains: "${filterValue.from.replace('*', '')}" }`);
    } else {
      gqlFilters.push(`${gqlParamName}: {startsWith: "${filterValue.from}" }`);
    }
  } else {
    return;
  }
}

function addZipCodeFilter(gqlFilters, selectedFilters) {
  const zipCode = selectedFilters.find(f => f.id === 'filters.postalCode');
  zipCode && gqlFilters.push(`zipCode: {startsWith: "${zipCode.value.toString()}"}`);
}

function addFileImportId(gqlFilters, selectedFilters) {
  const filter = selectedFilters.find(f => f.id === 'filters.lines.fromFile.title');
  if (filter && filter.values && filter.values.length) {
    gqlFilters.push(`tempDataUuid: "${filter.values[0].tempDataUuid}"`);
  }
}

function addCountries(gqlFilters, selectedFilters) {
  const countries = getValuesAttr(selectedFilters, 'filters.countries', 'codeIso3');

  if (countries) {
    gqlFilters.push(`countryCodeIso3: {in: [${countries}]}`);
  }
}

function valuesFromMutiselectFilter(
  gqlFilters,
  selectedFilters,
  gqlParamName,
  keyInCurrentFilter,
  valuesWithQuotes = false
) {
  const values = valuesWithQuotes
    ? getValuesIds(selectedFilters, keyInCurrentFilter)
    : getValuesIdsWithoutQuotes(selectedFilters, keyInCurrentFilter);
  if (values) {
    gqlFilters.push(`${gqlParamName}: {in:[${values}]}`);
  }
}

function addOrderId(gqlFilters, selectedFilters) {
  const orderId = getFilterValue(selectedFilters, 'filters.lines.orderID');
  if (orderId) {
    gqlFilters.push(`idOrder: {eq: "${orderId}"}`);
  }
}

function addOrderRef(gqlFilters, selectedFilters) {
  const orderRef = getFilterValue(selectedFilters, 'filters.orderReference');
  if (orderRef) {
    gqlFilters.push(`orderReference: {eq: "${orderRef}"}`);
  }
}

function addOfferFilterFilter(gqlFilters, selectedFilters) {
  const offerFilter = selectedFilters.find(o => o.id === 'filters.lines.associatedOffer');
  if (!offerFilter) return;

  const offers = offerFilter.values.map(o => `"${o.productCode}"`).join(',');
  if (offers) {
    gqlFilters.push(`productCode: {in: [${offers}]}`);
  }
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

function getValuesAttr(filters, filterId, attr) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `"${i[attr]}"`).join(',');
  }
}

function getValuesIdsWithoutQuotes(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `${i.id}`).join(',');
  }
}

function addTrafficFilter(gqlFilters, selectedFilters) {
  const isTraffic = selectedFilters.find(f => f.id === 'filters.lines.traffic');
  if (isTraffic) {
    gqlFilters.push(`isLignesTrafiquantes: true`);
  }
}

function addEUICCProfileFilter(gqlFilters, selectedFilters) {
  const currentStates = selectedFilters.find(f => f.id === 'filters.lines.states');
  if (currentStates) {
    const currentStatesValues = currentStates.values.map(i => i.id);
    gqlFilters.push(`profileEUICC: {in: [${currentStatesValues}]}`);
  }
}

function addSirenFilter(gqlFilters, selectedFilters) {
  const siren = selectedFilters.find(f => f.id === 'filters.lines.siren');
  if (siren) {
    gqlFilters.push(`siren: {eq: "${siren.value}"}`);
  }
}

export async function uploadSearchFile(file, idType) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('idType', idType);
  return await postFile(`/api/file/upload`, formData);
}

export async function uploadFileSimCards(file, orderId) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('orderId', orderId);
  formData.append('idType', 'CREATE_ICCID');
  return await postFile(`/api/file/uploadIccids`, formData);
}

export async function uploadFileSimCardsFromLines(file) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('idType', 'CREATE_ICCID');
  return await postFile(`/api/file/upload`, formData);
}

export async function importIccidsFromLines(partnerId, customerAccountId, simCardId, tempDataUuid) {
  const response = await query(
    `
    mutation {
      importSimcards(
        input: {
          uuid: "${tempDataUuid}"
          partnerId: "${partnerId}"
          customerAccountId: "${customerAccountId}"
          simCardId: "${simCardId}"
        }
      ) {
        tempDataUuid
        validated
        errors {
          key
          number
        }
      }
    }
    `
  );
  return response.data.importSimcards;
}

export async function exportLinesFromFileFilter(columns, orderBy, exportFormat, uploadId) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const uploadIdInfo = uploadId ? `uploadId: {eq: "${uploadId}"}` : '';
  const response = await query(
    `
    query {
      exportErrors(filter: {${uploadIdInfo}}, columns: [${columnsParam}]${orderingInfo} exportFormat: ${exportFormat} ) {
        downloadUri
        asyncRequired
        total
      }
    }
    `
  );
  if (!response) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.exportErrors;
}

export async function exportSimCardInstances(
  columns,
  orderBy,
  exportFormat,
  filters = [],
  asyncExportRequest = false,
  exportAll = false
) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';

  let asyncExportRequestParam = '';

  if (asyncExportRequest) {
    asyncExportRequestParam = `, asyncExportRequest: ${asyncExportRequest}`;
  }
  const response = await query(
    `
    query {
      exportSimCardInstances(filter: {${formatFilters(
        filters
      )}}, columns: [${columnsParam}]${orderingInfo}, exportFormat: ${exportFormat}${asyncExportRequestParam}, full: ${exportAll}) {
        downloadUri
        asyncRequired
      }
    }
    `
  );
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }

  return response.data.exportSimCardInstances;
}

export async function fetchCurrentConsumption(filters) {
  const filtersGQL = [];

  for (const [key, value] of Object.entries(filters)) {
    if (['simCardInstanceId', 'partyId', 'workflowId', 'customerAccoutId'].find(k => k === key)) {
      filtersGQL.push(`${key}:${value}`);
    }
  }

  const queryStr = `
  query {
    currentConsumptionV2(${filtersGQL.join(',')}){
      dataNationalConsumption
      dataIncomingNationalConsumption
      dataOutgoingNationalConsumption
      dataInternationalConsumption
      dataIncomingInternationalConsumption
      dataOutgoingInternationalConsumption
      dataTotal
      smsNationalConsumption
      smsIncomingNationalConsumption
			smsOutgoingNationalConsumption
      smsInternationalConsumption
      smsIncomingInternationalConsumption
      smsOutgoingInternationalConsumption
      smsTotal
      voiceNationalConsumption
      voiceIncomingNationalConsumption
      voiceOutgoingNationalConsumption
      voiceInternationalConsumption
      voiceIncomingInternationalConsumption
      voiceOutgoingInternationalConsumption
      voiceTotal
    }
  }
  `;

  const response = await query(queryStr);

  return response.data.currentConsumptionV2;
}

export async function exportCurrentConsumption(simcardId, exportFormat) {
  const queryStr = `
  query {
    exportCurrentConsumption(simCardInstanceId: ${simcardId}, exportFormat: ${exportFormat}){
      downloadUri
      asyncRequired
    }
  }
  `;

  const response = await query(queryStr);

  if (response.errors) {
    return {
      errors: response.errors,
    };
  }

  return response.data.exportCurrentConsumption;
}

export async function unthrottleLine(accessPointId) {
  const queryStr = `mutation { unthrottleLine(accessPointId: ${accessPointId}) }`;
  const response = await query(queryStr);
  return response.data.unthrottleLine;
}

export async function fetchLineServices(simCardInstanceId) {
  const queryStr = `
  {
    marketingServices(simCardInstanceId: ${simCardInstanceId}) {
      code
      labelService
      activated
      editable
      optional
      activationDate
      parameters {
        activated
        name
        code
        editable
        versionIp
        ipAdress

      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.marketingServices;
}
