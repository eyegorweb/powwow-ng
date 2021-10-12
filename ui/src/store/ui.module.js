import uuid from 'uuid/v1';
import { loadWidgets, getProfile, WIDGETS_STORAGE_VERSION } from '@/views/Home/widgets';
import { setLanguage } from '@/api/language';
import moment from 'moment';

import $i18n from '@/i18n';
import configureHighcharts from '@/dep/highcharts';

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
  local: undefined,

  exportPanelParams: undefined,
  isExportFormatChoiceOpen: false,
  exportNumberLines: undefined,

  homeWidgets: undefined,

  downloadURI: undefined,

  havePendingExports: false,
  havePendingActs: false,
  pendingInit: false,
};

export const getters = {
  activeWidgets: (state) => state.homeWidgets.filter((w) => w.checked),
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
  const widgetsToSave = widgets.map((w) => {
    const ret = { ...w };
    ret.component = undefined;
    return ret;
  });
  if (widgetsToSave && widgetsToSave.length) {
    localStorage.setItem('___homewidgets___', JSON.stringify(widgetsToSave));
    localStorage.setItem('_widgets_profile_', getProfile());
    localStorage.setItem('widgets.version', WIDGETS_STORAGE_VERSION);
  }
}

export const mutations = {
  async setPendingExportsStatus(s, havePendingExports) {
    s.havePendingExports = havePendingExports;
    s.pendingInit = true;
  },
  async sePtendingInit(s, pendingInit) {
    s.pendingInit = pendingInit;

  },
  async setPendingActsStatus(s, havePendingActs) {
    s.havePendingActs = havePendingActs;
  },

  async changeAppLanguage(state, lang) {
    $i18n.locale = lang;
    if (lang === 'en') {
      moment.locale('en-sg');
    } else {
      moment.locale('fr');
    }

    configureHighcharts(lang);
    await setLanguage(lang);
  },
  initHomeWidgets(state) {
    state.homeWidgets = loadWidgets();
    saveFormattedWidgets(state.homeWidgets);
  },
  openExportChoice(state, params) {
    state.exportPanelParams = params;
    state.isExportFormatChoiceOpen = true;
    state.exportNumberLines = params.nbOfLines;
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
  updatePanelPayload(state, newPayload) {
    state.panelPayload = { ...newPayload };
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
  clearMessages: (state) => {
    state.messages = [];
  },
  removeMessageById: (state, id) => {
    state.messages = state.messages.filter((m) => m.id !== id);
  },
  confirmAction: (state, action) => {
    state.actionToConfirm = action;
  },

  popupMessage: (state, message) => {
    state.actionToConfirm = {
      message,
      noOkButton: true,
      noTranslation: true,
      customCloseLabel: 'close',
    };
  },

  closeAction: (state) => {
    state.actionToConfirm = undefined;
  },
};
