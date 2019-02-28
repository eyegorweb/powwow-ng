<template>
  <ul class="list-group bg-white">
    <li class="list-group-item">{{ $t('indicators.averageProcessingTime') }}
      <div class="float-right text-success">{{ indicators.averageProcessingTime }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.orderToBeConfirmedByBO') }}
      <div class="float-right text-success">{{ indicators.orderToBeConfirmedByBO }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.ordersFailed') }}
      <div class="float-right text-danger">{{ indicators.ordersFailed }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.ordersInProgress') }}
      <div class="float-right text-warning">{{ indicators.ordersInProgress }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.ordersNotConfirmed') }}
      <div class="float-right text-warning">{{ indicators.ordersNotConfirmed }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.ordersToBeConfirmed') }}
      <div class="float-right text-warning">{{ indicators.ordersToBeConfirmed }}</div>
    </li>
  </ul>
</template>

<script>
import { fetchGetSimIndicators } from '@/api/indicators';

export default {
  data() {
    return {
      indicators: {},
    };
  },

  async mounted() {
    this.indicators = await fetchGetSimIndicators();
  },
};
</script>

<style lang="scss" scoped>
.list-group {
  padding: 1.25rem 1rem;

  .list-group-item {
    border: none;
    padding: 0.75rem 0;
    border-bottom: 2px solid $medium-gray;

    &:last-child {
      border: none;
    }
  }
}
</style>
