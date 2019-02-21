export const state = {
  isPanelOpen: false,
  panelTitle: undefined,
  panelId: undefined,
  panelPayload: undefined,
  isPanelWide: false,
};

export const mutations = {
  openPanel: (state, conf) => {
    const { title, panelId, payload, wide } = conf;
    state.isPanelOpen = true;
    state.panelTitle = title;
    state.panelId = panelId || title;
    state.panelPayload = payload;
    state.isPanelWide = wide;
  },
  closePanel: state => {
    state.isPanelOpen = false;
    state.panelTitle = undefined;
  },
};
