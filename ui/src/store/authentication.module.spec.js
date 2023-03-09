import * as authentification from './authentication.module';
import { fetchCurrentUserInfos } from '@/api/user.js';
import { isFeatureAvailable } from '@/api/partners';

jest.mock('@/api/user.js', () => ({
  fetchCurrentUserInfos: jest.fn(),
}));

jest.mock('@/api/partners', () => ({
  isFeatureAvailable: jest.fn(),
  getPartyOptions: jest.fn(),
}));

describe('Authentication module', () => {
  describe('Mutations', () => {
    it('Should set Auth token', () => {
      const state = {
        token: undefined,
        accessToken: undefined,
        refreshingToken: false,
      };

      const token = { iat: 1516239022, name: 'John Doe', sub: '1234567890' };

      // created using https://jwt.io/
      const tokenStr =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      authentification.mutations.setAuthToken(state, { token, tokenStr });

      expect(state.accessToken).toBe(tokenStr);
      expect(state.token).toEqual({ iat: 1516239022, name: 'John Doe', sub: '1234567890' });
    });
    it('starts refreshing token process', () => {
      const state = {
        refreshingToken: false,
      };
      authentification.mutations.startRefreshingToken(state);

      expect(state.refreshingToken).toBeTruthy();
    });
    it('Should stop refreshing', () => {
      const state = {
        refreshingToken: true,
      };
      authentification.mutations.stopRefreshingToken(state);

      expect(state.refreshingToken).toBeFalsy();
    });
    it('save curent user informations', () => {
      const state = {
        userInfos: true,
      };
      authentification.mutations.setCurrentUser(state, { name: 'lulu' });

      expect(state.userInfos).toEqual({ name: 'lulu' });
    });
  });

  describe('Getters', () => {
    it('should get values from state', () => {
      const state = {
        token: {
          user_name: 'Hulk',
        },
        accessToken: 'ABCD',
        refreshingToken: false,
        userInfos: {
          firstName: 'Solid',
          lastName: 'Snake',
          permissions: [
            {
              domain: 'getVision',
              action: 'filter_domain',
            },
            {
              domain: 'getSim',
              action: 'read',
            },
          ],
        },
      };

      expect(authentification.getters.token(state)).toEqual({ user_name: 'Hulk' });
      expect(authentification.getters.accessToken(state)).toBe('ABCD');
      expect(authentification.getters.refreshingToken(state)).toBe(false);
      expect(authentification.getters.userName(state)).toBe('Hulk');
      state.token = undefined;
      expect(authentification.getters.userName(state)).toBe('');
      expect(authentification.getters.userInfos(state)).toEqual(state.userInfos);
      expect(authentification.getters.havePermission(state)('getSim', 'read')).toBe(true);
      expect(authentification.getters.havePermission(state)('user', 'create')).toBe(false);
      expect(authentification.getters.havePermission(state)('getVision', 'filter_domain')).toBe(
        true
      );
    });
  });

  describe('Actions', () => {
    it('fetches current user informations from API', async () => {
      const fakeUserInfos = {
        name: 'TUTU',
      };

      fetchCurrentUserInfos.mockResolvedValue(fakeUserInfos);
      isFeatureAvailable.mockResolvedValue(true);
      const context = {
        commit: jest.fn(),
      };
      await authentification.actions.fetchUserInfos(context);
      expect(context.commit).toHaveBeenCalledWith('setCurrentUser', {
        isFleetEnabled: true,
        FLAG_STATISTICS_ENABLED: true,
        name: 'TUTU',
      });
    });
  });
});
