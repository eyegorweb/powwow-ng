<template>
  <div class="bg-white p-3">
    <h6>{{ $t(title) }}</h6>
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

<style lang="scss" scoped></style>
