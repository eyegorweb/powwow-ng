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
    routerObj.matched.forEach((record) => {
      if (record.meta.compatiblePartnerTypes) {
        compatiblePartnerTypes = record.meta.compatiblePartnerTypes;
      } else {
        compatiblePartnerTypes = undefined;
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
export function throwGuardNavigation(routerObj, store, tempIsStoreLoaded, callFn) {
  console.log('throw guard navigation', routerObj);
  if (tempIsStoreLoaded) {
    tries = 60;
    storeIsLoaded = tempIsStoreLoaded;
    if (storeIsLoaded) {
      // Testons les permissions quand toutes doivent être valables
      let permission = getPermission(routerObj);
      let havePermission = false;
      if (routerObj.meta && routerObj.meta.hasDependantPermission) {
        havePermission = !!permission.every((perm) => {
          return store.getters.havePermission(perm.domain, perm.action);
        });
      } else if (routerObj.meta && routerObj.meta.hasPartialDependantPermission) {
        // Testons les permissions quand l'une est obligatoire (premier index du tableau) et au moins une parmi le reste des autres valeurs du tableau
        // Cas spécial et unique pour la route label name = partnerDetail.accountDetail.options
        havePermission =
          store.getters.havePermission(permission[0].domain, permission[0].action) &&
          !!permission.splice(1, permission.length - 1).find((perm) => {
            return store.getters.havePermission(perm.domain, perm.action);
          });
      } else {
        // Testons la permission quand au moins une est valable
        havePermission = !!permission.find((perm) => {
          return store.getters.havePermission(perm.domain, perm.action);
        });
      }
      console.log(
        "Permettre la navigation jusqu'à l'url parce que j'ai la permission ????",
        havePermission
      );

      // Testons la compatibilité avec le type de partenaire, ce contrôle est nécessaire (donc renseigné pour certians liens)
      let compatiblePartnerType = checkCompatiblePartnerType(routerObj);
      console.log('type de partenaire compatible >>>>>>>', compatiblePartnerType);
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
      console.log(
        "Permettre la navigation jusqu'à l'url parce que j'ai un partenaire compatible obligatoire ????",
        haveCompatiblePartnerType
      );

      // Testons la restriction des options partenaires pour les utilisateurs de type partenaire
      let haveAdditionalOptionPermission = undefined;
      // Condition première: être un utilisateur partenaire OU un utilisateur compte groupe partenaire
      if (store.getters.userIsPartner || store.getters.userIsGroupPartner) {
        // Contrôle des options additionnelles, à traiter en les combinant (addition) avec les contrôles des types de partenaire permis
        // coachM2MAvailable
        if (routerObj.query && routerObj.query.coachM2MAvailable) {
          haveAdditionalOptionPermission = routerObj.query.coachM2MAvailable;
          console.log(
            "Permettre la navigation jusqu'à l'url parce que j'ai l'option coachM2MAvailable activée ?",
            routerObj.query.coachM2MAvailable
          );
        }
        // requestConsoActive
        if (routerObj.query && routerObj.query.requestConsoActive) {
          haveAdditionalOptionPermission = routerObj.query.requestConsoActive;
          console.log(
            "Permettre la navigation jusqu'à l'url parce que j'ai l'option requestConsoActive activée ?",
            routerObj.query.requestConsoActive
          );
        }
        // geolocEnabled
        if (routerObj.query && routerObj.query.geolocEnabled) {
          haveAdditionalOptionPermission = routerObj.query.geolocEnabled;
          console.log(
            "Permettre la navigation jusqu'à l'url parce que j'ai l'option geolocEnabled activée ?",
            routerObj.query.geolocEnabled
          );
        }
        // autoDiagnsticEnabled
        if (routerObj.query && routerObj.query.autoDiagnosticEnabled) {
          haveAdditionalOptionPermission = routerObj.query.autoDiagnosticEnabled;
          console.log(
            "Permettre la navigation jusqu'à l'url parce que j'ai l'option autoDiagnosticEnabled activée ?",
            routerObj.query.autoDiagnosticEnabled
          );
        }
        // specificCustomerID
        if (
          routerObj.query &&
          routerObj.query.specificCustomerID &&
          routerObj.query.specificCustomerID === 246
        ) {
          haveAdditionalOptionPermission = true;
          console.log(
            "Permettre la navigation jusqu'à l'url parce que je suis un partenaire IMT accessible",
            routerObj.query.autoDiagnosticEnabled
          );
          console.log(
            "Permettre la navigation jusqu'à l'url parce que j'ai au moins une option obligatoire activée ???",
            haveAdditionalOptionPermission
          );
        }
        // notifyOption
        if (routerObj.meta.additionalOption && routerObj.meta.additionalOption.notifyOption) {
          const checkOption = routerObj.meta.additionalOption.notifyOption;
          if (store.getters.userInfos && store.getters.userInfos[checkOption]) {
            haveAdditionalOptionPermission = true;
          }
          console.log(
            "Permettre la navigation jusqu'à l'url parce que j'ai l'option FLAG_STATISTICS_ENABLED activée ?",
            haveAdditionalOptionPermission
          );
        }
      }

      // Testons la restriction pour les utilisateurs par CF
      let hideForUserByCustomerAccount = undefined;
      // hideForUserByCustomerAccount
      if (routerObj.meta.hideForUserByCustomerAccount) {
        // Si user by CF, do not permit
        if (store.getters.userInfos && store.getters.userInfos.isUserByCustomerAccount) {
          hideForUserByCustomerAccount = true;
        } else {
          hideForUserByCustomerAccount = false;
        }
      }
      console.log(
        "Ne pas permettre la navigation jusqu'à l'url parce que je suis un userByCF ???",
        hideForUserByCustomerAccount
      );

      // Exécution de la navigation
      // Les options additionnelles sont à traiter en combinaison avec les options sur la compatibilité des partenaires
      if (haveCompatiblePartnerType === undefined) {
        // Sauf parfois une option additionnelle peut se vérifier sans le contrôle sur la compatibilité des partenaires
        if (
          havePermission &&
          (haveAdditionalOptionPermission === undefined || haveAdditionalOptionPermission) &&
          (hideForUserByCustomerAccount === undefined || !hideForUserByCustomerAccount)
        ) {
          callFn();
        } else {
          callFn({ name: 'home' });
        }
      } else {
        if (
          (havePermission &&
            haveCompatiblePartnerType &&
            haveAdditionalOptionPermission &&
            (hideForUserByCustomerAccount === undefined || !hideForUserByCustomerAccount)) ||
          (havePermission &&
            haveCompatiblePartnerType &&
            haveAdditionalOptionPermission === undefined &&
            (hideForUserByCustomerAccount === undefined || !hideForUserByCustomerAccount))
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
        tempIsStoreLoaded = throwGuardNavigation(
          routerObj,
          store,
          !!(store.getters && store.getters.userInfos && store.getters.userInfos.permissions),
          callFn
        );
      }, 50);
    }
  }
}
