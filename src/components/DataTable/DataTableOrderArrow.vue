<template>
  <span @click="toggleDirection()">
    <span v-if="notChosen" class="ic-Arrow-Filter-Icon hover-pointer" />
    <span v-if="isDirectionAsc" class="ic-Arrow-Up-Icon hover-pointer" />
    <span v-if="isDirectionDesc" class="ic-Arrow-Down-Icon hover-pointer" />
  </span>
</template>

<script>
export default {
  name: 'DataTableOrderArrow',
  props: {
    columnName: {
      type: String,
      required: true,
    },
    orderBy: {
      type: Object,
      required: true,
    },
  },
  computed: {
    notChosen() {
      return !this.isDirectionAsc && !this.isDirectionDesc;
    },
    isDirectionAsc() {
      return this.orderBy.key === this.columnName && this.orderBy.direction === 'ASC';
    },
    isDirectionDesc() {
      return this.orderBy.key === this.columnName && this.orderBy.direction === 'DESC';
    },
  },
  methods: {
    toggleDirection() {
      const orderingEvent = { key: this.columnName, direction: 'ASC' };

      if (this.isDirectionAsc) {
        orderingEvent.direction = 'DESC';
      }

      return this.$emit('update:orderBy', orderingEvent);
    },
  },
};
</script>
