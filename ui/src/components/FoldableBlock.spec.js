import { mount } from '@vue/test-utils';
import FoldableBlock from './FoldableBlock';

describe('FoldableBlock', () => {
  it('is closed by default', () => {
    const wrapper = mount(FoldableBlock, {
      propsData: {
        title: 'Some block',
        draggable: true,
      },
    });

    expect(wrapper.html()).toContain('Some block');
    expect(wrapper.find('.handle').exists()).toBe(true);
  });
});
