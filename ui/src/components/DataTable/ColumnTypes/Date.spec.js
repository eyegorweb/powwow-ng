import { mount } from '@vue/test-utils';
import Date from './Date.vue';

describe('Date.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = mount(Date, {
    propsData: {
      format: {
        type: 'Date',
      },
      item: '15-09-2017',
    },
  });

  it('renders the date in the proper format', () => {
    expect(wrapper.find('div').text()).toBe('15/09/2017');
  });
});
