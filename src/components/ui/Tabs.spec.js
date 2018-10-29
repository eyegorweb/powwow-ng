import { mount } from '@vue/test-utils';
import Tabs from './Tabs';

const tabs = [{ label: 'First' }, { label: 'Second' }, { label: 'Third' }];

describe('Tabs.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Tabs, {
      propsData: { tabs },
    });
  });

  it('displays no content by default', () => {
    expect(wrapper.find('.tab-content').text()).toBe('');
  });

  it('starts at index 0 by default', () => {
    expect(wrapper.find('.tab-label').is('.is-selected')).toBe(true);
    expect(
      wrapper
        .findAll('.tab-label')
        .at(1)
        .is('.is-selected')
    ).toBe(false);
  });

  it('changes the index by clicking on a tab', () => {
    const tabs = wrapper.findAll('.tab-label');
    tabs.at(1).trigger('click');
    expect(tabs.at(0).is('.is-selected')).toBe(false);
    expect(
      wrapper
        .findAll('.tab-label')
        .at(1)
        .is('.is-selected')
    ).toBe(true);
  });

  it('can customize tab label content', () => {
    wrapper = mount(Tabs, {
      propsData: { tabs },
      scopedSlots: {
        default: `<button class="custom" :key="props.id">{{ props.tab.label }}</button>`,
      },
    });

    expect(wrapper.findAll('button.custom')).toHaveLength(3);
    expect(wrapper.text()).toBe('FirstSecondThird');
  });
});
