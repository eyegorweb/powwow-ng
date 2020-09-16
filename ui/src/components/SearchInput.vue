<template>
  <div class="search-input">
    <UiInput
      v-model="$value"
      :block="block"
      :placeholder="placeholder"
      @update:value="updateValue"
      @click="suggestionsAreVisible = true"
    >
      <!-- TODO:Utiliser la bonne icone -->
      <img style="font-size: 24px" slot="icon" src="@/assets/search.svg" :style="{ left: 0 }" />
      <template slot="beforeInput">
        <slot name="beforeInput" />
      </template>
    </UiInput>

    <div
      v-if="suggestionsAreVisible"
      :class="{ collapsed: collapsedMode }"
      v-clickaway="hideIfCollapsedMode"
    >
      <slot :results="results" :query="$value" />
    </div>
  </div>
</template>

<script>
import { propWithDataFallback } from 'vue-prop-data-fallback';
import UiInput from '@/components/ui/UiInput';
import fuzzysort from 'fuzzysort';
import { clickaway } from '@/directives/clickaway';
import { containsWithHighlight } from '@/utils.js';

export default {
  // accepte une prop value mais peut marcher sans
  mixins: [propWithDataFallback('value')],

  props: {
    items: {
      type: Array,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    collapsedMode: Boolean,
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
    block: Boolean,
    containsSearch: Boolean,
  },
  directives: { clickaway },

  components: {
    UiInput,
  },

  computed: {
    results() {
      if (!this.$value) return this.highlightedResults;

      if (this.containsSearch) {
        return containsWithHighlight(this.$value, this.items);
      } else {
        return fuzzysort
          .go(this.$value, this.items, {
            keys: this.fields,
            allowTypo: false,
          })
          .map(r => ({
            item: r.obj,
            highlighted: this.fields.reduce((highlighted, field, i) => {
              highlighted[field] = fuzzysort.highlight(r[i]) || r.obj[field];
              return highlighted;
            }, {}),
          }));
      }
    },

    // version non surlignée à autiliser losque la recherche est vide
    highlightedResults() {
      if (!this.items) return [];

      return this.items.map(item => ({
        item,
        highlighted: this.fields.reduce((highlighted, field) => {
          highlighted[field] = item[field];
          return highlighted;
        }, {}),
      }));
    },
  },

  data() {
    return {
      suggestionsAreVisible: true,
    };
  },

  mounted() {
    this.suggestionsAreVisible = !this.collapsedMode;
  },

  methods: {
    hideIfCollapsedMode() {
      if (this.collapsedMode) {
        this.suggestionsAreVisible = false;
      }
    },
    updateValue(value) {
      if (this.collapsedMode) {
        this.suggestionsAreVisible = value && value.length;
      }
      this.$emit('update:value', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  position: relative;

  .close-icon {
    position: absolute;
    width: 1em;
    top: 0.5rem;
    right: 0;

    &:hover {
      cursor: pointer;
    }
  }
}

.collapsed {
  position: absolute;
  width: 100%;
  background: white;
  z-index: 999;
  border: 1px solid $gray-400;
  border-radius: 3px;
  padding-left: 10px;
  border-top: none;
}
</style>
