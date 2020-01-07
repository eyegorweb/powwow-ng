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
