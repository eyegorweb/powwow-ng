import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import GetSimTypeOption from './GetSimTypeOption';

const mocks = { $i18n, $t };

const simType = {
  simCard: {
    id: '76',
    name: 'M2M sim avec code pin',
  },
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
    console.log(wrapper.html());
    expect(wrapper.find('.simtype__name').text()).toContain(simType.simCard.name);
  });

  it('emits an event with the right data', () => {
    wrapper.find('input').trigger('click');
    expect(wrapper.emitted('update:defaultSelectedItem')).toContainEqual([simType]);
  });
});
