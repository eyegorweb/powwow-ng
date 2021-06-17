import { mount, shallowMount } from '@vue/test-utils';
import UserFormPanel from './UserFormPanel';

import { Store } from 'vuex-mock-store';
import { $t } from '@/../tests-utils';

import { fetchPartnerGroups, fetchAllowedRoles } from '@/api/users.js';
import { fetchpartnerById, fetchpartners } from '@/api/partners.js';
import { fetchAllLanguages } from '@/api/language.js';

jest.mock('@/api/users.js', () => ({
  fetchPartnerGroups: jest.fn(),
  fetchAllowedRoles: jest.fn(),
}));

jest.mock('@/api/partners.js', () => ({
  fetchpartnerById: jest.fn(),
  fetchpartners: jest.fn(),
}));

jest.mock('@/api/language.js', () => ({
  fetchAllLanguages: jest.fn(),
}));

describe.skip('UserFormPanel : Gestion des erreurs du formulaire', () => {
  const store = new Store({
    getters: {
      userInfos: false,
      userIsBO: false,
      userIsGroupAccount: false,
      havePermission: () => {
        return true;
      },
      userIsPartner: true,
      userIsGroupPartner: false,
      singlePartner: {
        id: 999,
      },
    },
    mutations: {
      flashMessage: jest.fn(),
      closePanel: jest.fn(),
      openPanel: jest.fn(),
      confirmAction: jest.fn(),
    },
  });

  afterEach(() => {
    store.reset();

    /*
    fetchAllLanguages.mockReset();
    fetchpartnerById.mockReset();
    fetchAllowedRoles.mockReset();
    fetchPartnerGroups.mockReset();
    //*/
  });

  fetchAllLanguages.mockResolvedValue([
    { language: 'fr', label: 'Français' },
    { language: 'en', label: 'Anglais' },
  ]);
  fetchpartnerById.mockResolvedValue({});
  fetchAllowedRoles.mockResolvedValue([]);
  fetchPartnerGroups.mockResolvedValue([]);

  /** @type {import('@vue/test-utils').Wrapper} */

  function prepareFormVerificationTest(data) {
    return shallowMount(UserFormPanel, {
      mocks: { $t, $store: store },
      propsData: {
        content: { fromUserMenu: true, fromPage: 'users' },
      },
      data() {
        return data;
      },
    });
  }

  it('Pouvoir enregistrer si aucune erreur dans le formulaire', () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        title: 'MR',
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'WXCqsdaze123*',
        passwordConfirm: 'WXCqsdaze123*',
        email: 'mail@mail.com',
      },
    });
    expect(wrapper.vm.canSave).toBe(true);
  });

  it('Ne pas pouvoir enregistrer si le mot de passe de confirmation ne correspond pas au champ mot de passe', () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        title: 'MR',
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'WXCqsdaze123*',
        passwordConfirm: 'nimportequoi*',
        email: 'mail@mail.com',
      },
    });
    expect(wrapper.vm.passwordConfirmationErrors).toEqual(['errors.password.confirm-error']);
    expect(wrapper.vm.canSave).toBe(false);
  });

  it(`Ne pas pouvoir enregistrer si le mot de passe ne contient pas de caractère spécial`, () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        title: 'MR',
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'WXCqsdaze123',
        passwordConfirm: 'WXCqsdaze123',
        email: 'mail@mail.com',
      },
    });
    expect(wrapper.vm.passwordConfirmationErrors).toEqual(['errors.password.special-error']);
    expect(wrapper.vm.canSave).toBe(false);
  });

  it(`Ne pas pouvoir enregistrer si le mot de passe ne contient pas de caractère majuscule`, () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        title: 'MR',
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'wxcqsdaze123*',
        passwordConfirm: 'wxcqsdaze123*',
        email: 'mail@mail.com',
      },
    });
    expect(wrapper.vm.passwordConfirmationErrors).toEqual(['errors.password.uppercase-error']);
    expect(wrapper.vm.canSave).toBe(false);
  });

  it(`Ne pas pouvoir enregistrer si le mot de passe ne contient pas de caractère minuscule`, () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        title: 'MR',
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'WXCQSDAZE123*',
        passwordConfirm: 'WXCQSDAZE123*',
        email: 'mail@mail.com',
      },
    });
    expect(wrapper.vm.passwordConfirmationErrors).toEqual(['errors.password.lowercase-error']);
    expect(wrapper.vm.canSave).toBe(false);
  });

  it(`Ne pas pouvoir enregistrer si le mot de passe ne contient pas de chiffres`, () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        title: 'MR',
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'WXCqsdaze*',
        passwordConfirm: 'WXCqsdaze*',
        email: 'mail@mail.com',
      },
    });
    expect(wrapper.vm.passwordConfirmationErrors).toEqual(['errors.password.number-error']);
    expect(wrapper.vm.canSave).toBe(false);
  });

  it(`Ne pas pouvoir enregistrer si la taille du mot de passe est strictement inférieure à 8`, () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        title: 'MR',
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'Aze123*',
        passwordConfirm: 'Aze123*',
        email: 'mail@mail.com',
      },
    });
    expect(wrapper.vm.passwordConfirmationErrors).toEqual(['errors.password.length-error']);
    expect(wrapper.vm.canSave).toBe(false);
  });

  it(`Ne pas pouvoir enregistrer si l'adresse mail est invalide`, () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        title: 'MR',
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'WXCqsdaze123*',
        passwordConfirm: 'WXCqsdaze123*',
        email: 'nimportequoi',
      },
    });
    expect(wrapper.vm.haveMailError).toBe(true);
    expect(wrapper.vm.canSave).toBe(false);
  });

  it(`Ne pas pouvoir enregistrer si le titre n'est pas séléctionné`, () => {
    const wrapper = prepareFormVerificationTest({
      form: {
        language: 'Français',
        firstName: 'prenom1',
        lastName: 'nom1',
        username: 'monlogin',
        password: 'WXCqsdaze123*',
        passwordConfirm: 'WXCqsdaze123*',
        email: 'mail@mail.com',
      },
    });
    expect(wrapper.vm.canSave).toBe(false);
  });
});

describe(`UserFormPanel: En tant qu'utilisateur partenaire`, () => {
  const store = new Store({
    getters: {
      userInfos: false,
      userIsBO: false,
      userIsGroupAccount: false,
      havePermission: () => {
        return true;
      },
      userIsPartner: true,
      userIsGroupPartner: false,
      singlePartner: {
        id: 999,
      },
    },
    mutations: {
      flashMessage: jest.fn(),
      closePanel: jest.fn(),
      openPanel: jest.fn(),
      confirmAction: jest.fn(),
    },
  });

  afterEach(() => {
    store.reset();
  });
  jest.mock('@/api/users.js', () => ({
    fetchPartnerGroups: jest.fn(),
    fetchAllowedRoles: jest.fn(),
  }));

  jest.mock('@/api/partners.js', () => ({
    fetchpartnerById: jest.fn(),
  }));

  jest.mock('@/api/language.js', () => ({
    fetchAllLanguages: jest.fn(),
  }));

  fetchAllLanguages.mockResolvedValue([
    { language: 'fr', label: 'Français' },
    { language: 'en', label: 'Anglais' },
  ]);
  fetchpartnerById.mockResolvedValue({});
  fetchAllowedRoles.mockResolvedValue([
    {
      Id: 4,
      name: 'ACHETEUR',
      description: 'Acheteur partenaire',
      category: null,
      scope: false,
      editable: true,
      activated: false,
    },
  ]);
  fetchPartnerGroups.mockResolvedValue([]);

  const wrapper = mount(UserFormPanel, {
    mocks: { $t, $store: store },
    propsData: {
      content: { fromUserMenu: true, fromPage: 'users' },
    },
  });

  it(`Ne pas voir de toggle des types de partenaires`, () => {
    const result = wrapper.findComponent({ name: 'UiToggle2' });
    expect(result.exists()).toBe(false);
  });
  it(`Ne pas pouvoir choisir de partenaire`, () => {
    const result = wrapper.findComponent({ name: 'PartnerCombo' });
    expect(result.exists()).toBe(false);
  });
});

describe(`UserFormPanel: En tant qu'utilisateur groupe partenaire`, () => {
  const store = new Store({
    state: {
      userContext: {
        contextPartnersType: [],
        contextPartners: [],
      },
    },
    getters: {
      userInfos: false,
      userIsBO: false,
      userIsGroupAccount: false,
      havePermission: () => {
        return true;
      },
      userIsPartner: false,
      userIsGroupPartner: true,
      singlePartner: {
        id: 999,
      },
    },
    mutations: {
      flashMessage: jest.fn(),
      closePanel: jest.fn(),
      openPanel: jest.fn(),
      confirmAction: jest.fn(),
    },
  });

  afterEach(() => {
    store.reset();
  });
  jest.mock('@/api/users.js', () => ({
    fetchPartnerGroups: jest.fn(),
    fetchAllowedRoles: jest.fn(),
  }));

  jest.mock('@/api/partners.js', () => ({
    fetchpartnerById: jest.fn(),
    fetchpartners: jest.fn(),
  }));

  jest.mock('@/api/language.js', () => ({
    fetchAllLanguages: jest.fn(),
  }));

  fetchAllLanguages.mockResolvedValue([
    { language: 'fr', label: 'Français' },
    { language: 'en', label: 'Anglais' },
  ]);
  fetchpartnerById.mockResolvedValue({});
  fetchAllowedRoles.mockResolvedValue([
    {
      Id: 4,
      name: 'ACHETEUR',
      description: 'Acheteur partenaire',
      category: null,
      scope: false,
      editable: true,
      activated: false,
    },
  ]);
  fetchPartnerGroups.mockResolvedValue([]);
  fetchpartners.mockResolvedValue([]);

  const wrapper = mount(UserFormPanel, {
    mocks: { $t, $store: store },
    propsData: {
      content: { fromUserMenu: true, fromPage: 'users' },
    },
  });

  it(`Ne pas voir de toggle des types de partenaires`, () => {
    const result = wrapper.findComponent({ name: 'UiToggle2' });
    expect(result.exists()).toBe(false);
  });
  it(`Pouvoir choisir de partenaire`, () => {
    const result = wrapper.findComponent({ name: 'PartnerCombo' });
    expect(result.exists()).toBe(true);
  });
});

describe(`UserFormPanel: En tant que BO`, () => {
  const store = new Store({
    state: {
      userContext: {
        contextPartnersType: [],
        contextPartners: [],
      },
    },
    getters: {
      userInfos: false,
      userIsBO: true,
      userIsGroupAccount: false,
      havePermission: () => {
        return true;
      },
      userIsPartner: false,
      userIsGroupPartner: false,
      singlePartner: {
        id: 999,
      },
    },
    mutations: {
      flashMessage: jest.fn(),
      closePanel: jest.fn(),
      openPanel: jest.fn(),
      confirmAction: jest.fn(),
    },
  });

  afterEach(() => {
    store.reset();
  });
  jest.mock('@/api/users.js', () => ({
    fetchPartnerGroups: jest.fn(),
    fetchAllowedRoles: jest.fn(),
  }));

  jest.mock('@/api/partners.js', () => ({
    fetchpartnerById: jest.fn(),
    fetchpartners: jest.fn(),
  }));

  jest.mock('@/api/language.js', () => ({
    fetchAllLanguages: jest.fn(),
  }));

  fetchAllLanguages.mockResolvedValue([
    { language: 'fr', label: 'Français' },
    { language: 'en', label: 'Anglais' },
  ]);
  fetchpartnerById.mockResolvedValue({});
  fetchAllowedRoles.mockResolvedValue([
    {
      Id: 4,
      name: 'ACHETEUR',
      description: 'Acheteur partenaire',
      category: null,
      scope: false,
      editable: true,
      activated: false,
    },
  ]);
  fetchPartnerGroups.mockResolvedValue([]);
  fetchpartners.mockResolvedValue([]);

  const wrapper = mount(UserFormPanel, {
    mocks: { $t, $store: store },
    propsData: {
      content: { fromUserMenu: true, fromPage: 'users' },
    },
  });

  it(`Voir de toggle des types de partenaires`, () => {
    const result = wrapper.findComponent({ name: 'UiToggle2' });
    expect(result.exists()).toBe(true);
  });

  it(`Voir les bon champs pour un utilisateur interne`, () => {
    const partnerCombo = wrapper.findComponent({ name: 'PartnerCombo' });
    expect(partnerCombo.exists()).toBe(false);

    const apiAutocomplete = wrapper.findComponent({ name: 'ApiAutocomplete' });
    expect(apiAutocomplete.exists()).toBe(false);
  });

  it(`Voir les bon champs pour un utilisateur de type partenaire`, async () => {
    await wrapper.setData({
      userType: 'PARTNER',
    });
    const partnerCombo = wrapper.findComponent({ name: 'PartnerCombo' });
    expect(partnerCombo.exists()).toBe(true);

    const apiAutocomplete = wrapper.find({ ref: 'partner-group' });
    expect(apiAutocomplete.exists()).toBe(false);
  });

  it(`Voir les bon champs pour un utilisateur de type groupe de partenaire`, async () => {
    await wrapper.setData({
      userType: 'PARTNER_GROUP',
    });
    const partnerCombo = wrapper.findComponent({ name: 'PartnerCombo' });
    expect(partnerCombo.exists()).toBe(false);

    const apiAutocomplete = wrapper.find({ ref: 'partner-group' });
    expect(apiAutocomplete.exists()).toBe(true);
  });
});
