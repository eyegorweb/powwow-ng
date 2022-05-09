import uuid from 'uuid/v1';

/**
 * Formatte api response errors
 * @param {Array} errors errors
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

// TODO: formatte POST errors from axios request
// {
//   "status":"UNPROCESSABLE_ENTITY",
//   "error":"FILE_LINE_NUMBER_INVALID",
//   "message":"InvalidFileLineNumber: Too much lines imported",
//   "maxNumbersPerFileUpload":null
// }
/**
 * Formatte axios post api rest response
 * @returns {Array} formatted response
 */
export function formatPostErrors(errors) {
  return errors;
}

/**
 *
 * @returns {Array} an object named errors with pair key/value describing an unclassified error
 */
function unclassifiedError() {
  return [{ key: 'Unclassified', value: 'Please try again later.' }];
}
