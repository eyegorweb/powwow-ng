import { shallowMount } from '@vue/test-utils';
import LinesTable from './index.vue';

import { Store } from 'vuex-mock-store';
import { $t } from '@/../tests-utils';

describe(`LinesTable : Options d'export`, () => {
  const storeParams = {
    state: {
      actLines: {
        limitPerPage: 5,
        apiError: undefined,
      },
    },
    getters: {
      'actLines/linePage': 1,
      'actLines/linesActionsResponse': undefined,
      'actLines/appliedFilters': [],
      'actLines/isLoading': false,
      limitPerPage: false,
      userIsBO: false,
      apiError: false,
      userIsPartner: false,
      userInfos: false,
      userName: false,
      singlePartner: {
        id: 999,
      },
      havePermission: jest.fn(),
      userIsOperator: false,
      userIsByCustomerAccount: false,
      isOpen: false,
      nextPage: false,
    },
    mutations: {
      setPage: jest.fn(),
      applyFilters: jest.fn(),
      forceAppliedFilters: jest.fn(),
      setPageLimit: jest.fn(),
      startSearchingById: jest.fn(),
      openPanel: jest.fn(),
    },
  };
  const store = new Store(storeParams);

  afterEach(() => {
    store.reset();
  });

  const wrapper = shallowMount(LinesTable, {
    mocks: { $t, $store: store },
  });

  it(`Export last usage si l'utilisateur a le droit`, () => {
    storeParams.getters.havePermission.mockReturnValueOnce(true);
    expect(wrapper.vm.exportChoices).toEqual(
      expect.arrayContaining([
        { id: 'CLASSIC', label: 'exportTable.classic', disabled: false },
        { id: 'FULL', label: 'exportTable.complete', disabled: false },
        { id: 'CONSUMPTION', label: 'exportTable.inProgress', disabled: true },
      ])
    );
  });

  it(`pas d'export "Export last usage" si l'utilisateur n'a pas la permission`, () => {
    storeParams.getters.havePermission.mockReturnValueOnce(false);
    expect(wrapper.vm.exportChoices).toEqual(
      expect.arrayContaining([
        { id: 'CLASSIC', label: 'exportTable.classic', disabled: false },
        { id: 'FULL', label: 'exportTable.complete', disabled: false },
      ])
    );
  });

  it(`Voir l'export de services si l'utilisateur a la permission`, () => {
    storeParams.getters.havePermission.mockImplementation((domain, action) => {
      if (domain === 'getParc' && action === 'export_service') return true;
      return false;
    });
    expect(wrapper.vm.otherExportChoices).toEqual(
      expect.arrayContaining([
        {
          id: 'SERVICES',
          label: 'exportTable.services',
        },
      ])
    );
  });

  it(`Voir l'export BO si l'utilisateur a la permission`, () => {
    storeParams.getters.havePermission.mockImplementation((domain, action) => {
      if (domain === 'getParc' && action === 'export_bo') return true;
      return false;
    });
    expect(wrapper.vm.otherExportChoices).toEqual(
      expect.arrayContaining([
        {
          id: 'BACKOFFICE',
          label: 'exportTable.BO',
        },
      ])
    );
  });

  it(`Ne pas voir les exports non permit`, () => {
    storeParams.getters.havePermission.mockReturnValue(false);
    expect(wrapper.vm.otherExportChoices).not.toEqual(
      expect.arrayContaining([
        {
          id: 'SERVICES',
          label: 'exportTable.services',
        },
      ])
    );
    expect(wrapper.vm.otherExportChoices).not.toEqual(
      expect.arrayContaining([
        {
          id: 'BACKOFFICE',
          label: 'exportTable.BO',
        },
      ])
    );
  });

  it(`Pas d'erreurs dans les boutons d'export si les filtres sont bons `, () => {
    storeParams.getters['actLines/appliedFilters'] = [
      {
        id: 'filters.partners',
        values: [
          {
            partyType: 'PARTNER',
          },
        ],
      },
      {
        id: 'filters.lines.SIMCardStatus',
        values: [
          {
            id: 'ACTIVATED',
          },
        ],
      },
    ];
    store.reset();
    const ret = wrapper.vm.getExportChoiceDisabledMessage('exportTable.services');
    expect(ret).toBe(false);
  });

  describe(`Message d'erreurs durant l'export `, () => {
    it(`Message d'erreur si le partenaire est MVNO`, () => {
      storeParams.getters['actLines/appliedFilters'] = [
        {
          id: 'filters.partners',
          values: [
            {
              partyType: 'MVNO',
            },
          ],
        },
        {
          id: 'filters.lines.SIMCardStatus',
          values: [
            {
              id: 'ACTIVATED',
            },
          ],
        },
      ];
      store.reset();
      const ret = wrapper.vm.getExportChoiceDisabledMessage('exportTable.services');
      expect(ret).toContain('getparc.actCreation.rechargeLV.partnerExportError');
    });
    it(`Message d'erreur si le filtre status n'est pas bon`, () => {
      storeParams.getters['actLines/appliedFilters'] = [
        {
          id: 'filters.partners',
          values: [
            {
              partyType: 'PARTNER',
            },
          ],
        },
        {
          id: 'filters.lines.SIMCardStatus',
          values: [{ id: 'ACTIVATION_IN_PROGRESS', label: 'Activation en cours' }],
        },
      ];
      store.reset();
      const ret = wrapper.vm.getExportChoiceDisabledMessage('exportTable.services');
      expect(ret).toContain('getparc.actCreation.rechargeLV.simStatusError');
    });
  });
});
