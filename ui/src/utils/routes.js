export let storeIsLoaded = false;

// compteur de récursivité
let tries = 60;

/**
 * Fonction utilitaire pour obtenir la permission à contrôler
 * @param {Object} routerObj router configuration
 * @returns {Array} permission sous la forme domain/action
 */
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

/**
 * Fonction utilitaire pour vérifier les types de partenaires compatibles
 * @param {Object} routerObj router configuration
 * @returns {Array} type de partenaire compatible
 */
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

/**
 * Fonction utilitaire, récursive, pour lancer le contrôle des permissions et donner accès à la navigation ciblée sinon redirige vers la home
 *
 * @param {Object} routerObj router configuration
 * @param {Object} store vuex store
 * @param {Boolean} tempIsStoreLoaded detect when Store is fully loaded (appreciated to access to all properties and methods)
 * @param {Function} callFn callback navigation
 */
export function waitForStoreLoaded(routerObj, store, tempIsStoreLoaded, callFn) {
  if (tempIsStoreLoaded) {
    tries = 60;
    storeIsLoaded = tempIsStoreLoaded;
    if (storeIsLoaded) {
      let permission = getPermission(routerObj);
      let havePermission = false;
      // Testons les permissions quand toutes doivent être valables
      if (routerObj.meta && routerObj.meta.hasDependantPermission) {
        havePermission = !!permission.every((perm) => {
          return store.getters.havePermission(perm.domain, perm.action);
        });
      } else if (routerObj.meta && routerObj.meta.hasPartialDependantPermission) {
        // Testons les permissions quand l'une est obligatoire et au moins une parmi d'autres
        // Cas spécial et unique pour la route label name = partnerDetail.accountDetail.options
        havePermission =
          permission.find((perm) => {
            return store.getters.havePermission(perm.domain, perm.action);
          }).length > 1;
      } else {
        // Testons la permission quand au moins une est valable
        havePermission = !!permission.find((perm) => {
          return store.getters.havePermission(perm.domain, perm.action);
        });
      }

      // Testons la compatibilité avec le type de partenaire, ce contrôle est nécessaire (donc renseigné pour certians liens)
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

      // Contrôle des options additionnelles, à traiter en les combinant (addition) avec les contrôles des types de partenaire permis
      let haveAdditionalOptionPermission = undefined;
      // coachM2MAvailable
      if (routerObj.query && routerObj.query.coachM2MAvailable) {
        haveAdditionalOptionPermission = routerObj.query.coachM2MAvailable === true;
      }
      // requestConsoActive
      if (routerObj.query && routerObj.query.requestConsoActive) {
        haveAdditionalOptionPermission = routerObj.query.requestConsoActive === true;
      }
      // geolocEnabled
      if (routerObj.query && routerObj.query.geolocEnabled) {
        haveAdditionalOptionPermission = routerObj.query.geolocEnabled === true;
      }
      // autoDiagnsticEnabled
      if (routerObj.query && routerObj.query.autoDiagnosticEnabled) {
        haveAdditionalOptionPermission = routerObj.query.autoDiagnosticEnabled === true;
      }
      // specificCustomerID
      if (
        routerObj.query &&
        routerObj.query.specificCustomerID &&
        routerObj.query.specificCustomerID === 246
      ) {
        haveAdditionalOptionPermission = routerObj.query.specificCustomerID === 246;
      }

      // Exécution de la navigation
      // Les options additionnelles sont à traiter en combinaison avec les options sur la compatibilité des partenaires
      if (haveCompatiblePartnerType === undefined) {
        if (havePermission) {
          callFn();
        } else {
          callFn({ name: 'home' });
        }
      } else {
        if (
          (havePermission && haveCompatiblePartnerType && haveAdditionalOptionPermission) ||
          (havePermission &&
            haveCompatiblePartnerType &&
            haveAdditionalOptionPermission === undefined)
        ) {
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
