<template>
  <div class="bordered bg-white p-3">
    <div class="d-flex justify-content-between">
      <h6>{{ $t(title) }}</h6>
      <a href="#" class="p-0" @click.stop="$emit('all')">{{ $t('unSelectAll') }}</a>
    </div>
    <SearchInput :items="items" :fields="['label']" :collapsed-mode="false" block>
      <div class="items-container" slot-scope="{ results }">
        <ItemSelector
          v-for="result in results"
          :key="'to_' + result.item.id"
          :item="result.item"
          @click="$emit('click', $event)"
          :disabled="isItemDisabled(result.item)"
          is-removing
        >
          <span v-html="result.highlighted.label" />
        </ItemSelector>
      </div>
    </SearchInput>
  </div>
</template>

<script>
import ItemSelector from './ItemSelector';
import SearchInput from '@/components/SearchInput';

export default {
  components: {
    ItemSelector,
    SearchInput,
  },
  props: {
    items: Array,
    title: String,
  },
  methods: {
    isItemDisabled(item) {
      const isChild = !!item.parent;
      if (!isChild) return false;

      return !!this.items.find((p) => p.groupParent && p.id == item.parent);
    },
  },
};
</script>

<style lang="scss" scoped>
.items-container {
  height: 11rem;
  overflow-y: auto;
}
.bordered {
  border: 1px solid $medium-gray;
  padding: 0.5rem;
  border-radius: 0.2rem;
}
</style>
