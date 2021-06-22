import { shallowMount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import NavBars from '@/components/NavBars/index.vue';
import NavBarBackoffice from '@/components/NavBars/NavBarBackoffice.vue';

const $route = {
  path: '/some/path',
};
const mocks = { $i18n, $t, $route };

describe('NavBars.vue', () => {
  it('renders backofficenavbar for bo users', () => {
    /** @type {import('@vue/test-utils').Wrapper} */
    const wrapper = shallowMount(NavBars, {
      propsData: { isBackofficeProfile: true },
      mocks,
    });
    expect(wrapper.find(NavBarBackoffice).exists()).toBe(true);
  });
});
