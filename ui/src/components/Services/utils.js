export function getMarketingOfferServices(offer) {
  return getOfferServices(offer.marketingServices);
}

export function getOfferServices(services) {
  return services.filter(s => !!s && !s.optional).map(formatServices);
}

export function getOptionalServices(services) {
  return services.filter(s => !!s && s.optional).map(formatServices);
}

function formatServices(s) {
  const service = {
    code: s.code,
    checked: s.activated,
    editable: s.editable,
    optional: s.optional,
    name: s.name,
    activationDate: s.activationDate,
  };
  if (s.code === 'DATA') {
    service.parameters = s.parameters
      .filter(ps => !!ps)
      .map(p => {
        return {
          active: p.activated,
          label: p.name || p.code,
          editable: p.editable,
          code: p.code,
          name: p.code,
        };
      });
  }
  return service;
}
