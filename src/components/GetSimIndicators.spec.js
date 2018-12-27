import { mount } from '@vue/test-utils';
import GetSimIndicators from './GetSimIndicators';
import * as api from '@/api/indicators';

import { $t } from '@/../tests-utils';

const mocks = { $t };

describe('GetSimIndicators', () => {
  it('fetches indicators', async () => {
    const indicators = {
      ordersValidated: 5,
      ordersInProgress: 4,
      nonConfirmedOrders: 3,
      faillingOrders: 2,
      ordersToBeValidated: 1,
    };

    api.fetchGetSimIndicators = jest.fn();
    api.fetchGetSimIndicators.mockResolvedValue(indicators);

    const wrapper = mount(GetSimIndicators, { mocks });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(api.fetchGetSimIndicators).toHaveBeenCalled();

    const expectedSnapshot = `<ul class="list-group bg-white"><li class="list-group-item">indicators.ordersToValidate
    <div class="float-right text-danger">5</div></li> <li class="list-group-item">indicators.ordersInProgress
    <div class="float-right text-success">4</div></li> <li class="list-group-item">indicators.nonConfirmedOrders
    <div class="float-right text-warning">3</div></li> <li class="list-group-item">indicators.faillingOrders
    <div class="float-right text-warning">2</div></li> <li class="list-group-item">indicators.ordersToBeValidated
    <div class="float-right text-warning">1</div></li></ul>`;

    expect(wrapper.html()).toEqual(expectedSnapshot);
  });
});
