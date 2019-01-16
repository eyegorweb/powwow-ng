import { mount, createLocalVue } from '@vue/test-utils';
import Link from './Link.vue';

import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('Link.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = mount(Link, {
    propsData: {
      format: {
        type: 'Link',
        getUrl(id) {
          return `detail/${id}`;
        },
      },
      item: '100',
    },
    localVue,
    router,
  });

  it('render a link corresponding to data passed as props', () => {
    expect(wrapper.find('a').attributes('href')).toContain('detail/100');
  });
});
