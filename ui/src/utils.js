export function redirectTo(url) {
  window.location.href = url;
}

export function isDevMode() {
  return process.env.NODE_ENV === 'development';
}

export function log(...args) {
  if (isDevMode()) {
    console.log(...args);
  }
}

export function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function truncateLabel(value, size = 12) {
  if (!value) return '';
  if (value.length <= size) return value;
  return value.substr(0, size) + '...';
}

export function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getBaseURL() {
  const sameUrl =
    location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
  return process.env.VUE_APP_AUTH_SERVER_URL && process.env.VUE_APP_AUTH_SERVER_URL.length
    ? process.env.VUE_APP_AUTH_SERVER_URL
    : sameUrl;
}

export function isEquivalent(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}

export function containsWithHighlight(search, items) {
  return items
    .filter(e => e.label.toLowerCase().includes(search.toLowerCase()))
    .map(found => ({
      highlighted: { label: highlightTxt(found.label, search) },
      item: found,
    }));
}

function highlightTxt(input, search) {
  const startTag = input.toLowerCase().indexOf(search.toLowerCase());
  const leftPart = input.slice(0, startTag);
  const rightPart = input.slice(startTag + search.length);

  const found = input.slice(startTag, startTag + search.length);

  return `${leftPart}<b>${found}</b>${rightPart}`;
}
