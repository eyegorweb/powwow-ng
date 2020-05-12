import { query } from './utils';

export async function getAvailableOffer(partnerId) {
  const queryStr = `{
  getAvailableOffer(partnerId: ${partnerId}) {
    partyRelated
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
`;

  const response = await query(queryStr);
  return response.data.getAvailableOffer;
}

export async function updateOffers(partnerId, offerIds) {
  const queryStr = `mutation{ updateOffers(partnerId: ${partnerId}, offerIds: [${offerIds.join(
    ', '
  )}]) }`;
  const response = await query(queryStr);
  if (response.data) return response.data.updateOffers;
}

export async function disableOffer(partnerId, offerId) {
  const queryStr = `mutation{ disableOffer(partnerId: ${partnerId}, offerId: ${offerId}) }`;
  const response = await query(queryStr);
  if (response.data) return response.data.disableOffer;
}

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchOffers(q, partners, { page, limit, partnerType, disabledOffer }) {
  let partnersIds,
    partnerGqlParam = '',
    rCardGqlParam = '',
    offersParam = '';

  if (disabledOffer) {
    offersParam = `, disabledOffer: false`;
  }

  if (partners && partners.length > 0) {
    partnersIds = partners.map(i => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
    rCardGqlParam = `rCard(partyId: ${partnersIds.replace(/['"]+/g, '')})`;
  }

  let partnerTypeGqlFilter = '';
  if (partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  }

  const queryStr = `
  query{
    workflows(filter:{description: {startsWith: "${q}"} ${offersParam} ${partnerGqlParam} ${partnerTypeGqlFilter}}, sorting: { description: DESC }, pagination: {limit: ${limit}, page: ${page}}) {
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
  const partnerIds = partners ? partners.map(p => `${p.id}`).join(',') : [];
  const queryStr = `
  query {
    workFlowByCustomerAccount(partyId: [${partnerIds}], pagination: {page: ${page}, limit: 20}) {
      total
      items{
        workflow {
          id
          workflowDescription
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

export async function fetchOffersForPartnerId(partnerId) {
  return await fetchOffers('', [{ id: partnerId }], { page: 0, limit: 50, disabledOffer: true });
}

export async function changeOffer(filters, lines, params) {
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
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
