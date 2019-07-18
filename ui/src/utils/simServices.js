import flatten from 'lodash.flatten';

/**
 * Il faut scanner tout les éléments de nonSystemServiceGroupList > standardAndSemiGlobalCatalogServiceGroups > catalogService pour extraire les données du service
 */
export function getServiceData(offer, dependencyCode) {
  const groupServices = offer.initialOffer.nonSystemServiceGroupList.map(
    g => g.standardAndSemiGlobalCatalogServiceGroups
  );
  return flatten(groupServices).find(s => s.catalogService.code === dependencyCode);
}
export function initDataService(offer, selectedDataService, servicesInitialized) {
  let dataServiceRet = undefined;

  const initService = () => {
    const data = getServiceData(offer, '878');
    if (!data) return;
    let serviceParameters = [];
    if (data && data.catalogServiceParameters) {
      serviceParameters = data.catalogServiceParameters;
    }

    const containTestApn = serviceParameters.find(
      s => s.defaultValue.indexOf('testrnis.fr') !== -1
    );
    const isEditable = data.partyAccess || false;
    const isChecked = data && data.activatedByDefault && !containTestApn;

    const dataService = {
      checked: isChecked,
      editable: isEditable,
      apns: [],
      data: { ...data },
    };

    const apns = serviceParameters.map(p => {
      return {
        label: p.defaultValue,
        selectable: p.partyAccess,
        selected: p.setOnActivation,
        id: p.id,
      };
    });

    dataService.apns = apns;

    dataServiceRet = dataService;
  };

  if (!servicesInitialized) {
    if (selectedDataService) {
      dataServiceRet = selectedDataService;
    } else {
      initService();
    }
  } else {
    initService();
  }

  return dataServiceRet;
}
