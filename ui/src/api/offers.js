import { query } from './utils';
import get from 'lodash.get';

export async function getAvailableOffer(partnerId, pagination) {
  const queryStr = `{
  getAvailableOffer(partnerId: ${partnerId}, pagination: { page: ${pagination.page}, limit: ${pagination.limit}}) {
    total
    items {
      workflow {
        id
        code
        workflowDescription
        name
        initialOffer {
          marketingServices {
            code
            labelService
            optional
            editable
          }
        }
      }
      partyRelated
    }
  }
}
`;

  const response = await query(queryStr);
  if (response.data.getAvailableOffer && response.data.getAvailableOffer.items) {
    return response.data.getAvailableOffer.items;
  } else {
    return response;
  }
}

export async function updateOffers(partnerId, offerIds) {
  const queryStr = `mutation{ updateOffersOnParty(partnerId: ${partnerId}, offerIds: [${offerIds.join(
    ', '
  )}]) }`;
  const response = await query(queryStr);
  if (response.data) return response.data.updateOffersOnParty;
}

export async function disableOffer(partnerId, offerId) {
  const queryStr = `mutation{ disableOffer(partnerId: ${partnerId}, offerId: ${offerId}) }`;
  const response = await query(queryStr);
  if (response.data) return response.data.disableOffer;
}

export async function fetchOffers2(filters, pagination, sorting) {
  let rCardGqlParam = '';

  if (filters && filters.partyId && filters.partyId.in && filters.partyId.in.length) {
    rCardGqlParam = `rCard(partyId: ${filters.partyId.in[0]})`;
  }

  const queryStr = `query Workflows($filters: WorkflowFilterInput, $pagination: Pagination, $sorting: WorkflowSorting) {
    workflows(filter: $filters, pagination: $pagination, sorting: $sorting) {
      total
      items {
        id
        code
        name
        workflowDescription
        ${rCardGqlParam}
        initialOffer {
          id
          code
          description
          offerDiscounts {
            discount {
              code
              discountType
            }
            lowerBound
            upperBound
          }
          offerPackages {
            usageType
            envelopeValue
            envelopeLabel
            unit
            lowerBound
            upperBound
            price
          }
          offerRanges {
            lowerBound
            upperBound
            unitPrice
            fixedPrice
            lowerBoundDiscount
            upperBoundDiscount
            unit
          }
          marketingServices {
            labelService
            code
            activated
            editable
            optional
            parameters {
              activated
              name
              code
              editable
            }
          }
        }
      }
    }
  }`;

  const response = await query(queryStr, { filters, pagination, sorting });

  return response.data.workflows.items;
}

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchOffers(
  q,
  partners,
  { page, limit, partnerType, disabledOffer, customerAccountCode, haveLvOffers }
) {
  let partnersIds,
    partnerGqlParam = '',
    rCardGqlParam = '',
    offersParam = '',
    customerAccountCodeParam = '';

  if (disabledOffer) {
    offersParam = `, disabledOffer: false`;
  }

  if (customerAccountCode) {
    customerAccountCodeParam = `, customerAccountCode: {in: ["${customerAccountCode}"]}`;
  }

  if (partners && partners.length > 0) {
    partnersIds = partners.map((i) => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
    rCardGqlParam = `rCard(partyId: ${partners[0].id})`;
  }

  let partnerTypeGqlFilter = '';
  if (partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  }

  let lvOffers = '';

  if (haveLvOffers) {
    lvOffers = `, longLifeOffer: true`;
  }

  const queryStr = `
  query{
    workflows(filter:{description: {startsWith: "${q}"} ${offersParam} ${partnerGqlParam} ${partnerTypeGqlFilter}${customerAccountCodeParam}${lvOffers}}, sorting: { description: DESC }, pagination: {limit: ${limit}, page: ${page}}) {
      total,
      items {
        id
        code
        name
        workflowDescription
        ${rCardGqlParam}
        initialOffer {
          id
          code
          description
          offerDiscounts {
            discount {
              code
              discountType
            }
            lowerBound
          }
          offerPackages {
            usageType
            envelopeValue
            envelopeLabel
            unit
          }
          offerRanges {
            lowerBound
            upperBound
            unitPrice
            fixedPrice
            lowerBoundDiscount
            upperBoundDiscount
            unit
          }
          marketingServices {
            labelService
            code
            activated
            editable
            optional
            parameters {
              activated
              name
              code
              editable
            }
          }
        }
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.workflows.items;
}

export async function fetchOfferWithBilligAccount(partners, page = 0) {
  const partnerIds = partners ? partners.map((p) => `${p.id}`).join(',') : [];
  const queryStr = `
  query {
    workFlowByCustomerAccount(partyId: [${partnerIds}], pagination: {page: ${page}, limit: 999}) {
      total
      items{
        workflow {
          id
          workflowDescription
          initialOffer{
            id
            code
          }
        }
        customerAccount {
          id
          code
          name
        }
      }
    }
  }`;
  const response = await query(queryStr);

  return response.data.workFlowByCustomerAccount.items;
}

export async function fetMaxValuesFromOfferPackage(offerCustoAccount) {
  const marketingOfferId = offerCustoAccount.workflowId;
  const customerAccountId = offerCustoAccount.customerAccoutId;

  const queryStr = `
  {
    marketingOfferPackage(marketingOfferId:${marketingOfferId}, customerAccountId:${customerAccountId}) {
      nbLines
      marketingOfferPackage {
        total
        items {
          __typename
          usageType
          envelopeLabel
          envelopeValue
          unit
          envelopeValueOctets
        }
      }
    }
  }
  `;

  const response = await query(queryStr);

  const items = get(response, 'data.marketingOfferPackage.marketingOfferPackage.items');
  // Valeur '∞' attribuée par défaut pour le mode Offre compteur
  let maxData = '∞';
  let maxVoice = '∞';
  let maxSMS = '∞';
  // Si on a des valeurs (items), alors on est en mode Offre forfait et on lit les informations de consommation
  // sinon on est en mode Offre Compteur (pas de borne donc on met la notion d'infini '∞')
  if (items && items.length) {
    const dataOffer = items.find((i) => i.usageType === 'DATA');
    const smsOffer = items.find((i) => i.usageType === 'SMS');
    const voiceOffer = items.find((i) => i.usageType === 'VOICE');

    if (dataOffer && dataOffer.envelopeValue > 0) {
      switch (dataOffer.unit) {
        case 'Go': {
          maxData = dataOffer.envelopeValue * 1024 * 1024 * 1024;
          break;
        }
        case 'Mo': {
          maxData = dataOffer.envelopeValue * 1024 * 1024;
          break;
        }
        case 'Ko': {
          maxData = dataOffer.envelopeValue * 1024;
          break;
        }
      }
    }
    if (smsOffer && smsOffer.envelopeValue > 0) {
      maxSMS = smsOffer.envelopeValue;
    }

    if (voiceOffer && voiceOffer.envelopeValue) {
      maxVoice = voiceOffer.envelopeValue;
    }
  }

  return {
    maxData,
    maxVoice,
    maxSMS,
  };
}

export async function changeOffer(filters, lines, params) {
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map((l) => l.id).join(',');
  }

  const {
    partyId,
    notifEmail,
    dueDate,
    sourceWorkflowID,
    targertWorkflowId,
    customerAccountId,
  } = params;

  const queryStr = `
  mutation {
    changeOffer(input: {simCardInstanceIds: [${lineIds}], partyId: ${partyId}, dueDate: "${formatDateForGql(
    dueDate
  )}", notification: ${boolStr(
    notifEmail
  )}}, sourceWorkflowID: ${sourceWorkflowID}, targertWorkflowId: ${targertWorkflowId}, customerAccountId: ${customerAccountId}) {
      numberOfUnitActionCreated
    }
  }
  `;

  return await query(queryStr);
}

export async function fetchUsageLimits(partnerId, customerAccountId, offerCode) {
  const queryStr = `
  query OfferGroup($partnerId: Long!, $customerAccountId: Long, $offerCode: String){
    offerGroup(partyId: $partnerId, customerAccountId: $customerAccountId, offerCode: $offerCode) {
      items {
        offerGroupPackages {
          usageType
          envelopeLabel
          envelopeValue
          unit
        }
      }
    }
  }`;

  try {
    const response = await query(queryStr, { partnerId, customerAccountId, offerCode });

    if (response.data.offerGroup.items.length > 0) {
      return get(response, 'data.offerGroup.items[0].offerGroupPackages');
    }
    return undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function fetchOfferGroupByParams(params) {
  const queryStr = `  query OfferGroup($partnerId: Long, $customerAccountId: Long, $offerGroupId: Long, $pagination: Pagination){
    offerGroup(partyId: $partnerId, offerGroupId: $offerGroupId, customerAccountId: $customerAccountId, pagination: $pagination) {
      total
      items {
        id
        description
        code
        auditable {
          created
          updated
        }
        customerAccount {
          id
          code
          name
          siret
          marketLine
          status
          auditable {
            created
          }
        }
        offerGroupDiscounts {
          discount {
            code
            discountType
          }
          lowerBound
          upperBound
          discountValue
        }
        offerGroupPackages {
          usageType
          envelopeValue
          envelopeLabel
          unit
          lowerBound
          upperBound
          price
          discount
        }
        offerGroupRanges  {
          lowerBound
          upperBound
          unitPrice
          fixedPrice
          upperBoundDiscount
          unit
        }
        marketingOffer {
          id
          code
          yorkCommunity
          allowedSuspensionDuration
          commitmentDuration
          billingOfferCode
          description
          marketingServices {
            labelService
            code
            activated
            editable
            optional
            parameters {
              activated
              name
              code
              editable
            }
          }
        }
      }
    }
  }
  `;
  return await query(queryStr, params);
}

export async function fetchOfferGroupById(offerGroupId) {
  const response = await fetchOfferGroupByParams({ offerGroupId });
  if (
    response &&
    response.data &&
    response.data.offerGroup &&
    response.data.offerGroup.items &&
    response.data.offerGroup.items.length
  ) {
    return response.data.offerGroup.items[0];
  }
}

export async function fetchCommercialOffersForPartnerId(partnerId, customerAccountId, pagination) {
  const response = await fetchOfferGroupByParams({ partnerId, customerAccountId, pagination });
  return response.data.offerGroup;
}

export async function createCommercialOffer(input) {
  const queryStr = `mutation CreateCommercialOffer($input: CommercialOfferMutInput!) {
    createCommercialOffer(input: $input) {
      id
    }
  }`;

  const response = await query(queryStr, { input });
  return response.data.createCommercialOffer;
}

export async function updateCommercialOffer(input) {
  const queryStr = `mutation UpdateCommercialOffer($input: CommercialOffeInput!) {
    updateCommercialOffer(input: $input) {
      id
    }
  }`;

  const response = await query(queryStr, { input });
  return response.data.updateCommercialOffer;
}

export async function fetchLVOffers(partyId, offerCode) {
  const queryStr = `
query LongLifeOffer($partyId: Long, $offerCode: String){
  longLifeOffer(partyId: $partyId, offerCode: $offerCode){
    id
    code
    description
    defaultPackage
    validityDuration
    packages {
      label
      usage {
        lowerBound
        upperBound
        envelopeValue
        envelopeLabel
        unit
        usageType
        price
        flagActiveDiscount
        modifyPackage
        duration
        envelopeValueOctets
      }
    }
  }
}`;

  const response = await query(queryStr, { partyId, offerCode });
  return response.data.longLifeOffer;
}

function formatDateForGql(inDate) {
  if (!inDate) return '';
  const startDate = inDate.replace(/\//g, '-');
  const parts = startDate.split(' ');
  if (parts) {
    if (parts.length === 2) {
      return startDate;
    } else {
      return `${parts[0]} 00:00:00`;
    }
  }
}

function boolStr(value) {
  return value ? 'true' : 'false';
}
