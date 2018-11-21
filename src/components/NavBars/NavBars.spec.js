import { shallowMount } from '@vue/test-utils';
import NavBars from '@/components/NavBars/index.vue';
import NavBarBackoffice from '@/components/NavBars/NavBarBackoffice.vue';
import NavBar from '@/components/NavBars/NavBar.vue';

describe('NavBars.vue', () => {
  it('renders backofficenavbar for bo users', () => {
    /** @type {import('@vue/test-utils').Wrapper} */
    const wrapper = shallowMount(NavBars, {
      propsData: { isBackofficeProfile: true },
    });
    expect(wrapper.find(NavBarBackoffice).exists()).toBe(true);
  });
});

describe('NavBar.vue', () => {
  it('displays client and corporate logos for non bo users', () => {
    const $route = {
      path: '/some/path',
    };
    /** @type {import('@vue/test-utils').Wrapper} */
    const wrapper = shallowMount(NavBar, {
      propsData: { isBackofficeProfile: false },
      mocks: {
        $route,
      },
    });
    expect(wrapper.findAll('.logo').length).toBe(2);
  });

  it('does not display any logo for bo users', () => {
    const $route = {
      path: '/some/path',
    };
    /** @type {import('@vue/test-utils').Wrapper} */
    const wrapper = shallowMount(NavBar, {
      propsData: { isBackofficeProfile: true },
      mocks: {
        $route,
      },
    });
    expect(wrapper.findAll('.logo').length).toBe(0);
  });
});
