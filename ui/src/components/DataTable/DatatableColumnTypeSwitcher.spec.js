import { mount } from '@vue/test-utils';
import DatatableColumnTypeSwitcher from './DataTableColumnTypeSwitcher.vue';

describe('DatatableColumnTypeSwitcher.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = mount(DatatableColumnTypeSwitcher, {
    propsData: {
      format: {
        type: 'Date',
      },
      item: '15-09-2017',
    },
  });

  it('renders the corresponding html element with the proper value', () => {
    expect(wrapper.find('div').text()).toBe('15/09/2017');
  });
});
