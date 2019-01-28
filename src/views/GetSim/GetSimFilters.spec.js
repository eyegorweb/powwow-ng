import { mount, shallowMount } from '@vue/test-utils';
import GetSimFilters from './GetSimFilters.vue';

import { $t } from '@/../tests-utils';

import { Store } from 'vuex-mock-store';

const store = new Store({
  getters: {
    currentFilters: {},
    canShowSelectedFilter: false,
    selectedOrderDate: null,
  },
});

afterEach(() => store.reset());

const mocks = { $t, $store: store };

jest.mock('flatpickr/dist/flatpickr.min.css', () => {});

describe('GetSimFilters', () => {
  it('should show all filters', () => {
    const expectedFilters = [
      'filters.partners',
      'filters.billingAccounts',
      'filters.orderStatus',
      'filters.orderReference',
      'filters.orderDate',
      'filters.offers',
      'filters.quantity',
      'filters.customFields',
      'filters.orderCreator',
      'filters.active',
      'filters.deliveryCountry',
      'filters.postalCode',
      'filters.city',
    ];
    const wrapper = mount(GetSimFilters, { mocks });
    const renderedTitles = wrapper.findAll('.title');
    for (let i = 0, max = expectedFilters.length; i < max; i++) {
      expect(renderedTitles.at(i).text()).toBe(expectedFilters[i]);
    }
  });

  it('sets a date range when picking two values', () => {
    const wrapper = shallowMount(GetSimFilters, { mocks });
    wrapper.vm.startDate = 'start';
    expect(store.commit).not.toHaveBeenCalled();
    wrapper.vm.endDate = 'end';
    expect(store.commit).toHaveBeenLastCalledWith('setOrderDateFilter', {
      startDate: 'start',
      endDate: 'end',
    });
  });

  it('gives priority to store values for orderDate', () => {
    const wrapper = shallowMount(GetSimFilters, { mocks });
    wrapper.vm.startDate = 'start';
    expect(wrapper.vm.startDate).toBe('start');
    store.getters.selectedOrderDate = { startDate: 's2', endDate: 'e2' };
    wrapper.vm.endDate = 'end';
    // le commit n'a pas d'effet, du coup c'est la valeur du store qui est retunue
    expect(wrapper.vm.startDate).toBe('s2');
    expect(wrapper.vm.endDate).toBe('e2');
  });
});
