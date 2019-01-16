import { mount } from '@vue/test-utils';
import GetSimPartnersFilter from './GetSimPartnersFilter';
import * as api from '@/api/partners';
import { Store } from 'vuex-mock-store';

import { $t } from '@/../tests-utils';

const store = new Store({
  getters: { selectedPartnersValues: [] },
});

afterEach(() => store.reset());

const mocks = { $t, $store: store };

describe('GetSimPartnersFilter', () => {
  it('fetches partners when component is mounted', () => {
    const partnersData = [
      {
        label: 'Circum',
        id: 19,
      },
      {
        label: 'Xylar',
        id: 20,
      },
    ];
    api.fetchpartners = jest.fn();
    api.fetchpartners.mockResolvedValue(partnersData);

    mount(GetSimPartnersFilter, { mocks });

    expect(api.fetchpartners).toHaveBeenCalled();
  });

  it('searches for new values from api', async () => {
    const partnersData = [
      {
        id: 1,
        name: 'wistiti le lion',
      },
    ];
    api.fetchpartners = jest.fn();
    api.fetchpartners.mockResolvedValue(partnersData);

    const wrapper = mount(GetSimPartnersFilter, { mocks });

    await wrapper.vm.searchValueChanged('wistiti');

    expect(wrapper.vm.partners).toEqual([
      {
        id: 1,
        label: 'wistiti le lion',
      },
    ]);

    expect(api.fetchpartners).toHaveBeenCalledWith('wistiti', { limit: 10, page: 0 });
  });

  it('adds next page content to current content', async () => {
    const partnersData = [
      {
        id: 1,
        name: 'wistiti le lion',
      },
    ];
    const partnersData2 = [
      {
        id: 2,
        name: 'wistiti le chien',
      },
    ];
    api.fetchpartners = jest.fn();
    api.fetchpartners.mockResolvedValue(partnersData);

    const wrapper = mount(GetSimPartnersFilter, { mocks });

    await wrapper.vm.searchValueChanged('wistiti');
    api.fetchpartners.mockResolvedValue(partnersData2);

    await wrapper.vm.nextPage();

    expect(wrapper.vm.page).toEqual(1);

    expect(wrapper.vm.partners).toEqual([
      { id: 1, label: 'wistiti le lion' },
      { id: 2, label: 'wistiti le chien' },
    ]);
  });
});
