import uuid from 'uuid/v1';

export const state = {
  isPanelOpen: false,
  panelTitle: undefined,
  panelId: undefined,
  panelPayload: undefined,
  isPanelWide: false,
  backdrop: undefined,
  message: undefined,
  messageLevel: undefined,
  messages: [],
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
  flashMessage: (state, msgInfo) => {
    // state.message = msgInfo.msg;
    // state.messageLevel = msgInfo.level;

    state.messages.push({
      id: uuid(),
      ...msgInfo,
    });
  },
  clearMessages: state => {
    state.messages = [];
  },
  removeMessageById: (state, id) => {
    state.messages = state.messages.filter(m => m.id !== id);
  },
};
