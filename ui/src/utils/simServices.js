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
        code: p.serviceParameter.code,
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

export function isBarrinServiceEnabled(catalogOffer, code) {
  const data = getServiceData(catalogOffer, code);
  return {
    checked: !data,
    editable: data ? data.partyAccess : false,
    data,
  };
}

export function isNormalServiceEnabled(catalogOffer, code) {
  const data = getServiceData(catalogOffer, code);
  return {
    checked: !!data,
    editable: data ? data.partyAccess : false,
    data,
  };
}

export const barringServices = [
  {
    name: 'VOIX_ENTRANTE',
    code: '2175',
  },
  {
    name: 'VOIX_SORTANTE',
    code: '2023',
  },
  {
    name: 'SMS_ENTRANT',
    code: '2171',
  },
  {
    name: 'SMS_SORTANT',
    code: '2174',
  },
  {
    name: 'NUMERO_DATA_CSD',
    code: '2188',
  },
  {
    name: 'DATA_CSD_ENTRANTE',
    code: '2172',
  },
  {
    name: 'DATA_CSD_SORTANTE',
    code: '2173',
  },
];

export const normalServices = [
  {
    name: 'ROAMING',
    code: '77',
  },
];
