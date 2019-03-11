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

    expect(wrapper.html()).toMatchSnapshot();
  });
});
