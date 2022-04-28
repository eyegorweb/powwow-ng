const CURRENT_VERSION = 1.1;

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

function getProfileStorage(usernameToSearch) {
  let getWayStorage = getGetWayStorage();
  if (getWayStorage['profiles']) {
    return getWayStorage['profiles'].filter((p) => {
      return p.username == usernameToSearch;
    });
  } else {
    return null;
  }
}

function updateUserProfileStorage(username, attr, value) {
  let getWayStorage = getGetWayStorage();
  let profiles = getWayStorage['profiles'];
  if (!profiles) {
    profiles = [];
  }

  let profile = getProfileStorage(username) ? getProfileStorage(username)[0] : null;
  if (!profile) {
    profile = {
      username,
      homeWidgets: { version: undefined, widgets: undefined },
    };
    profiles.push(profile);
  }
  if (attr) {
    profile[attr] = value;
  }
  profiles = profiles.map((p) => {
    return p.username === profile.username ? profile : p;
  });

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
  let profile = getProfileStorage(getCurrentUserStorage())
    ? getProfileStorage(getCurrentUserStorage())[0]
    : null;
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
    // new version
    let savedVersion = getWayStorage.__st_version__ || 0;
    savedVersion = parseInt(savedVersion);
    if (savedVersion !== CURRENT_VERSION) {
      updateGetWayStorage(JSON.stringify(init()));
    }
  }
}
