<template>
  <div class="alert alert-info alert-dismissible fade show" role="alert">
    <a href="#">{{ $t(filter.id) }}</a>

    <div data-test="content">
      <template v-if="filter.values">
        <template v-for="op in filter.values">
          <span class="detail" :key="op.id">
            {{ op.label }}
            <br>
          </span>
        </template>
      </template>

      <span v-else-if="filter.value" class="detail"> <br> {{ filter.value }}</span>

      <span
        v-else-if="filter.startDate && filter.endDate"
        class="detail"
      >{{ $t('getsim.date-from-to', dateFilter) }}</span>
    </div>

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
      required: true,
    },
  },

  methods: {
    ...mapActions(['clearFilter']),
  },

  computed: {
    dateFilter() {
      return (
        this.filter && {
          startDate: this.filter.startDate,
          endDate: this.filter.endDate,
        }
      );
    },
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
