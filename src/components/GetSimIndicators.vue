<template>
  <ul class="list-group bg-white">
    <li class="list-group-item">{{ $t('indicators.ordersToValidate') }}
      <div class="float-right text-danger">{{ ordersValidated }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.ordersInProgress') }}
      <div class="float-right text-success">{{ ordersInProgress }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.nonConfirmedOrders') }}
      <div class="float-right text-warning">{{ nonConfirmedOrders }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.faillingOrders') }}
      <div class="float-right text-warning">{{ faillingOrders }}</div>
    </li>
    <li class="list-group-item">{{ $t('indicators.ordersToBeValidated') }}
      <div class="float-right text-warning">{{ ordersToBeValidated }}</div>
    </li>
  </ul>
</template>

<script>
import { fetchGetSimIndicators } from '@/api/indicators';

export default {
  data() {
    return {
      ordersValidated: 0,
      ordersInProgress: 0,
      nonConfirmedOrders: 0,
      faillingOrders: 0,
      ordersToBeValidated: 0,
    };
  },

  async mounted() {
    const result = await fetchGetSimIndicators();
    this.ordersValidated = result.ordersValidated;
    this.ordersInProgress = result.ordersInProgress;
    this.nonConfirmedOrders = result.nonConfirmedOrders;
    this.faillingOrders = result.faillingOrders;
    this.ordersToBeValidated = result.ordersToBeValidated;
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
