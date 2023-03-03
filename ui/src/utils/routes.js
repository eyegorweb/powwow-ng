export let storeIsLoaded = false;

let tries = 60;
// Permission type Array with object inserted with keys (domain and action) / values
function getPermission(routerObj) {
  let permission = [];
  const isChild = routerObj.matched.find((record) => record.parent);
  const isGrandChild = routerObj.matched.find((record) => record.parent && record.parent.parent);
  if (isChild && !isGrandChild) {
    // Router level child
    if (Array.isArray(isChild.meta.permission)) {
      // Router child as Array
      permission = isChild.meta.permission.map((p) => p);
    } else {
      // Router child as Object
      permission = [isChild.meta.permission];
    }
  } else if (isChild && isGrandChild) {
    // Router level grand child
    if (Array.isArray(isGrandChild.meta.permission)) {
      // Router grand child as Array
      permission = isGrandChild.meta.permission.map((p) => p);
    } else {
      // Router grand child as Object
      permission = [isGrandChild.meta.permission];
    }
  } else {
    // Router level parent
    routerObj.matched.map((record) => {
      if (Array.isArray(record.meta.permission)) {
        permission = record.meta.permission.map((p) => p);
      } else {
        permission = [record.meta.permission];
      }
    });
  }
  return permission;
}

function checkCompatiblePartnerType(routerObj) {
  let compatiblePartnerTypes;
  const isChild = routerObj.matched.find((record) => record.parent);
  const isGrandChild = routerObj.matched.find((record) => record.parent && record.parent.parent);
  if (isChild && !isGrandChild) {
    // Router level child
    if (isChild.meta.compatiblePartnerTypes) {
      if (Array.isArray(isChild.meta.compatiblePartnerTypes)) {
        // Router child as Array
        compatiblePartnerTypes = isChild.meta.compatiblePartnerTypes.map((p) => p);
      } else {
        // Router child as Object
        compatiblePartnerTypes = [isChild.meta.compatiblePartnerTypes];
      }
    } else {
      compatiblePartnerTypes = undefined;
    }
  } else if (isChild && isGrandChild) {
    // Router level grand child
    if (isGrandChild.meta.compatiblePartnerTypes) {
      if (Array.isArray(isGrandChild.meta.compatiblePartnerTypes)) {
        // Router child as Array
        compatiblePartnerTypes = isGrandChild.meta.compatiblePartnerTypes.map((p) => p);
      } else {
        // Router child as Object
        compatiblePartnerTypes = [isGrandChild.meta.compatiblePartnerTypes];
      }
    } else {
      compatiblePartnerTypes = undefined;
    }
  } else {
    // Router level parent
    compatiblePartnerTypes = routerObj.matched.forEach((record) => {
      if (record.meta.compatiblePartnerTypes) {
        return record.meta.compatiblePartnerTypes;
      } else {
        return undefined;
      }
    });
  }
  return compatiblePartnerTypes;
}

export function waitForStoreLoaded(routerObj, store, tempIsStoreLoaded, callFn) {
  if (tempIsStoreLoaded) {
    tries = 60;
    storeIsLoaded = tempIsStoreLoaded;
    if (storeIsLoaded) {
      // Testons la permission
      let permission = getPermission(routerObj);
      const havePermission = !!permission.find((perm) => {
        return store.getters.havePermission(perm.domain, perm.action);
      });

      // Testons la compatibilité avec le type de partenaire ce contrôle est nécessaire (donc renseigné pour certians liens)
      let compatiblePartnerType = checkCompatiblePartnerType(routerObj);
      let haveCompatiblePartnerType = undefined;
      if (compatiblePartnerType) {
        haveCompatiblePartnerType = !!compatiblePartnerType.find((partnerType) => {
          const foundQueryParamPartnerType =
            routerObj.query && routerObj.query.partnerType
              ? routerObj.query.partnerType
              : undefined;
          if (foundQueryParamPartnerType) {
            return foundQueryParamPartnerType === partnerType;
          }
          return undefined;
        });
      }

      // Exécution de la navigation
      if (haveCompatiblePartnerType === undefined) {
        if (havePermission) {
          callFn();
        } else {
          callFn({ name: 'home' });
        }
      } else {
        if (havePermission && haveCompatiblePartnerType) {
          callFn();
        } else {
          callFn({ name: 'home' });
        }
      }
    }
  } else {
    if (tries > 0 && !tempIsStoreLoaded) {
      tries -= 1;
      setTimeout(() => {
        tempIsStoreLoaded = waitForStoreLoaded(
          routerObj,
          store,
          !!(store.getters && store.getters.userInfos && store.getters.userInfos.permissions),
          callFn
        );
      }, 50);
    }
  }
}
