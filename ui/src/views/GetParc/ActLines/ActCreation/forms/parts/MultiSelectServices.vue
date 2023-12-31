<template>
  <div
    class="container bg-white clearfix pb-3 items-search cmp-multi-select-search"
    :class="className"
    ref="container"
  >
    <SearchInput
      :items="items"
      :fields="inputFields"
      :collapsed-mode="collapsed"
      :placeholder="placeholder"
      :value.sync="searchValue"
      @clear="removeSelection()"
      :contains-search="containsSearch"
      without-search
    >
      <template slot="beforeInput">
        <button
          class="display-selections text-secondary underlined shadow-none bg-transparent p-0 mx-2 border-0"
          @click="showAll = !showAll"
          v-if="isMaximumItemsReached"
        >
          {{
            showAll
              ? $t('ui.MultiSelectSearch.showLess')
              : `+${selectedItems.length - maximumSelectableItems}`
          }}
        </button>
      </template>

      <div class="checkboxes" ref="checkboxes" @scroll="onScroll" slot-scope="{ results }">
        <UiCheckbox
          v-if="enableSelectAll"
          :value="results.map((r) => r.item)"
          :checked="multiSelectValues(results.map((r) => r.item))"
          @change="
            addAllToSelectedItems(
              $event,
              results.map((r) => r.item)
            ),
              updateTextLabel(
                $event,
                results.map((r) => r.item)
              )
          "
          class="text-secondary"
          >{{ labelText }} ({{ results.length }})</UiCheckbox
        >
        <UiCheckbox
          v-for="result in results"
          v-model="selectedItems"
          :value="updateServiceForCheckbox(result.item)"
          :key="'ms_' + result.item.id"
          :disabled="isItemDisabled(result.item)"
          @change="
            updateTextLabel(
              $event,
              results.map((r) => r.item)
            )
          "
        >
          <span v-html="result.highlighted.label" />
        </UiCheckbox>
      </div>
    </SearchInput>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput';
import UiCheckbox from '@/components/ui/Checkbox';
import unionBy from 'lodash.unionby';
import differenceBy from 'lodash.differenceby';
import isEqual from 'lodash.isequal';

export default {
  props: {
    items: {
      type: Array,
    },
    defaultSelectedItems: {
      type: Array,
    },
    enableSelectAll: {
      type: Boolean,
      default: false,
    },
    collapsed: Boolean,
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
    disabledItems: {
      type: Array,
      required: false,
    },
    disabled: Boolean,
    containsSearch: Boolean,
    selectedColor: {
      type: String,
      required: false,
    },
    className: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      // TODO: a mettre en computed
      labelText: this.$t('selectAll'),
      maximumSelectableItems: 2,
      showAll: false,
      canNotifyScrollLimit: true,
      searchValue: '',
    };
  },

  watch: {
    searchValue(value) {
      this.$refs.checkboxes.scrollTop = 0;
      this.emitDoSearch(value);
    },
  },

  computed: {
    multiSelectValues() {
      const selectedItems = this.selectedItems;
      return (displayedValues) =>
        displayedValues.filter((v) => selectedItems.find((s) => isEqual(v, s)));
    },
    cutSelectedItems() {
      // renvoit les N premiers partenaires sélectionnés
      return this.selectedItems.slice(0, this.maximumSelectableItems);
    },
    inputFields() {
      return ['label'];
    },
    selectedItems: {
      get() {
        return this.defaultSelectedItems;
      },
      set(newSelected) {
        this.$emit('update:defaultSelectedItems', newSelected);
      },
    },

    displayedItems: ({ selectedItems, showAll, cutSelectedItems }) =>
      showAll ? selectedItems : cutSelectedItems,

    // TODO: gerer le cas ou on fait une recherche texte
    isMaximumItemsReached: ({ selectedItems, maximumSelectableItems }) =>
      selectedItems.length > maximumSelectableItems,

    extraItemCount: ({ selectedItems, maximumSelectableItems }) =>
      selectedItems.length - maximumSelectableItems,
  },

  updated() {
    this.canNotifyScrollLimit = true;
  },

  methods: {
    emitDoSearch(event) {
      this.$emit('update:search', event);
    },
    isItemDisabled(item) {
      if (this.disabled) return true;
      if (!this.disabledItems) return false;
      return (
        this.disabledItems.find((i) => item.id === i.id) ||
        this.selectedItems.find((i) => item.id === i.id && i.managed)
      );
    },
    addAllToSelectedItems(items, displayedItems) {
      if (!items.length)
        this.selectedItems = differenceBy(this.selectedItems, displayedItems, 'id');
      else this.selectedItems = unionBy(this.selectedItems, items, 'id');
    },
    // supprime toutes les selections courantes au clic sur l'icone, sinon supprime la selection cliquée
    removeSelection(currentSelection) {
      const updatedSelections = !currentSelection
        ? []
        : this.selectedItems.filter((selection) => selection != currentSelection);
      this.selectedItems = updatedSelections;
      this.updateTextLabel(this.selectedItems);
    },
    updateTextLabel(results, displayedItems) {
      function isMatching(displayedValues) {
        const selectedItems = results;
        if (displayedValues) {
          return displayedValues.every(function(v) {
            return !!selectedItems.filter((s) => isEqual(s, v));
          });
        }
      }
      this.searchValue = '';

      this.labelText = isMatching(displayedItems) ? this.$t('unSelectAll') : this.$t('selectAll');
    },
    onScroll() {
      const heightStyle = getComputedStyle(this.$refs.checkboxes).height;
      const height = parseInt(heightStyle.replace('px', ''));
      const needMore =
        this.$refs.checkboxes.scrollTop + height + 2 >= this.$refs.checkboxes.scrollHeight;
      if (needMore && this.canNotifyScrollLimit) {
        this.canNotifyScrollLimit = false;
        this.$emit('scroll:limit');
      }
    },
    // En raison de la propriété 'managed' sur le service, la checkbox n'est pas coché
    // Différence entre la liste de services et l'item
    updateServiceForCheckbox(item) {
      if (this.selectedItems && this.selectedItems.length > 0 && item) {
        this.selectedItems.forEach((s) => {
          if (s.code === item.code) {
            item.managed = s.managed;
            item.addedToDisable = s.addedToDisable;
          }
        });
      }
      return item;
    },
  },

  components: {
    SearchInput,
    UiCheckbox,
  },
};
</script>

<style lang="scss" scoped>
.selection {
  position: relative;
  text-transform: uppercase;
  padding-left: 1rem;
  padding-right: 2rem;
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

.items-search ::v-deep .search-input {
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
  height: 100%;
  max-height: 12rem;
}
</style>
