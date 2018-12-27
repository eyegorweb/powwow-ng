<template>
  <div class="container bg-white clearfix pb-3 items-search">
    <SearchInput
      :items="itemsToSearch"
      :fields="inputFields"
      @clear="removeSelection()"
      @update:value="$emit('update:search', $event)"
    >
      <template slot="beforeInput">
        <div v-if="!allSelectionsVisible">
          <div
            v-for="selected in cutSelectedItems"
            class="selection ml-2 my-1 text-white bg-secondary rounded"
            :key="selected.id"
          >
            {{ selected.label }}
            <img
              class="remove-item close-icon"
              style="font-size: 24px"
              src="@/assets/close-white.svg"
              @click="removeSelection(selected)"
            >
          </div>
          <button
            class="display-selections text-secondary underlined shadow-none bg-transparent p-0 mx-2 border-0"
            v-if="maximumItemsReached"
            @click="allSelectionsVisible = true"
          >{{ `+${selectedItems.length - maximumSelectableItems}` }}</button>
        </div>

        <div v-else>
          <div
            v-for="selected in selectedItems"
            class="selection ml-2 my-1 text-white bg-secondary rounded"
            :key="selected.id"
          >
            {{ selected.label }}
            <img
              class="remove-item close-icon"
              style="font-size: 24px"
              src="@/assets/close-white.svg"
              @click="removeSelection(selected)"
            >
          </div>
        </div>
      </template>
      <div
        class="checkboxes"
        ref="checkboxes"
        @scroll="onScroll"
        slot-scope="{ results }"
      >
        <UiCheckbox
          :value="results.map(r => r.item)"
          :checked="multiSelectValues(results.map(r => r.item))"
          @change="addAllToSelectedItems($event, results.map(r => r.item)), updateTextLabel($event, results.map(r => r.item))"
          class="text-secondary"
        >{{ labelText }} ({{ results.length }})</UiCheckbox>
        <UiCheckbox
          v-for="result in results"
          v-model="selectedItems"
          :value="result.item"
          :key="result.item.id"
          @change="updateTextLabel($event, results.map(r => r.item))"
        >
          <span v-html="result.highlighted.label" />
        </UiCheckbox>
      </div>
    </SearchInput>
    <UiButton
      class="float-right px-5"
      variant="primary"
      size="sm"
    >Appliquer</UiButton>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput';
import UiCheckbox from '@/components/ui/Checkbox';
import UiButton from '@/components/ui/Button';
import unionBy from 'lodash.unionby';
import differenceBy from 'lodash.differenceby';
import isEqual from 'lodash.isequal';

export default {
  props: {
    items: {
      type: Array,
    },
  },
  data() {
    return {
      labelText: this.$t('selectAll'),
      maximumSelectableItems: 2,
      maximumItemsReached: false,
      allSelectionsVisible: false,
      selectedItems: [],
      canNotifyScrollLimit: true,
    };
  },

  updated() {
    this.canNotifyScrollLimit = true;
  },

  watch: {
    selectedItems: function(val) {
      // TODO: gerer le cas ou on fait une recherche texte
      this.maximumItemsReached = val.length > this.maximumSelectableItems ? true : false;
    },

    maximumItemsReached: function(val) {
      if (val && this.allSelectionsVisible) {
        this.allSelectionsVisible = true;
      }
    },
  },

  methods: {
    addAllToSelectedItems(items, displayedItems) {
      if (!items.length)
        this.selectedItems = differenceBy(this.selectedItems, displayedItems, 'id');
      else this.selectedItems = unionBy(this.selectedItems, items, 'id');
    },
    // supprime toutes les selections courantes au clic sur l'icone, sinon supprime la selection cliquée
    removeSelection(currentSelection) {
      const updatedSelections = !currentSelection
        ? []
        : this.selectedItems.filter(selection => selection != currentSelection);
      this.selectedItems = updatedSelections;
      this.updateTextLabel(this.selectedItems);
    },
    updateTextLabel(results, displayedItems) {
      function isMatching(displayedValues) {
        const selectedItems = results;
        if (displayedValues) {
          return displayedValues.every(function(v) {
            return selectedItems.includes(v);
          });
        }
      }
      this.labelText = isMatching(displayedItems) ? this.$t('unSelectAll') : this.$t('selectAll');
    },
    onScroll() {
      const needMore = this.$refs.checkboxes.scrollTop >= this.$refs.checkboxes.scrollHeight / 2;
      if (needMore && this.canNotifyScrollLimit) {
        this.canNotifyScrollLimit = false;
        this.$emit('scroll:limit');
      }
    },
  },

  computed: {
    multiSelectValues() {
      const selectedItems = this.selectedItems;
      return displayedValues => displayedValues.filter(v => selectedItems.find(s => isEqual(v, s)));
    },
    cutSelectedItems() {
      // renvoit les N premiers partenaires sélectionnés
      return this.selectedItems.slice(0, this.maximumSelectableItems);
    },
    itemsToSearch() {
      return this.items;
    },
    inputFields() {
      return ['label'];
    },
  },

  components: {
    SearchInput,
    UiCheckbox,
    UiButton,
  },
};
</script>

<style lang="scss" scoped>
.selection {
  position: relative;
  text-transform: uppercase;
  padding-left: 1rem;
  padding-right: 2rem;
  max-height: 2rem;
  flex: 0 1 auto;
  display: inline-flex;

  .remove-item {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      cursor: pointer;
    }
  }
}

.display-selections {
  appearance: none;
  text-decoration: underline;
  border: 0;

  &:hover {
    cursor: pointer;
  }
}

.items-search {
  padding-left: 0;
  padding-right: 0;
}

.items-search /deep/ .search-input {
  & > label {
    border-bottom: 1px solid $medium-gray;
    align-items: center;
    display: flex;
    flex-flow: wrap;
    padding-left: 2rem;
    width: 100%;
    & > input {
      padding-left: 0.8rem;
      border: 0;
      flex: 1 1;
      min-width: 140px;
      max-width: 100%;
      width: 100%;
    }
  }
}

.checkboxes {
  overflow-y: auto;
  height: 12rem;
}
</style>
