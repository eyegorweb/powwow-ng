import uuid from 'uuid/v1';
import { loadWidgets, getProfile } from '@/views/Home/widgets';

export const state = {
  isPanelOpen: false,
  panelTitle: undefined,
  panelId: undefined,
  panelTitleConf: undefined,
  panelPayload: undefined,
  isPanelWide: false,
  backdrop: undefined,
  message: undefined,
  messageLevel: undefined,
  messages: [],
  actionToConfirm: undefined,
  ignoreClickAway: false,
  width: undefined,

  homeWidgets: loadWidgets(),
};

export const getters = {
  activeWidgets: state => state.homeWidgets.filter(w => w.checked),
};

function openPanel(state, conf) {
  const {
    title,
    panelId,
    payload,
    wide,
    backdrop,
    titleConf,
    ignoreClickAway,
    width,
    onClosePanel,
  } = conf;
  state.isPanelOpen = true;
  state.panelTitle = title;
  state.panelId = panelId || title;
  state.panelPayload = payload;
  state.isPanelWide = wide;
  state.backdrop = !!backdrop;
  state.panelTitleConf = titleConf;
  state.ignoreClickAway = !!ignoreClickAway;
  state.width = width;
  state.onClosePanel = onClosePanel;
}

function saveFormattedWidgets(widgets) {
  const widgetsToSave = widgets.map(w => {
    return {
      title: w.title,
      description: w.description,
      checked: w.checked,
      large: w.large,
      seeMore: w.seeMore,
      mock: w.mock,
      layout: w.layout,
    };
  });
  localStorage.setItem('__homewidgets__', JSON.stringify(widgetsToSave));
  localStorage.setItem('_widgets_profile_', getProfile());
}

export const mutations = {
  initHomeWidgets(state) {
    saveFormattedWidgets(state.homeWidgets);
  },
  setHomeWidgets: (state, widgets) => {
    state.homeWidgets = [...widgets];
    saveFormattedWidgets(widgets);
  },
  openPanel,
  closePanel: (state, params) => {
    state.isPanelOpen = false;
    state.panelId = undefined;
    if (state.onClosePanel) {
      state.onClosePanel(params);
      state.onClosePanel = undefined;
    }
  },

  switchPanel: (state, conf) => {
    const openTrigger = () => {
      openPanel(state, conf);
    };
    if (state.isPanelOpen) {
      state.isPanelOpen = false;
      state.panelId = undefined;
      setTimeout(openTrigger, 500);
    } else {
      openTrigger();
    }
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
