import { mount } from '@vue/test-utils';
import GetSimOrders from './GetSimOrders';
import * as api from '@/api/orders';

import { $t } from '@/../tests-utils';

const mocks = { $t };

describe('GetSimOrders', () => {
  it('shows datatable with fetched orders', async () => {
    const data = {
      total: 1,
      items: [
        {
          id: 1234,
          creationDate: '11/11/2018',
          orderDate: '12/11/2018',
          activationAsked: true,
        },
      ],
    };

    api.searchOrders = jest.fn();
    api.searchOrders.mockResolvedValue(data);

    const wrapper = mount(GetSimOrders, { mocks });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain('1234');
    expect(wrapper.html()).toContain('11/11/2018');
    expect(wrapper.html()).toContain('12/11/2018');
  });
});
