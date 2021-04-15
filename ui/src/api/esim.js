import { query } from './utils';
import { formatFilters } from '@/api/linesActions.js';

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
  // const mockedResponse = {
  //   "data": {
  //     "esimStockProfiles": {
  //       "total": 1,
  //       "date": null,
  //       "items": [
  //         {
  //           "id": 1,
  //           "party": {
  //             "id": 2,
  //             "name": "LYRA NETWORK",
  //           },
  //           "simCardType": {
  //             "id": 1229,
  //             "category": "ESIM",
  //             "label": "SIM M2M MFF2 ENDURCIE BTA3V2 STEP2 OTA GSMA31 SIMM2M129",
  //           },
  //           "stockPreactAppaire": 1,
  //           "stockPreactNoAppaire": 3,
  //           "stockNoPreactAppaire": 2,
  //           "stockNoPreactNoAppaire": 4,
  //           "stockActifAppaire": 6,
  //           "stockActifNoAppaire": 5,
  //           "eidStockAvailable": 7,
  //           "updated": null
  //         }
  //       ]
  //     }
  //   }
  // }
  // if (response.errors) {
  //   return {
  //     errors: response.errors,
  //   };
  // }
  // return mockedResponse.data.esimStockProfiles;
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
    return response.data.simCardCategories.map(s => {
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
