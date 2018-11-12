import { mount } from '@vue/test-utils';
import SelectedFilters from './SelectedFilters.vue';

describe('filters/SelectedFilters', () => {
  it('Should show selected filters values', () => {
    const currentFilters = [
      {
        name: 'partners',
        values: [
          {
            code: 'c1',
            label: 'partner1',
          },
          {
            code: 'c2',
            label: 'partner2',
          },
        ],
      },
    ];

    /** @type {import('@vue/test-utils').Wrapper} */
    const wrapper = mount(SelectedFilters, {
      propsData: {
        currentFilters,
      },
    });

    const details = wrapper.findAll('.detail');

    expect(wrapper.findAll('.alert')).toHaveLength(1);
    expect(wrapper.find('.alert a').text()).toContain('partners');
    expect(details).toHaveLength(2);
    expect(details.at(0).text()).toContain('partner1');
    expect(details.at(1).text()).toContain('partner2');
  });
});
