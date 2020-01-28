<template>
  <div class="bordered bg-white p-3">
    <h6>{{ $t(title) }}</h6>
    <div class="items-container">
      <ul class="list-unstyled">
        <ItemSelector
          v-for="item in items"
          :key="'to_' + item.id"
          :item="item"
          is-removing
          :disabled="isItemDisabled(item)"
          @click="$emit('click', $event)"
        >
          <span>{{ item.label }}</span>
        </ItemSelector>
      </ul>
    </div>
  </div>
</template>

<script>
import ItemSelector from './ItemSelector';

export default {
  components: {
    ItemSelector,
  },
  props: {
    items: Array,
    title: String,
  },
  methods: {
    isItemDisabled(item) {
      const isChild = !!item.parent;
      if (!isChild) return false;

      return !!this.items.find(p => p.groupParent && p.id == item.parent);
    },
  },
};
</script>

<style lang="scss" scoped>
.items-container {
  height: 14.2rem;
  overflow-y: auto;
}
.bordered {
  border: 1px solid $medium-gray;
  padding: 0.5rem;
  border-radius: 0.2rem;
}
</style>
