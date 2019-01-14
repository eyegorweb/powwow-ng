import { mount } from '@vue/test-utils';

import * as api from '@/api/billingAccounts';

import { Store } from 'vuex-mock-store';
import { $t } from '@/../tests-utils';

import GetSimPartnersBillingAccountsFilter from './GetSimPartnersBillingAccountsFilter';

const store = new Store({
  getters: {
    selectedBillingAccountsValues: [],
    selectedPartnersValues: [
      {
        id: 'id_partner_1',
      },
    ],
  },
});

afterEach(() => store.reset());

const mocks = { $t, $store: store };

describe('GetSimPartnersBillingAccountsFilter', () => {
  it('fetches billing accounts when component is mounted', () => {
    const billingAccountsData = [
      {
        label: 'Circum',
        id: 19,
      },
      {
        label: 'Xylar',
        id: 20,
      },
    ];
    api.fetchBillingAccounts = jest.fn();
    api.fetchBillingAccounts.mockResolvedValue(billingAccountsData);

    mount(GetSimPartnersBillingAccountsFilter, { mocks });

    expect(api.fetchBillingAccounts).toHaveBeenCalled();
  });

  it('searches for new values from api with selected partners', async () => {
    const billingAccountsData = [
      {
        id: 1,
        label: 'wistiti le lion',
      },
    ];
    api.fetchBillingAccounts = jest.fn();
    api.fetchBillingAccounts.mockResolvedValue(billingAccountsData);

    const wrapper = mount(GetSimPartnersBillingAccountsFilter, { mocks });

    await wrapper.vm.searchValueChanged('wistiti');

    expect(wrapper.vm.billingAccounts).toEqual([
      {
        id: 1,
        label: 'wistiti le lion',
      },
    ]);

    expect(api.fetchBillingAccounts).toHaveBeenCalledWith(
      'wistiti',
      [
        {
          id: 'id_partner_1',
        },
      ],
      { limit: 50, page: 1 }
    );
  });

  it('adds next page content to current content', async () => {
    const billingAccountsData = [
      {
        id: 1,
        label: 'CF 1',
      },
    ];
    const offerData2 = [
      {
        id: 2,
        label: 'CF 2',
      },
    ];
    api.fetchBillingAccounts = jest.fn();
    api.fetchBillingAccounts.mockResolvedValue(billingAccountsData);

    const wrapper = mount(GetSimPartnersBillingAccountsFilter, { mocks });

    await wrapper.vm.searchValueChanged('wistiti');
    api.fetchBillingAccounts.mockResolvedValue(offerData2);

    await wrapper.vm.nextPage();

    expect(wrapper.vm.page).toEqual(2);

    expect(wrapper.vm.billingAccounts).toEqual([
      { id: 1, label: 'CF 1' },
      { id: 2, label: 'CF 2' },
    ]);
  });
});
