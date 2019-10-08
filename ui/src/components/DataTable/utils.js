import uuid from 'uuid/v1';

export function col(label, name, visible = true, orderable = false, format = undefined, extra) {
  return {
    id: uuid(),
    label,
    name,
    orderable,
    visible,
    format,
    ...extra,
  };
}
