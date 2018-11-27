// mock de debounce qui appelle directement la fonction
module.exports = fn =>
  function(...args) {
    return fn.apply(this, args);
  };
