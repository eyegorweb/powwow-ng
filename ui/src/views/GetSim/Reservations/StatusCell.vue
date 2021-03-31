<template>
  <div class="order-status d-flex justify-content-center">
    <StatusIcon :icon="icon" :color="iconColor" v-tooltip="getTooltipConfig()" />
  </div>
</template>

<script>
import StatusIcon from '@/components/StatusIcon';

const color_success = '#05d0a6';

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
      return {
        content: this.$t(`col.statuses.${this.item}`),
        classes: ['success-tooltip'],
      };
    },
  },

  computed: {
    iconColor() {
      return color_success;
    },

    icon() {
      switch (this.item) {
        case 'CREATED':
          return 'ic-Hourglass-Icon';

        case 'TERMINATED':
          return 'ic-check-circle';

        default:
          return 'ic-check-circle';
      }
    },
  },
};
</script>
