import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import GetSimTypeOption from './GetSimTypeOption';

const mocks = { $i18n, $t };

const simType = {
  id: 76,
  iccid: '8933215898343692617',
  type: 'M2M sim antivol avec code pin',
  accessPoint: null,
};

describe('GetSimTypeOption.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    wrapper = mount(GetSimTypeOption, {
      propsData: { item: simType },
      mocks,
    });
  });

  it('lists data passed in props', () => {
    expect(wrapper.find('.simtype__name').text()).toContain(simType.type);
  });

  it('emits an event with the right data', () => {
    wrapper.find('input').trigger('click');
    expect(wrapper.emitted('update:defaultSelectedItem')).toContainEqual([simType]);
  });
});
