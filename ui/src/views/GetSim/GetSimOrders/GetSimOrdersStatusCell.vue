<template>
  <div class="order-status d-flex flex-wrap align-items-center" v-if="isLoading">
    <div class="circle" />
    <div class="label label--loading" :class="{ error: isError }">{{ $t('col.statuses.' + item) }}</div>
  </div>
  <div class="order-status" v-tooltip="getTooltipConfig()" v-else>
    <StatusIcon :icon="icon" :color="iconColor" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StatusIcon from '@/components/StatusIcon';

const color_success = '#05d0a6';
const color_error = '#ea5b0f';
const color_warning = '#ffb900';

export default {
  name: 'GetSimOrdersStatusCell',
  components: {
    StatusIcon,
  },
  props: {
    item: {
      type: String,
    },
  },
  methods: {
    getTooltipConfig() {
      let cssColor = '';

      if (this.iconColor === color_success) {
        cssColor = 'success-tooltip';
      }
      if (this.iconColor === color_warning) {
        cssColor = 'warning-tooltip';
      }
      if (this.iconColor === color_error) {
        cssColor = 'error-tooltip';
      }

      return {
        content: this.$t('col.statuses.' + this.item),
        classes: [cssColor],
      };
    },
  },

  computed: {
    ...mapGetters('getsim', ['isLoading']),
    isError() {
      return this.item === 'NOT_VALIDATED' || this.item === 'CANCELED';
    },

    iconColor() {
      switch (this.item) {
        case 'NOT_VALIDATED':
        case 'CANCELED':
        case 'TO_BE_CONFIRMED_BY_BO':
          return color_warning;

        case 'FAILED':
          return color_error;

        case 'TO_BE_CONFIRMED':
        case 'CONFIRMATION_IN_PROGRESS':
        case 'CONFIRMED':
        case 'VALIDATED':
        default:
          return color_success;
      }
    },

    icon() {
      switch (this.item) {
        case 'TO_BE_CONFIRMED':
        case 'TO_BE_CONFIRMED_BY_BO':
          return 'ic-Clock-Icon';

        case 'CONFIRMED':
          return 'ic-check-circle';

        case 'VALIDATED':
          return 'ic-user-check';

        case 'CONFIRMATION_IN_PROGRESS':
          return 'ic-spinner3';

        case 'NOT_VALIDATED':
          return 'ic-Alt-Icon';

        case 'FAILED':
        case 'CANCELED':
          return 'ic-Cross-Icon';
        default:
          return 'ic-Check-Icon';
      }
    },
  },
};
</script>
