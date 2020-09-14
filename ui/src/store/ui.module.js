import uuid from 'uuid/v1';
import { loadWidgets, getProfile, WIDGETS_STORAGE_VERSION } from '@/views/Home/widgets';

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

  exportPanelParams: undefined,
  isExportFormatChoiceOpen: false,

  homeWidgets: undefined,

  downloadURI: undefined,
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
  const widgetsToSave = widgets
    .filter(w => !!w)
    .map(w => {
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
  if (widgetsToSave && widgetsToSave.length) {
    localStorage.setItem('___homewidgets___', JSON.stringify(widgetsToSave));
    localStorage.setItem('_widgets_profile_', getProfile());
    localStorage.setItem('widgets.version', WIDGETS_STORAGE_VERSION);
  }
}

export const mutations = {
  initHomeWidgets(state) {
    state.homeWidgets = loadWidgets();
    saveFormattedWidgets(state.homeWidgets);
  },
  openExportChoice(state, params) {
    state.exportPanelParams = params;

    state.isExportFormatChoiceOpen = true;
  },
  closeExportChoice(state) {
    state.isExportFormatChoiceOpen = false;
  },
  closeAndResetExportChoice(state) {
    state.isExportFormatChoiceOpen = false;
    state.exportPanelParams = undefined;
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

  startDownload: (state, uri) => {
    state.downloadURI = uri;
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
