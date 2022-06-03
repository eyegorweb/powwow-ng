import { query, addDateFilter, postFile, getFilterValue, getFilterValues } from './utils';

export async function fetchTransferSim(pagination, orderBy) {
  const orderingInfo =
    orderBy && orderBy.key ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    transferSimRequests(${paginationInfo}, ${orderingInfo})
    {
      items {
        transferId
        iccid
        fromPartner
        toPartner
        fromCustAccount
        toCustAccount
        created
        status
      },
      total
    }
  }
  `;

  const response = await query(queryStr);
  if (response && response.data && response.data.transferSimRequests)
    return response.data.transferSimRequests;
  return undefined;
}
export async function fetchlvConsumption(id) {
  const queryStr = `
  query {
    lvConsumption(simCardInstanceId: ${id}) {
      lastRechargeDate
      envelopeName
      dataConsumed
      dataAvailable
      smsConsumed
      smsAvailable
      voiceConsumed
      voiceAvailable
      DLV
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.lvConsumption;
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

export async function fetchSimCards(filters, pagination, sorting) {
  const queryStr = `
  query Simcards($filters: SIMCardFilterInput, $pagination: Pagination, $sorting: SIMCardSorting) {
    simcards(filter: $filters, pagination: $pagination, sorting: $sorting) {
      total
      items {
        simCard {
          label
          id
          category
          name
          code
          type
          number
          description
        }
      }
    }
  }`;
  const response = await query(queryStr, { filters, pagination, sorting });
  return response.data.simcards.items;
}

export async function fetchCardTypes(q, partners, { page = 0, limit = 999, partnerType }) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners.map((i) => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  let partnerTypeGqlFilter = '';
  if (partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  }
  const queryStr = `
    query {
      simcards(filter: { description: { contains: "${q}"} ${partnerGqlParam}${partnerTypeGqlFilter}} , sorting: { description: DESC }, pagination: {limit: ${limit}, page: ${page}} ) {
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

export async function fetchCommercialStatuses(partners) {
  const queryStr = `
  query CommercialStatus($ids: [ID!]){
    commercialStatus(filter: {idParty: {in: $ids}})
  }
  `;
  let ids, params;

  if (partners) {
    ids = partners.map((p) => p.id);
  }

  if (ids && ids.length) {
    params = { ids };
  }

  const response = await query(queryStr, params);
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

export async function searchLineByIccid(id) {
  const response = await searchLines({ key: 'id', direction: 'DESC' }, { page: 0, limit: 1 }, [
    {
      id: 'filters.iccid',
      value: '' + id,
    },
  ]);
  if (!response || !response.items || !response.items.length) return;
  return response.items[0];
}

async function searchLinesQuery(orderBy, pagination, filters, fields) {
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
      ${fields}
    }
  }`;

  const response = await query(queryStr);
  return response.data.simCardInstances;
}

export async function searchLinesForTable(orderBy, pagination, filters = []) {
  const fields = `
  total
  items {
    id
    iccid
    statusTranslated
    statuts
    deviceInstance {
      manufacturer
      deviceReference
    }
    party{
      id
      name
      partyType
    }
    workflow {
      workflowDescription
    }
    auditable {
      created
    }
    customFields {
      custom1
      custom2
      custom3
      custom4
      custom5
      custom6
    }
    lastCountry
    accessPoint {
      commercialStatusDate
      commercialStatus
      commercialStatusTranslated
      networkStatus
      preactivationDate
      activationDate
      commercialStatusDate
      terminationValidated
      workflowCode
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
      offer {
        marketingOffer {
          description
        }
      }
      lines {
        id
        msisdn
        imsi
        msisdnA
      }
    }
  }`;
  return searchLinesQuery(orderBy, pagination, filters, fields);
}

export async function searchLines(orderBy, pagination, filters = []) {
  const fields = `
  total
  items {
    customerAccountForActivation {
      id
      code
      name
      party {
        id
        name
        partyType
      }
    }
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
      spec1_label
      spec2_label
      suspensionFree
    }
    workflow {
      id
      workflowDescription
      roamingExtended
    }
    id
    iccid
    lastCountry
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
      customerAccount {
        id
        name
        code
      }
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
      terminationValidated
      commercialStatus
      preactivationDate
      activationDate
      commercialStatusDate
      flatEndDate
      networkStatus
      lines {
        id
        msisdn
        imsi
        msisdnA
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
    esimInfos {
      profileState
      lastProfileStateDate
      profileStateSynchroDate
      lastProfileState
      esimDownloadState
      esimDownloadSynchroDate
      eidValue
      msisdnSMSRStatus
    }
  }`;
  return await searchLinesQuery(orderBy, pagination, filters, fields);
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

  const partyTypeNEParam = getFilterValue(filters, 'partyType.ne');
  if (partyTypeNEParam) {
    allFilters.push(`partyType: {ne:${partyTypeNEParam}}`);
  }

  const customFields = getFilterValues(filters, 'filters.customFields');
  if (customFields && customFields.length > 0) {
    const customFeldsGQLparams = customFields
      .map((c) => `${c.id}: {startsWith: "${c.value}"}`)
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
  addIPFilter(allFilters, filters);

  addEsimId(allFilters, filters);
  addEsimCategory(allFilters, filters);
  addEsimType(allFilters, filters);
  addEsimFamily(allFilters, filters);
  addDownloadStatus(allFilters, filters);
  addEsimPairingStatus(allFilters, filters);
  addSMSRIDStatus(allFilters, filters);
  addIsDownload(allFilters, filters);
  addMassActionId(allFilters, filters);
  addSecurityTermination(allFilters, filters);

  return allFilters.join(',');
}

function trim(value) {
  return ('' + value).trim();
}

function addSecurityTermination(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'filters.lines.securityTerminationEnd');
  if (foundFilter) {
    gqlFilters.push(`securityTerminationEnd:true`);
  }
}

function addMassActionId(gqlFilters, selectedFilters) {
  const id = getFilterValue(selectedFilters, 'filters.lines.actionId');
  if (id) {
    gqlFilters.push(`massActionId: ${id}`);
  }
}

function addIsDownload(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'filters.downloadedProfile');
  if (foundFilter) {
    if (foundFilter.meta.label === 'common.YES' || foundFilter.meta.label === 'common.NO') {
      gqlFilters.push(
        `isDownloaded: ${foundFilter.meta.label === 'common.YES' ? 'true' : 'false'}`
      );
    }
  }
}

function addEsimPairingStatus(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(
    (f) => f.id === 'indicators.getparc.lines.esim.pairedLine'
  );
  if (foundFilter) {
    gqlFilters.push(`isEidAllocated: ${foundFilter.meta.value === 'YES' ? 'true' : 'false'}`);
  }
}

function addSMSRIDStatus(gqlFilters, selectedFilters) {
  const id = getFilterValue(selectedFilters, 'indicators.getparc.lines.esim.rid');
  if (id) {
    gqlFilters.push(`esimSmsrId: {eq: "${id}"}`);
  }
}

function addIPFilter(gqlFilters, selectedFilters) {
  const ip = getFilterValue(selectedFilters, 'filters.lines.ipFixe');
  if (ip) {
    gqlFilters.push(`ipFixeAdress: {contains: "${ip}"}`);
  }
}

function addEsimType(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'indicators.getparc.lines.esim.type');
  if (foundFilter) {
    gqlFilters.push(`esimStepType: {eq: ${foundFilter.meta.value}}`);
  }
}

function addEsimFamily(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'indicators.getparc.lines.esim.family');
  if (foundFilter) {
    gqlFilters.push(`simCardFamily: {eq: ${foundFilter.meta.value}}`);
  }
}

function addDownloadStatus(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(
    (f) => f.id === 'indicators.getparc.lines.esim.downloadStatus'
  );
  if (foundFilter) {
    gqlFilters.push(`esimDownloadState: {eq: ${foundFilter.meta.value}}`);
  }
}

function addEsimCategory(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(
    (f) => f.id === 'indicators.getparc.lines.esim.category'
  );
  if (foundFilter && foundFilter.meta && foundFilter.meta.value !== 'none') {
    gqlFilters.push(`simcardCategory: {eq: ${foundFilter.meta.value}}`);
  }
}

function addIdsFilter(gqlFilters, selectedFilters) {
  const _id = selectedFilters.find((f) => f.id === 'filters.id');
  const accessPointId = selectedFilters.find((f) => f.id === 'filters.accessPointId');
  const iccid = selectedFilters.find((f) => f.id === 'filters.iccid');
  const imsi = selectedFilters.find((f) => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find((f) => f.id === 'filters.msisdn');
  const imei = selectedFilters.find((f) => f.id === 'filters.imei');
  const msisdnA = selectedFilters.find((f) => f.id === 'filters.msisdnA');

  if (_id && _id.value) {
    gqlFilters.push(`id: {eq: "${trim(_id.value)}"}`);
  }
  if (iccid && iccid.value) {
    gqlFilters.push(`iccid: {eq: "${trim(iccid.value)}"}`);
  }
  if (imsi && imsi.value) {
    gqlFilters.push(`imsi: {eq: "${trim(imsi.value)}"}`);
  }
  if (msisdn && msisdn.value) {
    gqlFilters.push(`msisdn: {eq: "${trim(msisdn.value)}"}`);
  }
  if (imei && imei.value) {
    gqlFilters.push(`imei: {eq: "${trim(imei.value)}"}`);
  }
  if (msisdnA && msisdnA.value) {
    gqlFilters.push(`msisdnA: {eq: "${trim(msisdnA.value)}"}`);
  }
  if (accessPointId && accessPointId.value) {
    gqlFilters.push(`accessPointId: {eq: "${trim(accessPointId.value)}"}`);
  }
}

function addTerminationValidated(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'filters.lines.terminationValidated');
  if (foundFilter) {
    gqlFilters.push(`terminationValidated: ${foundFilter.meta.value}`);
  }
}

function addRangeFilter(gqlFilters, selectedFilters, gqlParamName, keyInCurrentFilter) {
  const filterValue = selectedFilters.find((f) => f.id === keyInCurrentFilter);
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
  const zipCode = selectedFilters.find((f) => f.id === 'filters.postalCode');
  zipCode && gqlFilters.push(`zipCode: {startsWith: "${zipCode.value.toString()}"}`);
}

function addFileImportId(gqlFilters, selectedFilters) {
  const filter = selectedFilters.find((f) => f.id === 'filters.lines.fromFile.title');
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

function addEsimId(gqlFilters, selectedFilters) {
  const id = getFilterValue(selectedFilters, 'indicators.getparc.lines.esim.id');
  if (id) {
    gqlFilters.push(`eId: {eq: "${id}"}`);
  }
}

function addOrderRef(gqlFilters, selectedFilters) {
  const orderRef = getFilterValue(selectedFilters, 'filters.orderReference');
  if (orderRef) {
    gqlFilters.push(`orderReference: {eq: "${orderRef}"}`);
  }
}

function addOfferFilterFilter(gqlFilters, selectedFilters) {
  const offerFilter = selectedFilters.find((o) => o.id === 'filters.lines.associatedOffer');
  if (!offerFilter) return;

  const offers = offerFilter.values.map((o) => `"${o.productCode}"`).join(',');
  if (offers) {
    gqlFilters.push(`productCode: {in: [${offers}]}`);
  }
}

function addActionTypeFilter(gqlFilters, selectedFilters) {
  const actionTypes = selectedFilters.find((f) => f.id === 'filters.actTypes');
  if (actionTypes) {
    const actionTypesValues = actionTypes.values.map((a) => a.id);
    gqlFilters.push(`actionTypes: [ ${[...actionTypesValues]} ]`);
  }
}

function getValuesIds(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map((i) => `"${i.id}"`).join(',');
  }
}

function getValuesAttr(filters, filterId, attr) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map((i) => `"${i[attr]}"`).join(',');
  }
}

function getValuesIdsWithoutQuotes(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map((i) => `${i.id}`).join(',');
  }
}

function addTrafficFilter(gqlFilters, selectedFilters) {
  const isTraffic = selectedFilters.find((f) => f.id === 'filters.lines.traffic');
  if (isTraffic) {
    gqlFilters.push(`isLignesTrafiquantes: true`);
  }
}

function addEUICCProfileFilter(gqlFilters, selectedFilters) {
  const currentStates = selectedFilters.find((f) => f.id === 'filters.lines.states');
  if (currentStates) {
    const currentStatesValues = currentStates.values.map((i) => i.id);
    gqlFilters.push(`profileEUICC: {in: [${currentStatesValues}]}`);
  }
}

function addSirenFilter(gqlFilters, selectedFilters) {
  const siren = selectedFilters.find((f) => f.id === 'filters.lines.siren');
  if (siren) {
    gqlFilters.push(`siren: {eq: "${siren.value}"}`);
  }
}

export async function uploadSearchFile(file, idType, partyId) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('idType', idType);
  if (partyId) {
    formData.append('id', partyId);
  }
  try {
    return await postFile(`/api/file/upload`, formData);
  } catch (e) {
    console.error(e);
    return {
      errors: [
        {
          key: e.status,
          error: e.data && e.data.error ? e.data.error : 'unknown',
          number: 0,
          message: 'Exception while uploading searchfile :' + e.statusText,
          data: e.data,
        },
      ],
    };
  }
}

export async function uploadFileSimCards(file, orderId) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('orderId', orderId);
  formData.append('idType', 'CREATE_ICCID');
  try {
    return await postFile(`/api/file/uploadIccids`, formData);
  } catch (e) {
    console.error(e);
    return {
      errors: [
        {
          key: e.status,
          error: e.data && e.data.error ? e.data.error : 'unknown',
          number: 0,
          message: 'Exception while uploading file simcards :' + e.statusText,
          data: e.data,
        },
      ],
    };
  }
}

export async function uploadFileSimCardsFromLines(file) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('idType', 'CREATE_ICCID');
  try {
    return await postFile(`/api/file/upload`, formData);
  } catch (e) {
    console.error(e);
    return {
      errors: [
        {
          key: e.status,
          error: e.data && e.data.error ? e.data.error : 'unknown',
          number: 0,
          message: 'Exception while uploading simcards :' + e.statusText,
          data: e.data,
        },
      ],
    };
  }
}

export async function uploadFileEsimCards(file) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('idType', 'EID');
  try {
    return await postFile(`/api/file/upload`, formData);
  } catch (e) {
    console.error(e);
    return {
      errors: [
        {
          key: e.status,
          error: e.data && e.data.error ? e.data.error : 'unknown',
          number: 0,
          message: 'Exception while uploading simcards :' + e.statusText,
          data: e.data,
        },
      ],
    };
  }
}

export async function importIccidsFromLines(partnerId, customerAccountId, simCardId, tempDataUuid) {
  const queryStr = `
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
    `;
  try {
    const response = await query(queryStr);
    return response.data.importSimcards;
  } catch (e) {
    console.error(e);
    return {
      errors: [
        {
          key: e,
          error: e.data && e.data.error ? e.data.error : 'unknown',
          number: 0,
          message: 'Exception while importing simcards : Technical error ' + e,
          data: e.data,
        },
      ],
    };
  }
}
export async function importEsim(partnerId, simCardId, tempDataUuid) {
  const queryStr = `
    mutation {
      addStockEID(
        filter: {
          tempDataUuid: "${tempDataUuid}"
          partyId: "${partnerId}"
          simcardId: "${simCardId}"
        }
      )
    }
    `;
  try {
    const response = await query(queryStr);
    if (response.errors) {
      return {
        errors: response.errors,
      };
    }
    return response.data.addStockEID;
  } catch (e) {
    console.error(e);
    return {
      errors: [
        {
          key: e,
          error: e.data && e.data.error ? e.data.error : 'unknown',
          number: 0,
          message: 'Exception while importing simcards : Technical error ' + e,
          data: e.data,
        },
      ],
    };
  }
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
  exportAll = false,
  exportChoice
) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  let asyncExportRequestParam = '';
  let exportType = exportChoice !== 'CLASSIC' ? `exportType: ${exportChoice}` : '';
  if (asyncExportRequest) {
    asyncExportRequestParam = `, asyncExportRequest: ${asyncExportRequest}`;
  }
  const response = await query(
    `
    query {
      exportSimCardInstances(filter: {${formatFilters(
        filters
      )}}, columns: [${columnsParam}]${orderingInfo}, exportFormat: ${exportFormat}${asyncExportRequestParam}, full: ${exportAll}, ${exportType})  {
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
    if (['simCardInstanceId', 'partyId', 'workflowId', 'customerAccoutId'].find((k) => k === key)) {
      filtersGQL.push(`${key}:${value}`);
    }
  }

  const queryStr = `
  query {
    currentConsumptionV2(${filtersGQL.join(',')}, full: true){
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
      dataIncomingNationalConsumptionStreams {
        stream
        volume
      }
      dataOutgoingNationalConsumptionStreams {
        stream
        volume
      }
      dataIncomingInternationalConsumptionStreams {
        stream
        volume
      }
      dataOutgoingInternationalConsumptionStreams {
        stream
        volume
      }
    }
  }
  `;

  const response = await query(queryStr);

  return response.data.currentConsumptionV2;
}

export async function exportCurrentConsumption(simcardId, exportFormat, exportChoice) {
  let response;
  if (exportChoice === 'BY_STREAM') {
    response = exportCurrentConsumptionByStream(simcardId, exportFormat);
  } else {
    response = exportCurrentConsumptionClassic(simcardId, exportFormat);
  }
  return response;
}

export async function exportCurrentConsumptionClassic(simcardId, exportFormat) {
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

export async function exportCurrentConsumptionByStream(simcardId, exportFormat) {
  const queryStr = `
  query {
    exportSplittedCurrentConsumption(simCardInstanceId: ${simcardId}, exportFormat: ${exportFormat}){
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

  return response.data.exportSplittedCurrentConsumption;
}

export async function unthrottleLine(accessPointId) {
  const queryStr = `mutation { unthrottleLine(accessPointId: ${accessPointId}) }`;
  const response = await query(queryStr);
  return response.data.unthrottleLine;
}

export async function fetchLineServices(simCardInstanceId) {
  const queryStr = `
  {
    marketingServicesV2(simCardInstanceId: ${simCardInstanceId}) {
      code
      labelService
      activated
      editable
      optional
      activationDate
      preServiceCode 
      roamingType
      type
      parameters {
        activated
        name
        code
        editable
        versionIp
        ipAdress
        parameter1
        parameter2

      }
    }
  }
  `;

  const response = {
    "data": {
      "marketingServicesV2": [
        {
          "code": "INCOMING_VOICE",
          "labelService": "Voix entrante",
          "activated": false,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "INCOMING_SMS",
          "labelService": "SMS entrant",
          "activated": false,
          "editable": true,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "OUTGOING_VOICE",
          "labelService": "Voix sortante",
          "activated": false,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "OUTGOING_SMS",
          "labelService": "SMS sortant",
          "activated": false,
          "editable": true,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "ROAMING",
          "labelService": "Roaming",
          "activated": true,
          "editable": true,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": "MONDE",
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "2172",
          "labelService": "RESTRICTION DATA CSD ENTRANT",
          "activated": true,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "2173",
          "labelService": "RESTRICTION DATA CSD SORTANT",
          "activated": true,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "75",
          "labelService": "RESTRICTION DES APPELS ENTRANTS",
          "activated": false,
          "editable": true,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "76",
          "labelService": "RESTRICTION DES APPELS SORTANTS",
          "activated": false,
          "editable": true,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "OTHER",
          "parameters": null
        },
        {
          "code": "LTE-M",
          "labelService": "LTE-M",
          "activated": false,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "DATA",
          "parameters": null
        },
        {
          "code": "NB-IoT",
          "labelService": "NB-IoT",
          "activated": true,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "DATA",
          "parameters": null
        },
        {
          "code": "Volte",
          "labelService": "VOLTE",
          "activated": false,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "DATA",
          "parameters": null
        },
        {
          "code": "5G M2M",
          "labelService": "5G-M2M",
          "activated": false,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "DATA",
          "parameters": null
        },
        {
          "code": "4G",
          "labelService": "4G",
          "activated": false,
          "editable": false,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "DATA",
          "parameters": null
        },
        {
          "code": "DATA",
          "labelService": "Data",
          "activated": true,
          "editable": true,
          "optional": false,
          "activationDate": null,
          "preServiceCode": null,
          "roamingType": null,
          "type": "DATA_APN",
          "parameters": [
            {
              "activated": true,
              "name": "gprsnac.com",
              "code": "APN1",
              "editable": true,
              "versionIp": null,
              "ipAdress": null,
              "parameter1": null,
              "parameter2": null
            },
            {
              "activated": false,
              "name": "objcobytel.com",
              "code": "APN2",
              "editable": true,
              "versionIp": null,
              "ipAdress": null,
              "parameter1": null,
              "parameter2": null
            },
            {
              "activated": false,
              "name": "a2bouygtel.com",
              "code": "APN3",
              "editable": true,
              "versionIp": null,
              "ipAdress": null,
              "parameter1": null,
              "parameter2": null
            }
          ]
        }
      ]
    }
  }

  return response.data.marketingServicesV2;
}
