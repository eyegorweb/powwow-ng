import { query } from './utils';

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchOffers(q, partners, { page, limit }) {
  const partnersIds = partners.map(i => `"${i.id}"`).join(',');
  const queryStr = `
  query{
    workflows(filter:{description: {contains: "${q}"}, partyId:{in: [${partnersIds}]}}, pagination: {limit: ${limit}, page: ${page}}) {
      total,
      items {
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
