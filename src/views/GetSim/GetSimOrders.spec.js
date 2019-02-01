import { mount, createLocalVue } from '@vue/test-utils';
import GetSimOrders from './GetSimOrders';
import * as api from '@/api/orders';

import { $t } from '@/../tests-utils';

import VueRouter from 'vue-router';

import { Store } from 'vuex-mock-store';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

const store = new Store({
  getters: { appliedFilters: [] },
});

const mocks = {
  $t,
  $store: store,
};

afterEach(() => store.reset());

describe('GetSimOrders', () => {
  it('shows datatable with fetched orders', async () => {
    const data = {
      total: 1,
      items: [
        {
          id: 1234,
          orderDate: '11/11/2018',
          activationAsked: true,
        },
      ],
    };

    api.searchOrders = jest.fn();
    api.searchOrders.mockResolvedValue(data);

    const wrapper = mount(GetSimOrders, {
      mocks,
      localVue,
      router,
    });

    // Attendre les retours des appels API et des imports asynchronnes (DataTableColumnTypeSWitcher)
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain('1234');
    expect(wrapper.html()).toContain('11/11/2018');
  });
});
