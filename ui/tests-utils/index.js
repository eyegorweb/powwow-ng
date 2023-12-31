exports.$t = (v) => v;
exports.$i18n = {
  locale: 'fr',
};

import get from 'lodash.get';

exports.$loGet = (object, path, defaultValue = '') => {
  const value = get(object, path, defaultValue);
  return value !== null ? value : defaultValue;
};

/**
 * Aide à la saisie durant la création des tests sur un composant qui utilise vueX
 */
exports.mountVuexComponentHelper = (Component) => {
  let vuexGetters = [];
  if (Component.computed) {
    vuexGetters = Object.keys(Component.computed).reduce((all, computedName) => {
      if (Component.computed[computedName].vuex) {
        if (computedName === 'havePermission') {
          all.push(`${computedName}: () => {
          return false;
        },`);
        }
        if (computedName === 'singlePartner') {
          all.push(`${computedName}: {
          id: 999
        },`);
        } else {
          all.push(`${computedName}: false,`);
        }
      }
      return all;
    }, []);
  }

  const vuexMutations = Object.keys(Component.methods).reduce((all, methodname) => {
    if (Component.methods[methodname].name === 'mappedMutation') {
      all.push(`${methodname}: jest.fn(),`);
    }
    return all;
  }, []);

  const textToRet = `
   const store = new Store({
    getters: {
      ${vuexGetters.join('\n')}
    },
    mutations: {
      ${vuexMutations.join('\n')}
    }
   });
  `;

  console.log(textToRet);
};
