import { shallowMount } from '@vue/test-utils';
import ExportButtonModals from './ExportButtonModals';
import { $t } from '@/../tests-utils';
import { Store } from 'vuex-mock-store';

describe('ExportButtonModals', () => {
  const storeParams = {
    state: {
      ui: {
        isExportFormatChoiceOpen: true,
        exportPanelParams: {
          exportChoices: undefined,
          exportFn: jest.fn(),
        },
        exportNumberLines: {},
      },
    },
    getters: {
      havePermission: () => {
        return false;
      },
      appliedFilters: [],
      userIsBO: true,
      userIsPartner: false,
      userIsGroupPartner: false,
      userIsOperator: false,
      userIsMVNO: false,
    },
    mutations: {
      closeExportChoice: jest.fn(),
      flashMessage: jest.fn(),
      closeAndResetExportChoice: jest.fn(),
      startDownload: jest.fn(),
    },
  };
  const store = new Store(storeParams);

  afterEach(() => {
    store.reset();
  });

  storeParams.state.ui.exportPanelParams.exportFn.mockImplementation(() => {
    return { downloadUri: 'AZERTY' };
  });

  it(`Ne pas pouvoir exporter si il y a un choix d'export et qu'aucun choix n'est fait`, async () => {
    storeParams.state.ui.exportPanelParams.exportChoices = [
      {
        id: 'CLASSIC',
        label: 'exportTable.classic',
      },
      {
        id: 'FULL',
        label: 'exportTable.complete',
      },
    ];
    store.reset();

    const wrapper = shallowMount(ExportButtonModals, {
      mocks: { $t, $store: store },
    });

    await wrapper.find('.export-csv-format').trigger('click');

    expect(storeParams.state.ui.exportPanelParams.exportFn).not.toHaveBeenCalled();

    storeParams.state.ui.exportPanelParams.exportChoices = undefined;
  });

  it(`Remise à zero du composant après la fermeture de la fenetre d'export `, async () => {
    storeParams.state.ui.exportPanelParams.exportChoices = [
      {
        id: 'CLASSIC',
        label: 'exportTable.classic',
      },
      {
        id: 'FULL',
        label: 'exportTable.complete',
      },
    ];
    store.reset();

    const wrapper = shallowMount(ExportButtonModals, {
      mocks: { $t, $store: store },
    });

    await wrapper.setData({
      exportChoice: 'CLASSIC',
    });

    await wrapper.find('.export-csv-format').trigger('click');
    expect(storeParams.state.ui.exportPanelParams.exportFn).toHaveBeenCalled();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.exportChoice).toBeUndefined();
  });
});
