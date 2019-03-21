import { mount } from '@vue/test-utils';

import * as api from '@/api/users';

import { Store } from 'vuex-mock-store';
import { $t } from '@/../tests-utils';

import GetSimOrderCreatorFilter from './GetSimOrderCreatorFilter';

const store = new Store({
  getters: {
    selectedOrderCreatorValues: [],
    selectedPartnersValues: [
      {
        id: 'id_partner_1',
      },
    ],
  },
});

afterEach(() => store.reset());

const mocks = { $t, $store: store };

describe('GetSimOrderCreatorFilter', () => {
  it('fetches order creators when component is mounted', () => {
    const creatorsData = [
      {
        label: 'Circum',
        id: 19,
      },
      {
        label: 'Xylar',
        id: 20,
      },
    ];
    api.fetchUsers = jest.fn();
    api.fetchUsers.mockResolvedValue(creatorsData);

    mount(GetSimOrderCreatorFilter, { mocks });

    expect(api.fetchUsers).toHaveBeenCalled();
  });

  it('searches for new values from api with selected partners', async () => {
    const creatorsData = [
      {
        id: 1,
        name: {
          firstName: 'wistiti',
          lastName: 'le lion',
        },
        party: {
          id: 1,
        },
      },
    ];
    api.fetchUsers = jest.fn();
    api.fetchUsers.mockResolvedValue(creatorsData);

    const wrapper = mount(GetSimOrderCreatorFilter, { mocks });

    await wrapper.vm.searchValueChanged('wistiti');

    expect(wrapper.vm.creators).toEqual([
      {
        id: 1,
        label: 'wistiti le lion',
        partnerId: 1,
      },
    ]);

    expect(api.fetchUsers).toHaveBeenCalledWith(
      'wistiti',
      [
        {
          id: 'id_partner_1',
        },
      ],
      { limit: 10, page: 0 }
    );
  });

  it('adds next page content to current content', async () => {
    const creatorsData = [
      {
        id: 1,
        name: {
          firstName: 'User',
          lastName: '1',
        },
        party: {
          id: 1,
        },
      },
    ];
    const offerData2 = [
      {
        id: 2,
        name: {
          firstName: 'User',
          lastName: '2',
        },
        party: {
          id: 1,
        },
      },
    ];
    api.fetchUsers = jest.fn();
    api.fetchUsers.mockResolvedValue(creatorsData);

    const wrapper = mount(GetSimOrderCreatorFilter, { mocks });

    await wrapper.vm.searchValueChanged('wistiti');
    api.fetchUsers.mockResolvedValue(offerData2);

    await wrapper.vm.nextPage();

    expect(wrapper.vm.page).toEqual(1);

    expect(wrapper.vm.creators).toEqual([
      { id: 1, label: 'User 1', partnerId: 1 },
      { id: 2, label: 'User 2', partnerId: 1 },
    ]);
  });
});
