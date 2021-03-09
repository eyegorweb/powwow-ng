import { shallowMount } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';
import { $t } from '@/../tests-utils';

import { when } from 'jest-when';

jest.mock('./filters/DateRangeFilter', () => {
  return {
    template: '<div>Date</div>',
  };
});

jest.mock('./filters/FileFilter', () => {
  return {
    template: '<div>FileFilter</div>',
  };
});

import MonitoringPage from './index.vue';

const defaultStoreParams = {
  getters: {
    userIsBO: true,
    userIsGroupAccount: true,
    userPartyGroup: false,
    userIsMultiPartner: false,
    userIsPartner: false,
    singlePartner: {},
    // havePermission: '',
  },
};

describe('Monitoring page', () => {
  it(`les toggle "Tout usage" et "Usage DATA" sont disponibles si l'utilisateur a la permission : getVision / read`, () => {
    // Given
    const havePermissionMock = jest.fn();
    when(havePermissionMock)
      .calledWith('getVision', 'read')
      .mockReturnValue(true);

    const store = new Store({
      getters: { ...defaultStoreParams.getters, havePermission: havePermissionMock },
    });

    const wrapper = shallowMount(MonitoringPage, {
      mocks: {
        $t,
        $store: store,
      },
      stubs: {
        FilterBar: { template: `<div>Filterbar</div>` },
      },
    });

    // When
    const toggleValuesToCheck = ['ALL', 'DATA'];
    const foundToggleValues = toggleValuesToCheck.filter(
      code => !!wrapper.vm.toggleValues.find(v => v.id === code)
    );

    // Then
    expect(foundToggleValues).toHaveLength(2);
  });

  it(`le "Cockpit M2M" est disponible si l'utilisateur a la permission : getVision / service_state`, () => {
    // Given
    const havePermissionMock = jest.fn();
    when(havePermissionMock)
      .calledWith('getVision', 'service_state')
      .mockReturnValue(true);

    const store = new Store({
      getters: { ...defaultStoreParams.getters, havePermission: havePermissionMock },
    });

    const wrapper = shallowMount(MonitoringPage, {
      mocks: {
        $t,
        $store: store,
      },
      stubs: {
        FilterBar: { template: `<div>Filterbar</div>` },
      },
    });

    // When
    const toggleValuesToCheck = ['COCKPIT'];
    const notFound = toggleValuesToCheck.filter(
      code => !!wrapper.vm.toggleValues.find(v => v.id === code)
    );

    // Then
    expect(notFound).toHaveLength(1);
  });
});
