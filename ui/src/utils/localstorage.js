const CURRENT_VERSION = 1;

// pour vider le localstorage de tout les utilisateurs incrémenter la variable CURRENT_VERSION
export function checkLocalStorageProfile() {
  let savedVersion = localStorage.getItem('__st_version__') || 0;

  savedVersion = parseInt(savedVersion);

  if (savedVersion !== CURRENT_VERSION) {
    localStorage.clear();
  }

  localStorage.setItem('__st_version__', CURRENT_VERSION);
}
