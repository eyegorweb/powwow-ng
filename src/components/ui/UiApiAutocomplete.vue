<template>
  <div class="position-relative" v-clickaway="hideSuggestions">
    <!-- TODO utiliser UiInput -->
    <!-- TODO permettre customiser l'input avec un scoped slot? Passer une computed property avec un setter -->
    <!-- dans le slot pour permettre la synchronisation de la valeur -->
    <Promised :promise="resultsPromise">
      <fieldset class="form-group" slot="combined" slot-scope="{ data }">
        <!-- TODO loading state sur input avec isPending -->
        <input
          type="text"
          class="form-control form-control-lg"
          v-model="$value"
          ref="input"
          @focus="onInputFocus"
          @blur="onInputBlur"
          autocomplete="off"
          v-bind="$attrs"
          @input="areSuggestionsVisible = true"
          @keydown.prevent.down.exact="selectDown(data ? data.length -1 : 0)"
          @keydown.prevent.up.exact="selectUp"
          @keydown.enter.exact="selectValue(data[selectedItem])"
        >
        <a class="p-0" @click.prevent="showSuggestions">
          <i :class="iconClass" />
        </a>
        <ul
          v-show="areSuggestionsVisible"
          class="autocomplete-results shadow position-absolute m-0 p-0 py-3 mt-2 bg-white border-1 border-gray w-100"
          @mouseleave="resetSelected"
          @scroll="() => onScroll(data)"
          ref="results"
        >
          <li
            v-if="!$value && !displayResultsWhileEmpty"
            class="autocomplete-result text-muted is-disabled"
          >Commencez à taper pour avoir des suggestions</li>
          <template v-else>
            <li
              v-for="(result, i) in data"
              :key="result.id"
              @click="selectValue(result)"
              @mouseenter="selectedItem = i"
              :class="i === selectedItem && 'is-selected'"
              class="autocomplete-result py-2"
            >
              <span v-if="result.highlighted" v-html="result.highlighted" />
              <template v-else>{{ result.label }}</template>
            </li>
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
import fuzzysort from 'fuzzysort';

export default {
  name: 'ApiAutocomplete',
  inheritAttrs: false,

  model: {
    event: 'update:value',
  },

  data() {
    return {
      resultsPromise: null,
      areSuggestionsVisible: false,
      selectedItem: -1,
      isOpen: this.defaultOpen,
      page: 0,
      canFetchNextPage: true,
    };
  },

  props: {
    apiMethod: Function,
    displayResultsWhileEmpty: Boolean,
    items: Array,
    // une string pour gere l'ajout de string arbitraires
    value: {
      type: [Object, String],
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    defaultOpen: Boolean,
    scrollForNext: Boolean,
  },

  computed: {
    $value: {
      get() {
        return typeof this.value === 'string'
          ? this.value
          : // gere le cas ou value est null
            this.value && this.value[this.labelKey];
      },
      set(newValue) {
        // TODO: à simplifier
        this.$emit(
          'update:value',
          typeof this.value === 'string'
            ? // quand la prop est une string on doit emettre une string or
              // slectValue va etre appele avec un objet en parametre
              typeof newValue === 'object'
              ? // gere selectValue(null)
                newValue && newValue[this.labelKey]
              : newValue
            : typeof newValue === 'object'
              ? newValue
              : { [this.labelKey]: newValue }
        );
      },
    },
    results() {
      if (!this.$value) return this.highlightedResults;

      return fuzzysort
        .go(this.$value, this.items, {
          key: 'label',
          allowTypo: false,
        })
        .map(r => ({
          ...r.obj,
          highlighted: fuzzysort.highlight(r),
        }));
    },
    // version non surlignée à autiliser losque la recherche est vide
    highlightedResults() {
      if (!this.items) return [];

      return this.items.map(item => ({
        ...item,
        highlighted: item.label,
      }));
    },
    iconClass() {
      return this.isOpen ? 'icon-default ic-Arrow-Up-Icon' : 'icon-default ic-Arrow-Down-Icon';
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
    enablePagination() {
      this.canFetchNextPage = true; // enable pagination
      this.page = 0;
    },
    async fetchResults() {
      this.enablePagination();

      this.resultsPromise = this.apiMethod
        ? this.apiMethod(this.$value || '')
        : Promise.resolve(this.results);
      await this.resultsPromise;
      this.resetSelected();
    },
    selectValue(value) {
      // hide suggestions now that one is selected
      this.areSuggestionsVisible = false;
      this.$value = value;
    },
    onInputBlur(e) {
      // quand on change vers un autre element dans le clavier, on cache les suggestions
      if (e.relatedTarget) this.hideSuggestions();
      this.toggleShow();
    },
    onInputFocus() {
      this.areSuggestionsVisible = true;
      this.toggleShow();
    },
    toggleShow() {
      this.isOpen = !this.isOpen;
    },
    showSuggestions() {
      this.areSuggestionsVisible = !this.areSuggestionsVisible;
    },
    async onScroll(currentData) {
      if (!this.scrollForNext && this.apiMethod) return;

      const heightStyle = getComputedStyle(this.$refs.results).height;
      const height = parseInt(heightStyle.replace('px', ''));
      const needMore = this.$refs.results.scrollTop + height >= this.$refs.results.scrollHeight;
      if (needMore && this.canFetchNextPage) {
        this.page += 1;
        const nextPageContent = await this.apiMethod(this.$value || '', this.page);
        this.canFetchNextPage = nextPageContent.length > 0;
        this.resultsPromise = Promise.resolve(currentData.concat(nextPageContent));
        await this.resultsPromise;
        this.resetSelected();
      }
    },
  },

  created() {
    if (this.displayResultsWhileEmpty) this.fetchResults();
  },

  watch: {
    // Pas possible d'utiliser une computed property à cause de la
    // nature async de debounce
    $value: debounce(function() {
      this.fetchResults();
    }, 200),

    items: 'fetchResults',
  },

  directives: { clickaway },
  components: { Promised },
};
</script>

<style lang="scss" scoped>
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';

.icon-default {
  display: block;
  position: absolute;
  right: 0.8rem;
  width: 1em;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    cursor: pointer;
  }
}

.autocomplete-results {
  font-size: 0.875rem;
  overflow: auto;
  z-index: $zindex-dropdown;
  max-height: 300px;
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
      background-color: $medium-gray;
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
