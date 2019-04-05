import { query } from './utils';

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchOffers(q, partners, { page, limit, partnerTypes }) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners.map(i => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  let partnerTypesGqlFilter = '';
  if (partnerTypes && partnerTypes.length) {
    const ids = partnerTypes.map(p => `${p.id}`).join(',');
    partnerTypesGqlFilter = `, partyType: {in: [${ids}]}`;
  }

  const queryStr = `
  query{
    workflows(filter:{description: {contains: "${q}"}${partnerGqlParam}${partnerTypesGqlFilter}}, pagination: {limit: ${limit}, page: ${page}}) {
      total,
      items {
        id
        code
        workflowDescription
        initialOffer {
          id
          nonSystemServiceGroupList {
            id
            system
            type
            code
            standardAndSemiGlobalCatalogServiceGroups {
              id
              activatedByDefault
              partyAccess
              catalogService {
                code
              }
              catalogServiceParameters {
                id
                setOnActivation
                defaultValue
                label
                partyAccess
                serviceParameter {
                  id
                  code
                  name
                }
              }
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

export async function fetchOffersForPartnerId(partnerId) {
  return await fetchOffers('', [{ id: partnerId }], { page: 0, limit: 50 });
}
