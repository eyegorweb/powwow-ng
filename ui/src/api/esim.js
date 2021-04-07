import { query } from './utils';

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
