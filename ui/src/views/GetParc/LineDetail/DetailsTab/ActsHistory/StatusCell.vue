<template>
  <div class="order-status d-flex flex-wrap align-items-center" v-if="isLoading">
    <div class="circle" />
    <div class="label label--loading" :class="{ error: isError }">
      {{ item }}
    </div>
  </div>
  <div class="order-status" v-else>
    <CheckMark :is-error="isError" />
    <div class="label" :class="{ error: isError }">
      {{ item }}
    </div>
  </div>
</template>

<script>
import CheckMark from '@/components/ui/CheckMark';
import { mapGetters } from 'vuex';

export default {
  name: 'StatusCell',
  components: {
    CheckMark,
  },
  props: {
    item: {
      type: String,
    },
    row: Object
  },

  computed: {
    ...mapGetters('getsim', ['isLoading']),
    isError() {
      return this.row.statusCode === 'NOT_VALIDATED' || this.row.statusCode === 'CANCELED' || this.row.statusCode === 'KO';
    },
  },
};
</script>

<style lang="scss">
@import '@/theme/scss/mixins/_circle.scss';

.order-status {
  div {
    float: left;
    &.label {
      padding: 0.25rem 0.4rem;
      color: $success;
      &.error {
        color: $orange;
      }

      &.label--loading {
        //gestion du loader
        color: $gray;
        &.error {
          color: $gray;
        }
      }
    }
  }

  .circle {
    @include circle;
  }
  clear: both;
}
</style>
