export function getOfferServices(offer) {
  return offer.marketingServices
    .filter(s => !!s && !s.optional)
    .map(s => {
      const service = {
        code: s.code,
        checked: s.activated,
        editable: s.editable,
        optional: s.optional,
      };
      if (s.code === 'DATA') {
        service.parameters = s.parameters
          .filter(ps => !!ps)
          .map(p => {
            return {
              active: p.activated,
              label: p.value,
              editable: p.editable,
              code: p.code,
              name: p.code,
            };
          });
      }
      return service;
    });
}
