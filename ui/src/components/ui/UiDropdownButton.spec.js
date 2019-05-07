import { mount } from '@vue/test-utils';
import UiDropdownButton from './UiDropdownButton.vue';

describe('UiDropdownButton.vue', () => {
  it('toggles the dropdown', () => {
    const wrapper = mount(UiDropdownButton);
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
    wrapper.find('.dropdown-toggle').trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);
    wrapper.find('.dropdown-toggle').trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
  });

  it('can be hidden', () => {
    const wrapper = mount(UiDropdownButton);
    wrapper.find('.dropdown-toggle').trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);
    wrapper.vm.hide();
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
  });

  it('can customise the button', () => {
    const wrapper = mount(UiDropdownButton, {
      scopedSlots: {
        trigger: `<div :class="props.staticClass" @click.stop="props.toggle">{{ props.isOpen }}</div>`,
      },
    });
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
    expect(wrapper.find('.dropdown-toggle').text()).toBe('false');
    wrapper.find('.dropdown-toggle').trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);
    expect(wrapper.find('.dropdown-toggle').text()).toBe('true');
  });

  it('can append content', () => {
    const wrapper = mount(UiDropdownButton, {
      scopedSlots: {
        append: `<div>appended</div>`,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
