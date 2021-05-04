import { formatFilters } from '@/api/linesActions.js';
import { query, getFilterValues, getValuesIdsWithoutQuotes, formatServicesForGQL } from './utils';

export async function exportEsimReservations(columns, orderBy, exportFormat, filters = []) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const queryStr = `
  query {
    esimReservationsExport(filter: {${formatFiltersReservation(
      filters
    )}},  exportFormat: ${exportFormat} ${orderingInfo},
      full: true
    ) {
      downloadUri
      total
      asyncRequired
    }
  }
  `;

  const response = await query(queryStr);
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

  return response.data.esimReservationsExport;
}

export async function exportEsimStocks(columns, orderBy, exportFormat, filters = []) {
  // const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const queryStr = `
  query {
    esimStockProfilesExport(filters: {${formatFiltersReservation(
      filters
    )}},  exportFormat: ${exportFormat},
    ) {
      downloadUri
      total
      asyncRequired
    }
  }
  `;

  const response = await query(queryStr);
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

  return response.data.esimStockProfilesExport;
}
export function formatFiltersReservation(selectedFilters) {
  const gqlFilters = [];

  addNewFilter(gqlFilters, selectedFilters, 'filters.partners', 'partyId');
  addNewFilter(gqlFilters, selectedFilters, 'common.billingAccount', 'customerAccountId');
  addNewFilter(gqlFilters, selectedFilters, 'filters.lines.typeSIMCard', 'simCardTypeId');
  addNewFilter(gqlFilters, selectedFilters, 'filters.offers', 'workflowCode');
  addNewFilter(gqlFilters, selectedFilters, 'filters.quantity', 'quantity');
  addNewFilter(gqlFilters, selectedFilters, 'getsim.reservations.filters.creator', 'creatorId');
  addActionsFilter(gqlFilters, selectedFilters);
  return gqlFilters.join(',');
}

function addNewFilter(gqlFilters, selectedFilters, filterName, filterApiName) {
  const filter = getValuesIdsWithoutQuotes(selectedFilters, filterName);
  if (filter) {
    gqlFilters.push(`${filterApiName}: {in: [${filter}]}`);
  }
}

function addActionsFilter(gqlFilters, selectedFilters) {
  const actions = getFilterValues(selectedFilters, 'filters.action');
  if (actions) {
    actions.forEach((e) => {
      if (e.id === 'filters.actionValues.ACTIVATED' && e.value) {
        gqlFilters.push(`activationAsked: {eq: ${e.value}}`);
      }
      if (e.id === 'filters.actionValues.PREACTIVATED' && e.value) {
        gqlFilters.push(`preactivationAsked: {eq: ${e.value}}`);
      }
    });
  }
}

export async function fetchEsimReservations(filter, pagination, sorting) {
  const queryStr = `
query fetchEsimReservations($filter: EsimReservationFilterInput, $pagination: Pagination!, $sorting: EsimReservationSorting) {
  esimReservations(filter: $filter, pagination: $pagination, sorting: $sorting){
    total
    items {
      id
      esimReservationDate
      massActionId
      status
      pairingAsked
      esimReservationReference
      downloadState
      preActivationAsked
      activationAsked
      quantity
      customFields {
        custom1
        custom1Date
        custom2
        custom2Date
        custom3
        custom3Date
        custom4
        custom4Date
        custom5
        custom5Date
        custom6
        custom6Date
      }
      simCardType {
        description
      }
      esimReservedMarketingOffer {
        description
      }
      auditable {
        creator {
          email
          name {
            title
            firstName
            lastName
          }
        }
      }
      party {
        contractReference
        name
        code
      }
      customerAccount {
        code
        address {
          address1
          zipCode
          city
          country
          state
        }
      }
    }
  }
}`;

  const response = await query(queryStr, { filter, pagination, sorting });
  return response.data.esimReservations;
}

export async function createEsimReservation({ esimReservationInput, selectedServicesInput }) {
  const queryStr = `
  mutation CreateEsimReservation($esimReservationInput: EsimReservationInput, $selectedServicesInput: [ServicesToActivateInput!]) {
    createEsimReservation(esimReservationInput: $esimReservationInput, selectedServicesInput: $selectedServicesInput ) {
      id
    }
  }`;
  const response = await query(queryStr, { esimReservationInput, selectedServicesInput });
  return response.data.createEsimReservation;
}

export async function fetchEsimStockProfiles(filter, pagination) {
  const queryStr = `
  query fetchEsimStockProfiles($filter: EsimStrockProfileFilterInput, $pagination: Pagination!) {
    esimStockProfiles(filters: $filter, pagination: $pagination) {
      total
      date
      items {
        id
        party {
          id
          name
        }
        simCardType {
          id
          category
          name
          code
          label
          description
        }
        stockPreactAppaire
        stockPreactNoAppaire
        stockNoPreactAppaire
        stockNoPreactNoAppaire
        stockActifAppaire
        stockActifNoAppaire
        eidStockAvailable
        updated
      }
    }
  }`;

  const response = await query(queryStr, { filter, pagination });
  return response.data.esimStockProfiles;
}

export async function fetchEsimCategories() {
  const queryStr = `
  {
    simCardCategories {
      simCardCategory
      label
    }
  }
  `;
  const response = await query(queryStr);

  if (response && response.data && response.data.simCardCategories) {
    return response.data.simCardCategories.map((s) => {
      return {
        label: s.label,
        value: s.simCardCategory,
      };
    });
  }

  return [];
}

export async function pairingByImportedFile({ partnerId, tempEidUuid }) {
  const queryStr = `
  mutation PairingByImportedFile($partnerId: Long!, $tempEidUuid: String!) {
    pairingByImportedFile(pairingByImportedFileInput: {
      partyId: $partnerId,
      tempEidUuid: $tempEidUuid
    }) {
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

  const response = await query(queryStr, { partnerId, tempEidUuid });
  return response.data.pairingByImportedFile;
}

export async function pairingByStockedEid(partnerId, filters, simCardTypeId, simCardInstanceIds) {
  const queryStr = `
  mutation PairingByStockedEid($partnerId: Long!, $simCardTypeId: Long!, $simCardInstanceIds: [ID!]) {
    pairingByStockedEid(pairingByStockedEidInput: {
      filter: {${formatFilters(filters)}}
      partyId: $partnerId
      simCardTypeId: $simCardTypeId
      simCardInstanceIds: $simCardInstanceIds
    }) {
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
  const response = await query(queryStr, { partnerId, simCardTypeId, simCardInstanceIds });
  return response.data.pairingByStockedEid;
}

export async function esimLiberationProfil(
  partnerId,
  filters,
  simCardInstanceIds,
  tempDataUuid,
  dueDate
) {
  const queryStr = `
  mutation EsimLiberationProfil($partnerId: Long!, $simCardInstanceIds: [ID!], $tempDataUuid: String, $dueDate: DateTime!) {
    esimLiberationProfil(input: {
      filter: {${formatFilters(filters)}}
      partyId: $partnerId
      simCardInstanceIds: $simCardInstanceIds
      tempDataUuid: $tempDataUuid
      dueDate: $dueDate
    }) {
      tempDataUuid
      validated
      errors {
        key
        number
        message
      }
    }
  }`;
  const response = await query(queryStr, { partnerId, simCardInstanceIds, tempDataUuid, dueDate });
  return response.data.esimLiberationProfil;
}

export async function esimStatusChangeProfil({
  filters,
  simCardInstanceIds,
  tempDataUuid,
  dueDate,
  notification,
  targetStateEnum,
  partnerId,
}) {
  const queryStr = `
  mutation EsimStatusChangeProfil($partnerId: Long!, $simCardInstanceIds: [ID!], $tempDataUuid: String, $dueDate: DateTime!, $targetStateEnum: TargetStateEnum!, $notification: Boolean!) {
    esimStatusChangeProfil(input: {
      filter: {${formatFilters(filters)}}
      partyId: $partnerId
      simCardInstanceIds: $simCardInstanceIds
      tempDataUuid: $tempDataUuid
      dueDate: $dueDate
      notification: $notification
      targetStateEnum: $targetStateEnum
    }) {
      tempDataUuid
      validated
      errors {
        key
        number
        message
      }
    }
  }`;

  const response = await query(queryStr, {
    partnerId,
    simCardInstanceIds,
    tempDataUuid,
    dueDate,
    notification,
    targetStateEnum,
  });
  return response.data.esimStatusChangeProfil;
}

export async function esimDownloadProfil(args) {
  const {
    filters,
    simCardInstanceIds,
    customerAccountID,
    workflowCode,
    tempDataUuid,
    partyId,
    dueDate,
    services,
    targetDownload,
    simStatus,
  } = args;

  let changeServicesParamsGql = '';

  if (services) {
    changeServicesParamsGql = formatServicesForGQL({
      data: services.dataService,
      services: services.services,
    });
  }

  const queryStr = `
  mutation EsimDownloadProfil(
    $simCardInstanceIds: [ID!],
    $customerAccountID: Long!,
    $workflowCode: String,
    $tempDataUuid: String
    $partyId: Long!
    $dueDate: DateTime!
    $targetDownload: DownloadStateEnum!
    $simStatus: SimCardActivationStatusEnum!) {
    esimDownloadProfil(input: {
      simCardInstanceIds: $simCardInstanceIds
      customerAccountID: $customerAccountID
      workflowCode: $workflowCode
      tempDataUuid: $tempDataUuid
      partyId: $partyId
      dueDate: $dueDate
      targetDownload: $targetDownload
      simStatus: $simStatus
      filter: {${formatFilters(filters)}}
      ${changeServicesParamsGql}
    }) {
      tempDataUuid
      validated
      errors {
        key
        number
        message
      }
    }
  }`;

  const response = await query(queryStr, {
    simCardInstanceIds,
    customerAccountID,
    workflowCode,
    tempDataUuid,
    partyId,
    dueDate,
    targetDownload,
    simStatus,
  });
  if (response.data) {
    return response.data.esimDownloadProfil;
  } else {
    return { errors: response.errors };
  }
}
