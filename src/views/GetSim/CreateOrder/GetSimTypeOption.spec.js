import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import GetSimTypeOption from './GetSimTypeOption';

const mocks = { $i18n, $t };

const simType = {
  id: '02',
  name: 'SIM M2M Endurcie 075',
  format: 'Standard, sans PIN',
  patent: 'Backup FR',
  lastCommand: '12/01/2018',
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
    expect(wrapper.find('.simtype__name').text()).toContain(simType.name);
    expect(wrapper.find('.simtype__format').text()).toContain(simType.format);
    expect(wrapper.find('.simtype__functions').text()).toContain(simType.patent);
    expect(wrapper.find('.simtype__order-status').text()).toContain(simType.lastCommand);
  });

  it('emits an event with the right data', () => {
    wrapper.find('input').trigger('click');
    expect(wrapper.emitted('update:defaultSelectedItem')).toContainEqual([simType]);
  });
});
