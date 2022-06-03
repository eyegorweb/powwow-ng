export function col(id, label, name, visible = true, orderable = false, format = undefined, extra) {
  return {
    id,
    label,
    name,
    orderable,
    visible,
    format,
    ...extra,
  };
}
