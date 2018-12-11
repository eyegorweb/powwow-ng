import { mount } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';
import Authentication from './Authentication.vue';
import * as utils from '@/utils';

process.env.VUE_APP_AUTH_SERVER_URL = 'http://localhost:4000';
process.env.VUE_APP_CLIENT_ID = 'nextgenui-implicit';

const store = new Store({
  state: { token: undefined },
  getters: { token: undefined, refreshingToken: undefined },
});

afterEach(() => store.reset());

describe('Authentication', () => {
  it('redirects to login page when no token is found', () => {
    const $route = {
      name: 'someRoute',
    };
    utils.redirectTo = jest.fn();

    mount(Authentication, {
      mocks: {
        $store: store,
        $route,
      },
    });

    expect(utils.redirectTo).toHaveBeenCalledWith(
      'http://localhost:4000/oauth/authorize?response_type=token&client_id=nextgenui-implicit&redirect_uri=http://localhost/callback'
    );
  });

  it('do not checks for token when current page is callback', () => {
    const $route = {
      name: 'callback',
    };
    utils.redirectTo = jest.fn();
    mount(Authentication, {
      mocks: {
        $store: store,
        $route,
      },
    });
    expect(utils.redirectTo).not.toHaveBeenCalled();
  });

  it('do not checks for token when current page is refresh', () => {
    const $route = {
      name: 'refresh',
    };
    utils.redirectTo = jest.fn();
    mount(Authentication, {
      mocks: {
        $store: store,
        $route,
      },
    });
    expect(utils.redirectTo).not.toHaveBeenCalled();
  });

  it('does nothing when token is present and page is not callback or refresh', () => {
    const $route = {
      name: 'somePage',
    };
    utils.redirectTo = jest.fn();

    mount(Authentication, {
      mocks: {
        $store: {
          ...store,
          getters: {
            token: {},
            refreshingToken: false,
          },
        },
        $route,
      },
    });
    expect(utils.redirectTo).not.toHaveBeenCalled();
  });

  it('extracts new token from iframe', () => {
    const $route = {
      name: 'somePage',
    };
    const setAuthToken = jest.fn();
    const stopRefreshingToken = jest.fn();

    const wrapper = mount(Authentication, {
      mocks: {
        $store: {
          ...store,
          mutations: {
            setAuthToken,
            stopRefreshingToken,
          },
        },
        $route,
      },
    });
    const frame = {
      target: {
        contentDocument: {
          location: {
            href: 'some.url?access_token=ABCD&scope=webclient',
          },
        },
      },
    };
    wrapper.vm.onRefreshTokenPageLoaded(frame);

    expect(store.commit).toHaveBeenNthCalledWith(1, 'setAuthToken', 'ABCD');
    expect(store.commit).toHaveBeenNthCalledWith(2, 'stopRefreshingToken');
  });

  it('redirects to login when no refresh token is returned', () => {
    const $route = {
      name: 'somePage',
    };
    utils.redirectTo = jest.fn();

    const wrapper = mount(Authentication, {
      mocks: {
        $store: store,
        $route,
      },
    });
    const frame = {
      target: {
        contentDocument: undefined,
      },
    };
    wrapper.vm.onRefreshTokenPageLoaded(frame);

    expect(store.commit).not.toHaveBeenNthCalledWith(1, 'setAuthToken');
    expect(utils.redirectTo).toHaveBeenCalled();
  });
});
