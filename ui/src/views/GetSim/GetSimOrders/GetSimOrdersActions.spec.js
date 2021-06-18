import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import GetSimOrdersActions from './GetSimOrdersActions';
import { Store } from 'vuex-mock-store';

describe('GetSimOrdersActions.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  const store = new Store({
    getters: {
      userIsBO: false,
      havePermission: () => {
        return true;
      },
    },
    mutations: {
      openExportChoice: jest.fn(),
      openPanel: jest.fn(),
      refreshIndicators: jest.fn(),
    },
  });

  it('shows actions for status = NOT_VALIDATED', () => {
    const order = {
      status: 'NOT_VALIDATED',
    };
    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks: { $i18n, $t, $store: store },
    });
    wrapper.find('button').trigger('click');

    expect(wrapper.vm.actions).toHaveLength(4);
    expect(wrapper.vm.actions).toEqual(
      expect.arrayContaining([
        'getsim.actions.DETAIL',
        'getsim.actions.CANCEL',
        'getsim.actions.VALIDATE',
        'getsim.actions.DUPLICATE',
      ])
    );
  });

  it('shows actions for status = VALIDATED', () => {
    const order = {
      status: 'VALIDATED',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks: { $i18n, $t, $store: store },
    });

    wrapper.find('button').trigger('click');

    expect(wrapper.vm.actions).toHaveLength(2);
    expect(wrapper.vm.actions).toEqual(
      expect.arrayContaining(['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE'])
    );
  });

  it('shows actions for status = CONFIRMATION_IN_PROGRESS', () => {
    const order = {
      status: 'CONFIRMATION_IN_PROGRESS',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks: { $i18n, $t, $store: store },
    });

    wrapper.find('button').trigger('click');

    expect(wrapper.vm.actions).toHaveLength(2);

    expect(wrapper.vm.actions).toHaveLength(2);
    expect(wrapper.vm.actions).toEqual(
      expect.arrayContaining(['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE'])
    );
  });

  it('shows actions for status = CONFIRMED', () => {
    const order = {
      status: 'CONFIRMED',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks: { $i18n, $t, $store: store },
    });

    wrapper.find('button').trigger('click');

    expect(wrapper.vm.actions).toHaveLength(3);
    expect(wrapper.vm.actions).toEqual(
      expect.arrayContaining([
        'getsim.actions.DETAIL',
        'getsim.actions.DUPLICATE',
        'getsim.actions.SHOW_SIM',
      ])
    );
  });

  it('shows actions for status = CANCELED', () => {
    const order = {
      status: 'CANCELED',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks: { $i18n, $t, $store: store },
    });

    wrapper.find('button').trigger('click');

    expect(wrapper.vm.actions).toHaveLength(2);
    expect(wrapper.vm.actions).toEqual(
      expect.arrayContaining(['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE'])
    );
  });

  it('shows actions for status = TERMINATED', () => {
    const order = {
      status: 'TERMINATED',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks: { $i18n, $t, $store: store },
    });

    wrapper.find('button').trigger('click');

    expect(wrapper.vm.actions).toHaveLength(4);
    expect(wrapper.vm.actions).toEqual(
      expect.arrayContaining([
        'getsim.actions.DETAIL',
        'getsim.actions.DUPLICATE',
        'getsim.actions.EXPORT',
        'getsim.actions.SHOW_SIM',
      ])
    );
  });
});
