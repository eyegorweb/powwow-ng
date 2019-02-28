import { mount } from '@vue/test-utils';
import GetSimIndicators from './GetSimIndicators';
import * as api from '@/api/indicators';

import { $t } from '@/../tests-utils';

const mocks = { $t };

describe('GetSimIndicators', () => {
  it('fetches indicators', async () => {
    const indicators = {
      ordersToBeConfirmed: 2,
      ordersInProgress: 2,
      ordersNotConfirmed: 0,
      ordersFailed: 0,
      averageProcessingTime: 0,
      orderToBeConfirmedByBO: 0,
    };

    api.fetchGetSimIndicators = jest.fn();
    api.fetchGetSimIndicators.mockResolvedValue(indicators);

    const wrapper = mount(GetSimIndicators, { mocks });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(api.fetchGetSimIndicators).toHaveBeenCalled();

    const expectedSnapshot = `<ul class="list-group bg-white"><li class="list-group-item">indicators.averageProcessingTime
    <div class="float-right text-success">0</div></li> <li class="list-group-item">indicators.orderToBeConfirmedByBO
    <div class="float-right text-success">0</div></li> <li class="list-group-item">indicators.ordersFailed
    <div class="float-right text-danger">0</div></li> <li class="list-group-item">indicators.ordersInProgress
    <div class="float-right text-warning">2</div></li> <li class="list-group-item">indicators.ordersNotConfirmed
    <div class="float-right text-warning">0</div></li> <li class="list-group-item">indicators.ordersToBeConfirmed
    <div class="float-right text-warning">2</div></li></ul>`;

    expect(wrapper.html()).toEqual(expectedSnapshot);
  });
});
