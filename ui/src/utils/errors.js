import uuid from 'uuid/v1';

/**
 * Formatte api response errors
 * @param {Array} response errors
 * @returns {Array} formatted response errors with pair key/value
 */
export function formatBackErrors(errors) {
  return errors.reduce((all, err) => {
    if (err && !err.extensions) return [];
    const extensions = Object.keys(err.extensions).filter((k) => k !== 'classification');
    const errorKeys = extensions.map((exName) => `${exName}.${err.extensions[exName]}`);
    all.push({
      id: uuid(),
      errorKeys,
      errors: !extensions.length
        ? unclassifiedError()
        : extensions.map((exName) => ({ key: exName, value: err.extensions[exName] })),
    });
    return all;
  }, []);
}

/**
 *
 * @returns {Array} an object named errors with pair key/value describing an unclassified error
 */
function unclassifiedError() {
  return [{ key: 'Unclassified', value: 'Please try again later.' }];
}
