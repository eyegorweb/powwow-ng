const CURRENT_VERSION = 1; // replace by 1.1

function init() {
  let getWayStorage = {
    __st_version__: CURRENT_VERSION,
    currentUser: undefined,
    profiles: undefined,
  };

  return getWayStorage;
}

function getGetWayStorage() {
  return JSON.parse(localStorage.getItem('getWay'));
}

function updateGetWayStorage(getWayStorage) {
  localStorage.setItem('getWay', getWayStorage);
}

export function getItemInStorage(key) {
  let getWayStorage = getGetWayStorage();
  return JSON.parse(getWayStorage[key]);
}

export function setItemInStorage(key, value) {
  let getWayStorage = getGetWayStorage();
  getWayStorage[key] = value;
  updateGetWayStorage(JSON.stringify(getWayStorage));
}

function getProfileStorage(username) {
  let getWayStorage = getGetWayStorage();
  if (getWayStorage['profiles']) {
    return getWayStorage['profiles'][username];
  } else {
    return null;
  }
}

function updateUserProfileStorage(username, attr, value) {
  let getWayStorage = getGetWayStorage();
  let profiles = getWayStorage['profiles'];
  console.log('------ update profile: BEGIN -------', profiles);
  if (!profiles) {
    profiles = {};
  }

  let profile = getProfileStorage(username);
  if (!profile) {
    profile = {
      username,
      homeWidgets: { version: undefined, widgets: undefined },
    };
  }
  if (attr) {
    profile[attr] = value;
  }
  profiles['username'] = profile;
  console.log('------ update profile: VALUE -------', profile);
  console.log('------ update profile: END -------', profiles);

  getWayStorage['profiles'] = profiles;
  updateGetWayStorage(JSON.stringify(getWayStorage));
}

function updateProfileStorage(attr, value) {
  updateUserProfileStorage(getCurrentUserStorage(), attr, value);
}

function getCurrentUserStorage() {
  return getGetWayStorage().currentUser;
}

export function setCurrentUserStorage(username) {
  let getWayStorage = getGetWayStorage();
  getWayStorage['currentUser'] = username;
  updateUserProfileStorage(username);
  updateGetWayStorage(JSON.stringify(getWayStorage));
}

export function getHomeWidgetsStorage() {
  let profile = getProfileStorage(getCurrentUserStorage());
  return profile ? profile['homeWidgets'] : null;
}

export function saveHomeWidgetsStorage(widgetsToSave, WIDGETS_STORAGE_VERSION) {
  let homeWidgets = { version: WIDGETS_STORAGE_VERSION, widgets: widgetsToSave };
  updateProfileStorage('homeWidgets', homeWidgets);
}

// pour vider le localstorage de tout les utilisateurs incrémenter la variable CURRENT_VERSION
export function checkLocalStorageProfile() {
  let getWayStorage = getGetWayStorage();
  if (!getWayStorage) {
    updateGetWayStorage(JSON.stringify(init()));
  } else {
    let savedVersion = localStorage.getItem('__st_version__') || 0;
    savedVersion = parseInt(savedVersion);
    if (savedVersion !== CURRENT_VERSION) {
      localStorage.clear();
    }
    localStorage.setItem('__st_version__', CURRENT_VERSION);

    // new version
    let savedVersionV2 = getWayStorage.__st_version__ || 0;
    savedVersionV2 = parseInt(savedVersionV2);
    if (savedVersionV2 !== CURRENT_VERSION) {
      updateGetWayStorage(JSON.stringify(init()));
    }
  }
}
