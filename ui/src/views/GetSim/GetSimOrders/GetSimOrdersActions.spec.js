import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import GetSimOrdersActions from './GetSimOrdersActions';

const mocks = { $i18n, $t };

describe('GetSimOrdersActions.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */

  it('shows actions for status = NOT_VALIDATED', () => {
    const order = {
      status: 'NOT_VALIDATED',
    };
    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks,
    });
    wrapper.find('button').trigger('click');

    const visibleActions = wrapper.findAll('.order-action');
    expect(visibleActions).toHaveLength(4);
    expect(visibleActions.at(0).text()).toEqual('getsim.actions.DETAIL');
    expect(visibleActions.at(1).text()).toEqual('getsim.actions.DUPLICATE');
    expect(visibleActions.at(2).text()).toEqual('getsim.actions.CANCEL');
    expect(visibleActions.at(3).text()).toEqual('getsim.actions.VALIDATE');
  });

  it('shows actions for status = VALIDATED', () => {
    const order = {
      status: 'VALIDATED',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks,
    });

    wrapper.find('button').trigger('click');

    const visibleActions = wrapper.findAll('.order-action');

    expect(visibleActions).toHaveLength(3);
    expect(visibleActions.at(0).text()).toEqual('getsim.actions.DETAIL');
    expect(visibleActions.at(1).text()).toEqual('getsim.actions.DUPLICATE');
    expect(visibleActions.at(2).text()).toEqual('getsim.actions.CANCEL');
  });

  it('shows actions for status = CONFIRMATION_IN_PROGRESS', () => {
    const order = {
      status: 'CONFIRMATION_IN_PROGRESS',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks,
    });

    wrapper.find('button').trigger('click');

    const visibleActions = wrapper.findAll('.order-action');

    expect(visibleActions).toHaveLength(2);
    expect(visibleActions.at(0).text()).toEqual('getsim.actions.DETAIL');
    expect(visibleActions.at(1).text()).toEqual('getsim.actions.DUPLICATE');
  });

  it('shows actions for status = CONFIRMED', () => {
    const order = {
      status: 'CONFIRMED',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks,
    });

    wrapper.find('button').trigger('click');

    const visibleActions = wrapper.findAll('.order-action');

    expect(visibleActions).toHaveLength(3);
    expect(visibleActions.at(0).text()).toEqual('getsim.actions.DETAIL');
    expect(visibleActions.at(1).text()).toEqual('getsim.actions.SHOW_SIM');
    expect(visibleActions.at(2).text()).toEqual('getsim.actions.DUPLICATE');
  });

  it('shows actions for status = CANCELED', () => {
    const order = {
      status: 'CANCELED',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks,
    });

    wrapper.find('button').trigger('click');

    const visibleActions = wrapper.findAll('.order-action');

    expect(visibleActions).toHaveLength(2);
    expect(visibleActions.at(0).text()).toEqual('getsim.actions.DETAIL');
    expect(visibleActions.at(1).text()).toEqual('getsim.actions.DUPLICATE');
  });

  it('shows actions for status = TERMINATED', () => {
    const order = {
      status: 'TERMINATED',
    };

    const wrapper = mount(GetSimOrdersActions, {
      propsData: { order },
      mocks,
    });

    wrapper.find('button').trigger('click');

    const visibleActions = wrapper.findAll('.order-action');

    expect(visibleActions).toHaveLength(4);
    expect(visibleActions.at(0).text()).toEqual('getsim.actions.DETAIL');
    expect(visibleActions.at(1).text()).toEqual('getsim.actions.EXPORT');
    expect(visibleActions.at(2).text()).toEqual('getsim.actions.SHOW_SIM');
    expect(visibleActions.at(3).text()).toEqual('getsim.actions.DUPLICATE');
  });
});
