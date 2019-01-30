import { mount, shallowMount } from '@vue/test-utils';
import GetSimFilters from './GetSimFilters.vue';

import { $t } from '@/../tests-utils';

import { Store } from 'vuex-mock-store';

jest.mock('daterangepicker/daterangepicker.js', () => {});
jest.mock('daterangepicker/daterangepicker.css', () => {});

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
});
