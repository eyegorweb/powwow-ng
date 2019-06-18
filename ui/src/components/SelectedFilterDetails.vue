<template>
  <div class="alert alert-info alert-dismissible fade show" role="alert">
    <span class="detail-title">{{ $t(filter.id) }}</span>
    <div data-test="content">
      <template v-if="filter.values">
        <template v-for="op in filter.values">
          <span class="detail" :key="op.id">
            {{ op.label }}
            <br />
          </span>
        </template>
      </template>

      <span v-else-if="filter.value" class="detail">{{ filter.value }}</span>

      <span v-else-if="filter.startDate && filter.endDate" class="detail">{{
        $t('getsim.date-from-to', dateFilter)
      }}</span>

      <span v-else-if="filter.startDate && !filter.endDate" class="detail">{{
        $t('getsim.date-since', dateFilter)
      }}</span>
      <span v-else-if="!filter.startDate && filter.endDate" class="detail">{{
        $t('getsim.date-over', dateFilter)
      }}</span>

      <span v-else-if="filter.from && filter.to" class="detail">{{
        $t('getsim.between-min-max', rangeFilter)
      }}</span>
      <span v-else-if="filter.from && !filter.to" class="detail"
        >{{ $t('getsim.ge') }} {{ filter.from }}</span
      >
      <span v-else-if="!filter.from && filter.to" class="detail"
        >{{ $t('getsim.le') }} {{ filter.to }}</span
      >
    </div>

    <button
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
      v-if="!fixed"
      @click="$emit('clear', filter.id)"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SelectedFilterDetails',
  props: {
    filter: {
      type: Object,
      required: true,
    },
    fixed: Boolean,
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
    rangeFilter() {
      return (
        this.filter && {
          min: this.filter.from,
          max: this.filter.to,
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.alert-info {
  padding: 0 0.3rem;
  background-color: #d9edf7;
}

.alert-dismissible .close {
  padding: 0.15rem 0.1rem;
}

.detail-title {
  color: $secondary;
  font-size: 1rem;
  line-height: 1em;
}

.detail {
  font-size: 1rem;
  line-height: 1em;
}
</style>
