<template>
  <Fragment>
    <Card v-for="i in 5" :key="'sk_' + i" :can-delete="false" :can-modify="false">
      <div class="skeleton-line" :style="{ width: '60%' }"></div>
      <div class="skeleton-line" :style="{ width: '40%' }"></div>
      <div class="skeleton-line" :style="{ width: '100%' }"></div>
      <div class="skeleton-line" :style="{ width: '100%' }"></div>
      <div class="skeleton-line" :style="{ width: '100%' }"></div>
    </Card>
  </Fragment>
</template>

<script>
import Card from '@/components/Card';
import { Fragment } from 'vue-fragment';

export default {
  components: {
    Card,
    Fragment,
  },
};
</script>

<style lang="scss" scoped></style>
