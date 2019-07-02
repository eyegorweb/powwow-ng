<template>
  <div class="mb-4">
    <h4>Chercher des clés de traduction</h4>
    <UiInput v-model="searchValue" class="d-block" />
    <ul class="list-group">
      <li class="list-group-item" :key="item" v-for="item in results">
        <b>{{ item }}</b> : {{ $t(item) }}
      </li>
    </ul>
  </div>
</template>

<script>
import frLocales from '@/locales/fr.json';
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    UiInput,
  },
  data() {
    return {
      searchValue: '',
      results: [],
    };
  },

  watch: {
    searchValue(newValue) {
      if (!newValue) {
        this.searchValue = '';
        this.results = [];
        return;
      }
      this.results = findPaths(frLocales, newValue);
    },
  },
};

/**
 * searches deep into an object recursively...
 * @param {Object} obj object to be searched
 * @param {any} searchValue the value/key to search for
 * @param {Object} [options]
 * @param {boolean} options.[searchKeys] whether to search object keys as well as values. Defaults to `true` if `serchValue` is a string, `false` otherwise.
 * @param {number} options.[maxDepth=20] maximum recursion depth (to avoid "Maximum call stack size exceeded")
 * @returns {string[]} Paths on the object to the matching results
 */
var findPaths = (
  obj,
  searchValue,
  { searchKeys = typeof searchValue === 'string', maxDepth = 20 } = {}
) => {
  const paths = [];
  const notObject = typeof searchValue !== 'object';
  const gvpio = (obj, maxDepth, prefix) => {
    if (!maxDepth) return;

    for (const [curr, currElem] of Object.entries(obj)) {
      if (searchKeys && curr === searchValue) {
        // To search for property name too ...
        paths.push(prefix + curr);
      }

      if (typeof currElem === 'object') {
        // object is "object" and "array" is also in the eyes of "typeof"
        // search again :D
        gvpio(currElem, maxDepth - 1, prefix + curr + '.');
        if (notObject) continue;
      }
      // it's something else... probably the value we are looking for
      // compares with "searchValue"
      if (currElem && currElem.toLowerCase().includes(searchValue.toLowerCase())) {
        // return index AND/OR property name
        paths.push(prefix + curr);
      }
    }
  };
  gvpio(obj, maxDepth, '');
  return paths;
};
</script>

<style lang="scss" scoped></style>
