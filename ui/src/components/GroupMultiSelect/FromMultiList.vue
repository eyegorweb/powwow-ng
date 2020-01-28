<template>
  <div class="bg-white p-3">
    <h6>{{ $t(title) }}</h6>
    <SearchInput
      :items="items"
      :fields="['label']"
      :collapsed-mode="false"
      :value.sync="searchValue"
      block
    >
      <div slot-scope="{ results }">
        <ItemSelector
          v-for="result in getVisibleItems(results)"
          :key="'from_' + result.item.id"
          :item="result.item"
          @click="$emit('click', $event)"
        >
          <span v-html="result.highlighted.label" />
        </ItemSelector>
      </div>
    </SearchInput>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput';
import ItemSelector from './ItemSelector';

export default {
  components: {
    SearchInput,
    ItemSelector,
  },
  props: {
    items: Array,
    title: String,
  },
  methods: {
    getVisibleItems(results) {
      return results.filter(r => !r.item.selected);
    },
  },

  data() {
    return {
      searchValue: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
