import { mount } from '@vue/test-utils';
import GetSimFilters from './GetSimFilters.vue';

import { $t } from '@/../tests-utils';

import { Store } from 'vuex-mock-store';
import { fetchOrderStatuses } from '@/api/orderStatuses';

jest.mock('@/api/orderStatuses', () => ({
  fetchOrderStatuses: jest.fn(),
}));

jest.mock('daterangepicker/daterangepicker.js', () => {});
jest.mock('daterangepicker/daterangepicker.css', () => {});

const store = new Store({
  state: {
    getsim: {},
  },
  getters: {
    'getsim/currentFilters': [],
    'getsim/canShowSelectedFilter': false,
    'getsim/selectedOrderDate': null,
    'getsim/selectedPartnersValues': undefined,
    'getsim/selectedOrderCreatorValues': undefined,
    'getsim/selectedOrderStatus': undefined,
    userIsPartner: false,
    userInfos: {},
    userIsMVNO: false,
  },
});

afterEach(() => store.reset());

const mocks = { $t, $store: store };

jest.mock('flatpickr/dist/flatpickr.min.css', () => {});

describe('GetSimFilters', () => {
  it('should show all filters', () => {
    const expectedFilters = [
      'savedFilters',
      'filters.partners',
      'filters.billingAccounts',
      'filters.orderStatus',
      'filters.lines.typeSIMCard',
      'filters.orderDate',
      'filters.offers',
      'filters.quantity',
      'filters.customFields',
      'filters.orderCreator',
      'filters.deliveryCountry',
      'filters.postalCode',
      'filters.city',
      'filters.action',
    ];
    const wrapper = mount(GetSimFilters, { mocks });
    const renderedTitles = wrapper.findAll('.foldable-block .title');

    for (let i = 0, max = expectedFilters.length; i < max; i++) {
      expect(renderedTitles.at(i).text()).toBe(expectedFilters[i]);
    }
  });
});
