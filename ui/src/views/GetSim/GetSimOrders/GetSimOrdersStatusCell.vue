<template>
  <div class="order-status d-flex flex-wrap align-items-center" v-if="isLoading">
    <div class="circle" />
    <div class="label label--loading" :class="{ error: isError }">
      {{ status }}
    </div>
  </div>
  <div class="order-status d-flex justify-content-center" v-else>
    <StatusIcon :icon="icon" :color="iconColor" v-tooltip="getTooltipConfig()" />
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
    row: Object,
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
        content: this.status,
        classes: [cssColor],
      };
    },
  },

  computed: {
    ...mapGetters('getsim', ['isLoading']),
    isError() {
      return this.item === 'NOT_VALIDATED' || this.item === 'CANCELED';
    },
    isM2MLIGHTOrder() {
      return this.row && this.row.party && this.row.party.partyType === 'M2M_LIGHT';
    },
    status() {
      if (
        this.isM2MLIGHTOrder &&
        (this.item === 'TO_BE_CONFIRMED' ||
          this.item === 'TO_BE_CONFIRMED_BY_BO' ||
          this.item === 'CONFIRMATION_IN_PROGRESS')
      ) {
        return this.$t(`col.statuses.VALIDATION`);
      } else {
        // TODO controle non existence du message (key = message)
        // SI non ajouter statut 'Autres'
        return this.$t(`col.statuses.${this.item}`);
      }
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
          return 'ic-Chronometer-Icon';

        case 'NOT_VALIDATED':
          return 'ic-Alt-Icon';

        case 'WAITING_FOR_PAYMENT':
          return 'ic-Hourglass-Icon';

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
