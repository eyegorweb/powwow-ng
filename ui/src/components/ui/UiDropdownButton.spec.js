import { mount } from '@vue/test-utils';
import UiDropdownButton from './UiDropdownButton.vue';

describe('UiDropdownButton.vue', () => {
  it('toggles the dropdown', async () => {
    const wrapper = mount(UiDropdownButton);
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
    await wrapper.find('.dropdown-toggle').trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);
    await wrapper.find('.dropdown-toggle').trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
  });

  it('can be hidden', async () => {
    const wrapper = mount(UiDropdownButton);
    await wrapper.find('.dropdown-toggle').trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);
    await wrapper.vm.hide();
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
  });

  it('can customise the button', async () => {
    const wrapper = mount(UiDropdownButton, {
      scopedSlots: {
        trigger: `<div :class="props.staticClass" @click.stop="props.toggle">{{ props.isOpen }}</div>`,
      },
    });
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
    expect(wrapper.find('.dropdown-toggle').text()).toBe('false');
    await wrapper.find('.dropdown-toggle').trigger('click');
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
