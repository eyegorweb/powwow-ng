import uuid from 'uuid/v1';

export function formatBackErrors(errors) {
  return errors.reduce((all, err) => {
    if (err && !err.extensions) return [];
    const extensions = Object.keys(err.extensions).filter((k) => k !== 'classification');
    const errorKeys = extensions.map((exName) => `${exName}.${err.extensions[exName]}`);
    all.push({
      id: uuid(),
      errorKeys,
      errors: extensions.map((exName) => ({ key: exName, value: err.extensions[exName] })),
    });
    return all;
  }, []);
}
