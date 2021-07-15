import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

Vue.prototype.$tl = function(key, locale) {
  var values = [],
    len = arguments.length - 1;
  while (len-- > 0) values[len] = arguments[len + 1];

  var i18n = this.$i18n;
  return i18n._t.apply(i18n, [key, locale, i18n._getMessages(), this].concat(values));
};

export default new VueI18n({
  locale: 'fr',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});
