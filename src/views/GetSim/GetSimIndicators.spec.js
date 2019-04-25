import { mount } from '@vue/test-utils';
import GetSimIndicators from './GetSimIndicators';
import * as api from '@/api/indicators';

import { $t } from '@/../tests-utils';

const mocks = { $t };

describe('GetSimIndicators', () => {
  it('fetches indicators', async () => {
    const indicators = {
      averageProcessingTime: 0,
    };

    api.fetchIndicators = jest.fn();
    api.fetchIndicators.mockResolvedValue(indicators);

    const wrapper = mount(GetSimIndicators, { mocks });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(api.fetchIndicators).toHaveBeenCalled();

    expect(wrapper.html()).toMatchSnapshot();
  });
});
