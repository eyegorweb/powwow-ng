import differenceWith from 'lodash.differencewith';

export function isFiltersAcceptable(selectedFilters, filtersToCheck) {
  let isEnabled = true;

  for (let i = 0, max = filtersToCheck.length; i < max; i++) {
    const itemFilter = filtersToCheck[i];
    const concernedFilter = selectedFilters.find((it) => itemFilter.id === it.id);
    if (concernedFilter && concernedFilter.values && concernedFilter.values.length) {
      const diff = differenceWith(
        concernedFilter.values,
        itemFilter.values,
        (a, b) => a.id === b.id
      );
      if (diff.length !== 0) {
        isEnabled = false;
      }
    }
  }

  return isEnabled;
}
