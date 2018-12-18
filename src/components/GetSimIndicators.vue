<template>
  <ul class="list-group bg-white">
    <li class="list-group-item">Commandes à valider
      <div class="float-right text-danger">{{ ordersToValidate }}</div>
    </li>
    <li class="list-group-item">Commandes en cours de traitement
      <div class="float-right text-success">{{ ordersInProgress }}</div>
    </li>
    <li class="list-group-item">Commandes non confirmées > 4h
      <div class="float-right text-warning">{{ ordersNonConfirmed }}</div>
    </li>
    <li class="list-group-item">Commandes en échec
      <div class="float-right text-warning">{{ ordersFailing }}</div>
    </li>
    <li class="list-group-item">Commandes à valider par le BO
      <div class="float-right text-warning">{{ ordersToBeValidated }}</div>
    </li>
  </ul>
</template>

<script>
import { fetchGetSimIndicators } from '@/api/indicators';

export default {
  data() {
    return {
      ordersToValidate: 0,
      ordersInProgress: 0,
      ordersNonConfirmed: 0,
      ordersFailing: 0,
      ordersToBeValidated: 0,
    };
  },

  async mounted() {
    const result = await fetchGetSimIndicators();
    this.ordersValidated = result.ordersValidated;
    this.ordersInProgress = result.ordersInProgress;
    this.ordersNonConfirmed = result.ordersNonConfirmed;
    this.ordersFailing = result.ordersFailing;
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
