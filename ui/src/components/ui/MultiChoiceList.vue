<template>
  <div class="card">
    <div class="card-body p-1">
      <ul class="list-unstyled m-0">
        <li
          class="item"
          :key="item.label"
          v-for="item in items"
          :class="{ selected: item.selected }"
          @click="() => selectItem(item)"
        >
          <div>{{ item.label }} <i class="ic-Check-Icon" v-if="item.selected" /></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
    },
  },
  data() {
    return {
      itemsTmp: [],
    };
  },
  methods: {
    selectItem(item) {
      if (item.selectable) {
        this.$emit('change', { ...item, selected: !item.selected });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
li:first-child {
  cursor: not-allowed !important;
}
.card-body {
  overflow-y: auto;
  height: 10vh;
}
.selected {
  font-weight: bold;
}
.item:hover {
  cursor: pointer;
}
.item i {
  color: $success;
  float: right;
}
</style>
