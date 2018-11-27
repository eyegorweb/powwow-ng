<template>
  <div
    class="position-relative"
    v-clickaway="hideSuggestions"
  >
    <!-- TODO utiliser UiInput -->
    <!-- TODO permettre customiser l'input avec un scoped slot? Passer une computed property avec un setter -->
    <!-- dans le slot pour permettre la synchronisation de la valeur -->
    <Promised :promise="resultsPromise">
      <fieldset
        class="form-group"
        slot="combined"
        slot-scope="{ data }"
      >
        <!-- TODO loading state sur input avec isPending -->
        <input
          type="text"
          class="form-control form-control-lg"
          v-model="$value"
          ref="input"
          @focus="areSuggestionsVisible = true"
          @blur="onInputBlur"
          autocomplete="off"
          v-bind="$attrs"
          @input="areSuggestionsVisible = true"
          @keydown.prevent.down.exact="selectDown(data ? data.length -1 : 0)"
          @keydown.prevent.up.exact="selectUp"
          @keydown.enter.exact="selectValue(data[selectedItem].label)"
        >
        <ul
          v-show="areSuggestionsVisible"
          class="autocomplete-results shadow position-absolute m-0 p-0 py-3 mt-2 bg-white border-1 border-gray w-100"
          @mouseleave="resetSelected"
        >
          <li
            v-if="!$value"
            class="autocomplete-result text-muted is-disabled"
          >Commencez à taper pour avoir des suggestions</li>
          <template v-else>
            <li
              v-for="(result, i) in data"
              :key="result.id"
              @click="selectValue(result.label)"
              @mouseenter="selectedItem = i"
              :class="i === selectedItem && 'is-selected'"
              class="autocomplete-result py-2"
            >{{ result.label }}</li>
          </template>
        </ul>
      </fieldset>
    </Promised>
  </div>
</template>

<script>
// TODO utiliser l'input refactorisé d'Olivier
import { Promised } from 'vue-promised';
import debounce from 'lodash.debounce';
import { clickaway } from '@/directives/clickaway';
import { propWithDataFallback } from 'vue-prop-data-fallback';

export default {
  name: 'ApiAutocomplete',
  inheritAttrs: false,
  mixins: [propWithDataFallback('value')],

  data() {
    return {
      resultsPromise: null,
      areSuggestionsVisible: false,

      selectedItem: -1,
    };
  },

  props: {
    apiMethod: {
      type: Function,
      required: true,
    },
  },

  methods: {
    hideSuggestions() {
      this.areSuggestionsVisible = false;
    },
    resetSelected() {
      this.selectedItem = -1;
    },
    selectDown(max) {
      this.selectedItem = Math.min(this.selectedItem + 1, max);
    },
    selectUp() {
      this.selectedItem = Math.max(0, this.selectedItem - 1);
    },
    debouncedFetch: debounce(async function(search) {
      this.resultsPromise = this.apiMethod(search);
      await this.resultsPromise;
      this.resetSelected();
    }, 200),
    selectValue(value) {
      // hide suggestions now that one is selected
      this.areSuggestionsVisible = false;
      this.$value = value;
    },
    onInputBlur(e) {
      // quand on change vers un autre element dans le clavier, on cache les suggestions
      if (e.relatedTarget) this.hideSuggestions();
    },
  },

  watch: {
    // Pas possible d'utiliser une computed property à cause de la
    // nature async de debounce
    $value: 'debouncedFetch',
  },

  directives: { clickaway },
  components: { Promised },
};
</script>

<style lang="scss" scoped>
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';

.autocomplete-results {
  font-size: 0.875rem;
  overflow: auto;
  z-index: $zindex-dropdown;
}

.autocomplete-result {
  list-style: none;
  text-indent: 2rem;
  line-height: 1.5rem;
  position: relative;
  &:not(.is-disabled) {
    cursor: pointer;
  }

  &:not(:last-child) {
    &::after {
      content: '';
      box-sizing: content-box;
      margin: 0 1rem;
      display: block;
      position: absolute;
      bottom: 0;
      height: 1px;
      width: calc(100% - 2rem);
      background-color: $medium-grey;
    }
  }

  // cache la ligne quand l'element est selectioné
  &:not(:last-child).is-selected {
    &::after {
      visibility: hidden;
    }
  }

  &.is-selected:not(.is-disabled) {
    background-color: $primary;
    color: $white;
  }
}
</style>
