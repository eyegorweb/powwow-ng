import { mount } from '@vue/test-utils';
import * as api from '@/api/offers';

import { Store } from 'vuex-mock-store';
import { $t } from '@/../tests-utils';

import GetSimOffersFilter from './GetSimOffersFilter';

const store = new Store({
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

describe('GetSimOffersFilter', () => {
  it('fetches offers when component is mounted', () => {
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

  it('searches for new values from api with selected partners', async () => {
    const offersData = [
      {
        id: 1,
        label: 'wistiti le lion',
      },
    ];
    api.fetchOffers = jest.fn();
    api.fetchOffers.mockResolvedValue(offersData);

    const wrapper = mount(GetSimOffersFilter, { mocks });

    await wrapper.vm.searchValueChanged('wistiti');

    expect(wrapper.vm.offers).toEqual([
      {
        id: 1,
        label: 'wistiti le lion',
      },
    ]);

    expect(api.fetchOffers).toHaveBeenCalledWith(
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
    const offersData = [
      {
        id: 1,
        label: 'offre 1',
      },
    ];
    const offerData2 = [
      {
        id: 2,
        label: 'offre 2',
      },
    ];
    api.fetchOffers = jest.fn();
    api.fetchOffers.mockResolvedValue(offersData);

    const wrapper = mount(GetSimOffersFilter, { mocks });

    await wrapper.vm.searchValueChanged('wistiti');
    api.fetchOffers.mockResolvedValue(offerData2);

    await wrapper.vm.nextPage();

    expect(wrapper.vm.page).toEqual(2);

    expect(wrapper.vm.offers).toEqual([{ id: 1, label: 'offre 1' }, { id: 2, label: 'offre 2' }]);
  });
});
