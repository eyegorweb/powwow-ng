export function checkFormat(file) {
  return (
    file.type !== 'application/vnd.ms-excel' &&
    file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
    file.type !== 'text/csv' &&
    file.type !== 'text/plain'
  );
}

export function checkFileSize(file) {
  return file.size > 1000000;
}
