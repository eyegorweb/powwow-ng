import uuid from 'uuid/v1';
import homeWidgets from '@/views/Home/widgets';

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
  actionToConfirm: undefined,

  homeWidgets,
};

export const getters = {
  activeWidgets: state => state.homeWidgets.filter(w => w.checked),
};

export const mutations = {
  setHomeWidgets: (state, widgets) => {
    state.homeWidgets = [...widgets];
  },
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
  confirmAction: (state, action) => {
    state.actionToConfirm = action;
  },
  closeAction: state => {
    state.actionToConfirm = undefined;
  },
};
