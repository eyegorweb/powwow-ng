<template>
  <div class="search-input">
    <UiInput v-model="$value" @update:value="$emit('update:value', $event)">
      <!-- TODO:Utiliser la bonne icone -->
      <img style="font-size: 24px" slot="icon" src="@/assets/search.svg" :style="{ left: 0 }">
      <template slot="beforeInput">
        <slot name="beforeInput" />
      </template>
    </UiInput>
    <!-- TODO:Utiliser la bonne icone -->
    <img
      class="close-icon"
      style="font-size: 24px"
      src="@/assets/close.svg"
      @click="$emit('clear')"
    >

    <div>
      <slot :results="results" :query="$value" />
    </div>
  </div>
</template>

<script>
import { propWithDataFallback } from 'vue-prop-data-fallback';
import UiInput from '@/components/ui/UiInput';
import fuzzysort from 'fuzzysort';

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
  },

  computed: {
    results() {
      if (!this.$value) return this.highlightedResults;

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

  components: {
    UiInput,
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
</style>
