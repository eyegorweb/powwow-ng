export const state = {
  isPanelOpen: false,
  panelTitle: undefined,
  panelId: undefined,
  panelPayload: undefined,
  isPanelWide: false,
  backdrop: undefined,
};

export const mutations = {
  openPanel: (state, conf) => {
    const { title, panelId, payload, wide, backdrop } = conf;
    state.isPanelOpen = true;
    state.panelTitle = title;
    state.panelId = panelId || title;
    state.panelPayload = payload;
    state.isPanelWide = wide;
    state.backdrop = !!backdrop;
  },
  closePanel: state => {
    state.isPanelOpen = false;
    state.panelId = undefined;
  },
};
