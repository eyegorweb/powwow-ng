export function getMarketingOfferServices(offer) {
  return getOfferServices(offer.marketingServices);
}

export function getOfferServices(services) {
  return services.filter((s) => !!s && !s.optional).map(formatServices);
}

export function getOptionalServices(services) {
  return services.filter((s) => !!s && s.optional).map(formatServices);
}

export function getActiveServicesWithoutAPN(services) {
  return services.filter((s) => s.activated && !s.parameters).map(formatServices);
}

function formatServices(s) {
  const service = {
    code: s.code,
    checked: s.activated,
    editable: s.editable,
    optional: s.optional,
    name: s.name,
    activationDate: s.activationDate,
    labelService: s.labelService,
    preServiceCode: s.preServiceCode,
    roamingType: s.roamingType,
    type: s.type,
    isClicked: false,
    // TODO: Gérer le OU du deuxième tableau indexé (premier tableau => ET)
    listServiceMandatory: s.serviceMandatory ? s.serviceMandatory : [],
    listServiceIncompatible: s.serviceIncompatible ? s.serviceIncompatible : [],
    notify: true,
    // Utilisé pour les dépendances de services
    managed: false,
    // Utilisé si un service à été ajouté à la suppression
    addedToDisable: false,
    barring: s.barring,
  };
  if (s.parameters && s.parameters.length > 0) {
    service.parameters = s.parameters
      .filter((ps) => !!ps)
      .map((p) => {
        return {
          active: p.activated,
          label: p.name || p.code,
          editable: p.editable,
          code: p.code,
          name: p.code,
          selected: p.activated,
          selectable: p.editable,
        };
      });
  }
  return service;
}

export function getApnServices(services) {
  return services
    .filter((s) => {
      // caution: s.parameters can return null or [null]
      return !!s && !!s.parameters && !!s.parameters.length && !!s.parameters[0];
    })
    .map((serviceWithParameter) => {
      const parameters = serviceWithParameter.parameters
        .filter(
          (serviceWithParameter) =>
            !!serviceWithParameter.ipAdress ||
            !!serviceWithParameter.parameter1 ||
            !!serviceWithParameter.parameter2
        )
        .map((serviceWithParameter) => {
          return {
            code: serviceWithParameter.code,
            name: serviceWithParameter.name,
            version: serviceWithParameter.versionIp,
            ipAdress: serviceWithParameter.ipAdress,
            parameter1: serviceWithParameter.parameter1,
            parameter2: serviceWithParameter.parameter2,
            type: serviceWithParameter.type,
            radiusOption: serviceWithParameter.radiusOption,
            radiusType: serviceWithParameter.radiusType,
          };
        });
      return parameters;
    });
}
