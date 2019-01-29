<template>
  <div
    class="alert alert-info alert-dismissible fade show"
    role="alert"
  >
    <a href="#">{{ $t(filter.id) }}</a>

    <span
      v-for="op in filter.values"
      :key="op.id"
    >
      <br>
      <span class="detail">{{ op.label }}</span>
    </span>

    <span v-if="filter.value">
      <br>
      <span class="detail">{{ filter.value }}</span>
    </span>

    <button
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
      @click="clearFilter(filter.id)"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SelectedFilterDetails',
  props: {
    filter: {
      type: Object,
    },
  },
  methods: {
    ...mapActions(['clearFilter']),
  },
};
</script>

<style scoped>
.alert-info {
  padding: 0 0.3rem;
  background-color: #d9edf7;
}
.alert-dismissible .close {
  padding: 0.15rem 0.1rem;
}

a {
  color: #009dcc;
  font-size: 14px;
  line-height: 1em;
}

.detail {
  font-size: 14px;
  line-height: 1em;
}
</style>
