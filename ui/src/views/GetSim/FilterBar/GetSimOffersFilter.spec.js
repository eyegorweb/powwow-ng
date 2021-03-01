import { mount } from '@vue/test-utils';

import * as api from '@/api/offers';

import { Store } from 'vuex-mock-store';
import { $t } from '@/../tests-utils';

import GetSimOffersFilter from './GetSimOffersFilter';

const store = new Store({
  state: { getsim: {} },

  getters: {
    selectedOffersValues: [],
    selectedPartnersValues: [
      {
        id: 'id_partner_1',
      },
    ],
  },
});

afterEach(() => store.reset());

const mocks = { $t, $store: store };

describe.skip('GetSimOffersFilter', () => {
  it('fetches billing accounts when component is mounted', () => {
    const offersData = [
      {
        label: 'Circum',
        id: 19,
      },
      {
        label: 'Xylar',
        id: 20,
      },
    ];
    api.fetchOffers = jest.fn();
    api.fetchOffers.mockResolvedValue(offersData);

    mount(GetSimOffersFilter, { mocks });

    expect(api.fetchOffers).toHaveBeenCalled();
  });
});
