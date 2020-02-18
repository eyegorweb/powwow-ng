import { query } from './utils';

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchOffers(q, partners, { page, limit, partnerType }) {
  let partnersIds,
    partnerGqlParam = '',
    rCardGqlParam = '';

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
    workflows(filter:{description: {startsWith: "${q}"}${partnerGqlParam}${partnerTypeGqlFilter}}, sorting: { description: DESC }, pagination: {limit: ${limit}, page: ${page}}) {
      total,
      items {
        id
        code
        workflowDescription
        ${rCardGqlParam}
        initialOffer {
          id
          code
          marketingServices {
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
  return await fetchOffers('', [{ id: partnerId }], { page: 0, limit: 50 });
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
