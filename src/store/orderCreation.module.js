export const state = {
  createOrderStep: 0,
  synthesis: [
    {
      id: 'step1.cf',
      label: 'common.billingAccounts',
      value: {
        id: 'cf1',
        label: '6.50766.12 - LEBARA 4G SERVICES',
      },
    },
  ],
};

export const getters = {
  synthesis: state => state.synthesis,
  createOrderStep: state => state.createOrderStep,
};

export const actions = {};

export const mutations = {};
