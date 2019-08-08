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
